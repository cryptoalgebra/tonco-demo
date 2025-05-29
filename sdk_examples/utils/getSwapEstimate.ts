/* eslint no-await-in-loop: 0 */
/* eslint no-continue: 0 */

import { Address, OpenedContract } from "@ton/core";
import { TonClient, TonClient4 } from "@ton/ton";
import {
    JettonAmount,
    Jetton,
    Pool,
    PoolContract,
    TickMath,
    TickConstructorArgs,
    SwapSimulator,
    Route,
    computePoolAddress,
    SwapState,
    DEX_VERSION,
    PoolContractInstanceType,
    SwapType,
    NumberedTickInfo,
} from "@toncodex/sdk";
import { getSwapType } from "./getSwapType";

export async function getSwapEstimateExactIn(
    amountIn: JettonAmount<Jetton>,
    pool: Pool,
    poolContract: OpenedContract<PoolContractInstanceType>
): Promise<bigint> {
    const zeroToOne = amountIn.jetton.equals(pool.jetton0);

    if (zeroToOne) {
        const res = await poolContract.getSwapEstimate(
            zeroToOne,
            BigInt(amountIn.quotient.toString()),
            BigInt(TickMath.MIN_SQRT_RATIO.toString()) + 1n
        );
        return -res.amount1;
    }
    const res = await poolContract.getSwapEstimate(
        zeroToOne,
        BigInt(amountIn.quotient.toString()),
        BigInt(TickMath.MAX_SQRT_RATIO.toString()) - 1n
    );
    return -res.amount0;
}

export async function getSwapEstimateExactOut(
    amountOut: JettonAmount<Jetton>,
    pool: Pool,
    poolContract: OpenedContract<PoolContractInstanceType>
): Promise<SwapState> {
    let tickInfos: NumberedTickInfo[];

    try {
        tickInfos = await poolContract.getTickInfosAll();
    } catch (e) {
        throw new Error("Failed to get ticks data");
    }

    const zeroToOne = amountOut.jetton.equals(pool.jetton1);

    const { sqrtRatioX96, tickCurrent, tickSpacing, liquidity, fee } = pool;

    const tickList: TickConstructorArgs[] = tickInfos.map((tick) => ({
        index: tick.tickNum,
        liquidityGross: tick.liquidityGross.toString(),
        liquidityNet: tick.liquidityNet.toString(),
    }));

    const swapSimulator = new SwapSimulator(
        BigInt(sqrtRatioX96.toString()),
        tickCurrent,
        tickSpacing,
        BigInt(liquidity.toString()),
        fee,
        tickList
    );

    const newState = await swapSimulator.swap(zeroToOne, -BigInt(amountOut.quotient.toString()));

    if (newState.liquidity <= 0n) {
        throw new Error("Insufficient liquidity");
    }

    return newState;
}

export async function getSwapEstimateExactInMultihop(
    initialAmount: JettonAmount<Jetton>,
    outputJetton: Jetton,
    routes: Route<Jetton, Jetton>[],
    client: TonClient | TonClient4
) {
    let bestAmount: JettonAmount<Jetton> | undefined;
    let bestRoute: Route<Jetton, Jetton> | undefined;
    let bestQuotes: JettonAmount<Jetton>[] | undefined;
    let bestSwapTypes: SwapType[] | undefined;

    for (const route of routes) {
        const { pools } = route;

        if (pools.length > 1 && pools.some((pool) => pool.liquidity.toString() === "0")) {
            continue;
        }

        let currentAmount = initialAmount;
        const currentQuotes: JettonAmount<Jetton>[] = [];
        const routeSwapTypes: SwapType[] = [];

        for (const pool of pools) {
            try {
                if (!pool || !pool.jetton0_wallet || !pool.jetton1_wallet) continue;

                const jetton0Wallet = Address.parse(pool.jetton0_wallet);
                const jetton1Wallet = Address.parse(pool.jetton1_wallet);

                let poolContract: OpenedContract<PoolContractInstanceType> | undefined;
                let swapResult: bigint | undefined;

                try {
                    const dexVersion = DEX_VERSION.v1_5;
                    const poolAddress = computePoolAddress(jetton0Wallet, jetton1Wallet, dexVersion);
                    const contract = new PoolContract[dexVersion](poolAddress);
                    poolContract = client.open(contract);

                    swapResult = await getSwapEstimateExactIn(currentAmount, pool, poolContract);

                    if (!swapResult) throw new Error("Invalid swap result v1.5");

                    routeSwapTypes.push(getSwapType(pool, currentAmount.jetton, dexVersion, true));
                } catch {
                    const dexVersionFallback = DEX_VERSION.v1;
                    const poolAddressFallback = computePoolAddress(jetton0Wallet, jetton1Wallet, dexVersionFallback);
                    const contractFallback = new PoolContract[dexVersionFallback](poolAddressFallback);
                    poolContract = client.open(contractFallback);

                    swapResult = await getSwapEstimateExactIn(currentAmount, pool, poolContract);

                    if (!swapResult) throw new Error("Invalid swap result v1");

                    routeSwapTypes.push(getSwapType(pool, currentAmount.jetton, dexVersionFallback, true));
                }

                const outJetton = currentAmount.jetton.equals(pool.jetton0) ? pool.jetton1 : pool.jetton0;

                currentAmount = JettonAmount.fromRawAmount(outJetton, swapResult.toString());
                currentQuotes.push(currentAmount);
            } catch (error) {
                console.error("Error during swap estimation:", error);
            }
        }

        if (!currentAmount.jetton.equals(outputJetton)) continue;

        if (!bestAmount || (bestAmount && currentAmount.greaterThan(bestAmount))) {
            bestAmount = currentAmount;
            bestRoute = route;
            bestQuotes = currentQuotes;
            bestSwapTypes = routeSwapTypes;
        }
    }

    return {
        bestAmount: bestAmount ? BigInt(bestAmount.quotient.toString()) : undefined,
        bestRoute,
        bestQuotes,
        swapTypes: bestSwapTypes ?? [],
    };
}

export async function getSwapEstimateExactOutMultihop(
    desiredAmountOut: JettonAmount<Jetton>,
    inputJetton: Jetton,
    routes: Route<Jetton, Jetton>[],
    client: TonClient | TonClient4
) {
    let bestAmount: JettonAmount<Jetton> | undefined;
    let bestRoute: Route<Jetton, Jetton> | undefined;
    let bestQuotes: JettonAmount<Jetton>[] | undefined;
    let bestSwapTypes: SwapType[] | undefined;

    let tickAfterSwap: number | undefined;
    let sqrtPriceAfterSwap: bigint | undefined;

    for (const route of routes) {
        const { pools } = route;

        const routeSwapTypes: SwapType[] = [];

        if (pools.length > 1 && pools.some((pool) => pool.liquidity.toString() === "0")) {
            continue;
        }

        let currentAmount = desiredAmountOut;
        const currentQuotes: JettonAmount<Jetton>[] = [];

        for (let i = pools.length - 1; i >= 0; i--) {
            const pool = pools[i];
            try {
                if (!pool || !pool.jetton0_wallet || !pool.jetton1_wallet) continue;

                const jetton0Wallet = Address.parse(pool.jetton0_wallet);
                const jetton1Wallet = Address.parse(pool.jetton1_wallet);

                let poolContract: OpenedContract<PoolContractInstanceType> | undefined;
                let swapResult: { amountCalculated: bigint; tick: number; sqrtPriceX96: bigint } | undefined;

                try {
                    const dexVersion = DEX_VERSION.v1_5;
                    const poolAddress = computePoolAddress(jetton0Wallet, jetton1Wallet, dexVersion);
                    const contract = new PoolContract[dexVersion](poolAddress);
                    poolContract = client.open(contract);

                    swapResult = await getSwapEstimateExactOut(currentAmount, pool, poolContract);

                    if (!swapResult) throw new Error("Invalid swap result v1.5");

                    const swapType = getSwapType(pool, currentAmount.jetton, dexVersion, false);
                    routeSwapTypes.push(swapType);
                } catch (err) {
                    // fallback to v1 pool
                    const dexVersionFallback = DEX_VERSION.v1;
                    const poolAddress = computePoolAddress(jetton0Wallet, jetton1Wallet, dexVersionFallback);
                    const contract = new PoolContract[dexVersionFallback](poolAddress);
                    poolContract = client.open(contract);

                    swapResult = await getSwapEstimateExactOut(currentAmount, pool, poolContract);

                    if (!swapResult) throw new Error("Invalid swap result v1");

                    const swapType = getSwapType(pool, currentAmount.jetton, dexVersionFallback, false);
                    routeSwapTypes.push(swapType);
                }

                const inputJettonFromPool = currentAmount.jetton.equals(pool.jetton1) ? pool.jetton0 : pool.jetton1;

                currentAmount = JettonAmount.fromRawAmount(inputJettonFromPool, swapResult.amountCalculated.toString());

                if (i === pools.length - 1) {
                    tickAfterSwap = swapResult.tick;
                    sqrtPriceAfterSwap = swapResult.sqrtPriceX96;
                }

                currentQuotes.push(currentAmount);
            } catch (error) {
                console.error("Error during reverse swap estimation:", error);
            }
        }

        if (!currentAmount.jetton.equals(inputJetton)) continue;

        if (!bestAmount || (bestAmount && currentAmount.lessThan(bestAmount))) {
            bestAmount = currentAmount;
            bestRoute = route;
            bestQuotes = currentQuotes;
            bestSwapTypes = routeSwapTypes;
        }
    }

    return {
        bestAmount: bestAmount ? BigInt(bestAmount?.quotient.toString()) : undefined,
        bestRoute,
        bestQuotes: bestQuotes && bestQuotes.length > 1 ? [bestQuotes[0], desiredAmountOut] : [desiredAmountOut],
        tickAfterSwap,
        sqrtPriceAfterSwap,
        swapTypes: bestSwapTypes?.reverse() ?? [],
    };
}

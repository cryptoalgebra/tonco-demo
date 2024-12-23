import { Address, toNano, TonClient4 } from "@ton/ton";
import { getHttpV4Endpoint } from "@orbs-network/ton-access";
import { PoolV3Contract, pTON_MINTER, SwapSimulator, TickConstructorArgs } from "@toncodex/sdk";

const POOL_ADDRESS = "EQD25vStEwc-h1QT1qlsYPQwqU5IiOhox5II0C_xsDNpMVo7"; // TON - USDT

async function main() {
    const endpoint = await getHttpV4Endpoint();
    const client = new TonClient4({ endpoint });

    const poolV3Contract = client.open(new PoolV3Contract(Address.parse(POOL_ADDRESS)));

    const inputJettonAddress = Address.parse(pTON_MINTER); // TON
    const amountIn = toNano(1); // 1 TON

    const { jetton0_minter, price_sqrt, tick, tick_spacing, lp_fee_current, liquidity } =
        await poolV3Contract.getPoolStateAndConfiguration();

    /* pool.jetton0_minter and pool.jetton1_minter from poolState are always sorted, so jetton0 is always first */
    const zeroToOne = inputJettonAddress.equals(jetton0_minter); // true

    const poolTicks = await poolV3Contract.getTickInfosAll();
    const tickList: TickConstructorArgs[] = poolTicks.map((tick) => ({
        index: tick.tickNum,
        liquidityGross: tick.liquidityGross.toString(),
        liquidityNet: tick.liquidityNet.toString(),
    }));

    const swapSimulator = new SwapSimulator(price_sqrt, tick, tick_spacing, liquidity, lp_fee_current, tickList);

    /* estimate 1 TON to USDT swap off-chain */
    const result = await swapSimulator.swapExactIn(zeroToOne, amountIn);
    return result;
}

main().then(console.log).catch(console.error);

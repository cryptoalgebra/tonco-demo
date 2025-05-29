import { Address, toNano } from "@ton/core";
import { getHttpV4Endpoint } from "@orbs-network/ton-access";
import {
    ADDRESS_ZERO,
    DEX_VERSION,
    Jetton,
    JettonMinter,
    Percent,
    Pool,
    PoolContract,
    PoolMessageManager,
    Position,
    pTON_MINTER,
    tryParseTick,
    validateMint,
} from "@toncodex/sdk";
import { TonClient4 } from "@ton/ton";

const recipient = Address.parse(ADDRESS_ZERO); // replace with user wallet address
const POOL_ADDRESS = "EQC_R1hCuGK8Q8FfHJFbimp0-EHznTuyJsdJjDl7swWYnrF0"; // TON - USDT v1.5
const jetton0 = new Jetton(pTON_MINTER.v1_5, 9, "TON"); // (address, decimals, symbol)
const jetton1 = new Jetton("0:b113a994b5024a16719f69139328eb759596c38a25f59028b146fecdc3621dfe", 6, "USD₮");
const amount0 = toNano(1).toString(); // 1 TON

export async function createMintMessage() {
    const endpoint = await getHttpV4Endpoint();
    const client = new TonClient4({ endpoint });

    const poolContract = client.open(new PoolContract[DEX_VERSION.v1_5](Address.parse(POOL_ADDRESS)));

    const {
        jetton0_wallet,
        jetton1_wallet,
        lp_fee_current,
        price_sqrt,
        liquidity,
        tick,
        tick_spacing,
        feeGrowthGlobal0X128,
        feeGrowthGlobal1X128,
    } = await poolContract.getPoolStateAndConfiguration();

    const pool = new Pool(jetton0, jetton1, lp_fee_current, price_sqrt.toString(), liquidity.toString(), tick, tick_spacing);

    // min price 3.1 USDT per TON <--> max price 6.5 USDT per TON
    const tickLower = tryParseTick(jetton0, jetton1, "3.1", pool?.tickSpacing);
    const tickUpper = tryParseTick(jetton0, jetton1, "6.5", pool?.tickSpacing);

    if (!tickLower || !tickUpper) return;

    const position = Position.fromAmount0({
        pool,
        tickLower,
        tickUpper,
        amount0,
        useFullPrecision: true,
    });

    const jetton0Minter = client.open(new JettonMinter(Address.parse(jetton0.address)));
    const jetton1Minter = client.open(new JettonMinter(Address.parse(jetton1.address)));

    const userJetton0Wallet = await jetton0Minter.getWalletAddress(recipient); // TON user jetton wallet
    const userJetton1Wallet = await jetton1Minter.getWalletAddress(recipient); // USDT user jetton wallet

    const routerJetton0Wallet = jetton0_wallet;
    const routerJetton1Wallet = jetton1_wallet;

    const slippage = new Percent(1, 100); // 1%

    try {
        const ticks = await poolContract.getTickInfosAll();

        const mintRequest = {
            tickLower: position.tickLower,
            tickUpper: position.tickUpper,
            liquidity: BigInt(position.liquidity.toString()),
        };

        const poolState = {
            tick,
            feeGrowthGlobal0X128,
            feeGrowthGlobal1X128,
            ticks,
        };

        if (!validateMint(mintRequest, poolState)) {
            throw new Error("Unsupported price range");
        }

        const messages = PoolMessageManager.createMintMessage(
            routerJetton0Wallet,
            routerJetton1Wallet,
            userJetton0Wallet,
            userJetton1Wallet,
            position,
            recipient,
            slippage,
            0, // queryId
            undefined, // referral
            DEX_VERSION.v1_5
        );

        return messages;
    } catch (error) {
        throw new Error("Failed to validate mint request");
    }
}

createMintMessage().then((result) => {
    console.log(result);
});

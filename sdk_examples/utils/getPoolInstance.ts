import { getHttpV4Endpoint } from "@orbs-network/ton-access";
import { Address, TonClient4 } from "@ton/ton";
import { DEX_VERSION, Jetton, Pool, PoolContract } from "@toncodex/sdk";

export async function getPoolInstance(jettonA: Jetton, jettonB: Jetton, poolAddress: string) {
    const endpoint = await getHttpV4Endpoint();
    const client = new TonClient4({ endpoint });
    const poolContract = client.open(new PoolContract[DEX_VERSION.v1](Address.parse(poolAddress)));

    /* pool.jetton0_minter and pool.jetton1_minter from poolState are always sorted, so jetton0 is always first */
    const { jetton0_minter, price_sqrt, tick, tick_spacing, lp_fee_current, liquidity, jetton0_wallet, jetton1_wallet } =
        await poolContract.getPoolStateAndConfiguration();

    const isSorted = Address.parse(jettonA.address).equals(jetton0_minter);

    const [jetton0, jetton1] = isSorted ? [jettonA, jettonB] : [jettonB, jettonA];

    const pool = new Pool(
        jetton0,
        jetton1,
        lp_fee_current,
        price_sqrt.toString(),
        liquidity.toString(),
        tick,
        tick_spacing,
        undefined,
        jetton0_wallet.toString(),
        jetton1_wallet.toString()
    );

    return pool;
}

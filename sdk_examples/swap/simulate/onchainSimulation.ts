import { Address, toNano, TonClient4 } from "@ton/ton";
import { getHttpV4Endpoint } from "@orbs-network/ton-access";
import { getSwapEstimate, PoolV3Contract, pTON_MINTER } from "@toncodex/sdk";

const POOL_ADDRESS = "EQD25vStEwc-h1QT1qlsYPQwqU5IiOhox5II0C_xsDNpMVo7"; // TON - USDT

async function main() {
    const endpoint = await getHttpV4Endpoint();
    const client = new TonClient4({ endpoint });

    const poolV3Contract = client.open(new PoolV3Contract(Address.parse(POOL_ADDRESS)));

    const inputJettonAddress = Address.parse(pTON_MINTER); // TON
    const amountIn = toNano(1); // 1 TON

    /* pool.jetton0_minter and pool.jetton1_minter from poolState are always sorted, so jetton0 is always first */
    const { jetton0_minter } = await poolV3Contract.getPoolStateAndConfiguration(); // TON
    const zeroToOne = inputJettonAddress.equals(jetton0_minter); // true

    /* estimate 1 TON to USDT swap on-chain */
    const result = await getSwapEstimate(amountIn, POOL_ADDRESS, zeroToOne, client);
    return result;
}

main().then(console.log).catch(console.error);

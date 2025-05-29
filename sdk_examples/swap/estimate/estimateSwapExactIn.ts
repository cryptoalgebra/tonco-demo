import { Address, toNano, TonClient4 } from "@ton/ton";
import { getHttpV4Endpoint } from "@orbs-network/ton-access";
import { DEX_VERSION, Jetton, JettonAmount, Pool, PoolContract, pTON_MINTER } from "@toncodex/sdk";
import { getSwapEstimateExactIn } from "../../utils/getSwapEstimate";
import { getPoolInstance } from "../../utils/getPoolInstance";

const POOL_ADDRESS = "EQC_R1hCuGK8Q8FfHJFbimp0-EHznTuyJsdJjDl7swWYnrF0"; // TON - USDT v1.5

export async function estimateSwapExactIn() {
    const endpoint = await getHttpV4Endpoint();
    const client = new TonClient4({ endpoint });

    const poolContract = client.open(new PoolContract[DEX_VERSION.v1_5](Address.parse(POOL_ADDRESS)));

    const jettonIn = new Jetton(pTON_MINTER.v1, 9, "TON");
    const jettonOut = new Jetton("0:b113a994b5024a16719f69139328eb759596c38a25f59028b146fecdc3621dfe", 6, "USD₮");

    const amountIn = JettonAmount.fromRawAmount(jettonIn, toNano(1).toString()); // 1 TON

    const pool = await getPoolInstance(jettonIn, jettonOut, POOL_ADDRESS);

    /* estimate 1 TON -> USDT swap */
    const result = await getSwapEstimateExactIn(amountIn, pool, poolContract);

    return result;
}

estimateSwapExactIn().then((result) => {
    console.log(`Exact-in estimated: 1 TON -> ${Number(result) / 10 ** 6} USDT`);
});

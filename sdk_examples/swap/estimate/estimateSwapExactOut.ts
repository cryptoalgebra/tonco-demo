import { Address, toNano } from "@ton/ton";
import { DEX_VERSION, Jetton, JettonAmount, PoolContract, pTON_MINTER } from "@toncodex/sdk";
import { getSwapEstimateExactOut } from "../../utils/getSwapEstimate";
import { getPoolInstance } from "../../utils/getPoolInstance";
import { getTonClient } from "../../utils/getTonClient";

const POOL_ADDRESS = "EQC_R1hCuGK8Q8FfHJFbimp0-EHznTuyJsdJjDl7swWYnrF0"; // TON - USDT v1.5

export async function estimateSwapExactOut() {
    const client = getTonClient();

    const poolContract = client.open(new PoolContract[DEX_VERSION.v1_5](Address.parse(POOL_ADDRESS)));

    const jettonIn = new Jetton("0:b113a994b5024a16719f69139328eb759596c38a25f59028b146fecdc3621dfe", 6, "USD₮");
    const jettonOut = new Jetton(pTON_MINTER.v1_5, 9, "TON");

    const amountOut = JettonAmount.fromRawAmount(jettonOut, toNano(1).toString()); // 1 TON

    const pool = await getPoolInstance(jettonIn, jettonOut, POOL_ADDRESS);

    /* estimate USDT <- 1 TON swap on-chain */
    const result = await getSwapEstimateExactOut(amountOut, pool, poolContract);

    return result.amountCalculated;
}

estimateSwapExactOut().then((result) => {
    console.log(`Exact-out estimated: ${Number(result) / 10 ** 6} USDT <- 1 TON`);
});

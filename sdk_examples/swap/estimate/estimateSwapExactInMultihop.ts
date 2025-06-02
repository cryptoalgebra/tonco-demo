import { fromNano, toNano } from "@ton/ton";
import { Jetton, JettonAmount, pTON_MINTER, Route } from "@toncodex/sdk";
import { getSwapEstimateExactInMultihop } from "../../utils/getSwapEstimate";
import { getPoolInstance } from "../../utils/getPoolInstance";
import { getTonClient } from "../../utils/getTonClient";

const TON_USDT_POOL_ADDRESS = "EQC_R1hCuGK8Q8FfHJFbimp0-EHznTuyJsdJjDl7swWYnrF0"; // TON - USDT v1.5
const STORM_USDT_POOL_ADDRESS = "EQDg9dBt7fRFUz9-vQ3qWRKi2CvJRUj8iWIjqlf738FSvAgl"; // STORM - USDT v1

export async function estimateSwapExactInMultihop() {
    const client = getTonClient();

    const jettonA = new Jetton(pTON_MINTER.v1, 9, "TON"); // (address, decimals, symbol)
    const jettonB = new Jetton("0:b113a994b5024a16719f69139328eb759596c38a25f59028b146fecdc3621dfe", 6, "USD₮");
    const jettonC = new Jetton("EQBsosmcZrD6FHijA7qWGLw5wo_aH8UN435hi935jJ_STORM", 9, "STORM");

    const amountIn = JettonAmount.fromRawAmount(jettonA, toNano(1).toString()); // 1 TON

    const tonUsdtPool = await getPoolInstance(jettonA, jettonB, TON_USDT_POOL_ADDRESS);
    const stormUsdtPool = await getPoolInstance(jettonB, jettonC, STORM_USDT_POOL_ADDRESS);

    const route = new Route([tonUsdtPool, stormUsdtPool], jettonA, jettonC);

    /* estimate 1 TON -> STORM multihop swap through USDT */
    const result = await getSwapEstimateExactInMultihop(amountIn, jettonC, [route], client);

    return result;
}

estimateSwapExactInMultihop()
    .then((result) => {
        if (!result.bestQuotes || !result.bestRoute || !result.bestAmount) {
            throw new Error("No route found");
        }
        const tokenPath = result.bestRoute.tokenPath;
        const quoteAtoB = result.bestQuotes[0].toExact();

        const bestAmount = fromNano(result.bestAmount);

        console.log(
            `Exact-in multihop estimated: 1 ${tokenPath[0].symbol} -> ${quoteAtoB} ${tokenPath[1].symbol} -> ${bestAmount} ${tokenPath[2].symbol}`
        );
        console.log("Swap types:", result.swapTypes);
    })
    .catch((error) => {
        console.error(error);
    });

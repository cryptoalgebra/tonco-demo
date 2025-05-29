import { fromNano, toNano, TonClient4 } from "@ton/ton";
import { getHttpV4Endpoint } from "@orbs-network/ton-access";
import { Jetton, JettonAmount, pTON_MINTER, Route } from "@toncodex/sdk";
import { getSwapEstimateExactOutMultihop } from "../../utils/getSwapEstimate";
import { getPoolInstance } from "../../utils/getPoolInstance";

const TON_USDT_POOL_ADDRESS = "EQC_R1hCuGK8Q8FfHJFbimp0-EHznTuyJsdJjDl7swWYnrF0"; // TON - USDT v1.5
const STORM_USDT_POOL_ADDRESS = "EQDg9dBt7fRFUz9-vQ3qWRKi2CvJRUj8iWIjqlf738FSvAgl"; // STORM - USDT v1

export async function estimateSwapExactOutMultihop() {
    const endpoint = await getHttpV4Endpoint();
    const client = new TonClient4({ endpoint });

    const jettonA = new Jetton(pTON_MINTER.v1, 9, "TON"); // (address, decimals, symbol)
    const jettonB = new Jetton("0:b113a994b5024a16719f69139328eb759596c38a25f59028b146fecdc3621dfe", 6, "USD₮");
    const jettonC = new Jetton("EQBsosmcZrD6FHijA7qWGLw5wo_aH8UN435hi935jJ_STORM", 9, "STORM");

    const desiredAmount = JettonAmount.fromRawAmount(jettonC, toNano(1).toString()); // 1 STORM

    const tonUsdtPool = await getPoolInstance(jettonA, jettonB, TON_USDT_POOL_ADDRESS);
    const stormUsdtPool = await getPoolInstance(jettonB, jettonC, STORM_USDT_POOL_ADDRESS);

    const route = new Route([tonUsdtPool, stormUsdtPool], jettonA, jettonC);

    /* estimate 1 TON -> STORM multihop swap through USDT */
    const result = await getSwapEstimateExactOutMultihop(desiredAmount, jettonA, [route], client);

    return result;
}

estimateSwapExactOutMultihop()
    .then((result) => {
        if (!result.bestQuotes || !result.bestRoute || !result.bestAmount) {
            throw new Error("No route found");
        }
        const tokenPath = result.bestRoute.tokenPath;
        const quoteCtoB = result.bestQuotes[0].toExact();

        const bestAmount = fromNano(result.bestAmount);

        console.log(
            `Exact-out multihop estimated: ${bestAmount} ${tokenPath[0].symbol} <- ${quoteCtoB} ${tokenPath[1].symbol} <- ${1} ${
                tokenPath[2].symbol
            }`
        );
        console.log("Swap types:", result.swapTypes);
    })
    .catch((error) => {
        console.error(error);
    });

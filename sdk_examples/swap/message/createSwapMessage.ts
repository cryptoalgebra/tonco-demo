import { Address, toNano } from "@ton/core";
import { ADDRESS_ZERO, Jetton, JettonMinter, PoolMessageManager, pTON_MINTER, ROUTER, SwapType } from "@toncodex/sdk";
import { getTonClient } from "../../utils/getTonClient";

const recipient = Address.parse(ADDRESS_ZERO); // replace with user wallet address

export async function createSwapMessage() {
    const client = getTonClient();

    const jettonIn = new Jetton(pTON_MINTER.v1_5, 9, "TON"); // (address, decimals, symbol)
    const jettonOut = new Jetton("0:b113a994b5024a16719f69139328eb759596c38a25f59028b146fecdc3621dfe", 6, "USD₮");
    const swapType = SwapType.TON_TO_JETTON_V1_5;
    const amountIn = toNano(1); // 1 TON

    const jettonInMinter = client.open(new JettonMinter(Address.parse(jettonIn.address)));
    const jettonOutMinter = client.open(new JettonMinter(Address.parse(jettonOut.address)));

    const userJettonInWallet = await jettonInMinter.getWalletAddress(recipient); // TON user jetton wallet
    const routerJettonOutWallet = await jettonOutMinter.getWalletAddress(Address.parse(ROUTER.v1_5)); // USDT router jetton wallet

    const message = PoolMessageManager.createSwapExactInMessage(
        userJettonInWallet,
        routerJettonOutWallet,
        recipient,
        amountIn,
        0n, // minimumAmountOut
        0n, // priceLimitSqrt
        swapType,
        0 // queryId
    );

    return message;
}

createSwapMessage().then((result) => {
    console.log(result);
});

import { Address, toNano } from "@ton/core";
import { ADDRESS_ZERO, Jetton, JettonMinter, PoolMessageManager, pTON_MINTER, ROUTER, SwapType } from "@toncodex/sdk";
import { getTonClient } from "../../utils/getTonClient";

const recipient = Address.parse(ADDRESS_ZERO); // replace with user wallet address

export async function createSwapMultihopMessage() {
    const client = getTonClient();

    const jettonA = new Jetton(pTON_MINTER.v1, 9, "TON"); // (address, decimals, symbol)
    const jettonB = new Jetton("0:b113a994b5024a16719f69139328eb759596c38a25f59028b146fecdc3621dfe", 6, "USD₮");
    const jettonC = new Jetton("EQBsosmcZrD6FHijA7qWGLw5wo_aH8UN435hi935jJ_STORM", 9, "STORM");

    const swapTypes = [SwapType.TON_TO_JETTON_V1_5, SwapType.JETTON_TO_JETTON_V1];

    const amountIn = toNano(1); // 1 TON

    const jettonAMinter = client.open(new JettonMinter(Address.parse(jettonA.address)));
    const jettonBMinter = client.open(new JettonMinter(Address.parse(jettonB.address)));
    const jettonCMinter = client.open(new JettonMinter(Address.parse(jettonC.address)));

    const userJettonAWallet = await jettonAMinter.getWalletAddress(recipient); // TON user jetton wallet
    const routerJettonBWallet = await jettonBMinter.getWalletAddress(Address.parse(ROUTER.v1_5)); // USDT router jetton wallet
    const routerJettonCWallet = await jettonCMinter.getWalletAddress(Address.parse(ROUTER.v1)); // STORM router jetton wallet

    const message = PoolMessageManager.createSwapExactInMultihopMessage(
        userJettonAWallet,
        [routerJettonBWallet, routerJettonCWallet],
        recipient,
        amountIn,
        [0n, 0n], // minimumAmountsOut
        [0n, 0n], // priceLimitsSqrt
        swapTypes
    );

    return message;
}

createSwapMultihopMessage().then((result) => {
    console.log(result);
});

import { Address, DEX_VERSION, Jetton, Route, SwapType } from "@toncodex/sdk";
import { isTON } from "./isTON";

export function getSwapType(
    pool: Route<Jetton, Jetton>["pools"][number],
    jetton: Jetton,
    dexVersion: DEX_VERSION,
    isExactIn: boolean
): SwapType {
    const jettonAddr = Address.parse(jetton.address);
    const jetton0 = Address.parse(pool.jetton0.address);
    const jetton1 = Address.parse(pool.jetton1.address);

    const isJetton0TON = isTON(jetton0);
    const isJetton1TON = isTON(jetton1);

    if (isExactIn) {
        // TON -> Jetton or Jetton -> TON
        if (isJetton0TON || isJetton1TON) {
            const tonIsInput = jettonAddr.equals(isJetton0TON ? jetton0 : jetton1);
            if (dexVersion === DEX_VERSION.v1_5) {
                return tonIsInput ? SwapType.TON_TO_JETTON_V1_5 : SwapType.JETTON_TO_TON_V1_5;
            }
            if (dexVersion === DEX_VERSION.v1) {
                return tonIsInput ? SwapType.TON_TO_JETTON_V1 : SwapType.JETTON_TO_TON_V1;
            }
            throw new Error("Unsupported DEX version");
        }
        // Jetton -> Jetton
        return dexVersion === DEX_VERSION.v1_5 ? SwapType.JETTON_TO_JETTON_V1_5 : SwapType.JETTON_TO_JETTON_V1;
    }

    const inputJetton = jettonAddr.equals(jetton0) ? jetton1 : jetton0;
    const isInputTON = isTON(inputJetton);
    const isOutputTON = isTON(jettonAddr);

    if (isInputTON || isOutputTON) {
        if (dexVersion === DEX_VERSION.v1_5) {
            return isInputTON ? SwapType.TON_TO_JETTON_V1_5 : SwapType.JETTON_TO_TON_V1_5;
        }
        if (dexVersion === DEX_VERSION.v1) {
            return isInputTON ? SwapType.TON_TO_JETTON_V1 : SwapType.JETTON_TO_TON_V1;
        }
        throw new Error("Unsupported DEX version");
    }

    return dexVersion === DEX_VERSION.v1_5 ? SwapType.JETTON_TO_JETTON_V1_5 : SwapType.JETTON_TO_JETTON_V1;
}

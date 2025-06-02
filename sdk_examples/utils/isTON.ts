import { Address } from "@ton/core";
import { pTON_MINTER } from "@toncodex/sdk";

export function isTON(address: Address) {
    return address.equals(Address.parse(pTON_MINTER.v1)) || address.equals(Address.parse(pTON_MINTER.v1_5));
}

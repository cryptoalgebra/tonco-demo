import { TonClient } from "@ton/ton";

const TON_CENTER_API_KEY = "";

export function getTonClient() {
    const endpoint = "https://toncenter.com/api/v2/jsonRPC";
    const client = new TonClient({ endpoint, apiKey: TON_CENTER_API_KEY });

    return client;
}

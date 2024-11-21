import {Address, TonClient, toNano, JettonWallet} from "@ton/ton";

const ROUTER_USDT_WALLET = Address.parse('EQCsrUV5ZySz8ArUKkMRsgZn2kviikOVFYejgfc6qVUiCYtS');
const ROUTER_WTTON_WALLET = Address.parse('EQCHHakhWxSQIWbw6ioW21YnjVKBCDd_gVjF9Mz9_dIuFy23');

async function getTVL() {
    const tonClient = new TonClient({
        endpoint: "https://toncenter.com/api/v2/jsonRPC",
    });
    const usdtWallet = tonClient.open(JettonWallet.create(ROUTER_USDT_WALLET));
    const usdtAmount = Number(await usdtWallet.getBalance()) / 10**6;
    console.log("USDT: " + usdtAmount);

    // sleep because rate limit
    await new Promise(f => setTimeout(f, 5000));

    const wtTONWallet = tonClient.open(JettonWallet.create(ROUTER_WTTON_WALLET));
    const wtTONAmount = Number(await wtTONWallet.getBalance()) / 10**9;
    console.log("wtTON: " + wtTONAmount);

    const TONPriceRaw = await (await fetch("https://tonapi.io/v2/rates?tokens=ton&currencies=usd")).json()
    const TONPriceUSD = TONPriceRaw.rates.TON.prices["USD"]
    console.log("TON Price: " + TONPriceUSD);

    const tvl = usdtAmount + wtTONAmount * TONPriceUSD;
    console.log("TVL: " + tvl);
}

getTVL().catch((e) => console.log(e)).then(() => console.log('Done'));
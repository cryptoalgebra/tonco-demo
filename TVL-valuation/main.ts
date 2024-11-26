import { AccountEvent, Action, Api, HttpClient, SmartContractAction, Trace } from "tonapi-sdk-js";
import pLimit from "p-limit";
import {Address, TonClient, toNano, JettonWallet} from "@ton/ton";
import { ContractOpcodes } from "./opCodes";


const ROUTER  : Address = Address.parse('EQC_-t0nCnOFMdp7E7qPxAOCbCWGFz-e3pwxb6tTvFmshjt5');
const ROUTER_USDT_WALLET  : Address = Address.parse('EQCsrUV5ZySz8ArUKkMRsgZn2kviikOVFYejgfc6qVUiCYtS');
const ROUTER_WTTON_WALLET : Address = Address.parse('EQCHHakhWxSQIWbw6ioW21YnjVKBCDd_gVjF9Mz9_dIuFy23');

const USDT_MASTER :  Address = Address.parse('EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs');


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


export type UserTVLData = {[x : number] : number}

async function getUserTVLUSD(startUnixTime: number, endUnixTime: number, addressStr : string ) : Promise< {[timestamp : number] : number}> {

    /* Open provider */
    const API_KEY = "AGHD4DYGGAWBDZAAAAAPYUMY4V22MOI74LDT4VIF47EBFARRYYABMNGJMDGF6QJI2JATNKA";

    /* tonApi client for fetching additional data, such as jetton balances, etc. */
    const httpClient = new HttpClient({
        baseUrl: "https://tonapi.io",
        baseApiParams: {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-type": "application/json",
            },
        },
    });
    const client = new Api(httpClient);

    /* We use TON at current price. Because whatever */
    const TONPriceRaw = await (await fetch("https://tonapi.io/v2/rates?tokens=ton&currencies=usd")).json()
    const TONPriceUSD = TONPriceRaw.rates.TON.prices["USD"]
    console.log("TON Price: " + TONPriceUSD);

    /* Fetch all user transactions for the period */
    const userAddress : Address = Address.parse(addressStr)
  

    let eventIds : AccountEvent[] = []
    let effectiveStartTime = startUnixTime;
    let effectiveEndTime = endUnixTime;

    let haveTxs = true;


    while (haveTxs) {
        /* We get ids in backward order */
        const lastTxs = await client.accounts.getAccountEvents(userAddress.toString(), 
        {
            limit: 100,
            start_date: effectiveStartTime,
            end_date: effectiveEndTime
        });

        if (lastTxs.events.length) {
            eventIds = [...eventIds, ...lastTxs.events];
            let chunkStartTime = lastTxs.events[0].timestamp;
            let chunkEndTime   = lastTxs.events[lastTxs.events.length - 1].timestamp;

            console.log(`Got a chunk of length ${lastTxs.events.length} with info`)
            for (let eventId of lastTxs.events) {                
                    console.log(`   - ${new Date(eventId.timestamp * 1000)}`)
            }

            effectiveEndTime = chunkEndTime
        } else {
            haveTxs = false;
        }
    }


    console.log(`Event ids loaded - ${eventIds.length}`)
    eventIds = eventIds.sort((a : AccountEvent, b : AccountEvent) => {return (a.timestamp - b.timestamp)})

    const limit = pLimit(1);
    const events = await Promise.all(
        eventIds.map((event) =>
          limit(() => client.events.getEvent(event.event_id)),
        ),
      );

    /*now let's scan all burns and mints  */  
    let tonInvestment = 0n
    let usdtInvestment = 0n

    let tvlAtTimestamp : {[timestamp : number] : number} = {}

    for (let event of events ) {        
        let execs     : Action[] = event.actions.filter((action) => action.SmartContractExec)
        let transfers : Action[] = event.actions.filter((action) => action.JettonTransfer)

        //console.log(event.event_id)

        let ton = 0n;
        let usd = 0n;

        let hasLPImpact = false;
        for (let exec of execs) {

            let account : Address = Address.parse(exec.SmartContractExec!.contract.address)           
                       

            if (Number(exec.SmartContractExec!.operation) == ContractOpcodes.POOLV3_MINT) {
                console.log("MINT:")
                hasLPImpact = true
            }
            if (Number(exec.SmartContractExec!.operation) == ContractOpcodes.POOLV3_BURN) {
                console.log("BURN:")
                hasLPImpact = true
            }   
        }

        // console.log(event.value_flow)

        for (let flow of event.value_flow)
        {
            if (Address.parse(flow.account.address).toString() == ROUTER.toString()) {
                if( flow.jettons !== undefined) {
                    for (let jetton of flow.jettons) {
                        if (Address.parse(jetton.jetton.address).toString() == USDT_MASTER.toString() )
                        {
                            usd += BigInt(jetton.quantity)
                        }
                    }
                }
            }

            if (Address.parse(flow.account.address).toString() == ROUTER_WTTON_WALLET.toString()) {
                // console.log("Ton flow", flow.ton)
                ton += BigInt(flow.ton)
            }

        }

        /*for (let transfer of transfers) {
            console.log(transfer)
        }*/


        if (hasLPImpact) {
            usdtInvestment += usd 
            tonInvestment  += ton 

            tvlAtTimestamp[event.timestamp] = (Number(usdtInvestment) / 1e6) + (Number(tonInvestment) / 1e9) * TONPriceUSD;

            console.log("  - USDT", Number(usd) / 1000000.0 )
            console.log("  - TON ", Number(ton) / 1000000000.0 )
        } else {
            // console.log("Not an LP operation")
        }
           
    }

    console.log("Total: ")
    console.log("USDT", Number(usdtInvestment) / 1000000.0 )
    console.log("TON ", Number(tonInvestment) / 1000000000.0 )



    const tvl = (Number(usdtInvestment) / 1e6) + (Number(tonInvestment) / 1e9) * TONPriceUSD;
    console.log("TVL: " + tvl);
    
    Object.entries(tvlAtTimestamp).map(([a, b]) => {console.log(new Date(Number(a) * 1000), " - ",  b, " USD")})


    return tvlAtTimestamp;
}


//getTVL().catch((e) => console.log(e)).then(() => console.log('Done'));

// Since the start of the TONCO mainnet
getUserTVLUSD(Math.floor(Date.parse("2024-11-18T12:00:00.000Z") / 1000), Math.floor(Date.now() / 1000), "UQCRuwIDpgPE8flurzhvcoR8VCdWuCZljjcjAB0ITP35gg32")
/// getUserTVLUSD(Math.floor(Date.parse("2024-11-18T12:00:00.000Z") / 1000), Math.floor(Date.now() / 1000), "UQAt4dox6p4lpyv13PicDbiW0x3GJZKS24G6JU1bEwUH6ZCc") // Nick 
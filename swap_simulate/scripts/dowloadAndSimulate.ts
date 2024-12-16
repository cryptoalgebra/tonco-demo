import * as fs from 'fs';
import { Address, beginCell, Cell, ShardAccount, toNano, TonClient4 } from "@ton/ton"
import { getHttpV4Endpoint } from "@orbs-network/ton-access";
import { Blockchain, createShardAccount } from '@ton/sandbox';
import { TickMath } from '../wrappers/frontmath/frontMath';
import { BLACK_HOLE_ADDRESS } from '../wrappers/tonUtils';
import { PoolSimulator } from '../wrappers/frontmath/swap';
import { compile } from '@ton/blueprint';
import { PoolV3Contract } from '../wrappers/PoolV3Contract';

async function main() {
    
    const endpoint = await getHttpV4Endpoint()
    const client = new TonClient4({ endpoint })

    let poolAddressS = "EQD25vStEwc-h1QT1qlsYPQwqU5IiOhox5II0C_xsDNpMVo7"
    let poolAddress = Address.parse(poolAddressS)
    let pTonProxyMinterS = "EQCUnExmdgwAKADi-j2KPKThyQqTc7U650cgM0g78UzZXn9J"
    let pTonProxyMinder = Address.parse(pTonProxyMinterS)

    const cseqno = (await client.getLastBlock()).last.seqno
    const state = await client.getAccount(cseqno, poolAddress)


    let result : {
        address : string,
        code : string,
        data : string,
        swaps : {zeroForOne: boolean, inAmount : string, outAmount: string}[]
    } = {
        address : "",
        code : "",
        data : "",
        swaps : []

    }


    if (state.account.state.type != "active") {
        return
    }
  
    result.address = poolAddress.toString()
    result.code = state.account.state.code! 
    result.data = state.account.state.data!

    //console.log(result.code)
    //console.log(result.data)
    
    let bcCode :Cell = Cell.fromBoc(Buffer.from(result.code, "base64"))[0]
    //let bcCode : Cell = await compile("PoolV3Contract")
    let bcData : Cell = Cell.fromBoc(Buffer.from(result.data, "base64"))[0]       
    

    const blockchain = await Blockchain.create();    
    const ownerWallet = await blockchain.treasury("ownerWallet");
    const sender = ownerWallet.getSender()

    const shard : ShardAccount = createShardAccount({address: poolAddress, code: bcCode, data: bcData, balance:toNano(1.0)})
    blockchain.setShardAccount(poolAddress, shard)
    const poolContract = new PoolV3Contract(poolAddress)
    let poolContractOpened = blockchain.openContract(poolContract)

    let poolState = await poolContractOpened.getPoolStateAndConfiguration()
    console.log(poolState)
    let poolTicks = await poolContractOpened.getTickInfosAll()
    console.log("Pool ticks: ", poolTicks.length)

    let tickKotlin = ""
    for (let i of poolTicks.keys()) {
        tickKotlin += (`ticks [${poolTicks[i].tickNum}] = BigInteger("${poolTicks[i].liquidityNet.toString()}")\n`)
    }
    
    fs.writeFileSync("kotlin.ticks", tickKotlin)

  
    const step0A = 94243023749710n / 100n
    const step0B = 942430237400n / 100n
    
    let i = 1n;
    while (i < 60n) 
    {
        for (let dir of [false, true]) 
        {
            const amount0 = (dir ? step0A : step0B) * i
            let limitPrice = dir ? TickMath.MIN_SQRT_RATIO + 1n : TickMath.MAX_SQRT_RATIO - 1n

            console.log(`zeroForOne=${dir} amount0=${amount0}` )
            // reset state
            const shard : ShardAccount = createShardAccount({address: poolAddress, code: bcCode, data: bcData, balance:toNano(1.0)})
            blockchain.setShardAccount(poolAddress, shard)
            const poolContract = new PoolV3Contract(poolAddress)
            let poolContractOpened = blockchain.openContract(poolContract)
        
            
            // Call get method
            let res = {amount0 : 0n , amount1 : 0n}
            let result1 : bigint 
            if (true) {                       
                res = (await poolContractOpened.getSwapEstimate(dir, amount0, limitPrice, 0n))
                console.log(`${i} ${amount0} -> ( ${res.amount0}, ${res.amount1})`)
                result1 = dir ? res.amount1 : res.amount0
            }

            let result2 : bigint 
            
            if (true) {
                // Make real swap
                let swapMessage = PoolV3Contract.messageSwapPool(BLACK_HOLE_ADDRESS, dir ? poolState.jetton0_wallet : poolState.jetton1_wallet, amount0, limitPrice, 0n)
                const message : Cell  = beginCell()
                    .storeUint(0, 1) // tag
                    .storeUint(1, 1) // ihr_disabled
                    .storeUint(1, 1) // allow bounces
                    .storeUint(0, 1) // not bounced itself
                    .storeAddress(poolState.router_address)
                    .storeAddress(poolAddress)
                    .storeCoins(toNano(1.0))
                    .storeUint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                    .storeRef(swapMessage)
                .endCell()
            
                const realSwap = await blockchain.sendMessage(message)
                let poolStateAfter = await poolContractOpened.getPoolStateAndConfiguration()
                let real = {amount0: poolStateAfter.reserve0 - poolState.reserve0, amount1 : poolStateAfter.reserve1 - poolState.reserve1 }
                result2 = dir ? real.amount1 : real.amount0
            }

            let result3 : bigint 
                
            if (true) {
                // Simulated swap
                let poolSimulator : PoolSimulator  = new  PoolSimulator(
                    poolState.price_sqrt,
                    poolState.tick, 
                    poolState.liquidity,
                    poolState.lp_fee_current,
                    poolTicks
                )

                const simSwap = await poolSimulator.swapInternal(dir, amount0, limitPrice )
                result3 = dir ? simSwap.amount1 : simSwap.amount0
            }



            console.log(`Swap results - ${result1} | ${result2} | ${result3}`)

            if (result1 != result2 ) {
                throw("Difference")
            }

            if (result1 != result3 ) {
                throw("Difference")
            }

            // Saving ground truth
            result.swaps.push({"zeroForOne" : dir, inAmount: amount0.toString(), outAmount : res.amount1.toString() })
        }

        i = i + 1n
    }

    fs.writeFileSync("swap_ground_truth.json", JSON.stringify(result))
}


main()
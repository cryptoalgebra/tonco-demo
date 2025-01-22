import * as fs from 'fs';
import { Address, beginCell, Cell, ShardAccount, toNano, TonClient4 } from "@ton/ton"
import { getHttpV4Endpoint } from "@orbs-network/ton-access";
import { printTransactionFees, Blockchain, createShardAccount } from '@ton/sandbox';
import { TickMath } from '../wrappers/frontmath/frontMath';
import { BLACK_HOLE_ADDRESS } from '../wrappers/tonUtils';
import { PoolSimulator } from '../wrappers/frontmath/swap';
import { PoolV3Contract } from '../wrappers/PoolV3Contract';
import { SwapSimulator, TickConstructorArgs } from '@toncodex/sdk';
//import { SwapSimulator, TickConstructorArgs } from 'toncodexlocal';
import BigNumber from 'bignumber.js';

async function main() {
    
    const endpoint = await getHttpV4Endpoint()
    const client = new TonClient4({ endpoint })

    let jsonName = "swap_ground_truth.json"
    let poolAddressS = "EQD25vStEwc-h1QT1qlsYPQwqU5IiOhox5II0C_xsDNpMVo7"
    let poolAddress = Address.parse(poolAddressS)
    let pTonProxyMinterS = "EQCUnExmdgwAKADi-j2KPKThyQqTc7U650cgM0g78UzZXn9J"
    let pTonProxyMinder = Address.parse(pTonProxyMinterS)

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

    if (fs.existsSync(jsonName)) {
        console.log(`${jsonName} exists loading data from there...`)
        result = JSON.parse(fs.readFileSync(jsonName, 'utf-8'))
    } else {
        const cseqno = (await client.getLastBlock()).last.seqno
        const state = await client.getAccount(cseqno, poolAddress)

        if (state.account.state.type != "active") {
            return
        }

        result.address = poolAddress.toString()
        result.code = state.account.state.code! 
        result.data = state.account.state.data!

    }

  
    let bcCode :Cell = Cell.fromBase64(result.code)
    //let bcCode : Cell = await compile("PoolV3Contract")
    let bcData : Cell = Cell.fromBase64(result.data)
    

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
    const step0A = 94243023749710n / 100n
    const step0B = 942430237400n / 100n

    let tickKotlin = ""
    tickKotlin += "    val ticks = TreeMap<Long, BigInteger>()\n"
    for (let i of poolTicks.keys()) {
        tickKotlin += (`    ticks [${poolTicks[i].tickNum}] = BigInteger("${poolTicks[i].liquidityNet.toString()}")\n`)
    }

    tickKotlin +=     
    `var amm = ToncoAMM(\n` +
    `    BigInteger("${poolState.price_sqrt.toString()}"),\n` +
    `    ${poolState.tick},\n` +
    `    BigInteger("${poolState.liquidity.toString()}"),\n` +
    `    ${poolState.lp_fee_current},        \n` +
    `    ticks\n` +
    `)\n` +
    `var swapResult = amm.convertForward(\n`  +
    `    BigInteger.ZERO,  // reserves? \n`  +
    `    BigInteger.ZERO,  // reserves? \n`  +
    `    BigInteger("${step0A}"),\n`  +
    `    SwapDirection.FORWARD\n`  +
    `)\n`  
    
    fs.writeFileSync("kotlin.ticks", tickKotlin)

    
    let i = 2n;
    while (i < 3n) 
    {
        for (let dir of [/*false*/ true]) 
        {
            const amount0 = (dir ? step0A : step0B) * i
            let limitPrice     = dir ? TickMath.MIN_SQRT_RATIO + 1n : TickMath.MAX_SQRT_RATIO - 1n
            let limitPriceBack = dir ? TickMath.MAX_SQRT_RATIO - 1n : TickMath.MIN_SQRT_RATIO + 1n
            

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
                printTransactionFees(realSwap.transactions)
                let poolStateAfter = await poolContractOpened.getPoolStateAndConfiguration()
                let real = {amount0: poolStateAfter.reserve0 - poolState.reserve0, amount1 : poolStateAfter.reserve1 - poolState.reserve1 }
                result2 = dir ? real.amount1 : real.amount0
            }

            let result3 : bigint 
                
            if (true) {
                console.log("================================= TS: Simulated swap ================================= ")
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

                console.log("Sim Swap : ", simSwap)
                /* Let's test exactOut */
                let poolSimulatorNoFee : PoolSimulator  = new PoolSimulator(poolState.price_sqrt, poolState.tick, poolState.liquidity, 0, poolTicks)
                const exactOutSwap = await poolSimulatorNoFee.swapInternal( dir, -amount0, limitPrice)
                console.log("New state tick      :", poolSimulatorNoFee.tick)
                console.log("New state price     :", poolSimulatorNoFee.sqrtRatioX96)                
                console.log("New state liquidity :", poolSimulatorNoFee.liquidity)

                const exactOutBack = await poolSimulatorNoFee.swapInternal( !dir, amount0, limitPriceBack)

                console.log("Exact Out Swap : ", exactOutSwap)
                console.log("Exact Swap Back: ", exactOutBack)

                console.log("Final state tick      :", poolSimulatorNoFee.tick)
                console.log("Final state price     :", poolSimulatorNoFee.sqrtRatioX96)                
                console.log("Final state liquidity :", poolSimulatorNoFee.liquidity)

                let deltaAmount0 = (exactOutSwap.amount0 + exactOutBack.amount0)
                let deltaAmount1 = (exactOutSwap.amount1 + exactOutBack.amount1)

                deltaAmount0 = deltaAmount0 > 0 ? deltaAmount0 : - deltaAmount0
                deltaAmount1 = deltaAmount1 > 0 ? deltaAmount1 : - deltaAmount1

                if (deltaAmount0 > 1) {
                    throw("Difference with exactOut and back")
                }

                if (deltaAmount1 > 1) {
                    throw("Difference with exactOut and back")
                }
            }

            let result4 : bigint 
            if (true) {
                // SDK: Simulated swap
                console.log("================================= SDK: Simulated swap ================================= ")

                const tickList: TickConstructorArgs[] = poolTicks.map((tick) => ({
                    index: tick.tickNum,
                    liquidityGross: tick.liquidityGross.toString(),
                    liquidityNet: tick.liquidityNet.toString(),
                }));

                const swapSimulator = new SwapSimulator( poolState.price_sqrt, poolState.tick, poolState.tick_spacing, poolState.liquidity, poolState.lp_fee_current, tickList);

                /* estimate 1 TON to USDT swap off-chain */
                let newState = await swapSimulator.swap(dir, amount0);
                result4 = newState.amountCalculated

                const newSqrtPrice = newState.sqrtPriceX96
                const sqrtRatio   = BigNumber(newSqrtPrice.toString()).div(BigNumber(poolState.price_sqrt.toString()))
                const priceImpact = sqrtRatio.pow(2)
                const priceImpactPercent = (priceImpact.times(100)).minus(100)
                console.log(`Price Impact: ${priceImpactPercent.toFixed(4)} %`)

                /* Let's test exactOut */
                const swapSimulatorNoFee = new SwapSimulator( poolState.price_sqrt, poolState.tick, poolState.tick_spacing, poolState.liquidity, 0, tickList);
                console.log(`Estimate how much we would need to get ${amount0}`)
                const exactOutSwap = await swapSimulatorNoFee.swap(dir, -amount0)
                console.log(exactOutSwap)          

                const swapSimulatorNoFeeBack = new SwapSimulator( exactOutSwap.sqrtPriceX96, exactOutSwap.tick, poolState.tick_spacing, exactOutSwap.liquidity, 0, tickList);
                const exactOutBack = await swapSimulatorNoFeeBack.swap(!dir, amount0)                
                console.log(exactOutBack)

                //const exactOutSwap = await swapSimulatorNoFee.swap(dir, -amount0)
                
            }

            console.log(`             | dir   |   amount    | getSwapEstimate | blockchain call | ts simulation | sdk simulation `)
            console.log(`Swap results | ${dir.toString().padStart(5)} | ${i} ${amount0.toString().padStart(10)} | ${result1} | ${result2} | ${result3} | ${result4} `)

            if (result1 != result2 ) {
                throw("Difference with direct call")
            }

            if ((result3 !== undefined) && (result1 != result3)) {
                throw("Difference with simulator")
            }

            if ((result4 !== undefined) && (result1 != result4) ) {
                throw("Difference with SDK")
            }

            // Saving ground truth
            result.swaps.push({"zeroForOne" : dir, inAmount: amount0.toString(), outAmount : res.amount1.toString() })
        }

        i = i + 1n
    }

    fs.writeFileSync("swap_ground_truth.json", JSON.stringify(result, null, 2))

    /* Some testes */

    //let tick = -51660
    //console.log(`TickMath.getSqrtRatioAtTick(${tick}) = ${TickMath.getSqrtRatioAtTick(tick)} `)
}


main()
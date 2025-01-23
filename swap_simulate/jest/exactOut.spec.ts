import * as fs from 'fs';
import { encodeSqrtRatioX96, SwapSimulator, TickConstructorArgs } from "@toncodex/sdk";
import { encodePriceSqrt, TickMath } from "../wrappers/frontmath/frontMath";

describe('Exact Out', () => {

    let jestConsole = console;
    global.console = require('console');

    it('2+2', async () => {
        expect(2+2).toEqual(4);
    })
    
    describe('limit ticks inited', () => 
    {
        const tickList: TickConstructorArgs[] = []
        let price_sqrt = encodePriceSqrt(1n, 1n)
        let tick = TickMath.getTickAtSqrtRatio(price_sqrt)
        let tickSpacing: number = 1  
        let liquidity: bigint = 3161n

        beforeAll(() => {            
            let minTick: number = TickMath.getMinTick(tickSpacing)
            let maxTick: number = TickMath.getMaxTick(tickSpacing)

            tickList.push({index: minTick, liquidityGross: (liquidity).toString(), liquidityNet: ( liquidity).toString()})
            tickList.push({index: maxTick, liquidityGross: (liquidity).toString(), liquidityNet: (-liquidity).toString()})

           
        })

        it('Small swap from center', async() => 
        {
            const swapSimulatorNoFee = new SwapSimulator( price_sqrt, tick, tickSpacing, liquidity, 0, tickList);
            const amount0 = 10n;
            const zeroForOne = true;
            console.log(`Estimate how much we would need to get ${amount0}`)
            const exactOutSwap = await swapSimulatorNoFee.swap(zeroForOne, -amount0)
            console.log(exactOutSwap)          


            console.log(`Really swapping back ${amount0}`)
            const swapSimulatorNoFeeBack = new SwapSimulator( exactOutSwap.sqrtPriceX96, exactOutSwap.tick, tickSpacing, exactOutSwap.liquidity, 0, tickList);
            const exactOutBack = await swapSimulatorNoFeeBack.swap(!zeroForOne, amount0)                
            console.log(exactOutBack)

            expect(exactOutBack.amountCalculated).toEqual(-amount0)

            let priceDelta = Math.abs(exactOutBack.tick - tick)
            console.log(priceDelta)     
            expect(priceDelta).toBeLessThanOrEqual(1)
        })


        it('Large swap from center', async() => 
        {
            const swapSimulatorNoFee = new SwapSimulator( price_sqrt, tick, tickSpacing, liquidity, 0, tickList);
            const amount0 = 100000n;
            const zeroForOne = true;
            console.log(`Estimate how much we would need to get ${amount0}`)
            const exactOutSwap = await swapSimulatorNoFee.swap(zeroForOne, -amount0)
            console.log(exactOutSwap)          


            console.log(`Really swapping back ${amount0}`)
            const swapSimulatorNoFeeBack = new SwapSimulator( exactOutSwap.sqrtPriceX96, exactOutSwap.tick, tickSpacing, exactOutSwap.liquidity, 0, tickList);
            const exactOutBack = await swapSimulatorNoFeeBack.swap(!zeroForOne, amount0)                
            console.log(exactOutBack)

            expect(exactOutBack.amountCalculated).toEqual(-amount0)
        })
    })

    it('Swap from skdamn', async() => 
    {
        const tickListData = fs.readFileSync("jest/tickList.json", 'utf8');    
        let tickList = JSON.parse(tickListData)

        console.log(tickList)

        let price_sqrt = 5618691743686889640411867057n
        let tick = -52928
        let tickSpacing = 60
        let liquidity = 5458952048252535n
        let lp_fee_current = 3

        const swapSimulator = new SwapSimulator( price_sqrt, tick, tickSpacing, liquidity, lp_fee_current, tickList);
        const amount0 = 500n * 1000n * 1000n * 1000000n;
        const zeroForOne = true;
        console.log(`Estimate how much we would need to get ${amount0}`)
        const exactOutSwap = await swapSimulator.swap(zeroForOne, -amount0)
        console.log(exactOutSwap)        
        
        let swapped = amount0 + exactOutSwap.amountSpecifiedRemaining
        console.log("We maximally can get back:", swapped, " coins")

        const swapSimulatorBack = new SwapSimulator( exactOutSwap.sqrtPriceX96, exactOutSwap.tick, tickSpacing, exactOutSwap.liquidity, lp_fee_current, tickList);
        const exactOutBack = await swapSimulatorBack.swap(!zeroForOne, swapped * (10000n + BigInt(lp_fee_current)) / 10000n )
        console.log(exactOutBack)
        
        expect(exactOutBack.tick).toEqual(tick)
        expect(exactOutBack.liquidity).toEqual(liquidity)       

    })


    
})
    
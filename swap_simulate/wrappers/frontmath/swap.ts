import { NumberedTickInfo } from "../PoolV3Contract";
import { TickMath } from "./frontMath";
import { SwapMath } from "./swapMath";



interface StepComputations {
    sqrtPriceStartX96: bigint;
    tickNext: number;
    initialized: boolean;
    sqrtPriceNextX96: bigint;
    amountIn: bigint;
    amountOut: bigint;
    feeAmount: bigint;
  }

function maxBigInt(a: bigint, b: bigint): bigint {
    return a > b ? a : b;
}

function minBigInt(a: bigint, b: bigint): bigint {
    return a < b ? a : b;
}


export class PoolSimulator {

    constructor(
        public sqrtRatioX96 : bigint,
        public tick : number,
        public liquidity : bigint,
        public fee : number,
        public ticks : NumberedTickInfo[],

        public trace : boolean = false
    ) { 
    }

    /* This obviously can be optimized with a map */
    getNextTick(zeroForOne : boolean, tick : number) : [number, boolean]{
        if (zeroForOne) {
            for (let i = this.ticks.length - 1; i >= 0; i--) {
                if (this.ticks[i].tickNum <= tick)
                    return [this.ticks[i].tickNum, true]                
            }
            return [TickMath.MIN_TICK , false]
        } else {
            for (let i = 0; i < this.ticks.length; i++) {
                if (this.ticks[i].tickNum > tick)
                    return [this.ticks[i].tickNum, true]                
            }
            return [TickMath.MAX_TICK , false]
        }
        return [tick, false]
    }

    getTick(tick : number) {
        for (let i = 0; i < this.ticks.length; i++) {
            if (this.ticks[i].tickNum == tick)
                return this.ticks[i]
        }
        return undefined
    }



    async  swapInternal(
        zeroForOne: boolean,
        amountSpecified:  bigint,
        sqrtPriceLimitX96?: bigint,

    ): Promise<{
        amount0 : bigint,
        amount1 : bigint
    }> {

        if (this.trace) {
            console.log(`swapInternal(): called`)
            console.log(`zeroForOne       : ${zeroForOne}`)
            console.log(`amountSpecified  : ${amountSpecified}`)
            console.log(`sqrtPriceLimitX96: ${sqrtPriceLimitX96}`)
        }


        let toReturn = {amount0 : 0n, amount1 : 0n}

        if (!sqrtPriceLimitX96) {
            sqrtPriceLimitX96 = zeroForOne ? TickMath.MIN_SQRT_RATIO + 1n : TickMath.MAX_SQRT_RATIO - 1n;
        }

        if (zeroForOne) {
            if (! (sqrtPriceLimitX96 > TickMath.MIN_SQRT_RATIO)) {
                throw ('RATIO_MIN')
            }
            if (sqrtPriceLimitX96 >= this.sqrtRatioX96) {
                return toReturn
            }    
        } else {
            if (! (sqrtPriceLimitX96 < TickMath.MAX_SQRT_RATIO)) {
                throw ('RATIO_MAX')
            }
            if (sqrtPriceLimitX96 <= this.sqrtRatioX96) {
                return toReturn
            }    
        }
        
        const exactInput : boolean = amountSpecified > 0n;
        console.log(`ExactInput: ${exactInput}`)
        // keep track of swap state

        const state = {
            amountSpecifiedRemaining: amountSpecified,
            amountCalculated: 0n,
            sqrtPriceX96: this.sqrtRatioX96,
            tick: this.tick,
            liquidity: this.liquidity,
        };

        // start swap while loop
        while ((state.amountSpecifiedRemaining != 0n) && (state.sqrtPriceX96 != sqrtPriceLimitX96)) 
        {
            if (this.trace) {
                console.log(` === Staring new swap iteration ==="`);
                console.log(`   amountSpecifiedRemaining: `, state.amountSpecifiedRemaining)
                console.log(`   current price: `, state.sqrtPriceX96 )
                console.log(`   target Price : `, sqrtPriceLimitX96)
                console.log(`   curent tick  : `, state.tick )
            }
            
            const step: Partial<StepComputations> = {};
            step.sqrtPriceStartX96 = state.sqrtPriceX96;
    
            // because each iteration of the while loop rounds, we can't optimize this code (relative to the smart contract)
            // by simply traversing to the next available tick, we instead need to exactly replicate
            // tickBitmap.nextInitializedTickWithinOneWord
            [step.tickNext, step.initialized] = this.getNextTick(zeroForOne, state.tick)

            if (step.tickNext < TickMath.MIN_TICK) {
                step.tickNext = TickMath.MIN_TICK;
            } else if (step.tickNext > TickMath.MAX_TICK) {
                step.tickNext = TickMath.MAX_TICK;
            }

            step.sqrtPriceNextX96 = TickMath.getSqrtRatioAtTick(step.tickNext);

            let sqrtPriceLimitStep : bigint = zeroForOne ? 
                maxBigInt(step.sqrtPriceNextX96, sqrtPriceLimitX96) : 
                minBigInt(step.sqrtPriceNextX96, sqrtPriceLimitX96);

            let stepResult = SwapMath.computeSwapStep(
                state.sqrtPriceX96,
                sqrtPriceLimitStep,
                state.liquidity,
                state.amountSpecifiedRemaining,
                BigInt(this.fee)
            )

            /*
            console.log(" - sqrtPriceX96: " , state.sqrtPriceX96)
            console.log(" - sqrtPriceLimitStep: " , sqrtPriceLimitStep)
            console.log(" - liquidity: " , state.liquidity)
            console.log(" - amountSpecifiedRemaining: " , state.amountSpecifiedRemaining)
            console.log(" - fee: ", BigInt(this.fee))
            console.log(`OUT:`, stepResult)
            */

            state.sqrtPriceX96 = stepResult.sqrtRatioNextX96            
            step.amountIn  = stepResult.amountIn
            step.amountOut = stepResult.amountOut
            step.feeAmount = stepResult.feeAmount


            if (exactInput) {
                state.amountSpecifiedRemaining = state.amountSpecifiedRemaining - (step.amountIn + step.feeAmount)
                state.amountCalculated = state.amountCalculated - step.amountOut
            } else {
                state.amountSpecifiedRemaining = state.amountSpecifiedRemaining + step.amountOut
                state.amountCalculated = state.amountCalculated + (step.amountIn + step.feeAmount)
            }

            // TODO
            if (state.sqrtPriceX96 == step.sqrtPriceNextX96) 
            {
            // if the tick is initialized, run the tick transition
                if (step.initialized) {
                    let liquidityNet = this.getTick(step.tickNext)!.liquidityNet

                    // if we're moving leftward, we interpret liquidityNet as the opposite sign
                    // safe because liquidityNet cannot be type(int128).min
                    if (zeroForOne) {
                        liquidityNet =  -liquidityNet
                    }
                    state.liquidity = state.liquidity + liquidityNet
                }

                state.tick = zeroForOne ? step.tickNext - 1 : step.tickNext;
            } else if (state.sqrtPriceX96 != step.sqrtPriceStartX96) {
                state.tick = TickMath.getTickAtSqrtRatio(state.sqrtPriceX96);
            }
            //console.log(`REM = ${state.amountSpecifiedRemaining}`)
        }


        if (zeroForOne == exactInput) {
            toReturn.amount0 = amountSpecified - state.amountSpecifiedRemaining;
            toReturn.amount1 = state.amountCalculated;
        } else {
            toReturn.amount0 = state.amountCalculated;
            toReturn.amount1 = amountSpecified - state.amountSpecifiedRemaining;    
        }

        this.sqrtRatioX96 = state.sqrtPriceX96
        this.tick  = state.tick
        this.liquidity    = state.liquidity

        return toReturn
    }
}

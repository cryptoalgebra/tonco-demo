import java.math.BigInteger
import java.lang.RuntimeException
import java.util.TreeMap

import SwapDirection
import TickMath
import SwapMath


 
data class ToncoAMM(
    var sqrtRatioX96 : BigInteger, 
    var tickCurrent  : Long,
    var liquidity    : BigInteger,
    var fee          : Long,
    var ticks        : TreeMap<Long, BigInteger> // We only need netLiquidity
) {

    val tickMath = TickMath() // Should move this to companion
    val swapMath = SwapMath() // Should move this to companion

    val name = "tonco"



    data class SwapResult(var amount0 : BigInteger, var amount1: BigInteger)

    data class SwapState(
        var amountSpecifiedRemaining: BigInteger,
        var amountCalculated: BigInteger,
        var sqrtPriceX96: BigInteger,
        var tick: Long,
        var liquidity: BigInteger
    )


    data class SwapStep(
        var sqrtPriceStartX96: BigInteger,
        var tickNext: Long,
        var initialized: Boolean,
        var sqrtPriceNextX96: BigInteger,
        var amountIn: BigInteger,
        var amountOut: BigInteger,
        var feeAmount: BigInteger
    )

    fun convertForward(
        inputReserves: BigInteger,
        outputReserves: BigInteger,
        inputAmount: BigInteger,
        direction: SwapDirection,       
    ): SwapResult {
        var amountSpecified : BigInteger = inputAmount

        var toReturn = SwapResult(BigInteger.ZERO, BigInteger.ZERO)
        
        var sqrtPriceLimitX96 : BigInteger 
        if (direction == SwapDirection.FORWARD) {
            sqrtPriceLimitX96 = TickMath.MIN_SQRT_RATIO + BigInteger.ONE
        } else {
            sqrtPriceLimitX96 = TickMath.MAX_SQRT_RATIO - BigInteger.ONE
        }
        

        if (direction == SwapDirection.FORWARD) {
            if (! (sqrtPriceLimitX96 > TickMath.MIN_SQRT_RATIO)) {
                throw RuntimeException("RATIO_MIN")
            }
            if (sqrtPriceLimitX96 >= this.sqrtRatioX96) {
                return toReturn
            }    
        } else {
            if (! (sqrtPriceLimitX96 < TickMath.MAX_SQRT_RATIO)) {
                throw RuntimeException("RATIO_MAX")
            }
            if (sqrtPriceLimitX96 <= this.sqrtRatioX96) {
                return toReturn
            }    
        }
        
        val exactInput : Boolean = (amountSpecified > BigInteger.ZERO);

        // keep track of swap state
        var state = SwapState(
            amountSpecified, 
            BigInteger.ZERO,
            this.sqrtRatioX96,
            this.tickCurrent,
            this.liquidity
        )

        // start swap while loop
        while ((state.amountSpecifiedRemaining > BigInteger.ZERO) && (state.sqrtPriceX96 != sqrtPriceLimitX96)) 
        {
            var step: SwapStep = SwapStep(
                state.sqrtPriceX96,
                0,
                false,
                BigInteger.ZERO,
                BigInteger.ZERO,
                BigInteger.ZERO,
                BigInteger.ZERO
            );
           
           println("state.tick    :${state.tick}")
            val nextKey : Long? 
            if (direction == SwapDirection.FORWARD) {
                // Price goes down with forward swap

                nextKey = this.ticks.floorKey(state.tick) // Less of equal checks
            } else {                
                nextKey = this.ticks.higherKey(state.tick)  // Strictly higher checks
            }

            step.tickNext = nextKey
            step.initialized = (nextKey != null)

            println("step.tickNext    :${step.tickNext}")
            println("step.initialized :${step.initialized}")

            if (step.tickNext < TickMath.MIN_TICK) {
                step.tickNext = TickMath.MIN_TICK;
            } else if (step.tickNext > TickMath.MAX_TICK) {
                step.tickNext = TickMath.MAX_TICK;
            }

            step.sqrtPriceNextX96 = tickMath.getSqrtRatioAtTick(step.tickNext);
            println("step.sqrtPriceNextX96 :${step.sqrtPriceNextX96}")


            var sqrtPriceLimitStep : BigInteger
            if (direction == SwapDirection.FORWARD) {
                sqrtPriceLimitStep = step.sqrtPriceNextX96.max(sqrtPriceLimitX96)
            } else {
                sqrtPriceLimitStep = step.sqrtPriceNextX96.min(sqrtPriceLimitX96)
            }

            var stepResult = swapMath.computeSwapStep(
                state.sqrtPriceX96,
                sqrtPriceLimitStep,
                state.liquidity,
                state.amountSpecifiedRemaining,
                BigInteger.valueOf(this.fee)
            )

            
            println(" - sqrtPriceX96: ${state.sqrtPriceX96}")
            println(" - sqrtPriceLimitStep: ${sqrtPriceLimitStep}")
            println(" - liquidity: ${state.liquidity}")
            println(" - amountSpecifiedRemaining: ${state.amountSpecifiedRemaining}")
            println(" - fee:  ${this.fee}")
            println("OUT: $stepResult")
            

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
                    var liquidityNet = this.ticks[step.tickNext]!!

                    // if we're moving leftward, we interpret liquidityNet as the opposite sign
                    // safe because liquidityNet cannot be type(int128).min
                    if (direction == SwapDirection.FORWARD) {
                        liquidityNet =  -liquidityNet
                    }
                    state.liquidity = state.liquidity + liquidityNet
                }

                if (direction == SwapDirection.FORWARD) {
                    state.tick =  step.tickNext - 1 
                } else {
                    state.tick =  step.tickNext
                }
            } else if (state.sqrtPriceX96 != step.sqrtPriceStartX96) {
                state.tick = tickMath.getTickAtSqrtRatio(state.sqrtPriceX96);
            }
            println("REM = ${state.amountSpecifiedRemaining}")
            //throw RuntimeException("BREAK")
        }


        if ((direction == SwapDirection.FORWARD) == exactInput) {
            toReturn.amount0 = amountSpecified - state.amountSpecifiedRemaining;
            toReturn.amount1 = state.amountCalculated;
        } else {
            toReturn.amount0 = state.amountCalculated;
            toReturn.amount1 = amountSpecified - state.amountSpecifiedRemaining;    
        }

        return toReturn



    }

}

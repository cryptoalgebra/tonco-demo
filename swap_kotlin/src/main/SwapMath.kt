// import { mulDivRoundingUp, SqrtPriceMath } from "./sqrtMath";
import java.math.BigInteger
import SqrtPriceMath



class SwapMath {

     companion object {
        val FEE_DENOMINATOR: BigInteger = BigInteger("10000")
    }


    data class StepResult(var sqrtRatioNextX96 : BigInteger, var amountIn: BigInteger, var amountOut : BigInteger, var feeAmount : BigInteger)


    fun computeSwapStep(
        sqrtRatioCurrentX96: BigInteger,
        sqrtRatioTargetX96: BigInteger,
        liquidity: BigInteger,
        amountRemaining: BigInteger,
        feePips: BigInteger  
    ) : StepResult
    {
        val sqrtPriceMath = SqrtPriceMath()  // Should move this to companion

        var sqrtRatioNextX96: BigInteger = BigInteger.ZERO;
        var amountIn : BigInteger = BigInteger.ZERO;
        var amountOut: BigInteger = BigInteger.ZERO;
        var feeAmount: BigInteger = BigInteger.ZERO;

        
        val zeroForOne : Boolean = (sqrtRatioCurrentX96 >= sqrtRatioTargetX96)
        val exactIn    : Boolean = (amountRemaining >= BigInteger.ZERO)

        println("computeSwapStep: zeroForOne = ${zeroForOne}")
        println("computeSwapStep: exactIn = ${exactIn}")
        
        if (exactIn) {
            val amountRemainingLessFee = (amountRemaining * (SwapMath.FEE_DENOMINATOR - feePips)) / SwapMath.FEE_DENOMINATOR
        
            if (zeroForOne) {
                amountIn = sqrtPriceMath.getAmount0Delta(sqrtRatioTargetX96, sqrtRatioCurrentX96, liquidity, true)
                println("computeSwapStep: amountIn_1 = ${amountIn}")
            } else {
                amountIn = sqrtPriceMath.getAmount1Delta(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, true)
            }

            if (amountRemainingLessFee >= amountIn) {
                sqrtRatioNextX96 = sqrtRatioTargetX96
            } else {
                sqrtRatioNextX96 = sqrtPriceMath.getNextSqrtPriceFromInput(sqrtRatioCurrentX96, liquidity, amountRemainingLessFee, zeroForOne)
            }
        } else {

            if (zeroForOne) {
                amountOut = sqrtPriceMath.getAmount1Delta(sqrtRatioTargetX96, sqrtRatioCurrentX96, liquidity, false)       
            } else {
                amountOut = sqrtPriceMath.getAmount0Delta(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, false)
            } 

            if (- amountRemaining >= amountOut) {
                sqrtRatioNextX96 = sqrtRatioTargetX96
            } else {
                sqrtRatioNextX96 = sqrtPriceMath.getNextSqrtPriceFromOutput(sqrtRatioCurrentX96, liquidity, -amountRemaining, zeroForOne)
            }
        }
         
        val max : Boolean = (sqrtRatioTargetX96 == sqrtRatioNextX96)

        if (zeroForOne) {
            if (max && exactIn) {
                amountIn = amountIn
            } else {
                amountIn = sqrtPriceMath.getAmount0Delta(sqrtRatioNextX96, sqrtRatioCurrentX96, liquidity, true)
            }

            if (max && !exactIn) {
                amountOut = amountOut
            } else {
                amountOut = sqrtPriceMath.getAmount1Delta(sqrtRatioNextX96, sqrtRatioCurrentX96, liquidity, false)
            }
        } else {
            if (max && exactIn) {
                amountIn = amountIn
            } else {
                amountIn = sqrtPriceMath.getAmount1Delta(sqrtRatioCurrentX96, sqrtRatioNextX96, liquidity, true)
            }

            if (max && !exactIn) {
                amountOut = amountOut
            } else {
                amountOut = sqrtPriceMath.getAmount0Delta(sqrtRatioCurrentX96, sqrtRatioNextX96, liquidity, false)
            }
        }

        println("computeSwapStep: amountIn_2 = ${amountIn}")
        
        if ((!exactIn) && (amountOut > - amountRemaining)) {
            amountOut = - amountRemaining
        }

        if (exactIn && (sqrtRatioNextX96 != sqrtRatioTargetX96)) {
            // we didn't reach the target, so take the remainder of the maximum input as fee
            feeAmount = amountRemaining - amountIn
        } else {
            feeAmount = sqrtPriceMath.mulDivRoundingUp( amountIn, feePips, SwapMath.FEE_DENOMINATOR - feePips )
        }

        return StepResult(sqrtRatioNextX96, amountIn, amountOut, feeAmount)
    }
}
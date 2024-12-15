import { mulDivRoundingUp, SqrtPriceMath } from "./sqrtMath";

export abstract class SwapMath {

    static FEE_DENOMINATOR : bigint = 10000n;

    /**
     * Cannot be constructed.
     */
    private constructor() {}

    public static computeSwapStep(
        sqrtRatioCurrentX96: bigint,
        sqrtRatioTargetX96: bigint,
        liquidity: bigint,
        amountRemaining: bigint,
        feePips: bigint  // Fee computations is done our way in 1/10^4 parts, not like in uniswap were they use 1/10^6 scaler
    )
    {
        let sqrtRatioNextX96: bigint = 0n;
        let amountIn : bigint = 0n;
        let amountOut: bigint = 0n;
        let feeAmount: bigint = 0n;

        const zeroForOne = sqrtRatioCurrentX96 >= sqrtRatioTargetX96
        const exactIn    = amountRemaining >= 0n

        if (exactIn) {
            const amountRemainingLessFee = (amountRemaining * (SwapMath.FEE_DENOMINATOR - feePips)) / SwapMath.FEE_DENOMINATOR
        
            if (zeroForOne) {
                amountIn = SqrtPriceMath.getAmount0Delta(sqrtRatioTargetX96, sqrtRatioCurrentX96, liquidity, true)
            } else {
                amountIn = SqrtPriceMath.getAmount1Delta(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, true)
            }

            if (amountRemainingLessFee >= amountIn) {
                sqrtRatioNextX96 = sqrtRatioTargetX96
            } else {
                sqrtRatioNextX96 = SqrtPriceMath.getNextSqrtPriceFromInput(sqrtRatioCurrentX96, liquidity, amountRemainingLessFee, zeroForOne)
            }
        } else {

            if (zeroForOne) {
                amountOut = SqrtPriceMath.getAmount1Delta(sqrtRatioTargetX96, sqrtRatioCurrentX96, liquidity, false)       
            } else {
                amountOut = SqrtPriceMath.getAmount0Delta(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, false)
            } 

            if (- amountRemaining >= amountOut) {
                sqrtRatioNextX96 = sqrtRatioTargetX96
            } else {
                sqrtRatioNextX96 = SqrtPriceMath.getNextSqrtPriceFromOutput(sqrtRatioCurrentX96, liquidity, -amountRemaining, zeroForOne)
            }
        }

        const max = (sqrtRatioTargetX96 == sqrtRatioNextX96)

        if (zeroForOne) {
            if (max && exactIn) {
                amountIn = amountIn
            } else {
                amountIn = SqrtPriceMath.getAmount0Delta(sqrtRatioNextX96, sqrtRatioCurrentX96, liquidity, true)
            }

            if (max && !exactIn) {
                amountOut = amountOut
            } else {
                amountOut = SqrtPriceMath.getAmount1Delta(sqrtRatioNextX96, sqrtRatioCurrentX96, liquidity, false)
            }
        } else {
            if (max && exactIn) {
                amountIn = amountIn
            } else {
                amountIn = SqrtPriceMath.getAmount1Delta(sqrtRatioCurrentX96, sqrtRatioNextX96, liquidity, true)
            }

            if (max && !exactIn) {
                amountOut = amountOut
            } else {
                amountOut = SqrtPriceMath.getAmount0Delta(sqrtRatioCurrentX96, sqrtRatioNextX96, liquidity, false)
            }
        }

        if ((!exactIn) && (amountOut > - amountRemaining)) {
            amountOut = - amountRemaining
        }

        if (exactIn && (sqrtRatioNextX96 != sqrtRatioTargetX96)) {
            // we didn't reach the target, so take the remainder of the maximum input as fee
            feeAmount = amountRemaining - amountIn
        } else {
            feeAmount = mulDivRoundingUp( amountIn, feePips, SwapMath.FEE_DENOMINATOR - feePips )
        }

        return {sqrtRatioNextX96 : sqrtRatioNextX96, amountIn: amountIn, amountOut: amountOut, feeAmount : feeAmount}
    }
}
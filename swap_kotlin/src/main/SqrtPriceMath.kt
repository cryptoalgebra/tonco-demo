import java.math.BigInteger

class SqrtPriceMath {

    companion object {
        // Static-like constant for 2^96
        val Q96: BigInteger = BigInteger.ONE.shiftLeft(96)
        val MaxUint160 : BigInteger = BigInteger.ONE.shiftLeft(160) - BigInteger.ONE
    }

    fun mulDivRoundingUp(a: BigInteger, b: BigInteger, denominator: BigInteger): BigInteger {
        val product = a * b;
        var result = product / denominator;
        if ((product % denominator) != BigInteger.ZERO) {
            result += BigInteger.ONE
        }
        return result;
    }


    fun getAmount0Delta(
        sqrtRatioAX96p: BigInteger,
        sqrtRatioBX96p: BigInteger,
        liquidity: BigInteger,
        roundUp: Boolean
    ): BigInteger {

        println("getAmount0Delta(${sqrtRatioAX96p} ${sqrtRatioBX96p} ${liquidity} ${roundUp})")
        var sqrtRatioAX96 = sqrtRatioAX96p
        var sqrtRatioBX96 = sqrtRatioBX96p
        
        if (sqrtRatioAX96 > sqrtRatioBX96) 
        {
            sqrtRatioAX96 = sqrtRatioBX96p
            sqrtRatioBX96 = sqrtRatioAX96p
        } 

        val numerator1 = liquidity.shiftLeft(96);
        val numerator2 = sqrtRatioBX96 - sqrtRatioAX96;

        if (roundUp) {
            return mulDivRoundingUp (
            mulDivRoundingUp(numerator1, numerator2, sqrtRatioBX96),
            BigInteger.ONE, sqrtRatioAX96 )
        } else {
            return ((numerator1 * numerator2) / sqrtRatioBX96) / sqrtRatioAX96
        }
    }

   
    fun getAmount1Delta(
        sqrtRatioAX96p: BigInteger,
        sqrtRatioBX96p: BigInteger,
        liquidity: BigInteger,
        roundUp: Boolean
    ): BigInteger {
        var sqrtRatioAX96 = sqrtRatioAX96p
        var sqrtRatioBX96 = sqrtRatioBX96p
        
        if (sqrtRatioAX96p > sqrtRatioBX96p) 
        {
            sqrtRatioAX96 = sqrtRatioBX96p
            sqrtRatioBX96 = sqrtRatioAX96p
        } 


        if(roundUp) {
            return mulDivRoundingUp(liquidity, sqrtRatioBX96 - sqrtRatioAX96, Q96)
        } else {
            return ( liquidity * (sqrtRatioBX96 - sqrtRatioAX96) / Q96 )
        }
    }

  

    fun getNextSqrtPriceFromInput(
        sqrtPX96: BigInteger,
        liquidity: BigInteger,
        amountIn: BigInteger,
        zeroForOne: Boolean
    ): BigInteger {
        if (zeroForOne) {
            return this.getNextSqrtPriceFromAmount0RoundingUp  (sqrtPX96, liquidity, amountIn, true)
        } else {
            return this.getNextSqrtPriceFromAmount1RoundingDown(sqrtPX96, liquidity, amountIn, true)
        }
    }

    fun getNextSqrtPriceFromOutput(
        sqrtPX96: BigInteger,
        liquidity: BigInteger,
        amountOut: BigInteger,
        zeroForOne: Boolean
    ): BigInteger {
        if (zeroForOne) {
            return this.getNextSqrtPriceFromAmount1RoundingDown(sqrtPX96, liquidity, amountOut, false )
        } else {
            return this.getNextSqrtPriceFromAmount0RoundingUp  (sqrtPX96, liquidity, amountOut, false )
        }
    }

   
    fun getNextSqrtPriceFromAmount0RoundingUp(
        sqrtPX96: BigInteger,
        liquidity: BigInteger,
        amount: BigInteger,
        add: Boolean
    ): BigInteger {
        if (amount == BigInteger.ZERO) {
            return sqrtPX96;
        }

        var numerator1 = liquidity.shiftLeft(96);

        if (add) {
            //const product = multiplyIn256(amount, sqrtPX96);
            val product = amount * sqrtPX96;
            if (product / amount == sqrtPX96) {
                //const denominator = addIn256(numerator1, product);
                val denominator = numerator1 + product;
                if (denominator >= numerator1) {
                    return mulDivRoundingUp(numerator1, sqrtPX96, denominator);
                }
            }

            return mulDivRoundingUp(numerator1, BigInteger.ONE, (numerator1 / sqrtPX96) + amount);
        } else {
            //const product = multiplyIn256(amount, sqrtPX96);
            val product = amount * sqrtPX96;

            val denominator = numerator1 - product;
            return mulDivRoundingUp(numerator1, sqrtPX96, denominator);
        }
    }

    fun getNextSqrtPriceFromAmount1RoundingDown(
        sqrtPX96: BigInteger,
        liquidity: BigInteger,
        amount: BigInteger,
        add: Boolean
    ): BigInteger {
        if (add) {
            var quotient : BigInteger
            if (amount <= MaxUint160) {
                quotient = (amount.shiftLeft(96)) / liquidity
            } else {
                quotient = (amount  * Q96) / liquidity;
            }

            return sqrtPX96 + quotient;
        } else {
            var quotient = mulDivRoundingUp(amount, Q96, liquidity);       
            return sqrtPX96 - quotient;
        }
    } 
}
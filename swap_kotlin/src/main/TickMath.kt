import java.math.BigInteger

class TickMath {

    companion object {
        /**
        * The minimum tick that can be used on any pool.
        */
        val MIN_TICK: Long = -887272
        /**
        * The maximum tick that can be used on any pool.
        */
        val MAX_TICK: Long = 887272

        /**
        * The sqrt ratio corresponding to the minimum tick that could be used on any pool.
        */
        val MIN_SQRT_RATIO: BigInteger = BigInteger("4295128739")
        /**
        * The sqrt ratio corresponding to the maximum tick that could be used on any pool.
        */
        val MAX_SQRT_RATIO: BigInteger = BigInteger("1461446703485210103287273052203988822378723970342")

        val Q32: BigInteger = BigInteger.ONE.shiftLeft(32)
        val MaxUint256: BigInteger = BigInteger("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", 16)

    }

/*
    public static getMinTick (tickSpacing: number) 
    { 
        return Math.ceil(-887272 / tickSpacing) * tickSpacing;
    }

    public static getMaxTick (tickSpacing: number) 
    {
        return Math.floor(887272 / tickSpacing) * tickSpacing;
    } 
    

    public static getMaxLiquidityPerTick(tickSpacing: number) 
    {
        const denum : number = (this.getMaxTick(tickSpacing) - this.getMinTick(tickSpacing)) / tickSpacing + 1
        return MaxUint128 / BigInt(denum);
    }
*/  


  /**
   * Returns the sqrt ratio as a Q64.96 for the given tick. 
   * 
   *  The sqrt ratio is computed as sqrt(1.0001^tick) * 2^96 = sqrt(1.0001)^tick * 2^96 
   * 
   * algorithm is as follows  
   *    1. Untill the very end everything is computed in 128.128
   *    2. As we are computing the n-th power of the constant (1 / sqrt(1.0001)) ~= 0,99995000374968752734
   *    3. Rasing to the power if trival, we have all power of 2 powers precomputed 
   *       Just multiply the powers that have active bits in inital value
   *    4. For tick1 = -tick the result would be inverted
   * 
   * @param tick the tick for which to compute the sqrt ratio
   */
    
  public fun getSqrtRatioAtTick(tick: Long): BigInteger {
  
    val absTick: Long = if (tick < 0) - tick else tick

    var ratio: BigInteger = BigInteger.ZERO

    if  ((absTick and 0x1) != 0L) {
        ratio = BigInteger("fffcb933bd6fad37aa2d162d1a594001", 16)   // ~ 1 / sqrt(1.0001) in 128.128
    } else {
        ratio = BigInteger("100000000000000000000000000000000", 16)
    }

    if ((absTick and 0x2    ) != 0L) { ratio = (ratio * BigInteger( "fff97272373d413259a46990580e213a", 16)).shiftRight(128)} ; // ~ 1 / sqrt(1.0001)^2 in 128.128
    if ((absTick and 0x4    ) != 0L) { ratio = (ratio * BigInteger( "fff2e50f5f656932ef12357cf3c7fdcc", 16)).shiftRight(128)} ; // ~ 1 / sqrt(1.0001)^4 in 128.128
    if ((absTick and 0x8    ) != 0L) { ratio = (ratio * BigInteger( "ffe5caca7e10e4e61c3624eaa0941cd0", 16)).shiftRight(128)} ; // ...  
    if ((absTick and 0x10   ) != 0L) { ratio = (ratio * BigInteger( "ffcb9843d60f6159c9db58835c926644", 16)).shiftRight(128)} ;
    if ((absTick and 0x20   ) != 0L) { ratio = (ratio * BigInteger( "ff973b41fa98c081472e6896dfb254c0", 16)).shiftRight(128)} ;
    if ((absTick and 0x40   ) != 0L) { ratio = (ratio * BigInteger( "ff2ea16466c96a3843ec78b326b52861", 16)).shiftRight(128)} ;
    if ((absTick and 0x80   ) != 0L) { ratio = (ratio * BigInteger( "fe5dee046a99a2a811c461f1969c3053", 16)).shiftRight(128)} ;
    if ((absTick and 0x100  ) != 0L) { ratio = (ratio * BigInteger( "fcbe86c7900a88aedcffc83b479aa3a4", 16)).shiftRight(128)} ;
    if ((absTick and 0x200  ) != 0L) { ratio = (ratio * BigInteger( "f987a7253ac413176f2b074cf7815e54", 16)).shiftRight(128)} ;
    if ((absTick and 0x400  ) != 0L) { ratio = (ratio * BigInteger( "f3392b0822b70005940c7a398e4b70f3", 16)).shiftRight(128)} ;
    if ((absTick and 0x800  ) != 0L) { ratio = (ratio * BigInteger( "e7159475a2c29b7443b29c7fa6e889d9", 16)).shiftRight(128)} ;
    if ((absTick and 0x1000 ) != 0L) { ratio = (ratio * BigInteger( "d097f3bdfd2022b8845ad8f792aa5825", 16)).shiftRight(128)} ;
    if ((absTick and 0x2000 ) != 0L) { ratio = (ratio * BigInteger( "a9f746462d870fdf8a65dc1f90e061e5", 16)).shiftRight(128)} ;
    if ((absTick and 0x4000 ) != 0L) { ratio = (ratio * BigInteger( "70d869a156d2a1b890bb3df62baf32f7", 16)).shiftRight(128)} ;
    if ((absTick and 0x8000 ) != 0L) { ratio = (ratio * BigInteger( "31be135f97d08fd981231505542fcfa6", 16)).shiftRight(128)} ;
    if ((absTick and 0x10000) != 0L) { ratio = (ratio * BigInteger(  "9aa508b5b7a84e1c677de54f3e99bc9", 16)).shiftRight(128)} ;
    if ((absTick and 0x20000) != 0L) { ratio = (ratio * BigInteger(   "5d6af8dedb81196699c329225ee604", 16)).shiftRight(128)} ;
    if ((absTick and 0x40000) != 0L) { ratio = (ratio * BigInteger(     "2216e584f5fa1ea926041bedfe98", 16)).shiftRight(128)} ;
    if ((absTick and 0x80000) != 0L) { ratio = (ratio * BigInteger(          "48a170391f7dc42444e8fa2", 16)).shiftRight(128)} ; // ~ 1 / sqrt(1.0001)^524288 in 128.128

    
    if (tick > 0) {
        ratio = MaxUint256 / ratio
    }

    if ((ratio % Q32) > BigInteger.ZERO) {
        return (ratio / Q32) + BigInteger.ONE
    } else {
        return (ratio / Q32)
    }
  }
  

  /**
   * Returns the tick corresponding to a given sqrt ratio, s.t. #getSqrtRatioAtTick(tick) <= sqrtRatioX96
   * and #getSqrtRatioAtTick(tick + 1) > sqrtRatioX96
   * 
   *    Compute inverse of sp = sqrt(1.0001^tick) * 2^96
   *     tick = log( (sp / 2^96)^2 ) / log(1.0001)
   * 
   *   If you have a binary number, the most significant bit gives the log2 apporoximation
   *    
   *   msb(X) + 1 > log2(X) > msb(X)
   * 
   *   Here is a gameplan
   *    1. transform Q64.96 to 128.128 format
   *    2. Find the most significant bit. Shift the value to aligin it with bit 128bit of the storage variable r
   *    3. Get inital approximation of the log2 by using msb position and putting in into fixed point format.
   *        Input value of 2^128 which was the represenation of number 1 would now correspord to log2 of 0
   *    4. Iterativly improve the approximation
   *        1. Details are sparsly discribed in links 
   *              a. https://hackmd.io/@abdk/SkVJeHK9v
   *              b. https://medium.com/coinmonks/math-in-solidity-part-5-exponent-and-logarithm-9aef8515136e
   * 
   *  
   *    5. now we have a base 2 logarithm. To get the power we need to raise 1.0001 to to get the same result, we need to multiplty this power by 
   *       log_1.0001(2) - the power to which 1.0001 need to be raised to get 2
   * 
   * @param sqrtRatioX96 the sqrt ratio as a Q64.96 for which to compute the tick
   */


  public fun getTickAtSqrtRatio(sqrtRatioX96: BigInteger): Long {
    
    val sqrtRatioX128 = sqrtRatioX96.shiftLeft(32)

    val msb = sqrtRatioX128.bitLength() - 1 

    var r: BigInteger

    if (msb >= 128) {
        r = sqrtRatioX128.shiftRight(msb - 127)
    } else {
        r = sqrtRatioX128.shiftLeft(127 - msb)
    }

    var log_2: BigInteger = (msb - 128).toBigInteger().shiftLeft(64)

    for (i in 0..13)
    {
        r = (r * r).shiftRight(127)
        val f = r.shiftRight(128)
        log_2 = log_2 or (f.shiftLeft(63 - i))
        r = r.shiftRight(f.toInt())
    }

    // Now change base to 1.0001
    val log_sqrt10001 = log_2 * BigInteger("255738958999603826347141")  // log(sqrt(1.0001);2) * 2^64 

    val tickLow  = ((log_sqrt10001 - BigInteger(  "3402992956809132418596140100660247210")).shiftRight(128)).toLong()
    val tickHigh = ((log_sqrt10001 + BigInteger("291339464771989622907027621153398088495")).shiftRight(128)).toLong()
    
    if (tickLow == tickHigh) {
        return tickLow
    }

    if (this.getSqrtRatioAtTick(tickHigh) <= sqrtRatioX96) {
        return tickHigh
    } 
    
    return tickLow
    
    //return 0
  }
  
}
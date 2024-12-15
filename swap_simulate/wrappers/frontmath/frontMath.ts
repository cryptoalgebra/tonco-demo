import BigNumber from 'bignumber.js'


export const FEE_DENOMINATOR: number = 10000
export const IMPOSSIBLE_FEE: number = FEE_DENOMINATOR + 1

// constants used internally but not expected to be used externally
export const MaxUint256 = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn
export const MaxUint128 = 0xffffffffffffffffffffffffffffffffn
// used in liquidity amount math
export const Q32  : bigint = 2n**32n
export const Q96  : bigint = 2n**96n 
export const Q128 : bigint = 2n**128n 
export const Q192 : bigint = Q96**2n 

export function expandTo18Decimals(n: bigint): bigint {
    return n * (10n**18n);
}


function mulShift(val: bigint, mulBy: bigint): bigint {
    return (val * mulBy) >> 128n
}

const POWERS_OF_2 = [128, 64, 32, 16, 8, 4, 2, 1].map((pow: number): [number, bigint] => [
    pow,
    2n ** BigInt(pow) 
])

export function mostSignificantBit(x: bigint): number 
{
    // invariant(JSBI.greaterThan(x, ZERO), 'ZERO')
    // invariant(JSBI.lessThanOrEqual(x, MaxUint256), 'MAX')  
    if (x <= 0) 
        return -1
    let msb: number = 0
    for (const [power, min] of POWERS_OF_2) {
        if (x >= min) {
            x = x >> BigInt(power)
            msb += power
        }
    }
    return msb
}


export function encodePriceSqrt(reserve1: bigint, reserve0: bigint): bigint {
  // console.log(`We should compute price ${reserve1} ${reserve0}`)
  BigNumber.set({DECIMAL_PLACES: 60})
  let result  = BigNumber(reserve1.toString())
      .div(reserve0.toString())
      .sqrt()
      .multipliedBy(new BigNumber(2).pow(96))
      .integerValue(3);

  // console.log(`Result computed with bignumber ${result.toFixed(0)}`);
  return BigInt(result.toFixed(0));
}  


// Don't use this in production. It's quite imprecise.
export function invertPriceSqrtX96(sqrtPriceX96: bigint): bigint {
      return 2n ** (96n+96n) / sqrtPriceX96
}  


/* For debug and testing only. */
export function getApproxFloatPrice(priceSqrt: bigint) : number {
  let result = BigNumber(priceSqrt.toString())
      .div(BigNumber(2).pow(48))
      .pow(2)
      .div(BigNumber(2).pow(96))

  //console.log("getApproxFloatPrice(): ", result)  
  return Number(result.toPrecision(8));
}


export function formatPriceUniswap(price: bigint): string {
    return (BigNumber(price.toString()).div(BigNumber(2).pow(96))).pow(2).toPrecision(5)
}




export abstract class TickMath {
  /**
   * Cannot be constructed.
   */
  private constructor() {}

  /**
   * The minimum tick that can be used on any pool.
   */
  public static MIN_TICK: number = -887272
  /**
   * The maximum tick that can be used on any pool.
   */
  public static MAX_TICK: number = -TickMath.MIN_TICK


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

  /**
   * The sqrt ratio corresponding to the minimum tick that could be used on any pool.
   */
  public static MIN_SQRT_RATIO: bigint = 4295128739n
  /**
   * The sqrt ratio corresponding to the maximum tick that could be used on any pool.
   */
  public static MAX_SQRT_RATIO: bigint = 1461446703485210103287273052203988822378723970342n

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
  public static getSqrtRatioAtTick(tick: number): bigint {
    // invariant(tick >= TickMath.MIN_TICK && tick <= TickMath.MAX_TICK && Number.isInteger(tick), 'TICK')

    const absTick: number = tick < 0 ? tick * -1 : tick

    let ratio: bigint =
      (absTick & 0x1) != 0
        ? 0xfffcb933bd6fad37aa2d162d1a594001n   // ~ 1 / sqrt(1.0001) in 128.128
        : 0x100000000000000000000000000000000n
    if ((absTick & 0x2    ) != 0) ratio = mulShift(ratio, 0xfff97272373d413259a46990580e213an) // ~ 1 / sqrt(1.0001)^2 in 128.128
    if ((absTick & 0x4    ) != 0) ratio = mulShift(ratio, 0xfff2e50f5f656932ef12357cf3c7fdccn) // ~ 1 / sqrt(1.0001)^4 in 128.128
    if ((absTick & 0x8    ) != 0) ratio = mulShift(ratio, 0xffe5caca7e10e4e61c3624eaa0941cd0n) // ...  
    if ((absTick & 0x10   ) != 0) ratio = mulShift(ratio, 0xffcb9843d60f6159c9db58835c926644n)
    if ((absTick & 0x20   ) != 0) ratio = mulShift(ratio, 0xff973b41fa98c081472e6896dfb254c0n)
    if ((absTick & 0x40   ) != 0) ratio = mulShift(ratio, 0xff2ea16466c96a3843ec78b326b52861n)
    if ((absTick & 0x80   ) != 0) ratio = mulShift(ratio, 0xfe5dee046a99a2a811c461f1969c3053n)
    if ((absTick & 0x100  ) != 0) ratio = mulShift(ratio, 0xfcbe86c7900a88aedcffc83b479aa3a4n)
    if ((absTick & 0x200  ) != 0) ratio = mulShift(ratio, 0xf987a7253ac413176f2b074cf7815e54n)
    if ((absTick & 0x400  ) != 0) ratio = mulShift(ratio, 0xf3392b0822b70005940c7a398e4b70f3n)
    if ((absTick & 0x800  ) != 0) ratio = mulShift(ratio, 0xe7159475a2c29b7443b29c7fa6e889d9n)
    if ((absTick & 0x1000 ) != 0) ratio = mulShift(ratio, 0xd097f3bdfd2022b8845ad8f792aa5825n)
    if ((absTick & 0x2000 ) != 0) ratio = mulShift(ratio, 0xa9f746462d870fdf8a65dc1f90e061e5n)
    if ((absTick & 0x4000 ) != 0) ratio = mulShift(ratio, 0x70d869a156d2a1b890bb3df62baf32f7n)
    if ((absTick & 0x8000 ) != 0) ratio = mulShift(ratio, 0x31be135f97d08fd981231505542fcfa6n)
    if ((absTick & 0x10000) != 0) ratio = mulShift(ratio,  0x9aa508b5b7a84e1c677de54f3e99bc9n)
    if ((absTick & 0x20000) != 0) ratio = mulShift(ratio,   0x5d6af8dedb81196699c329225ee604n)
    if ((absTick & 0x40000) != 0) ratio = mulShift(ratio,     0x2216e584f5fa1ea926041bedfe98n)
    if ((absTick & 0x80000) != 0) ratio = mulShift(ratio,          0x48a170391f7dc42444e8fa2n) // ~ 1 / sqrt(1.0001)^524288 in 128.128

    
    if (tick > 0) ratio = MaxUint256 / ratio

    if ((ratio % Q32) > 0) {
        return (ratio / Q32) + 1n
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


  public static getTickAtSqrtRatio(sqrtRatioX96: bigint): number {
    // invariant(
    //  JSBI.greaterThanOrEqual(sqrtRatioX96, TickMath.MIN_SQRT_RATIO) &&
    //    JSBI.lessThan(sqrtRatioX96, TickMath.MAX_SQRT_RATIO),
    //  'SQRT_RATIO'
    //)

    const sqrtRatioX128 = sqrtRatioX96 << 32n

    const msb = mostSignificantBit(sqrtRatioX128)

    let r: bigint

    if (msb >= 128n) {
        r = sqrtRatioX128 >> BigInt(msb - 127)
    } else {
        r = sqrtRatioX128 << BigInt(127 - msb)
    }

    let log_2: bigint = BigInt(msb - 128) << 64n

    for (let i = 0; i < 14; i++) {
        r = (r * r) >> 127n
        const f = r >> 128n
        log_2 = log_2 | (f << BigInt(63 - i))
        r = r >> f
    }

    // Now change base to 1.0001
    const log_sqrt10001 = log_2 * 255738958999603826347141n  // log(sqrt(1.0001);2) * 2^64 

    const tickLow  = Number((log_sqrt10001 -   3402992956809132418596140100660247210n) >> 128n)
    const tickHigh = Number((log_sqrt10001 + 291339464771989622907027621153398088495n) >> 128n)
    
    return tickLow === tickHigh
      ? tickLow
      : (this.getSqrtRatioAtTick(tickHigh) <= sqrtRatioX96)
        ? tickHigh
        : tickLow
  }
}
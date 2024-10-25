import { useEffect, useMemo, useState } from 'react';
import {
  Pool,
  Route,
  TickMath,
  TradeType,
  Jetton,
  JettonAmount,
  Trade,
  PoolV3Contract,
} from '@toncodex/sdk';
import { TradeState, TradeStateType } from 'src/types/trade-state';
import JSBI from 'jsbi';
import useSWR from 'swr';
import { OpenedContract } from '@ton/core';
import { usePoolV3 } from '../pool/usePoolV3';
import { usePoolV3Contract } from '../contracts/usePoolV3Contract';

// const DEFAULT_GAS_QUOTE = 2_000_000

const getSwapEstimate = async (
  amountIn: JettonAmount<Jetton> | undefined,
  pool: Pool | null | undefined,
  poolV3Contract: OpenedContract<PoolV3Contract> | undefined,
) => {
  if (!amountIn || !pool || !poolV3Contract) return undefined;
  const zeroToOne = amountIn.jetton.equals(pool.jetton0);

  if (zeroToOne) {
    const res = await poolV3Contract.getSwapEstimate(
      zeroToOne,
      BigInt(amountIn.quotient.toString()),
      BigInt(TickMath.MIN_SQRT_RATIO.toString()) + 1n,
    );
    return -res.amount1;
  }
  const res = await poolV3Contract.getSwapEstimate(
    zeroToOne,
    BigInt(amountIn.quotient.toString()),
    BigInt(TickMath.MAX_SQRT_RATIO.toString()) - 1n,
  );
  return -res.amount0;
};

/**
 * Returns the best v3 trade for a desired exact input swap
 * @param amountIn the amount to swap in
 * @param currencyOut the desired output currency
 */
export function useBestTradeExactIn(
  amountIn?: JettonAmount<Jetton>,
  currencyOut?: Jetton,
  poolAddress?: string,
): {
  state: TradeStateType;
  trade: Trade<Jetton, Jetton, TradeType.EXACT_INPUT> | null;
  fee?: bigint[] | null;
  priceAfterSwap?: bigint[] | null;
  refetch?: () => void;
} {
  const [, pool] = usePoolV3(poolAddress);
  const poolV3Contract = usePoolV3Contract(poolAddress);

  const {
    data: amountOut,
    isLoading,
    error: isError,
    mutate: refetch,
  } = useSWR(
    [amountIn, currencyOut, poolV3Contract, pool],
    () => getSwapEstimate(amountIn, pool, poolV3Contract),
    {
      refreshInterval: 5000,
    },
  );

  const trade = useMemo(() => {
    if (
      !amountIn ||
      !currencyOut ||
      !pool ||
      (!amountOut && !isLoading) ||
      isError
    ) {
      return {
        state: TradeState.INVALID,
        trade: null,
        refetch: undefined,
      };
    }

    if (isLoading || !amountOut) {
      return {
        state: TradeState.LOADING,
        trade: null,
        refetch: undefined,
      };
    }

    try {
      const route = new Route([pool], amountIn.jetton, currencyOut);

      return {
        state: TradeState.VALID,
        fee: [BigInt(pool.fee) * 100n],
        trade: Trade.createUncheckedTrade({
          route,
          tradeType: TradeType.EXACT_INPUT,
          inputAmount: amountIn,
          outputAmount: JettonAmount.fromRawAmount(
            currencyOut,
            amountOut.toString(),
          ),
        }),
        priceAfterSwap: null,
        refetch,
      };
    } catch (error) {
      return {
        state: TradeState.INVALID,
        trade: null,
        refetch: undefined,
      };
    }
  }, [amountIn, currencyOut, pool, amountOut, isLoading, isError, refetch]);

  return trade;
}

/**
 * Returns the best v3 trade for a desired exact output swap
 * @param currencyIn the desired input currency
 * @param amountOut the amount to swap out
 */
export function useBestTradeExactOut(
  currencyIn?: Jetton,
  amountOut?: JettonAmount<Jetton>,
  poolAddress?: string,
): {
  state: TradeStateType;
  trade: Trade<Jetton, Jetton, TradeType.EXACT_OUTPUT> | null;
  fee?: bigint[] | null;
  priceAfterSwap?: bigint[] | null;
} {
  // const { routes, loading: routesLoading } = useAllRoutes(currencyIn, amountOut?.jetton);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [amountIn, setAmountIn] = useState<bigint>();

  const [, pool] = usePoolV3(poolAddress);
  const poolV3Contract = usePoolV3Contract(poolAddress);

  useEffect(() => {
    if (!amountOut || !currencyIn || !poolV3Contract || !pool) return;
    setIsError(false);
    setIsLoading(true);

    const getSwapEstimate = async () => {
      const zeroToOne = amountOut.jetton.equals(pool.jetton1);

      try {
        if (zeroToOne) {
          const res = await poolV3Contract.getSwapEstimate(
            zeroToOne,
            BigInt(amountOut.quotient.toString()),
            BigInt(TickMath.MIN_SQRT_RATIO.toString()),
          );
          /* dirt */
          const amount0 = Number(res.amount0);
          const amount1 = Number(-res.amount1);
          const multiplier = amount0 / amount1;

          setAmountIn(BigInt(Math.floor(amount0 * multiplier)));
        } else {
          const res = await poolV3Contract.getSwapEstimate(
            zeroToOne,
            -BigInt(amountOut.quotient.toString()),
            BigInt(
              JSBI.subtract(TickMath.MAX_SQRT_RATIO, JSBI.BigInt(1)).toString(),
            ),
          );
          /* dirt */
          const amount0 = Number(res.amount0);
          const amount1 = Number(res.amount1);
          const multiplier = amount0 / amount1;

          setAmountIn(BigInt(Math.floor(amount0 * multiplier)));
        }
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    getSwapEstimate();
  }, [amountOut, currencyIn, pool, poolV3Contract]);

  const trade = useMemo(() => {
    if (
      !amountOut ||
      !currencyIn ||
      !pool ||
      (!amountIn && !isLoading) ||
      isError
    ) {
      return {
        state: TradeState.INVALID,
        trade: null,
        refetch: undefined,
      };
    }

    if (isLoading || !amountIn) {
      return {
        state: TradeState.LOADING,
        trade: null,
        refetch: undefined,
      };
    }

    const route = new Route([pool], currencyIn, amountOut.jetton);

    return {
      state: TradeState.VALID,
      fee: [100n],
      trade: Trade.createUncheckedTrade({
        route,
        tradeType: TradeType.EXACT_OUTPUT,
        inputAmount: JettonAmount.fromRawAmount(
          currencyIn,
          amountIn.toString(),
        ),
        outputAmount: amountOut,
      }),
      priceAfterSwap: null,
      refetch: undefined,
    };
  }, [amountOut, currencyIn, pool, amountIn, isLoading, isError]);

  return trade;
}

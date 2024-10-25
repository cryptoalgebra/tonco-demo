import { Address } from '@ton/core';
import { useState } from 'react';
import keyBy from 'lodash.keyby';
import {
  Jetton,
  Pool,
  TickMath,
  tickToPrice,
  computePoolAddress,
} from '@toncodex/sdk';
import { TonClient } from '@ton/ton';
import { getAllTicks } from './useAllTicks';
import { useTonClient } from '../common/useTonClient';

interface TickProcessed {
  liquidityActive: bigint;
  tickIdx: number;
  liquidityNet: bigint;
  price0: string;
  price1: string;
  liquidityGross: bigint;
}

interface TicksResult {
  ticksProcessed: TickProcessed[];
  tickSpacing: number;
  activeTickIdx: number;
  token0: Jetton;
  token1: Jetton;
}

export function useInfoTickData() {
  const numSurroundingTicks = 500;
  const PRICE_FIXED_DIGITS = 8;

  const client = useTonClient();

  const [ticksResult, setTicksResult] = useState<TicksResult | null>(null);
  const [ticksLoading, setTicksLoading] = useState(false);

  async function fetchInitializedTicks(client: TonClient, poolAddress: string) {
    const surroundingTicksResult = await getAllTicks(client, poolAddress);

    return { ticks: surroundingTicksResult, loading: false, error: false };
  }

  async function fetchTicksSurroundingPrice(pool: Pool) {
    setTicksLoading(true);

    try {
      if (
        !client ||
        !pool.jetton0_wallet ||
        !pool.jetton1_wallet ||
        ticksLoading ||
        ticksResult
      )
        return undefined;

      const poolId = computePoolAddress(
        Address.parse(pool.jetton0_wallet),
        Address.parse(pool.jetton1_wallet),
      );

      const {
        tickCurrent: poolCurrentTick,
        liquidity,
        jetton0: token0,
        jetton1: token1,
      } = pool;

      const tickSpacing = Number(pool.tickSpacing);

      const activeTickIdx =
        Math.floor(poolCurrentTick / tickSpacing) * tickSpacing;

      const initializedTicksResult = await fetchInitializedTicks(
        client,
        poolId.toString(),
      );

      if (initializedTicksResult.error || initializedTicksResult.loading) {
        return {
          error: initializedTicksResult.error,
          loading: initializedTicksResult.loading,
        };
      }

      const { ticks: initializedTicks } = initializedTicksResult;

      const tickIdxToInitializedTick = keyBy(initializedTicks, 'tickIdx');

      let activeTickIdxForPrice = activeTickIdx;
      if (activeTickIdxForPrice < TickMath.MIN_TICK) {
        activeTickIdxForPrice = TickMath.MIN_TICK;
      }
      if (activeTickIdxForPrice > TickMath.MAX_TICK) {
        activeTickIdxForPrice = TickMath.MAX_TICK;
      }

      const activeTickProcessed = {
        liquidityActive: BigInt(liquidity.toString()),
        tickIdx: activeTickIdx,
        liquidityNet: BigInt(0),
        price0: tickToPrice(token0, token1, activeTickIdxForPrice).toFixed(
          PRICE_FIXED_DIGITS,
        ),
        price1: tickToPrice(
          token1,
          token0,
          activeTickIdxForPrice,
          false,
        ).toFixed(PRICE_FIXED_DIGITS),
        liquidityGross: BigInt(0),
      };

      const activeTick = tickIdxToInitializedTick[activeTickIdx];
      if (activeTick) {
        activeTickProcessed.liquidityGross = BigInt(activeTick.liquidityGross);
        activeTickProcessed.liquidityNet = BigInt(activeTick.liquidityNet);
      }

      const Direction = {
        ASC: 'ASC',
        DESC: 'DESC',
      };

      // Computes the numSurroundingTicks above or below the active tick.
      const computeSurroundingTicks = (
        _activeTickProcessed: TickProcessed,
        _tickSpacing: number,
        _numSurroundingTicks: number,
        direction: string,
      ) => {
        let previousTickProcessed = {
          ..._activeTickProcessed,
        };

        // Iterate outwards (either up or down depending on 'Direction') from the active tick,
        // building active liquidity for every tick.
        let processedTicks = [];
        for (let i = 0; i < _numSurroundingTicks; i += 1) {
          const currentTickIdx =
            direction === Direction.ASC
              ? previousTickProcessed.tickIdx + _tickSpacing
              : previousTickProcessed.tickIdx - _tickSpacing;

          if (
            currentTickIdx < TickMath.MIN_TICK ||
            currentTickIdx > TickMath.MAX_TICK
          ) {
            break;
          }

          const currentTickProcessed = {
            liquidityActive: previousTickProcessed.liquidityActive,
            tickIdx: currentTickIdx,
            liquidityNet: BigInt(0),
            price0: tickToPrice(token0, token1, currentTickIdx).toFixed(
              PRICE_FIXED_DIGITS,
            ),
            price1: tickToPrice(token1, token0, currentTickIdx, false).toFixed(
              PRICE_FIXED_DIGITS,
            ),
            liquidityGross: BigInt(0),
          };

          const currentInitializedTick =
            tickIdxToInitializedTick[currentTickIdx.toString()];
          if (currentInitializedTick) {
            currentTickProcessed.liquidityGross = BigInt(
              currentInitializedTick.liquidityGross,
            );
            currentTickProcessed.liquidityNet = BigInt(
              currentInitializedTick.liquidityNet,
            );
          }

          if (direction === Direction.ASC && currentInitializedTick) {
            currentTickProcessed.liquidityActive =
              BigInt(previousTickProcessed.liquidityActive) +
              BigInt(currentInitializedTick.liquidityNet);
          } else if (
            direction === Direction.DESC &&
            BigInt(previousTickProcessed.liquidityNet) !== BigInt(0)
          ) {
            currentTickProcessed.liquidityActive =
              BigInt(previousTickProcessed.liquidityActive) -
              BigInt(previousTickProcessed.liquidityNet);
          }

          processedTicks.push(currentTickProcessed);
          previousTickProcessed = currentTickProcessed;
        }

        if (direction === Direction.DESC) {
          processedTicks = processedTicks.reverse();
        }

        return processedTicks;
      };

      const subsequentTicks = computeSurroundingTicks(
        activeTickProcessed,
        tickSpacing,
        numSurroundingTicks,
        Direction.ASC,
      );

      const previousTicks = computeSurroundingTicks(
        activeTickProcessed,
        tickSpacing,
        numSurroundingTicks,
        Direction.DESC,
      );

      const ticksProcessed = previousTicks
        .concat(activeTickProcessed)
        .concat(subsequentTicks);

      setTicksResult({
        ticksProcessed,
        tickSpacing: Number(tickSpacing),
        activeTickIdx,
        token0,
        token1,
      });
      return undefined;
    } catch (err) {
      throw new Error(err as string);
    } finally {
      setTicksLoading(false);
    }
  }

  return {
    fetchTicksSurroundingPrice: {
      ticksResult,
      ticksLoading,
      fetchTicksSurroundingPrice,
    },
  };
}

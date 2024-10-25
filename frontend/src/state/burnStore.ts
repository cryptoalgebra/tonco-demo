import {
  Jetton,
  JettonAmount,
  Percent,
  Position,
  computePoolAddress,
} from '@toncodex/sdk';
import { useCallback, useMemo } from 'react';
import { create } from 'zustand';
import { useTonConnect } from 'src/hooks/common/useTonConnect';
import { ExtendedPosition } from 'src/hooks/position/useAllPositions';
import { Address } from '@ton/core';
import JSBI from 'jsbi';
import { useCollectedFees } from 'src/hooks/position/useCollectedFees';

export interface IDerivedBurnInfo {
  position?: Position;
  liquidityPercentage?: Percent;
  liquidityValue0?: JettonAmount<Jetton>;
  liquidityValue1?: JettonAmount<Jetton>;
  liquidityToBurn?: JSBI;
  poolAddress: string | undefined;
  feeValue0?: JettonAmount<Jetton>;
  feeValue1?: JettonAmount<Jetton>;
  outOfRange: boolean;
  error?: string;
}

interface BurnState {
  readonly percent: number;
  actions: {
    selectPercent: (percent: number) => void;
  };
}

export const useBurnState = create<BurnState>((set) => ({
  percent: 100,
  actions: {
    selectPercent: (percent: number) => set({ percent }),
  },
}));

export function useDerivedBurnInfo(
  position?: ExtendedPosition,
): IDerivedBurnInfo {
  const { wallet: account } = useTonConnect();

  const { percent } = useBurnState();

  const pool = position?.position.pool;

  const poolAddress = useMemo(() => {
    if (!pool?.jetton0_wallet || !pool.jetton1_wallet) return undefined;

    return computePoolAddress(
      Address.parse(pool.jetton0_wallet),
      Address.parse(pool.jetton1_wallet),
    ).toString();
  }, [pool]);

  const jetton0 = pool?.jetton0;
  const jetton1 = pool?.jetton1;

  const positionSDK = position?.position;

  const {
    liquidityPercentage,
    liquidityValue0,
    liquidityValue1,
    liquidityToBurn,
  } = useMemo(() => {
    const liquidityPercentage = new Percent(percent, 100);

    const discountedAmount0 = positionSDK
      ? liquidityPercentage.multiply(positionSDK.amount0.quotient).quotient
      : undefined;
    const discountedAmount1 = positionSDK
      ? liquidityPercentage.multiply(positionSDK.amount1.quotient).quotient
      : undefined;

    const liquidityValue0 =
      jetton0 && discountedAmount0
        ? JettonAmount.fromRawAmount(jetton0, discountedAmount0)
        : undefined;
    const liquidityValue1 =
      jetton1 && discountedAmount1
        ? JettonAmount.fromRawAmount(jetton1, discountedAmount1)
        : undefined;

    const liquidityToBurn =
      positionSDK &&
      liquidityPercentage.multiply(positionSDK.liquidity).quotient;

    return {
      liquidityPercentage,
      liquidityValue0,
      liquidityValue1,
      liquidityToBurn,
    };
  }, [percent, positionSDK, jetton0, jetton1]);

  const { amount0: feeValue0, amount1: feeValue1 } = useCollectedFees(
    position,
    poolAddress,
  );

  const outOfRange =
    pool && positionSDK
      ? pool.tickCurrent < positionSDK.tickLower ||
        pool.tickCurrent > positionSDK.tickUpper
      : false;

  let error: string | undefined;

  if (!account) {
    error = `Connect Wallet`;
  }
  if (percent === 0) {
    error = error ?? `Enter a percent`;
  }

  return useMemo(
    () => ({
      position: positionSDK,
      liquidityPercentage,
      liquidityValue0,
      liquidityValue1,
      liquidityToBurn,
      poolAddress,
      feeValue0,
      feeValue1,
      outOfRange,
      error,
    }),
    [
      positionSDK,
      liquidityPercentage,
      liquidityValue0,
      liquidityValue1,
      liquidityToBurn,
      poolAddress,
      feeValue0,
      feeValue1,
      outOfRange,
      error,
    ],
  );
}

export function useBurnActionHandlers(): {
  onPercentSelect: (percent: number) => void;
} {
  const {
    actions: { selectPercent },
  } = useBurnState();

  const onPercentSelect = useCallback((percent: number) => {
    selectPercent(percent);
  }, []);

  return {
    onPercentSelect,
  };
}

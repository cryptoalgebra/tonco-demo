import deepMerge from 'lodash.merge';
import { useMemo } from 'react';
import { Percent } from '@toncodex/sdk';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  txDeadline: number;
  slippage: Percent | 'auto';
  isExpertMode: boolean;
  isMultihop: boolean;
  actions: {
    setTxDeadline: (txDeadline: number) => void;
    setSlippage: (slippage: Percent | 'auto') => void;
    setIsExpertMode: (isExpertMode: boolean) => void;
    setIsMultihop: (isMultihop: boolean) => void;
  };
}

export const useUserState = create(
  persist<UserState>(
    (set) => ({
      txDeadline: 180,
      slippage: 'auto',
      isExpertMode: false,
      isMultihop: true,
      importedTokens: {},
      actions: {
        setTxDeadline: (txDeadline) =>
          set({
            txDeadline,
          }),
        setSlippage: (slippage) =>
          set({
            slippage,
          }),
        setIsExpertMode: (isExpertMode) =>
          set({
            isExpertMode,
          }),
        setIsMultihop: (isMultihop) =>
          set({
            isMultihop,
          }),
      },
    }),
    {
      name: 'user-state-storage',
      merge(persistedState, currentState) {
        const state = persistedState as UserState;

        return deepMerge(
          {
            ...currentState,
            slippage: state.slippage === 'auto' ? 'auto' : new Percent(0),
          },
          state,
        );
      },
    },
  ),
);

export function useUserSlippageToleranceWithDefault(
  defaultSlippageTolerance: Percent,
): Percent {
  const { slippage } = useUserState();
  return useMemo(
    () => (slippage === 'auto' ? defaultSlippageTolerance : slippage),
    [slippage, defaultSlippageTolerance],
  );
}

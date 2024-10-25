import { useMemo } from 'react';
import { Jetton } from '@toncodex/sdk';
import { useJettonPriceUSD } from './useJettonPriceUSD';

export function useUSDValue(
  value: number | undefined,
  jetton: Jetton | undefined,
) {
  const jettonUSDPrice = useJettonPriceUSD(jetton);

  return useMemo(() => {
    if (!jettonUSDPrice) return 0;
    return value ? value * jettonUSDPrice : 0;
  }, [value, jettonUSDPrice]);
}

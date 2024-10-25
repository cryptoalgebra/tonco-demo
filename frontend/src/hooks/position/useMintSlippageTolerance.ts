import { useMemo } from 'react';
import { Percent } from '@toncodex/sdk';
import { useUserSlippageToleranceWithDefault } from 'src/state/userStore';

const ZERO_PERCENT = new Percent('0');
const MINT_DEFAULT_SLIPPAGE = new Percent(1, 100); // 1%

export default function useMintSlippageTolerance(outOfRange: boolean): Percent {
  const slippage = useUserSlippageToleranceWithDefault(MINT_DEFAULT_SLIPPAGE);

  return useMemo(() => {
    if (outOfRange) return ZERO_PERCENT;
    return slippage;
  }, [outOfRange, slippage]);
}

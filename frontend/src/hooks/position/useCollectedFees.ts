import { useEffect, useState } from 'react';
import { JettonAmount } from '@toncodex/sdk';
import { usePoolV3Contract } from '../contracts/usePoolV3Contract';
import { ExtendedPosition } from './useAllPositions';

export function useCollectedFees(
  position: ExtendedPosition | undefined,
  poolAddress: string | undefined,
) {
  const [collectedFees, setCollectedFees] = useState<bigint[]>();
  const poolV3Contract = usePoolV3Contract(poolAddress);

  useEffect(() => {
    if (!position || !poolV3Contract) return undefined;
    const fetchFees = async () => {
      const fees = await poolV3Contract.getCollectedFees(
        position.position.tickLower,
        position.position.tickUpper,
        BigInt(position.position.liquidity.toString()),
        BigInt(position.feeGrowthInside0LastX128),
        BigInt(position.feeGrowthInside1LastX128),
      );

      if (!fees) return undefined;

      return [fees.amount0, fees.amount1];
    };

    fetchFees().then(setCollectedFees);

    return undefined;
  }, [poolV3Contract, position]);

  return {
    amount0:
      position &&
      collectedFees &&
      JettonAmount.fromRawAmount(
        position.position.pool.jetton0,
        collectedFees?.[0].toString(),
      ),
    amount1:
      position &&
      collectedFees &&
      JettonAmount.fromRawAmount(
        position.position.pool.jetton1,
        collectedFees?.[1].toString(),
      ),
  };
}

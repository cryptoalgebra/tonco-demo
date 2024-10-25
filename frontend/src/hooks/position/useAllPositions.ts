import { useMemo } from 'react';
import { Address } from '@ton/core';
import { Pool, Position } from '@toncodex/sdk';
import { useAllPositionsQuery } from 'src/graphql/generated/graphql';

export interface ExtendedPosition {
  position: Position;
  tokenId: number;
  nftAddress: string;
  nftImage: string;
  feeAmount0: string;
  feeAmount1: string;
  feeGrowthInside0LastX128: string;
  feeGrowthInside1LastX128: string;
}

export function useAllPositions({
  pool,
  poolAddress,
  wallet,
}: {
  pool: Pool | null | undefined;
  poolAddress: string | undefined;
  wallet: string | null;
}) {
  const { data, loading: isAllPositionsLoading } = useAllPositionsQuery({
    variables: {
      owner: wallet ? Address.parse(wallet).toString() : '',
      pool: poolAddress ? Address.parse(poolAddress).toRawString() : '',
    },
    skip: !wallet || !poolAddress || !pool,
    pollInterval: 10000,
  });

  const positions = useMemo(() => {
    if (!pool || !data?.positions) return undefined;

    const positionsTemp: ExtendedPosition[] = [];

    for (const position of data.positions) {
      if (!position) return undefined;
      const positionSDK = new Position({
        pool,
        liquidity: position.liquidity,
        tickLower: position.tickLower,
        tickUpper: position.tickUpper,
      });

      positionsTemp.push({
        tokenId: Number(position.id.split(':')[0]),
        nftAddress: position.nftAddress,
        nftImage: position.nftImage,
        position: positionSDK,
        feeAmount0: '0',
        feeAmount1: '0',
        feeGrowthInside0LastX128: position.feeGrowthInside0LastX128,
        feeGrowthInside1LastX128: position.feeGrowthInside1LastX128,
      });
    }

    return positionsTemp;
  }, [pool, data]);

  return { positions, isLoading: !positions && isAllPositionsLoading };
}

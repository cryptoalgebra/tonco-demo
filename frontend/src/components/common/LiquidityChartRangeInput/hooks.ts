import { useCallback, useEffect, useMemo } from 'react';

import { Pool } from '@toncodex/sdk';
import { useInfoTickData } from 'src/hooks/pool/usePoolTickData';
import { ChartEntry } from './types';

export function useDensityChartData({
  pool,
  isSorted,
}: {
  pool: Pool | undefined | null;
  isSorted: boolean;
}) {
  const {
    fetchTicksSurroundingPrice: {
      ticksResult,
      fetchTicksSurroundingPrice,
      ticksLoading,
    },
  } = useInfoTickData();

  // const jetton0Wallet = useJettonWalletAddress({ jettonMinterAddress: currencyA?.address, ownerAddress: ROUTER });
  // const jetton1Wallet = useJettonWalletAddress({ jettonMinterAddress: currencyB?.address, ownerAddress: ROUTER });

  // const poolAddress = useMemo(() => {
  //     if (!jetton0Wallet || !jetton1Wallet) return undefined;
  //     return computePoolAddress(Address.parse(jetton0Wallet), Address.parse(jetton1Wallet));
  // }, [jetton0Wallet, jetton1Wallet]);

  // const [, pool] = usePoolV3(poolAddress?.toString());

  // const isSorted = pool && currencyA?.equals(pool.jetton0);

  useEffect(() => {
    if (!pool) return;
    fetchTicksSurroundingPrice(pool);
  }, [pool]);

  const formatData = useCallback(() => {
    if (!ticksResult) {
      return undefined;
    }

    const data = ticksResult.ticksProcessed;

    const newData: ChartEntry[] = [];

    for (let i = 0; i < data.length; i++) {
      const t = data[i];

      const chartEntry = {
        activeLiquidity: parseFloat(t.liquidityActive.toString()),
        price0: isSorted
          ? parseFloat(t.price0.toString())
          : parseFloat(t.price1.toString()),
      };

      if (chartEntry.activeLiquidity > 0) {
        newData.push(chartEntry);
      }
    }

    return newData;
  }, [ticksResult, isSorted]);

  return useMemo(
    () => ({
      isLoading: ticksLoading,
      formattedData: !ticksLoading ? formatData() : undefined,
    }),
    [ticksLoading, formatData],
  );
}

import { jettons } from 'src/constants/jettons';
import { Jetton } from '@toncodex/sdk';
import useSWR from 'swr';
import { Api } from 'tonapi-sdk-js';
import { useTonConsoleClient } from '../common/useTonConsoleClient';

const jettonsUSD = {
  // [jettons.TON.symbol]: 6.35,
  [jettons.USD.symbol]: 1.0,
  [jettons.USDC.symbol]: 1.0004,
  [jettons.ALG_USD.symbol]: 0.99985,
  [jettons.BTC.symbol]: 57700,
  [jettons.ETH.symbol]: 2450,
  [jettons.A_COIN.symbol]: 0.512,
  [jettons.F6.symbol]: 30000,
  [jettons.F3.symbol]: 15000,
};

export function fetchJettonUSDPriceSync(jetton: Jetton) {
  if (jettonsUSD[jetton.symbol]) {
    return jettonsUSD[jetton.symbol];
  }
  return 0;
}

async function fetchJettonUSDPrice(
  client: Api<unknown>,
  jetton: Jetton | undefined,
) {
  if (!jetton) return undefined;

  if (jettonsUSD[jetton.symbol]) {
    return jettonsUSD[jetton.symbol];
  }
  if (jetton.equals(jettons.TON)) {
    const rates = await client.rates.getRates({
      tokens: ['ton'],
      currencies: ['usd'],
    });
    return rates.rates.TON.prices?.USD;
  }
  const rates = await client.rates.getRates({
    tokens: [jetton.address],
    currencies: ['usd'],
  });
  return rates.rates[jetton.address].prices?.USD;
}

export function useJettonPriceUSD(jetton: Jetton | undefined) {
  const client = useTonConsoleClient();

  const { data: jettonUSDPrice } = useSWR(
    ['jettonUSDPrice', jetton?.symbol],
    () => fetchJettonUSDPrice(client, jetton),
  );

  return jettonUSDPrice || 0;
}

import { CHAIN } from '@tonconnect/ui-react';
import { APP_CHAIN } from 'src/constants/chain';
import { Api, HttpClient } from 'tonapi-sdk-js';

const API_KEY = import.meta.env.VITE_TON_CONSOLE_API_KEY;

/* tonApi client for fetching additional data, such as jetton balances, etc. */
export function useTonConsoleClient() {
  const httpClient = new HttpClient({
    baseUrl:
      APP_CHAIN === CHAIN.TESTNET
        ? 'https://testnet.tonapi.io'
        : 'https://tonapi.io',
    baseApiParams: {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-type': 'application/json',
      },
    },
  });
  const tonConsoleClient = new Api(httpClient);

  return tonConsoleClient;
}

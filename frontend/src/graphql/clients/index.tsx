import { ApolloClient, InMemoryCache } from '@apollo/client';
import { CHAIN } from '@tonconnect/ui-react';
import { APP_CHAIN } from 'src/constants/chain';

export const infoClient = new ApolloClient({
  uri:
    APP_CHAIN === CHAIN.TESTNET
      ? import.meta.env.VITE_INFO_GRAPH_TESTNET
      : import.meta.env.VITE_INFO_GRAPH,
  cache: new InMemoryCache(),
});

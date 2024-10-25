import React from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter, Navigate, RouterProvider } from 'react-router-dom';

import './index.css';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { ApolloProvider } from '@apollo/client';
import App from './App';
import { SwapPage } from './pages/swap';
import PoolsPage from './pages/pools';
import CreatePoolPage from './pages/create-pool';
import { TonClientProvider } from './hooks/common/useTonClient';
import PoolPage from './pages/pool';
import CreatePositionPage from './pages/create-position';
import { infoClient } from './graphql/clients/index';
import ExplorePage from './pages/explore';
import ExploreJettonPage from './pages/explore-jetton';
import PoolsList from './components/pools/PoolsList';
import JettonsList from './components/jettons/JettonsList';
import ExplorePoolPage from './pages/explore-pool';
import TransactionsList from './components/transactions/TransactionsList';

const router = createHashRouter([
  {
    path: '/',
    element: <Navigate replace to={'/swap'} />,
  },
  {
    path: '/swap',
    element: (
      <App>
        <SwapPage />
      </App>
    ),
  },
  {
    path: '/pools',
    element: (
      <App>
        <PoolsPage />
      </App>
    ),
  },
  {
    path: '/pool/:poolId',
    element: (
      <App>
        <PoolPage />
      </App>
    ),
  },
  {
    path: '/pool/:poolId/create-position',
    element: (
      <App>
        <CreatePositionPage />
      </App>
    ),
  },
  {
    path: '/create-pool',
    element: (
      <App>
        <CreatePoolPage />
      </App>
    ),
  },
  {
    path: '/explore',
    element: (
      <App>
        <ExplorePage>
          <PoolsList isExplore />
        </ExplorePage>
      </App>
    ),
  },
  {
    path: '/explore/jettons',
    element: (
      <App>
        <ExplorePage>
          <JettonsList />
        </ExplorePage>
      </App>
    ),
  },
  {
    path: '/explore/pools',
    element: (
      <App>
        <ExplorePage>
          <PoolsList isExplore />
        </ExplorePage>
      </App>
    ),
  },
  {
    path: '/explore/transactions',
    element: (
      <App>
        <ExplorePage>
          <TransactionsList />
        </ExplorePage>
      </App>
    ),
  },
  {
    path: '/explore/jettons/:jettonId',
    element: (
      <App>
        <ExploreJettonPage />
      </App>
    ),
  },
  {
    path: '/explore/pools/:poolId',
    element: (
      <App>
        <ExplorePoolPage />
      </App>
    ),
  },
]);

const manifestUrl = 'https://testnet.tonco.io/ton-manifest.json';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={infoClient}>
      <TonConnectUIProvider manifestUrl={manifestUrl}>
        <TonClientProvider>
          <RouterProvider router={router} />
        </TonClientProvider>
      </TonConnectUIProvider>
    </ApolloProvider>
  </React.StrictMode>,
);

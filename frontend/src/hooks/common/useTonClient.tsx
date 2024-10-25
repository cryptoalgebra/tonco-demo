import React, { createContext, useContext, useMemo, useState } from 'react';
import { TonClient } from '@ton/ton';
import { APP_CHAIN } from 'src/constants/chain';
import { CHAIN } from '@tonconnect/ui-react';
import { useAsyncInitialize } from './useAsyncInitialize';

type TonClientContextType = {
  client: TonClient | null;
  loading: boolean;
};

const TonClientContext = createContext<TonClientContextType | undefined>(
  undefined,
);

export function TonClientProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<TonClient | null>(null);
  const [loading, setLoading] = useState(true);

  const providerValue = useMemo(
    () => ({
      client,
      loading,
    }),
    [client, loading],
  );

  useAsyncInitialize(async () => {
    const endpoint =
      APP_CHAIN === CHAIN.TESTNET
        ? 'https://testnet.toncenter.com/api/v2/jsonRPC'
        : 'https://toncenter.com/api/v2/jsonRPC';
    const newClient = new TonClient({
      endpoint,
      apiKey: import.meta.env.VITE_TON_CENTER_API_KEY,
    });
    setClient(newClient);
    setLoading(false);
    return newClient;
  }, []);

  return (
    <TonClientContext.Provider value={providerValue}>
      {children}
    </TonClientContext.Provider>
  );
}

export function useTonClient() {
  const context = useContext(TonClientContext)?.client;
  if (context === undefined) {
    throw new Error('useTonClient must be used within a TonClientProvider');
  }
  return context;
}

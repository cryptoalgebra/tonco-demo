import { useEffect, useState } from 'react';
import { Event } from 'tonapi-sdk-js';
import { useTonConnect } from './useTonConnect';
import { useTonConsoleClient } from './useTonConsoleClient';

export function useWaitForTransaction(
  hash: string | undefined,
  refreshInterval = 10000,
) {
  const [data, setData] = useState<Event>();
  const client = useTonConsoleClient();
  const { wallet } = useTonConnect();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (hash) {
      setData(undefined);
      setIsLoading(false);
      setIsError(false);
      setIsSuccess(false);
    }
  }, [hash]);

  useEffect(() => {
    if (!hash || !client || !wallet || isLoading || isSuccess || isError)
      return;
    setIsLoading(true);

    const fetchTransaction = async () => {
      try {
        console.log('wait for tx - ', hash);
        await new Promise((resolve) => {
          setTimeout(resolve, refreshInterval);
        });
        const tx = await client.events.getEvent(hash);

        if (tx.in_progress === false) {
          setData(tx);
          setIsSuccess(true);
          setIsError(false);
          setIsLoading(false);
        } else {
          fetchTransaction();
        }
      } catch (e) {
        setData(undefined);
        setIsSuccess(false);
        setIsError(true);
        setIsLoading(false);
        console.error(e);
      }
    };

    fetchTransaction();
  }, [hash, client, refreshInterval, wallet, isLoading, isSuccess, isError]);

  return {
    data,
    isError,
    isLoading,
    isSuccess,
  };
}

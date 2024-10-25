import { ToastAction } from 'src/components/ui/toast';
import { ExternalLinkIcon } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from 'src/components/ui/use-toast';
import { APP_CHAIN } from 'src/constants/chain';
import { CHAIN } from '@tonconnect/ui-react';
import { useTonConnect } from './useTonConnect';
import { useWaitForTransaction } from './useWaitForTransaction';

interface TransactionInfo {
  title: string;
  description?: string;
  tokenA?: string;
  tokenB?: string;
  // tokenId?: string;
  // type: TransactionType;
}
export function ViewTxOnExplorer({ hash }: { hash: string | undefined }) {
  return hash ? (
    <ToastAction altText="View on explorer" asChild>
      <Link
        to={
          APP_CHAIN === CHAIN.TESTNET
            ? `https://testnet.tonviewer.com/transaction/${hash}`
            : `https://tonviewer.com/transaction/${hash}`
        }
        target={'_blank'}
        className="gap-2 border-none hover:bg-transparent hover:text-blue-400"
      >
        View on explorer
        <ExternalLinkIcon size={16} />
      </Link>
    </ToastAction>
  ) : null;
}

export function useTransactionAwait(
  hash: string | undefined,
  transactionInfo: TransactionInfo,
  redirectPath?: string,
) {
  const { toast } = useToast();

  const navigate = useNavigate();

  const { wallet } = useTonConnect();

  const { isError, isLoading, isSuccess } = useWaitForTransaction(hash);

  useEffect(() => {
    if (isLoading && hash && wallet) {
      console.log('toast loading');
      toast({
        title: transactionInfo.title,
        description: transactionInfo.description || 'Transaction was sent',
        action: <ViewTxOnExplorer hash={hash} />,
      });
    }
  }, [isLoading, wallet, hash]);

  useEffect(() => {
    if (isError && hash) {
      console.log('toast error');
      toast({
        title: transactionInfo.title,
        description: transactionInfo.description || 'Transaction failed',
        action: <ViewTxOnExplorer hash={hash} />,
      });
    }
  }, [isError]);

  useEffect(() => {
    if (isSuccess && hash) {
      console.log('toast success');
      toast({
        title: transactionInfo.title,
        description: transactionInfo.description || 'Transaction confirmed',
        action: <ViewTxOnExplorer hash={hash} />,
      });
      if (redirectPath) {
        navigate(redirectPath);
      }
    }
  }, [isSuccess]);

  return {
    isError,
    isLoading,
    isSuccess,
  };
}

import React, { useCallback, useEffect, useState } from 'react';
import ArrowBtn from 'src/assets/arrow.svg';
import { MenuState } from 'src/types/token-menu';
import { cn } from 'src/lib/cn';
import { useTokensState } from 'src/state/tokensStore';
import { JettonLogo } from 'src/components/common/JettonLogo';
import { Input } from 'src/components/ui/Input';
import { Check, Copy, Search } from 'lucide-react';
import { Address } from '@ton/core';
import { useJetton } from 'src/hooks/jetton/useJetton';
import { useJettonBalance } from 'src/hooks/jetton/useJettonBalance';
import { formatUnits } from 'src/utils/common/formatUnits';
import { Skeleton } from 'src/components/ui/Skeleton';
import { Jetton } from '@toncodex/sdk';
import { useSwapActionHandlers, useSwapState } from 'src/state/swapStore';
import { SwapField } from 'src/types/swap-field';
import { useTokenMenuState } from 'src/state/tokenMenuStore';
import { useTonConnect } from 'src/hooks/common/useTonConnect';
import { formatAmount } from 'src/utils/common/formatAmount';
import { isAddress } from 'src/utils/common/isAddress';

function JettonRow({
  onSelect,
  isSelected,
  jetton,
}: {
  onSelect: (jetton: Jetton) => void;
  isSelected: boolean;
  jetton: Jetton;
}) {
  const [isCopied, setIsCopied] = useState(false);
  const { wallet } = useTonConnect();
  const balance = useJettonBalance(jetton.address, wallet);
  const formattedBalance = formatAmount(
    formatUnits(Number(balance), jetton.decimals),
    4,
  );

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    navigator.clipboard.writeText(jetton.address).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    });
  };

  return (
    <div
      role={'button'}
      tabIndex={0}
      onClick={() => !isSelected && onSelect(jetton)}
      onKeyDown={() => !isSelected && onSelect(jetton)}
      className={cn(
        'group flex w-full items-center gap-4 px-6 py-4 transition-all duration-300 ease-in-out sm:px-8',
        isSelected
          ? 'cursor-not-allowed bg-div-disabled text-text-disabled hover:bg-div-disabled'
          : 'cursor-pointer hover:bg-dark',
      )}
      key={jetton.symbol}
    >
      <JettonLogo jetton={jetton} size={window.innerWidth < 640 ? 28 : 32} />
      <span className="text-md sm:text-xl">{jetton.symbol}</span>
      <button
        type={'button'}
        className="invisible sm:group-hover:visible"
        onClick={handleCopy}
      >
        {isCopied ? (
          <Check opacity={0.5} size={16} />
        ) : (
          <Copy opacity={0.8} size={16} />
        )}
      </button>
      {balance === undefined ? (
        <Skeleton className="ml-auto h-6 w-12" />
      ) : (
        balance && <span className="text-md ml-auto">{formattedBalance}</span>
      )}
    </div>
  );
}

function TokenSelectMenu() {
  const [searchValue, setSearchValue] = useState('');
  const [tokenToImport, setTokenToImport] = useState('');

  const {
    [SwapField.INPUT]: { currencyId: tokenIn },
    [SwapField.OUTPUT]: { currencyId: tokenOut },
  } = useSwapState();

  const { onCurrencySelection } = useSwapActionHandlers();

  const {
    menuState,
    actions: { setMenuState },
  } = useTokenMenuState();

  const handleInputSelect = useCallback(
    (inputCurrency: Jetton) => {
      onCurrencySelection(SwapField.INPUT, inputCurrency);
    },
    [onCurrencySelection],
  );

  const handleOutputSelect = useCallback(
    (outputCurrency: Jetton) => {
      onCurrencySelection(SwapField.OUTPUT, outputCurrency);
    },
    [onCurrencySelection],
  );

  const {
    importedTokens,
    actions: { importToken },
  } = useTokensState();

  const allTokens = Object.values(importedTokens);

  const newToken = useJetton(tokenToImport);

  const handleClose = () => {
    setMenuState(MenuState.CLOSED);
  };

  const handleJettonSelect = (jetton: Jetton) => {
    if (menuState === MenuState.INPUT) handleInputSelect(jetton);
    if (menuState === MenuState.OUTPUT) handleOutputSelect(jetton);
    setMenuState(MenuState.CLOSED);
  };

  const handleImportToken = () => {
    if (!newToken) return;
    importToken(newToken);
  };

  useEffect(() => {
    if (!searchValue || !allTokens) return;

    if (
      isAddress(searchValue) &&
      !allTokens.find((jetton) =>
        Address.parse(jetton.address).equals(Address.parse(searchValue)),
      )
    ) {
      setTokenToImport(searchValue);
    }
  }, [searchValue, allTokens]);

  return (
    <div className="h-[500px] w-full self-center rounded-xl bg-light py-4 sm:h-[600px]">
      <div className="flex flex-col gap-4 border-0 border-border-light p-4 pt-1 sm:p-6 sm:pt-2">
        <div
          role={'button'}
          tabIndex={0}
          onClick={handleClose}
          onKeyDown={handleClose}
          className="flex w-fit cursor-pointer items-center gap-2"
        >
          <img
            alt="Arrow"
            width={14}
            height={14}
            className="rotate-90"
            src={ArrowBtn}
          />
          <p className="text-xl max-md:text-lg">Select a token</p>
        </div>
        <div className="relative flex items-center">
          <Input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="sm:text-md mx-auto h-12 w-full rounded-xl bg-lighter pl-12 text-[14px] outline-none sm:h-14"
            placeholder="Search name or address"
          />
          <Search className="text-border absolute left-4" size={20} />
        </div>
      </div>
      <div className="h-[345px] overflow-auto sm:h-[430px]">
        <div className="empty:pt-10 empty:after:text-xl empty:after:text-border-light empty:after:content-['No_results_found.']">
          {newToken && (
            <JettonRow
              key={newToken.symbol}
              onSelect={() => {
                handleImportToken();
                handleJettonSelect(newToken);
              }}
              isSelected={false}
              jetton={newToken}
            />
          )}
          {allTokens.map((jetton) => {
            if (
              !jetton.symbol
                .toLowerCase()
                .includes(searchValue.toLowerCase()) &&
              !jetton.name?.toLowerCase().includes(searchValue.toLowerCase())
            ) {
              return null;
            }
            const isTokenSelected =
              (menuState === MenuState.INPUT && tokenOut === jetton.address) ||
              (menuState === MenuState.OUTPUT && tokenIn === jetton.address);
            return (
              <JettonRow
                key={jetton.symbol}
                onSelect={handleJettonSelect}
                isSelected={isTokenSelected}
                jetton={jetton}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TokenSelectMenu;

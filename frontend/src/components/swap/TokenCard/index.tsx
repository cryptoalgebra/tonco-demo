import { ChevronDown, WalletMinimal } from 'lucide-react';
import { useMemo } from 'react';
import { JettonLogo } from 'src/components/common/JettonLogo';
import { Input } from 'src/components/ui/Input';
import { useTonConnect } from 'src/hooks/common/useTonConnect';
import { useJettonBalance } from 'src/hooks/jetton/useJettonBalance';
import { cn } from 'src/lib/cn';
import { Jetton } from '@toncodex/sdk';
import { useTokenMenuState } from 'src/state/tokenMenuStore';
import { MenuState } from 'src/types/token-menu';
import { formatAmount } from 'src/utils/common/formatAmount';
import { formatUnits } from 'src/utils/common/formatUnits';

interface TokenSwapCardProps {
  handleValueChange?: (value: string) => void;
  handleMaxValue?: () => void;
  value: string;
  currency: Jetton | undefined;
  menuType: MenuState;
  disabled?: boolean;
  lockCurrencies?: boolean;
  usdValue?: number;
  percentDifference?: number;
}

function TokenCard({
  handleValueChange,
  handleMaxValue,
  value,
  currency,
  disabled,
  menuType,
  usdValue,
  percentDifference,
  lockCurrencies,
}: TokenSwapCardProps) {
  const { wallet } = useTonConnect();

  const {
    actions: { setMenuState },
  } = useTokenMenuState();

  const handleInput = (value: string) => {
    let _value = value;
    if (value === '.') {
      _value = '0.';
    }
    handleValueChange?.(_value);
  };

  const balance = useJettonBalance(currency?.address, wallet);

  const formattedPercentDiff = useMemo(() => {
    if (!percentDifference) return undefined;

    if (percentDifference > 0) return `(+${percentDifference.toFixed(2)}%)`;
    if (percentDifference < 100 && percentDifference > -100)
      return `(${percentDifference.toFixed(2)}%)`;

    return undefined;
  }, [percentDifference]);

  return (
    <div className="flex h-[124px] w-full items-center rounded-xl border border-border-light bg-light">
      <div className="flex h-full w-fit flex-col items-start gap-2 p-3">
        <button
          type={'button'}
          onClick={() => setMenuState(menuType)}
          className={cn(
            !lockCurrencies
              ? 'flex h-full w-fit cursor-pointer items-center gap-2 rounded-lg bg-lighter/40 px-2 py-4 transition-all duration-300 ease-in-out hover:bg-lighter'
              : 'flex h-full w-fit items-center gap-2 px-2 py-4',
            menuType === MenuState.CLOSED && !lockCurrencies
              ? 'cursor-auto pr-4 hover:bg-lighter/40'
              : '',
          )}
        >
          {currency && <JettonLogo jetton={currency} size={32} />}
          <p className="text-nowrap text-lg font-semibold sm:text-xl">
            {currency?.symbol}
          </p>
          {menuType === MenuState.CLOSED || lockCurrencies ? null : (
            <ChevronDown />
          )}
        </button>
        <button
          type={'button'}
          onClick={handleMaxValue}
          className={cn(
            'ml-1 flex items-center gap-2 text-sm',
            handleMaxValue ? 'group cursor-pointer' : '',
          )}
        >
          <WalletMinimal className="opacity-50 transition-all duration-200 group-hover:opacity-100" />
          <p className="opacity-50 transition-all duration-200 group-hover:opacity-100">
            {balance && currency
              ? formatAmount(formatUnits(balance, currency.decimals), 4)
              : '0.0'}
          </p>
        </button>
      </div>

      <div className="flex h-full w-full flex-col gap-2 p-3 max-sm:pl-0">
        <Input
          readOnly={disabled}
          type={'text'}
          value={value}
          id={`amount-${currency?.symbol}`}
          onUserInput={(v) => handleInput(v)}
          className="ml-auto h-[66px] w-full rounded-xl bg-transparent px-1 pt-3 text-right text-[22px] text-white outline-none sm:text-2xl"
          placeholder={'0.0'}
          maxDecimals={currency?.decimals}
          maxLength={24}
        />
        <div className="relative bottom-0 ml-auto mr-1 flex h-6 min-w-max items-center gap-1 text-sm text-muted">
          <p>
            ≈ ${usdValue ? formatAmount(usdValue, 4) : usdValue?.toFixed(2)}
          </p>
          {percentDifference ? (
            <p
              className={
                percentDifference > 1
                  ? 'text-green-500'
                  : (percentDifference > 0 && percentDifference < 1) ||
                      (percentDifference < 0 && percentDifference > -1)
                    ? 'text-white'
                    : percentDifference < -1 && percentDifference > -3
                      ? 'text-orange-300'
                      : percentDifference < -3 && percentDifference > -100
                        ? 'text-red-400'
                        : 'text-white'
              }
            >
              {formattedPercentDiff}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default TokenCard;

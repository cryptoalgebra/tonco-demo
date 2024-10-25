import { useCallback } from 'react';
import { JettonLogo } from 'src/components/common/JettonLogo';
import { Input } from 'src/components/ui/Input';
import { useTonConnect } from 'src/hooks/common/useTonConnect';
import { useJettonBalance } from 'src/hooks/jetton/useJettonBalance';
import { Jetton } from '@toncodex/sdk';

interface EnterAmountsCardProps {
  currency: Jetton | undefined;
  value: string;
  handleChange: (value: string) => void;
}

function EnterAmountsCard({
  currency,
  value,
  handleChange,
}: EnterAmountsCardProps) {
  const { wallet: account } = useTonConnect();

  const balance = useJettonBalance(currency?.address, account);

  const handleInput = useCallback((value: string) => {
    let _value = value;
    if (value === '.') {
      _value = '0.';
    }
    handleChange(_value);
  }, []);

  function setMax() {
    handleChange(balance || '0');
  }

  return (
    <div className="bg-card-dark flex w-full rounded-2xl p-3">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <JettonLogo jetton={currency} size={35} />
          <span className="text-lg font-bold">
            {currency ? currency.symbol : 'Select a token'}
          </span>
        </div>
        {currency && account && (
          <div className={'flex whitespace-nowrap text-sm'}>
            <div>
              <span className="font-semibold">Balance: </span>
              <span>{balance}</span>
            </div>
            <button
              type={'button'}
              className="ml-2 text-[#63b4ff]"
              onClick={setMax}
            >
              Max
            </button>
          </div>
        )}
      </div>

      <div className="flex w-full flex-col items-end">
        <Input
          value={value}
          id={`amount-${currency?.symbol}`}
          onUserInput={(v) => handleInput(v)}
          className={`w-9/12 border-none p-0 text-right text-xl font-bold`}
          placeholder={'0.0'}
          maxDecimals={currency?.decimals}
        />
        {/* <div className="text-sm">{fiatValue && formatUSD.format(fiatValue)}</div> */}
      </div>
    </div>
  );

  // return (
  //   <div
  //       className="flex flex-col justify-between w-full relative">
  //     <div
  //     className="absolute text-right">
  //       {/* // {`Balance: ${displayNumber(balance)}`} */}
  //       {`Balance: ${balance.toString()}`}
  //     </div>

  //     <div
  //     className="flex items-center justify-between">
  //       <div className="flex items-center p-2">
  //         {/* <EquilibreAvatar
  //           src={asset?.logoURI || ''}
  //           size={'md'}
  //           ml={1}
  //           mr={4}
  //         /> */}
  //         <Input value={value} onChange={v => handleChange(v.target.value)} />
  //         {/* <InputGroup flexDirection={'column'}>
  //           <NumberInput
  //             step={0.1}
  //             colorScheme="white"
  //             variant={'unstyled'}
  //             value={value}
  //             onChange={handleChange}>
  //             <NumberInputField
  //               fontSize={'2xl'}
  //               placeholder="0"
  //               textAlign={'left'}
  //             />
  //           </NumberInput>
  //         </InputGroup> */}
  //       </div>
  //       <Button
  //         onClick={setMax}>
  //         MAX
  //       </Button>
  //     </div>
  //     <div className="mt-4">
  //       {error ? (
  //         <div className="flex flex-col absolute">
  //           {error}
  //         </div>
  //       ) : needApprove ? (
  //         <Button
  //           disabled={!approve || isApprovalLoading}
  //           onClick={() => approve()}>
  //           {isApprovalLoading ? 'Loading...' : `Approve ${currency?.symbol}`}
  //         </Button>
  //       ) : valueForApprove ? (
  //         <div className="absolute">
  //           {/* <CheckIcon /> */}
  //           Approved
  //         </div>
  //       ) : null}
  //     </div>
  //   </div>
  // );
}

export default EnterAmountsCard;

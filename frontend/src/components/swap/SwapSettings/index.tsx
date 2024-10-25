import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'src/components/ui/Popover';
import { useUserState } from 'src/state/userStore';
import { SettingsIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from 'src/components/ui/Button';
import { Percent } from '@toncodex/sdk';
import { Input } from 'src/components/ui/Input';
import { cn } from 'src/lib/cn';

function SlippageTolerance() {
  const {
    slippage,
    actions: { setSlippage },
  } = useUserState();

  const [slippageInput, setSlippageInput] = useState('');
  const [slippageError, setSlippageError] = useState<boolean>(false);

  function parseSlippageInput(value: string) {
    // populate what the user typed and clear the error
    setSlippageInput(value);
    setSlippageError(false);

    if (value.length === 0) {
      setSlippage('auto');
    } else {
      const parsed = Math.floor(Number.parseFloat(value) * 100);

      if (!Number.isInteger(parsed) || parsed < 0 || parsed > 5000) {
        setSlippage('auto');
        if (value !== '.') {
          setSlippageError(true);
        }
      } else {
        setSlippage(new Percent(parsed, 10_000));
      }
    }
  }

  const tooLow = slippage !== 'auto' && slippage.lessThan(new Percent(5, 1000)); // 0.5%
  const tooHigh =
    slippage !== 'auto' && slippage.greaterThan(new Percent(2, 100)); // 2%

  const slippageString = slippage !== 'auto' ? slippage.toFixed(2) : 'auto';

  return (
    <div className="flex flex-col gap-2 max-sm:text-sm">
      <div className="text-md font-semibold">Slippage Tolerance</div>
      <div className="grid grid-cols-4 items-center gap-3">
        <Button
          variant={slippageString === 'auto' ? 'outlineActiveBlue' : 'outline'}
          className="h-10 rounded-lg"
          onClick={() => parseSlippageInput('')}
        >
          Auto
        </Button>
        <Button
          variant={slippageString === '0.50' ? 'outlineActiveBlue' : 'outline'}
          className="h-10 rounded-lg"
          onClick={() => parseSlippageInput('0.5')}
        >
          0.5%
        </Button>
        <Button
          variant={slippageString === '1.00' ? 'outlineActiveBlue' : 'outline'}
          className="h-10 rounded-lg"
          onClick={() => parseSlippageInput('1')}
        >
          1%
        </Button>
        <Button
          variant={slippageString === '2.00' ? 'outlineActiveBlue' : 'outline'}
          className="h-10 rounded-lg"
          onClick={() => parseSlippageInput('2')}
        >
          2%
        </Button>

        <div className="col-span-4 flex w-full">
          <Input
            value={
              slippageInput.length > 0
                ? slippageInput
                : slippage === 'auto'
                  ? ''
                  : slippage.toFixed(2)
            }
            onChange={(e) => parseSlippageInput(e.target.value)}
            onBlur={() => {
              setSlippageInput('');
              setSlippageError(false);
            }}
            className={`text-md h-12 w-full rounded-l-lg rounded-r-none border-none bg-lighter text-left font-semibold outline-none`}
            placeholder={'0.0'}
          />
          <div className="flex select-none items-center rounded-r-lg bg-lighter px-2 text-sm">
            %
          </div>
        </div>
      </div>
      {slippageError || tooLow || tooHigh ? (
        <div>
          {slippageError ? (
            <div className="rounded-lg bg-red-900 px-2 py-1 text-red-200">
              Enter a valid slippage percentage
            </div>
          ) : (
            <div className="rounded-lg bg-yellow-300 px-2 py-1 text-yellow-800">
              {tooLow
                ? 'Your transaction may fail'
                : 'Your transaction may be frontrun'}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function TransactionDeadline() {
  const {
    txDeadline,
    actions: { setTxDeadline },
  } = useUserState();

  const [deadlineInput, setDeadlineInput] = useState('');
  const [deadlineError, setDeadlineError] = useState<boolean>(false);

  function parseCustomDeadline(value: string) {
    setDeadlineInput(value);
    setDeadlineError(false);

    if (value.length === 0) {
      setTxDeadline(60 * 30);
    } else {
      try {
        const parsed: number = Math.floor(Number.parseFloat(value) * 60);
        if (!Number.isInteger(parsed) || parsed < 60 || parsed > 180 * 60) {
          setDeadlineError(true);
        } else {
          setTxDeadline(parsed);
        }
      } catch (error) {
        setDeadlineError(true);
      }
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="text-md font-semibold">Transaction Deadline</div>
      <div className="flex">
        <Input
          placeholder={'30'}
          value={
            deadlineInput.length > 0
              ? deadlineInput
              : txDeadline === 180
                ? ''
                : (txDeadline / 60).toString()
          }
          onChange={(e) => parseCustomDeadline(e.target.value)}
          onBlur={() => {
            setDeadlineInput('');
            setDeadlineError(false);
          }}
          color={deadlineError ? 'red' : ''}
          className={`text-md h-12 w-full rounded-l-lg rounded-r-none border-none bg-lighter text-left font-semibold outline-none`}
        />
        <div className="flex select-none items-center rounded-r-lg bg-lighter px-2 text-sm">
          minutes
        </div>
      </div>
    </div>
  );
}

function SwapSettings() {
  const { slippage } = useUserState();

  const isWarning =
    slippage !== 'auto' && slippage.greaterThan(new Percent(2, 100)); // 2%

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            'flex w-fit gap-2 px-3',
            isWarning
              ? 'bg-yellow-300 text-yellow-800 hover:bg-yellow-300/80'
              : '',
          )}
          variant={isWarning ? 'ghost' : 'icon'}
          size={'icon'}
        >
          {isWarning && `${slippage.toFixed(0)}% slippage`}
          <SettingsIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align={'end'}
        className="mx-auto flex w-fit flex-col gap-4 rounded-xl border border-lighter bg-light p-4 text-white sm:p-6"
      >
        <div className="text-md font-bold">Transaction Settings</div>
        <hr className="border-lighter" />
        <SlippageTolerance />
        <TransactionDeadline />
        {/* <Multihop /> */}
        {/* <ExpertMode /> */}
      </PopoverContent>
    </Popover>
  );
}

// const ExpertMode = () => {
//     const {
//         isExpertMode,
//         actions: { setIsExpertMode },
//     } = useUserState();

//     return (
//         <div className="flex flex-col gap-2 max-w-[332px]">
//             <div className="flex justify-between items-center gap-2 text-md font-semibold">
//                 <label htmlFor="expert-mode">Expert mode</label>
//                 {/* <Switch id="expert-mode" checked={isExpertMode} onCheckedChange={setIsExpertMode} /> */}
//             </div>
//             <p className="whitespace-break-spaces">Advanced control over swap parameters such as price setting and gas management.</p>
//         </div>
//     );
// };

// const Multihop = () => {
//     const {
//         isMultihop,
//         actions: { setIsMultihop },
//     } = useUserState();

//     return (
//         <div className="flex flex-col gap-2 max-w-[332px]">
//             <div className="flex justify-between items-center gap-2 text-md font-semibold">
//                 <label htmlFor="multihop">Multihop</label>
//                 {/* <Switch id="multihop" checked={isMultihop} onCheckedChange={setIsMultihop} /> */}
//             </div>
//             <p className="whitespace-break-spaces">Optimized trades across multiple liquidity pools.</p>
//         </div>
//     );
// };

export default SwapSettings;

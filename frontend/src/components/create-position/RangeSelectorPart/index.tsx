import { useCallback, useEffect, useState } from 'react';
import { Button } from 'src/components/ui/Button';
import { Input } from 'src/components/ui/Input';
import { Jetton, Price } from '@toncodex/sdk';
import { useMintState } from 'src/state/mintStore';

export interface RangeSelectorPartProps {
  value: string;
  onUserInput: (value: string) => void;
  decrement: () => string;
  increment: () => string;
  decrementDisabled?: boolean;
  incrementDisabled?: boolean;
  label?: string;
  width?: string;
  locked?: boolean;
  initialPrice: Price<Jetton, Jetton> | undefined;
  disabled: boolean;
  title: string;
  isSorted: boolean;
}

function RangeSelectorPart({
  value,
  decrement,
  increment,
  decrementDisabled = false,
  incrementDisabled = false,
  locked,
  onUserInput,
  disabled,
  title,
  isSorted,
}: RangeSelectorPartProps) {
  const [localTokenValue, setLocalTokenValue] = useState('');

  const {
    initialTokenPrice,
    actions: { updateSelectedPreset },
  } = useMintState();

  const handleOnBlur = useCallback(() => {
    if (isSorted) {
      onUserInput(localTokenValue);
    } else {
      onUserInput(
        (Number(localTokenValue) / Number(localTokenValue) ** 2).toString(),
      );
    }
  }, [localTokenValue, onUserInput]);

  const handleDecrement = useCallback(() => {
    onUserInput(decrement());
  }, [decrement, onUserInput]);

  const handleIncrement = useCallback(() => {
    onUserInput(increment());
  }, [increment, onUserInput]);

  useEffect(() => {
    if (value) {
      setLocalTokenValue(value);
    } else if (value === '') {
      setLocalTokenValue('');
    }
  }, [initialTokenPrice, value]);

  useEffect(() => () => updateSelectedPreset(null), []);

  return (
    <div className="w-full sm:w-fit">
      <div className="mb-3 text-xs font-bold">{title.toUpperCase()}</div>
      <div className="relative flex">
        <Button
          variant={'ghost'}
          onClick={handleDecrement}
          disabled={decrementDisabled || disabled}
          className="h-12 rounded-xl rounded-r-none border border-border-light bg-lighter/50 hover:bg-lighter/20"
        >
          -
        </Button>

        <Input
          type={'text'}
          value={localTokenValue}
          id={title}
          onBlur={handleOnBlur}
          disabled={disabled || locked}
          onUserInput={(v) => {
            setLocalTokenValue(v);
            updateSelectedPreset(null);
          }}
          placeholder={'0.00'}
          className="h-12 w-full rounded-none border-x-0 border-y border-border-light bg-lighter text-center outline-none"
        />

        <Button
          variant={'ghost'}
          onClick={handleIncrement}
          disabled={incrementDisabled || disabled}
          className="h-12 rounded-xl rounded-l-none border border-border-light bg-lighter/50 hover:bg-lighter/20"
        >
          +
        </Button>
      </div>
    </div>
  );
}

export default RangeSelectorPart;

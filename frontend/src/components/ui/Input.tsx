import * as React from 'react';
import { cn } from 'src/lib/cn';

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`);
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onUserInput?: (value: string) => void;
  maxDecimals?: number;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onUserInput, maxDecimals = 18, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'placeholder:text-muted-foreground flex bg-dark px-3 py-2 file:border-0 file:bg-transparent file:font-medium',
        className,
      )}
      ref={ref}
      onChange={(e) => {
        let value = e.target.value.replace(/,/g, '.');
        value =
          value.indexOf('.') >= 0
            ? value.slice(0, value.indexOf('.') + maxDecimals + 1)
            : value;
        if (
          value === '' ||
          inputRegex.test(value.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        ) {
          onUserInput && onUserInput(value);
        }
      }}
      inputMode={'decimal'}
      pattern="^[0-9]*[.,]?[0-9]*$"
      minLength={1}
      maxLength={100}
      spellCheck="false"
      autoComplete="off"
      autoCorrect="off"
      {...props}
    />
  ),
);
Input.displayName = 'Input';

export { Input };

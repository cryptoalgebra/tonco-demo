import React, { ButtonHTMLAttributes } from 'react';
import { cn } from 'src/lib/cn';

export const ActionButton: React.FC<ActionButtonProps> = React.memo(
  ({ color = 'green', children, className, ...props }) => {
    const defaultStyles =
      'w-full flex items-center justify-center h-[84px] rounded-xl cursor-pointer font-bold text-xl sm:text-2xl  duration-200 disabled:cursor-not-allowed disabled:opacity-50';

    const colorStyles = {
      green: `bg-primary-green/80 hover:bg-primary-green/60 disabled:bg-primary-green/80`,
      red: `bg-primary-red hover:bg-primary-red/80 disabled:bg-primary-red/80`,
      blue: `bg-primary-blue hover:bg-primary-blue/80 disabled:bg-primary-blue/80`,
    };

    return (
      <button
        {...props}
        className={cn(defaultStyles, colorStyles[color], className)}
      >
        {children}
      </button>
    );
  },
);

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  color?: 'blue' | 'red' | 'green';
  children: React.ReactNode;
}

import React from 'react';
import SwitchBtn from 'src/assets/switch-btn.svg';
import { cn } from 'src/lib/cn';

export const SwitchButton: React.FC<SwitchButtonProps> = React.memo(
  ({ className, onClick }) => {
    const defaultStyles =
      'border rounded-full bg-dark hover:bg-light border-border-light w-fit h-fit p-1.5 transition-all ease-in-out duration-300';

    return (
      <button onClick={onClick} className={cn(defaultStyles, className)}>
        <img width={22} src={SwitchBtn} />
      </button>
    );
  },
);

interface SwitchButtonProps {
  className?: string;
  onClick: (e: React.MouseEvent) => void;
}

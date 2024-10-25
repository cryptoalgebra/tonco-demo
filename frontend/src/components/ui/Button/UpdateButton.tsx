import React from 'react';
import UpdateBtn from 'src/assets/update-btn.svg';
import { cn } from 'src/lib/cn';

export const UpdateButton: React.FC<UpdateButtonProps> = React.memo(
  ({ onClick, className, ...props }) => (
    <button className={cn(className)} onClick={onClick} {...props}>
      <img src={UpdateBtn} />
    </button>
  ),
);

interface UpdateButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  className?: string;
}

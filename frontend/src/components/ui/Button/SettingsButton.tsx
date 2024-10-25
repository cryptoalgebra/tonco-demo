import { SettingsIcon } from 'lucide-react';
import React from 'react';
import { cn } from 'src/lib/cn';

export const SettingsButton: React.FC<SettingsButtonProps> = React.memo(
  ({ onClick, className }) => (
    <button className={cn(className)} onClick={onClick}>
      <SettingsIcon />
    </button>
  ),
);

interface SettingsButtonProps {
  className?: string;
  onClick: () => void;
}

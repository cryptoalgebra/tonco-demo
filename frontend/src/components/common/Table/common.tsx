import { ChevronDownIcon } from 'lucide-react';
import { cn } from 'src/lib/cn';

interface HeaderItemProps {
  children: React.ReactNode;
  className?: string;
  sort?: () => void;
  isAsc?: boolean;
}

export function HeaderItem({
  children,
  className,
  sort,
  isAsc,
}: HeaderItemProps) {
  return (
    <div>
      <span
        role={'button'}
        tabIndex={0}
        onClick={() => sort && sort()}
        onKeyDown={() => sort && sort()}
        className={cn(
          '-ml-2 inline-flex select-none items-center gap-2 rounded-xl px-2 py-1 duration-300',
          className,
          sort && 'hover:bg-card-hover cursor-pointer',
        )}
      >
        {children}
        {sort && (
          <ChevronDownIcon
            size={16}
            className={`${isAsc ? 'rotate-180' : 'rotate-0'} duration-300`}
          />
        )}
      </span>
    </div>
  );
}

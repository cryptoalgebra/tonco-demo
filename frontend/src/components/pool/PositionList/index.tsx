import { ExtendedPosition } from 'src/hooks/position/useAllPositions';
import { PositionCard } from '../PositionCard';

export function PositionList({ positions }: { positions: ExtendedPosition[] }) {
  return (
    <div className="grid w-full animate-fade-in gap-4 max-md:grid-cols-3 max-sm:grid-cols-2 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {positions.map((position) => (
        <PositionCard key={position.tokenId} position={position} />
      ))}
    </div>
  );
}

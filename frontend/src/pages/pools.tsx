import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import PoolsList from 'src/components/pools/PoolsList';
import { Button } from 'src/components/ui/Button';

function PoolsPage() {
  return (
    <div className="flex w-full animate-fade-in flex-col gap-6 py-6 max-md:pb-24 sm:py-12">
      <div className="flex items-center justify-between">
        <h2 className="mr-auto text-3xl">Pools</h2>
        <Link className="sm:hidden" to="/swap">
          <Button className="flex h-6 gap-2 rounded-xl" variant={'outline'}>
            <ArrowLeft size={12} />
            Back
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border border-border-light bg-light p-2 pb-5 sm:p-6 sm:pb-2">
        <PoolsList />
      </div>
    </div>
  );
}

export default PoolsPage;

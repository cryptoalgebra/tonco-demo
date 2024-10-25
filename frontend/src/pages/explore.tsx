import { ReactNode, useEffect, useRef } from 'react';
import { matchPath, NavLink, useLocation } from 'react-router-dom';
import DexCharts from 'src/components/explore/DexCharts';

const PATHS = {
  BASE: '/explore',
  JETTONS: '/explore/jettons',
  POOLS: '/explore/pools',
  TRANSACTIONS: '/explore/transactions',
};

const tabs = [
  {
    title: 'Pools',
    link: '/explore/pools',
    active: [PATHS.POOLS, PATHS.BASE],
  },
  {
    title: 'Jettons',
    link: '/explore/jettons',
    active: [PATHS.JETTONS],
  },
  {
    title: 'Transactions',
    link: '/explore/transactions',
    active: [PATHS.TRANSACTIONS],
  },
];

export function Navigation() {
  const { pathname } = useLocation();

  const setNavlinkClasses = (paths: string[]) =>
    paths.some((path) => matchPath(path, pathname))
      ? 'text-primary-green'
      : 'hover:text-primary-green';

  return (
    <nav className="w-full border-b border-y-border-light pb-4 text-xl">
      <ul className="flex gap-8 whitespace-nowrap">
        {tabs.map((tab) => (
          <NavLink
            key={`explore-nav-item-${tab.link}`}
            to={tab.link}
            className={`${setNavlinkClasses(
              tab.active,
            )} select-none font-semibold duration-200`}
          >
            {tab.title}
          </NavLink>
        ))}
      </ul>
    </nav>
  );
}

function ExplorePage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      if (ref.current) {
        ref.current.scrollIntoView();
      }
    }
  }, [hash]);

  return (
    <div className="items-left flex flex-col gap-8 py-6 text-left max-md:pb-24 sm:py-12">
      <DexCharts />
      <Navigation />
      <div
        ref={ref}
        className="rounded-xl border border-border-light bg-light p-2 pb-5 sm:p-6 sm:pb-2"
        id="list"
      >
        {children}
      </div>
    </div>
  );
}

export default ExplorePage;

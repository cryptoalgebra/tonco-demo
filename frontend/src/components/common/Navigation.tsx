import { ArrowUpDown, Droplets, LucideLineChart } from 'lucide-react';
import { NavLink, matchPath, useLocation } from 'react-router-dom';

const PATHS = {
  SWAP: '/swap',
  POOLS: '/pools',
  EXPLORE: '/explore',
};

const menuItems = [
  {
    title: 'Swap',
    link: '/swap',
    active: [PATHS.SWAP],
    icon: <ArrowUpDown size={20} />,
  },
  {
    title: 'Pools',
    link: '/pools',
    active: [PATHS.POOLS],
    icon: <Droplets size={20} />,
  },
  {
    title: 'Explore',
    link: '/explore',
    active: [PATHS.EXPLORE],
    icon: <LucideLineChart size={20} />,
  },
];

function Navigation() {
  const { pathname } = useLocation();

  const setNavlinkClasses = (paths: string[]) =>
    paths.some((path) => matchPath(path, pathname))
      ? 'bg-primary-red'
      : 'hover:bg-primary-red/50';

  return (
    <nav className="w-1/3 max-md:hidden">
      <ul className="flex justify-center gap-4 whitespace-nowrap">
        {menuItems.map((item) => (
          <NavLink
            key={`nav-item-${item.link}`}
            to={item.link}
            className={`${setNavlinkClasses(item.active)} select-none rounded-lg px-4 py-2 font-semibold duration-200`}
          >
            {item.title}
          </NavLink>
        ))}
      </ul>
    </nav>
  );
}

export function MobileNavigation() {
  const { pathname } = useLocation();

  const setNavlinkClasses = (paths: string[]) =>
    paths.some((path) => matchPath(path, pathname)) ? 'text-pink-500' : '';

  return (
    <nav className="fixed -bottom-[1px] left-0 z-50 flex w-full items-center justify-center gap-2 border-t border-border-light bg-dark p-3 md:hidden">
      <ul className="flex w-full justify-evenly whitespace-nowrap">
        {menuItems.map((item) => (
          <NavLink
            key={`nav-item-${item.link}`}
            to={item.link}
            className={`${setNavlinkClasses(item.active)} flex h-full w-12 flex-col items-center gap-2 text-xs`}
          >
            {item.icon}
            {item.title}
          </NavLink>
        ))}
      </ul>
    </nav>
  );
}

export default Navigation;

import { Toaster } from '../ui/toaster';
import Header from './Header';
import { MobileNavigation } from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-full w-full flex-col">
      <Header />
      <main className="h-full">{children}</main>
      <MobileNavigation />
      <Toaster />
    </div>
  );
}

export default Layout;

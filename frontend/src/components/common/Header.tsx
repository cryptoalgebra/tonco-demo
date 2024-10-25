import { CHAIN, TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react';
import { useTonConnect } from 'src/hooks/common/useTonConnect';
import { Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Address } from '@ton/core';
import { truncateHash } from 'src/utils/common/truncateHash';
import { APP_CHAIN } from 'src/constants/chain';
import { Button } from '../ui/Button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/Popover';
import Navigation from './Navigation';

function TONCO() {
  return (
    <div className="flex w-1/3 items-center max-md:w-full">
      <Link to={'/'}>
        <div className="bg-card flex items-center gap-4 rounded-xl px-4 py-1 text-xl">
          <img width={32} src="/tonco-logo.png" alt={'TONCO logo'} />
          <p className="">TONCO</p>
        </div>
      </Link>
      {APP_CHAIN === CHAIN.TESTNET ? (
        <div className="w-fit rounded-full border-0 border-lighter bg-yellow-300 px-3 py-1 text-yellow-900 max-md:text-sm">
          Testnet
        </div>
      ) : (
        <div className="w-fit rounded-full border-0 border-lighter bg-green-400 px-3 py-1 text-green-900 max-md:text-sm">
          Mainnet
        </div>
      )}
    </div>
  );
}

function Account() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { wallet, connected } = useTonConnect();
  const [tonConnectUI] = useTonConnectUI();

  return (
    <div className="flex w-1/3 items-center justify-end gap-4 whitespace-nowrap">
      <TonConnectButton className="max-md:hidden" />
      <Popover
        open={isPopoverOpen}
        onOpenChange={() => {
          if (!connected) return;
          setIsPopoverOpen(!isPopoverOpen);
        }}
      >
        <PopoverTrigger className="relative">
          <Wallet
            onClick={() =>
              connected ? setIsPopoverOpen(true) : tonConnectUI.openModal()
            }
            size={32}
            className="h-10 w-10 cursor-pointer rounded-xl p-2 hover:bg-border-light md:hidden"
          />
        </PopoverTrigger>
        {wallet ? (
          <PopoverContent
            align="end"
            className="flex w-fit flex-col items-center gap-1 rounded-xl p-2"
          >
            <p className="text-sm opacity-50">
              {tonConnectUI.wallet?.device.appName}
            </p>
            <p>
              {truncateHash(
                Address.parseRaw(wallet).toString({ bounceable: false }),
              )}
            </p>
            <Button
              onClick={() => {
                setIsPopoverOpen(false);
                tonConnectUI.disconnect();
              }}
              variant={'outline'}
              className="w-full rounded-xl bg-lighter py-2 hover:opacity-80"
            >
              Disconnect
            </Button>
          </PopoverContent>
        ) : null}
      </Popover>
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-2 border-b border-border-light bg-dark py-4 max-md:relative max-md:justify-center xs:p-4">
      <TONCO />
      <Navigation />
      <Account />
    </header>
  );
}

export default Header;

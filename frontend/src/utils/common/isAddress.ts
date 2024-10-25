import { validateAndParseAddress } from '@toncodex/sdk';

export function isAddress(address: string): boolean {
  let isaddress = false;

  try {
    isaddress = Boolean(validateAndParseAddress(address));
  } catch (e) {
    isaddress = false;
  }

  return isaddress;
}

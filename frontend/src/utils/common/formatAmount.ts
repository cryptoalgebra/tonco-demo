import { formatCurrency } from './formatCurrency';

export function formatAmount(amount: string | number, decimals = 3): string {
  const amountNum = Number(amount);
  const minAmount = 1 / 10 ** decimals;

  if (amountNum === 0) return '0';
  if (amountNum < minAmount) return `< ${minAmount}`;
  if (amountNum < 1)
    return Number(
      (Math.floor(amountNum / minAmount) * minAmount).toFixed(decimals),
    ).toString();
  if (amountNum < 10000) return (Math.floor(amountNum * 100) / 100).toString();
  if (amountNum < 100000) return Math.floor(amountNum).toString();

  if (amountNum < 1 * 10 ** 18)
    return formatCurrency.format(Math.floor(amountNum * 100) / 100);

  return '∞';
}

export function reverseFormatAmount(formattedNumber: string): number {
  const suffixes: { [key: string]: number } = {
    K: 1e3,
    M: 1e6,
    B: 1e9,
    T: 1e12,
  };

  const suffix = formattedNumber.slice(-1);
  const value = parseFloat(formattedNumber.slice(0, -1));

  if (formattedNumber.startsWith('< ') || formattedNumber.startsWith('> ')) {
    const floatValue = parseFloat(formattedNumber.slice(2));
    return floatValue > 0 ? floatValue : 0;
  }

  if (suffixes[suffix]) {
    return value * suffixes[suffix];
  }
  return parseFloat(formattedNumber);
}

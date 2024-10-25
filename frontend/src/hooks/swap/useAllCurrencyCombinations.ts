import { useMemo } from 'react';
import { jettons } from 'src/constants/jettons';
import { Jetton } from '@toncodex/sdk';

export function useAllCurrencyCombinations(
  currencyA?: Jetton,
  currencyB?: Jetton,
): [Jetton, Jetton][] {
  const [tokenA, tokenB] = [currencyA, currencyB];

  const bases: Jetton[] = useMemo(() => [jettons.ALG_USD, jettons.ALG_ETH], []);

  const basePairs: [Jetton, Jetton][] = useMemo(
    () =>
      bases
        .flatMap((base): [Jetton, Jetton][] =>
          bases.map((otherBase) => [base, otherBase]),
        )
        .filter(([t0, t1]) => !t0.equals(t1)),
    [bases],
  );

  return useMemo(
    () =>
      tokenA && tokenB
        ? [
            [tokenA, tokenB] as [Jetton, Jetton],
            ...bases.map((base): [Jetton, Jetton] => [tokenA, base]),
            ...bases.map((base): [Jetton, Jetton] => [tokenB, base]),
            ...basePairs,
          ]
            .filter(([t0, t1]) => !t0.equals(t1))
            .filter(([t0, t1], i, otherPairs) => {
              const firstIndexInOtherPairs = otherPairs.findIndex(
                ([t0Other, t1Other]) =>
                  (t0.equals(t0Other) && t1.equals(t1Other)) ||
                  (t0.equals(t1Other) && t1.equals(t0Other)),
              );
              return firstIndexInOtherPairs === i;
            })
        : [],
    [tokenA, tokenB, bases, basePairs],
  );
}

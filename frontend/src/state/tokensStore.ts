import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import deepMerge from 'lodash.merge';
import { jettons, Jettons } from 'src/constants/jettons';
import { Jetton } from '@toncodex/sdk';

interface TokensState {
  importedTokens: Jettons;
  actions: {
    importToken: (jetton: Jetton) => void;
  };
}

export const useTokensState = create(
  persist<TokensState>(
    (set, get) => ({
      importedTokens: jettons,
      actions: {
        importToken: (jetton) => {
          const { importedTokens } = get();
          set({
            importedTokens: {
              ...importedTokens,
              [jetton.symbol]: jetton,
            },
          });
        },
      },
    }),
    {
      name: 'tokens-storage',
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState, currentState) =>
        deepMerge(currentState, persistedState),
    },
  ),
);

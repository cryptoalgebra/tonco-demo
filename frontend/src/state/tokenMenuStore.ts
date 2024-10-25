import { create } from 'zustand';
import { MenuState } from '../types/token-menu';

export type TokenMenuState = {
  menuState: MenuState;
  actions: {
    setMenuState: (menuState: MenuState) => void;
  };
};

export const useTokenMenuState = create<TokenMenuState>((set) => ({
  menuState: MenuState.CLOSED,
  actions: {
    setMenuState: (menuState: MenuState) => {
      set({ menuState });
    },
  },
}));

import { create } from 'zustand';

interface ResourceState {
  gold: number;
  elixir: number;
  darkElixir: number;
  addResources: (gold: number, elixir: number, darkElixir: number) => void;
  resetResources: () => void;
}

export const useResourceStore = create<ResourceState>((set) => ({
  gold: 0,
  elixir: 0,
  darkElixir: 0,
  addResources: (gold, elixir, darkElixir) => set((state) => ({
    gold: state.gold + gold,
    elixir: state.elixir + elixir,
    darkElixir: state.darkElixir + darkElixir,
  })),
  resetResources: () => set({ gold: 0, elixir: 0, darkElixir: 0 }),
}));

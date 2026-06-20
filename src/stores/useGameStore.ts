import { create } from 'zustand';

interface GameState {
  fen: string;
  isGameOver: boolean;
  result: 'white' | 'black' | 'draw' | null;
  setFen: (fen: string) => void;
  setGameOver: (value: boolean) => void;
  setResult: (value: 'white' | 'black' | 'draw' | null) => void;
}

export const useGameStore = create<GameState>((set) => ({
  fen: 'start',
  isGameOver: false,
  result: null,
  setFen: (fen) => set({ fen }),
  setGameOver: (isGameOver) => set({ isGameOver }),
  setResult: (result) => set({ result }),
}));

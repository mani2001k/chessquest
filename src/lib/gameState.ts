import type { Piece } from '../types';
import { RESOURCE_REWARDS, XP_GAINS, getLevelForXp } from './chessLogic';

export interface MatchLoot extends Record<string, number> {
  gold: number;
  elixir: number;
  dark_elixir: number;
}

export function calculateLoot(pieceType: Piece['type']): MatchLoot {
  const reward = RESOURCE_REWARDS[pieceType];
  return {
    gold: reward.gold,
    elixir: reward.elixir,
    dark_elixir: reward.dark_elixir,
  };
}

export function getXpForCapture(pieceType: Piece['type']) {
  return XP_GAINS.capture + (pieceType === 'queen' ? 1 : 0);
}

export function getWinXp() {
  return XP_GAINS.win;
}

export function pieceSymbolToType(symbol: string): Piece['type'] {
  switch (symbol.toLowerCase()) {
    case 'p':
      return 'pawn';
    case 'n':
      return 'knight';
    case 'b':
      return 'bishop';
    case 'r':
      return 'rook';
    case 'q':
      return 'queen';
    case 'k':
      return 'king';
    default:
      return 'pawn';
  }
}

export function awardXp(piece: Piece, xpGain: number) {
  const nextXp = piece.xp + xpGain;
  const nextLevel = Math.min(10, getLevelForXp(nextXp));
  return {
    ...piece,
    xp: nextXp,
    level: Math.max(piece.level, nextLevel),
  };
}

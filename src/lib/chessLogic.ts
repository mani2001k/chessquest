import { Chess, type Square } from 'chess.js';
import type { BuildingType, PieceType } from '../types';

export const XP_THRESHOLDS: Record<number, number> = {
  1: 0,
  2: 100,
  3: 250,
  4: 500,
  5: 800,
  6: 1200,
  7: 1700,
  8: 2300,
  9: 3000,
  10: 4000,
};

export const XP_GAINS = {
  capture: 2,
  survive: 1,
  win: 10,
  mvp: 5,
};

export const RESOURCE_REWARDS: Record<PieceType, { gold: number; elixir: number; dark_elixir: number }> = {
  pawn: { gold: 2, elixir: 0, dark_elixir: 0 },
  knight: { gold: 0, elixir: 3, dark_elixir: 0 },
  bishop: { gold: 0, elixir: 4, dark_elixir: 0 },
  rook: { gold: 0, elixir: 0, dark_elixir: 4 },
  queen: { gold: 0, elixir: 0, dark_elixir: 6 },
  king: { gold: 1, elixir: 1, dark_elixir: 1 },
};

export function createChessInstance() {
  return new Chess();
}

export function isValidMove(fen: string, from: string, to: string) {
  const chess = new Chess(fen);
  const moves = chess.moves({ square: from as Square, verbose: true }) as Array<{ to: string }>;
  return moves.some((move) => move.to === (to as Square));
}

export function getPieceLevelBadge(level: number) {
  if (level >= 8) return 'S';
  if (level >= 5) return 'A';
  if (level >= 3) return 'B';
  return 'C';
}

export function chooseAIMove(chess: Chess) {
  const moves = chess.moves({ verbose: true }) as Array<{ from: string; to: string; flags: string }>;
  if (!moves.length) return null;
  const captureMoves = moves.filter((move) => move.flags.includes('c') || move.flags.includes('e'));
  return captureMoves.length ? captureMoves[Math.floor(Math.random() * captureMoves.length)] : moves[Math.floor(Math.random() * moves.length)];
}

export function calculateXp(level: number, xpGain: number) {
  return Math.min(4000, level * 50 + xpGain);
}

export const BUILDING_UPGRADE_COSTS: Record<BuildingType, (level: number) => { gold: number; elixir: number }> = {
  barracks: (level) => ({ gold: 100 + level * 50, elixir: 50 + level * 25 }),
  army_camp: (level) => ({ gold: 120 + level * 60, elixir: 40 + level * 20 }),
  spell_factory: (level) => ({ gold: 140 + level * 70, elixir: 80 + level * 30 }),
  storage: (level) => ({ gold: 200 + level * 80, elixir: 20 + level * 15 }),
};

export function buildingUpgradeCost(building: BuildingType, level: number) {
  return BUILDING_UPGRADE_COSTS[building](level);
}

export function buildingCapacity(level: number) {
  return 5 + level * 2;
}

export function storageMultiplier(level: number) {
  return 1 + level * 0.25;
}

export function getLevelForXp(totalXp: number) {
  const levels = Object.entries(XP_THRESHOLDS).map(([level, threshold]) => ({ level: Number(level), threshold }));
  return levels.reduce((current, next) => (totalXp >= next.threshold ? next : current), levels[0]).level;
}

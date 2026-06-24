export type BuildingType = 'town_hall' | 'gold_mine' | 'elixir_collector' | 'dark_elixir_tank';
export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';

export interface Player {
  id: string;
  username: string;
  email?: string;
  gold: number;
  elixir: number;
  dark_elixir: number;
  total_games: number;
  wins: number;
  created_at?: string;
}

export interface Piece {
  id: string;
  player_id: string;
  type: PieceType;
  level: number;
  created_at?: string;
}

export interface Building {
  id: string;
  player_id: string;
  type: BuildingType;
  level: number;
  created_at?: string;
}

export type Winner = 'white' | 'black' | 'draw';

export interface GameRecord {
  id: string;
  created_at?: string;
  white_player_id: string;
  black_player_id: string | null;
  winner: Winner;
  moves: unknown[];
  loot_earned: Record<string, unknown>;
  xp_awarded: Record<string, unknown>;
  game_state: Record<string, unknown>;
}

export interface WebhookPayload {
  gameId: string;
  winner: Winner;
  whitePlayerId: string;
  blackPlayerId?: string | null;
  moves: unknown[];
  lootEarned: Record<string, unknown>;
  xpAwarded: Record<string, unknown>;
}


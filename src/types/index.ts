export type PieceType = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';

export type BuildingType = 'barracks' | 'army_camp' | 'spell_factory' | 'storage';

export interface Player {
  id: string;
  username: string;
  gold: number;
  elixir: number;
  dark_elixir: number;
  trophies: number;
  total_games: number;
  wins: number;
  created_at: string;
}

export interface Piece {
  id: string;
  player_id: string;
  name: string;
  type: PieceType;
  class: string;
  level: number;
  xp: number;
  total_captures: number;
  games_survived: number;
  active: boolean;
  created_at: string;
}

export interface GameRecord {
  id: string;
  white_player_id: string;
  black_player_id: string | null;
  winner: 'white' | 'black' | 'draw';
  moves: unknown[];
  loot_earned: Record<string, number>;
  xp_awarded: Record<string, unknown>;
  game_state: Record<string, unknown>;
  created_at: string;
}

export interface WebhookPayload {
  gameId: string;
  whitePlayerId: string;
  blackPlayerId: string | null;
  winner: 'white' | 'black' | 'draw';
  result: 'win' | 'loss' | 'draw';
  moves: unknown[];
  lootEarned: Record<string, number>;
  xpAwarded: Record<string, unknown>;
  finalScores: {
    gold: number;
    elixir: number;
    dark_elixir: number;
    total_games: number;
    wins: number;
  };
  timestamp: string;
}

export interface Building {
  id: string;
  player_id: string;
  type: BuildingType;
  level: number;
  created_at: string;
}

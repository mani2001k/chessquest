import { supabase } from './supabase';
import type { GameRecord, Player, Piece, Building, WebhookPayload } from '../types';

export async function getCurrentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data?.user?.id ?? null;
}

export async function getPlayerProfile(playerId?: string): Promise<Player | null> {
  const id = playerId ?? (await getCurrentUserId());
  if (!id) return null;
  const { data, error } = await supabase.from('players').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return (data as Player) ?? null;
}

export async function getPiecesForPlayer(playerId?: string): Promise<Piece[]> {
  const id = playerId ?? (await getCurrentUserId());
  if (!id) return [];
  const { data, error } = await supabase.from('pieces').select('*').eq('player_id', id).order('created_at', { ascending: true });
  if (error) throw error;
  return (data as Piece[]) ?? [];
}

export async function getGamesForPlayer(playerId?: string): Promise<GameRecord[]> {
  const id = playerId ?? (await getCurrentUserId());
  if (!id) return [];
  const { data, error } = await supabase.from('games').select('*').or(`white_player_id.eq.${id},black_player_id.eq.${id}`).order('created_at', { ascending: false });
  if (error) throw error;
  return (data as GameRecord[]) ?? [];
}

export async function createPiece(payload: Partial<Piece>): Promise<Piece> {
  const id = await getCurrentUserId();
  if (!id) throw new Error('Not authenticated');
  const insert = { ...payload, player_id: id } as any;
  const { data, error } = await supabase.from('pieces').insert(insert).select().single();
  if (error) throw error;
  return data as Piece;
}

export async function updatePiece(id: string, updates: Partial<Piece>): Promise<Piece> {
  const { data, error } = await supabase.from('pieces').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data as Piece;
}

export async function createGameRecord(game: Omit<Partial<GameRecord>, 'id' | 'created_at'> & {
  white_player_id: string;
  black_player_id: string | null;
  winner: 'white' | 'black' | 'draw';
  moves: unknown[];
  loot_earned: Record<string, unknown>;
  xp_awarded: Record<string, unknown>;
  game_state: Record<string, unknown>;
}): Promise<GameRecord> {
  const { data, error } = await supabase.from('games').insert(game).select().single();
  if (error) {
    console.error('createGameRecord failed', { error, game });
    throw error;
  }
  return data as GameRecord;
}

export async function sendN8nWebhook(payload: WebhookPayload): Promise<void> {
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL as string | undefined;
  if (!webhookUrl) return;

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Webhook request failed: ${response.status} ${response.statusText} ${text}`);
  }
}

export async function updatePlayerResources(updates: Partial<Pick<Player, 'gold' | 'elixir' | 'dark_elixir' | 'total_games' | 'wins'>>): Promise<Player> {
  const id = await getCurrentUserId();
  if (!id) throw new Error('Not authenticated');

  const { data, error } = await supabase.from('players').update(updates).eq('id', id).select().single();
  if (error) throw error;

  return data as Player;
}

export async function getBuildingsForPlayer(playerId?: string): Promise<Building[]> {
  const id = playerId ?? (await getCurrentUserId());
  if (!id) return [];
  const { data, error } = await supabase.from('buildings').select('*').eq('player_id', id).order('created_at', { ascending: true });
  if (error) throw error;
  return (data as Building[]) ?? [];
}

export async function updateBuildingLevel(buildingId: string, level: number): Promise<Building> {
  const { data, error } = await supabase.from('buildings').update({ level }).eq('id', buildingId).select().single();
  if (error) throw error;
  return data as Building;
}

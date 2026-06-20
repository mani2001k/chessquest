import { useQuery } from '@tanstack/react-query';
import { getPlayerProfile } from '../lib/api';
import type { Player } from '../types';

export function usePlayer() {
  return useQuery<Player | null>({ queryKey: ['player'], queryFn: () => getPlayerProfile(), staleTime: 1000 * 60 * 2 });
}

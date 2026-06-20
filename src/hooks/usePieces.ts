import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPiece, getPiecesForPlayer, updatePiece } from '../lib/api';
import type { Piece } from '../types';

export function usePieces() {
  const qc = useQueryClient();
  const q = useQuery<Piece[]>({ queryKey: ['pieces'], queryFn: () => getPiecesForPlayer(), staleTime: 1000 * 60 });

  const add = useMutation<Piece, Error, Partial<Piece>>({
    mutationFn: (payload: Partial<Piece>) => createPiece(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pieces'] }),
  });

  const save = useMutation<Piece, Error, { id: string; updates: Partial<Piece> }>({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Piece> }) => updatePiece(id, updates),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pieces'] }),
  });

  return { ...q, add, save };
}

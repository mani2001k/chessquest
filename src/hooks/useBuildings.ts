import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getBuildingsForPlayer, updateBuildingLevel } from '../lib/api';
import type { Building } from '../types';

export function useBuildings() {
  const qc = useQueryClient();
  const q = useQuery<Building[]>({ queryKey: ['buildings'], queryFn: () => getBuildingsForPlayer(), staleTime: 1000 * 60 });

  const upgrade = useMutation<Building, Error, { id: string; level: number }>({
    mutationFn: ({ id, level }: { id: string; level: number }) => updateBuildingLevel(id, level),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['buildings'] }),
  });

  return { ...q, upgrade };
}

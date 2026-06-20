import { useMemo, useState } from 'react';
import { usePieces } from '../../hooks/usePieces';
import { useBuildings } from '../../hooks/useBuildings';
import { buildingCapacity, XP_THRESHOLDS } from '../../lib/chessLogic';
import type { Piece } from '../../types';

export function ArmyCamp() {
  const { data: pieces, isLoading, error, add, save } = usePieces();
  const { data: buildings } = useBuildings();
  const [name, setName] = useState('');

  if (isLoading) return <div className="rounded-3xl bg-panel p-4">Loading army...</div>;
  if (error) return <div className="rounded-3xl bg-panel p-4">Error loading army</div>;

  const camp = buildings?.find((building) => building.type === 'army_camp');
  const capacity = buildingCapacity(camp?.level ?? 1);
  const currentCount = pieces?.length ?? 0;
  const atCapacity = currentCount >= capacity;

  return (
    <div className="rounded-3xl border border-white/10 bg-panel p-6 shadow-glow">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Army Camp</h2>
          <p className="mt-2 text-sm text-muted">Train new units and watch your veterans grow stronger.</p>
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!name || atCapacity) return;
            await add.mutateAsync({ name, type: 'pawn' as Piece['type'], class: 'barbarian', level: 1, xp: 0, total_captures: 0, games_survived: 0, active: true });
            setName('');
          }}
          className="flex gap-2"
        >
          <input
            placeholder="New unit name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-2xl border border-white/10 bg-surface px-3 py-2 text-white outline-none focus:border-accent"
          />
          <button
            disabled={atCapacity}
            className="rounded-2xl bg-accent px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Train
          </button>
        </form>
      </div>

      <div className="mt-6 space-y-3">
        <div className="rounded-3xl border border-white/10 bg-surface p-4">
          <p className="text-sm text-muted">Army size: {currentCount}/{capacity}</p>
        </div>
        {(pieces ?? []).map((p: Piece) => {
          const nextThreshold = XP_THRESHOLDS[p.level + 1] ?? Infinity;
          const canPromote = p.level < 10 && p.xp >= nextThreshold;

          return (
            <div key={p.id} className="rounded-2xl bg-surface p-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="mt-1 text-sm text-muted">{p.class} · Level {p.level}</div>
                <div className="mt-2 text-sm text-muted">XP: {p.xp}</div>
                <div className="mt-1 text-sm text-muted">Captures: {p.total_captures}</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button
                  disabled={!canPromote || save.status === 'pending'}
                  onClick={async () => {
                    if (!canPromote) return;
                    await save.mutateAsync({ id: p.id, updates: { level: p.level + 1 } });
                  }}
                  className="rounded-2xl bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {canPromote ? 'Promote' : 'Keep Training'}
                </button>
                <button
                  className="rounded-2xl bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10"
                  onClick={async () => {
                    await add.mutateAsync({ name: `${p.name} Jr`, type: p.type, class: p.class, level: 1, xp: 0, total_captures: 0, games_survived: 0, active: true });
                  }}
                >
                  Clone
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

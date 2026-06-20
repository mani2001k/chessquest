import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getGamesForPlayer } from '../../lib/api';
import type { GameRecord } from '../../types';

function formatOutcome(game: GameRecord, currentUserId: string) {
  if (game.winner === 'draw') return 'Draw';
  const isWhite = game.white_player_id === currentUserId;
  return game.winner === (isWhite ? 'white' : 'black') ? 'Win' : 'Loss';
}

export function BattleHistory() {
  const { data: games = [], isLoading } = useQuery<GameRecord[]>({
    queryKey: ['battleHistory'],
    queryFn: () => getGamesForPlayer(),
    staleTime: 1000 * 60 * 2,
  });

  const rows = useMemo(
    () => games.map((game) => ({
      id: game.id,
      outcome: game.winner === 'draw' ? 'Draw' : `${game.winner.toUpperCase()} victory`,
      loot: `${game.loot_earned.gold} gold, ${game.loot_earned.elixir} elixir, ${game.loot_earned.dark_elixir} dark`,
      createdAt: new Date(game.created_at).toLocaleString(),
    })),
    [games],
  );

  return (
    <section className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="rounded-3xl border border-white/10 bg-panel p-6 shadow-glow">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Battle History</h2>
            <p className="mt-2 text-sm text-muted">Recent completed battles and loot summaries.</p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-surface">
          {isLoading ? (
            <div className="p-6 text-center text-sm text-muted">Loading history...</div>
          ) : rows.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted">No battles recorded yet.</div>
          ) : (
            <div className="grid gap-2 p-4 text-sm text-muted md:grid-cols-[1fr_1fr_1fr_1fr]">
              <div className="font-semibold text-white">Outcome</div>
              <div className="font-semibold text-white">Loot</div>
              <div className="font-semibold text-white">Details</div>
              <div className="font-semibold text-white">When</div>
              {rows.map((row) => (
                <>
                  <div key={`${row.id}-outcome`} className="rounded-2xl bg-panel p-4 text-white">
                    {row.outcome}
                  </div>
                  <div key={`${row.id}-loot`} className="rounded-2xl bg-panel p-4">
                    {row.loot}
                  </div>
                  <div key={`${row.id}-details`} className="rounded-2xl bg-panel p-4">
                    Game {row.id.slice(0, 8)}
                  </div>
                  <div key={`${row.id}-when`} className="rounded-2xl bg-panel p-4">
                    {row.createdAt}
                  </div>
                </>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

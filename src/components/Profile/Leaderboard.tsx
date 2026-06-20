import { useMemo } from 'react';

const leaderboard = [
  { rank: 1, name: 'QueenArcher', trophies: 1495 },
  { rank: 2, name: 'MageMaster', trophies: 1420 },
  { rank: 3, name: 'KnightLord', trophies: 1360 },
];

export function Leaderboard() {
  const leaders = useMemo(() => leaderboard, []);

  return (
    <section className="rounded-3xl border border-white/10 bg-panel p-6 shadow-glow">
      <h2 className="text-xl font-semibold">Leaderboard</h2>
      <div className="mt-6 space-y-3">
        {leaders.map((player) => (
          <div key={player.rank} className="flex items-center justify-between rounded-3xl bg-surface px-4 py-3">
            <span className="font-semibold">#{player.rank} {player.name}</span>
            <span className="text-sm text-muted">{player.trophies}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

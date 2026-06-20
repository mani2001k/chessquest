import { usePlayer } from '../../hooks/usePlayer';

export function PlayerStats() {
  const { data: player, isLoading } = usePlayer();

  if (isLoading) {
    return (
      <section className="rounded-3xl border border-white/10 bg-panel p-6 shadow-glow">
        <h2 className="text-xl font-semibold">Commander Stats</h2>
        <div className="mt-6 text-sm text-muted">Loading player progress...</div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-panel p-6 shadow-glow">
      <h2 className="text-xl font-semibold">Commander Stats</h2>
      <p className="mt-2 text-sm text-muted">{player?.username ?? 'Commander'}, your army is ready.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Stat label="Trophies" value={player?.trophies ?? 0} />
        <Stat label="Wins" value={player?.wins ?? 0} />
        <Stat label="Games" value={player?.total_games ?? 0} />
        <Stat label="Gold" value={player?.gold ?? 0} />
        <Stat label="Elixir" value={player?.elixir ?? 0} />
        <Stat label="Dark Elixir" value={player?.dark_elixir ?? 0} />
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl bg-surface p-4">
      <p className="text-sm uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className="mt-3 text-2xl font-semibold">{value}</p>
    </div>
  );
}

import { useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { buildingCapacity, buildingUpgradeCost, storageMultiplier } from '../../lib/chessLogic';
import { updatePlayerResources } from '../../lib/api';
import { usePlayer } from '../../hooks/usePlayer';
import { useBuildings } from '../../hooks/useBuildings';
import { Building } from '../../types';
import { PlayerStats } from '../Profile/PlayerStats';
import EnhancedVillageMap from './EnhancedVillageMap';
import { Leaderboard } from '../Profile/Leaderboard';
import { ArmyCamp } from './ArmyCamp';
import InteractiveResourceCard from '../UI/InteractiveResourceCard';

const defaultBuildings: Building[] = [
  { id: 'barracks', player_id: 'system', type: 'barracks', level: 1, created_at: new Date().toISOString() },
  { id: 'army_camp', player_id: 'system', type: 'army_camp', level: 1, created_at: new Date().toISOString() },
  { id: 'spell_factory', player_id: 'system', type: 'spell_factory', level: 1, created_at: new Date().toISOString() },
  { id: 'storage', player_id: 'system', type: 'storage', level: 1, created_at: new Date().toISOString() },
];

export function VillageView() {
  const [activeTab, setActiveTab] = useState<'overview' | 'buildings' | 'army'>('overview');
  const navigate = useNavigate();
  const { data: player } = usePlayer();
  const { data: buildings, isLoading: buildingsLoading, upgrade } = useBuildings();
  const updatePlayer = useMutation({
    mutationFn: (updates: Partial<import('../../types').Player>) => updatePlayerResources(updates),
    onSuccess: () => {
      // invalidation can be handled by React Query consumer if needed
    },
  });

  const villageBuildings = buildings ?? defaultBuildings;

  const totalCapacity = useMemo(() => {
    const camp = villageBuildings.find((building) => building.type === 'army_camp');
    return buildingCapacity(camp?.level ?? 1);
  }, [villageBuildings]);

  const totalStorage = useMemo(() => {
    const storage = villageBuildings.find((building) => building.type === 'storage');
    return Math.floor(storageMultiplier(storage?.level ?? 1) * 500);
  }, [villageBuildings]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-surface via-panel to-surface px-4 py-6 text-white">
      <section className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 rounded-3xl border-2 border-cyan-500/30 bg-gradient-to-r from-panel/80 to-panel/60 p-8 shadow-2xl md:flex-row md:items-center md:justify-between backdrop-blur-sm transform hover:scale-102 transition-transform duration-300">
          <div className="animate-slide-up">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-chess-light to-chess-cyan bg-clip-text text-transparent">Chess Quest Village</h1>
            <p className="text-sm text-muted mt-2">Manage your army, upgrade your base, and launch your next battle.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/battle')}
              className="rounded-2xl bg-gradient-to-r from-accent to-red-600 px-6 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:scale-110 hover:shadow-lg shadow-accent/50 transform hover:-translate-y-1"
            >
              ⚔️ Launch Battle
            </button>
            {['overview', 'buildings', 'army'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-widest transition-all duration-300 transform hover:scale-105 ${
                  activeTab === tab
                    ? 'bg-chess-cyan text-panel shadow-lg shadow-cyan-500/50'
                    : 'bg-white/5 text-white hover:bg-white/10 hover:-translate-y-1'
                }`}
              >
                {tab === 'overview' && '📊'}
                {tab === 'buildings' && '🏢'}
                {tab === 'army' && '🪖'}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced village map */}
        <div className="animate-scale-in">
          <EnhancedVillageMap buildings={villageBuildings} />
        </div>

        {/* Resource cards grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 animate-slide-up">
          <InteractiveResourceCard title="Gold" value={player?.gold ?? 0} icon="💰" color="gold" />
          <InteractiveResourceCard title="Elixir" value={player?.elixir ?? 0} icon="⚗️" color="elixir" />
          <InteractiveResourceCard title="Dark Elixir" value={player?.dark_elixir ?? 0} icon="🌑" color="dark" />
          <InteractiveResourceCard title="Army Capacity" value={totalCapacity} icon="🪖" color="cyan" />
          <InteractiveResourceCard title="Storage" value={totalStorage} icon="📦" color="cyan" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">

            {activeTab === 'overview' && (
              <div className="rounded-3xl border border-white/10 bg-panel p-6 shadow-glow">
                <h2 className="text-xl font-semibold">Victory Path</h2>
                <p className="mt-3 text-sm text-muted">Review your latest training data, resource pools, and battle readiness.</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-surface p-5">
                    <h3 className="text-sm uppercase tracking-[0.3em] text-muted">Trophies</h3>
                    <p className="mt-4 text-3xl font-semibold">{player?.trophies ?? 0}</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-surface p-5">
                    <h3 className="text-sm uppercase tracking-[0.3em] text-muted">Wins</h3>
                    <p className="mt-4 text-3xl font-semibold">{player?.wins ?? 0}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'buildings' && (
              <div className="rounded-3xl border border-white/10 bg-panel p-6 shadow-glow">
                <h2 className="text-xl font-semibold">Buildings</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {villageBuildings.map((building) => {
                    const cost = buildingUpgradeCost(building.type, building.level);
                    const hasGold = (player?.gold ?? 0) >= cost.gold;
                    const hasElixir = (player?.elixir ?? 0) >= cost.elixir;
                    const canAfford = hasGold && hasElixir && !buildingsLoading;

                    return (
                      <div key={building.id} className="rounded-3xl border border-white/10 bg-surface p-5">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <h3 className="font-semibold capitalize">{building.type.replace('_', ' ')}</h3>
                            <p className="mt-1 text-sm text-muted">Level {building.level}</p>
                          </div>
                          <button
                            disabled={!canAfford}
                            className="rounded-2xl bg-accent px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={async () => {
                              if (!canAfford || !player) return;
                              await updatePlayer.mutateAsync({
                                gold: player.gold - cost.gold,
                                elixir: player.elixir - cost.elixir,
                              });
                              await upgrade.mutateAsync({ id: building.id, level: building.level + 1 });
                            }}
                          >
                            Upgrade
                          </button>
                        </div>
                        <p className="mt-3 text-sm text-muted">Cost: {cost.gold} gold, {cost.elixir} elixir.</p>
                        <p className="mt-2 text-sm text-muted">Improves your army capacity and training speed.</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'army' && (
              <div className="mt-4">
                <ArmyCamp />
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <PlayerStats />
            <Leaderboard />
          </aside>
        </div>
      </section>
    </main>
  );
}

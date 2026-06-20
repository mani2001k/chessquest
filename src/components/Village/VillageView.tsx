import { useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { buildingCapacity, buildingUpgradeCost, storageMultiplier } from '../../lib/chessLogic';
import { updatePlayerResources } from '../../lib/api';
import { usePlayer } from '../../hooks/usePlayer';
import { useBuildings } from '../../hooks/useBuildings';
import { Building } from '../../types';
import { PlayerStats } from '../Profile/PlayerStats';
import { Leaderboard } from '../Profile/Leaderboard';
import { ArmyCamp } from './ArmyCamp';

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
    <main className="min-h-screen bg-surface px-4 py-6 text-white">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-panel p-6 shadow-glow md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Chess Quest Village</h1>
            <p className="text-sm text-muted">Manage your army, upgrade your base, and launch your next battle.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-2xl bg-white/5 px-4 py-3 text-sm transition hover:bg-white/10" onClick={() => navigate('/battle')}>
              Launch Battle
            </button>
            <button className="rounded-2xl bg-white/5 px-4 py-3 text-sm transition hover:bg-white/10" onClick={() => setActiveTab('overview')}>
              Overview
            </button>
            <button className="rounded-2xl bg-white/5 px-4 py-3 text-sm transition hover:bg-white/10" onClick={() => setActiveTab('buildings')}>
              Buildings
            </button>
            <button className="rounded-2xl bg-white/5 px-4 py-3 text-sm transition hover:bg-white/10" onClick={() => setActiveTab('army')}>
              Army Camp
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-panel p-6 shadow-glow">
              <h2 className="text-xl font-semibold">Village Snapshot</h2>
              <p className="mt-3 text-sm text-muted">Resources and building progress are visible here. Keep your base stocked for the next clash.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-surface p-5">
                  <h3 className="text-sm uppercase tracking-[0.3em] text-muted">Current gold</h3>
                  <p className="mt-4 text-3xl font-semibold">{player?.gold ?? 0}</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-surface p-5">
                  <h3 className="text-sm uppercase tracking-[0.3em] text-muted">Elixir</h3>
                  <p className="mt-4 text-3xl font-semibold">{player?.elixir ?? 0}</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-surface p-5">
                  <h3 className="text-sm uppercase tracking-[0.3em] text-muted">Dark Elixir</h3>
                  <p className="mt-4 text-3xl font-semibold">{player?.dark_elixir ?? 0}</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-surface p-5">
                  <h3 className="text-sm uppercase tracking-[0.3em] text-muted">Army capacity</h3>
                  <p className="mt-4 text-3xl font-semibold">{totalCapacity}</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-surface p-5">
                  <h3 className="text-sm uppercase tracking-[0.3em] text-muted">Storage cap</h3>
                  <p className="mt-4 text-3xl font-semibold">{totalStorage}</p>
                </div>
              </div>
            </div>

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

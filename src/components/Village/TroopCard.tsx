import React from 'react';
import troopSvg from '../../assets/troop.svg';

export function TroopCard({ name, count }: { name: string; count: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-surface p-4 flex items-center gap-3">
      <img src={troopSvg} alt={name} className="w-12 h-12" />
      <div>
        <div className="font-semibold">{name}</div>
        <div className="text-sm text-muted">{count} trained</div>
      </div>
    </div>
  );
}

export default TroopCard;

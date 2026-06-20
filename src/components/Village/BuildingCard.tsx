import React from 'react';
import buildingSvg from '../../assets/building.svg';
import type { Building } from '../../types';

export function BuildingCard({ building }: { building: Building }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-surface p-4 text-center">
      <img src={buildingSvg} alt={building.type} className="mx-auto w-14 h-14" />
      <h4 className="mt-3 font-semibold capitalize">{building.type.replace('_', ' ')}</h4>
      <p className="text-sm text-muted">Level {building.level}</p>
    </div>
  );
}

export default BuildingCard;

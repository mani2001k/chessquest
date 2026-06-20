import React from 'react';
import buildingSvg from '../../assets/building.svg';
import troopSvg from '../../assets/troop.svg';
import bgSvg from '../../assets/village-bg.svg';
import type { Building } from '../../types';

type Props = { buildings: Building[] };

export function ClashVillage({ buildings }: Props) {
  // Simple layout mapping - positions are illustrative
  const positions = [
    { left: '10%', top: '40%' },
    { left: '28%', top: '30%' },
    { left: '46%', top: '44%' },
    { left: '64%', top: '28%' },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/6 bg-gradient-to-b from-surface to-panel p-0">
      <div className="pointer-events-none opacity-60">
        <img src={bgSvg} alt="village background" className="w-full h-56 object-cover" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full max-w-4xl h-56">
          {buildings.slice(0, 4).map((b, i) => (
            <div
              key={b.id}
              style={{ left: positions[i]?.left ?? '10%', top: positions[i]?.top ?? '40%' }}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
            >
              <img src={buildingSvg} alt={b.type} className="w-16 h-16 drop-shadow-lg" />
              <div className="mt-2 text-sm font-semibold">{b.type.replace('_', ' ')}</div>
              <div className="text-xs text-muted">Lv {b.level}</div>
            </div>
          ))}

          <div className="absolute right-6 bottom-4 flex gap-3">
            <img src={troopSvg} alt="troop" className="w-10 h-10 animate-bounce" />
            <img src={troopSvg} alt="troop" className="w-10 h-10 animate-bounce delay-150" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClashVillage;

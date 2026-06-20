import React from 'react';
import type { Building } from '../../types';

interface EnhancedVillageProps {
  buildings: Building[];
}

export function EnhancedVillageMap({ buildings }: EnhancedVillageProps) {
  const cloudinaryAssets = {
    bg: 'https://res.cloudinary.com/da52innak/image/upload/v1781951900/https___assets.ig-items.com_files_uploads_game_background_type_img_mobile_681be47c-7861-4988-a7a7-ae159d7aeec3_pizggu.webp',
    building: 'https://res.cloudinary.com/da52innak/image/upload/v1781951918/asset_909ca076-a831-5b58-9382-f90d8b50eae2_w7yhva.webp',
    troops: 'https://res.cloudinary.com/da52innak/image/upload/v1781951918/static-assets-upload18011851912651474672_tvqgun.webp',
  };

  const positions = [
    { left: '15%', top: '30%', delay: '0ms' },
    { left: '35%', top: '50%', delay: '100ms' },
    { left: '55%', top: '25%', delay: '200ms' },
    { left: '75%', top: '55%', delay: '300ms' },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border-4 border-cyan-500/30 h-96 bg-gradient-to-br from-surface to-panel shadow-2xl">
      {/* Background asset */}
      <div className="absolute inset-0 opacity-30">
        <img
          src={cloudinaryAssets.bg}
          alt="village background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Interactive buildings */}
      <div className="absolute inset-0 pointer-events-auto">
        {buildings.slice(0, 4).map((building, idx) => (
          <div
            key={building.id}
            style={{
              left: positions[idx]?.left,
              top: positions[idx]?.top,
              transitionDelay: positions[idx]?.delay,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer animate-float"
          >
            {/* Building wrapper with hover scale */}
            <div className="relative transition-all duration-300 transform group-hover:scale-125 group-hover:-translate-y-3">
              <img
                src={cloudinaryAssets.building}
                alt={building.type}
                className="w-20 h-20 drop-shadow-2xl transition-all group-hover:drop-shadow-[0_0_20px_rgba(16,185,129,0.8)]"
              />

              {/* Level badge with bounce animation */}
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm group-hover:animate-bounce-scale shadow-lg">
                {building.level}
              </div>

              {/* Tooltip on hover */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-panel border border-cyan-400/50 px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
                <div className="font-semibold capitalize">{building.type.replace('_', ' ')}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Animated troops */}
      <div className="absolute bottom-6 right-6 flex gap-4 pointer-events-none">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{ animationDelay: `${i * 0.2}s` }}
            className="animate-bounce-scale"
          >
            <img
              src={cloudinaryAssets.troops}
              alt="troop"
              className="w-12 h-12 drop-shadow-lg transition-transform hover:scale-110"
            />
          </div>
        ))}
      </div>

      {/* Decorative glow elements */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-chess-cyan/10 rounded-full filter blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-chess-light/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
    </div>
  );
}

export default EnhancedVillageMap;

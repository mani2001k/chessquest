import React from 'react';

export function AnimatedBattleOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center">
      <div className="w-96 h-96 rounded-full bg-gradient-to-tr from-red-500/20 via-yellow-400/10 to-transparent animate-pulse" />
    </div>
  );
}

export default AnimatedBattleOverlay;

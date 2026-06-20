import React, { useState } from 'react';

interface InteractiveCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  color?: 'gold' | 'elixir' | 'dark' | 'cyan';
}

export function InteractiveResourceCard({ title, value, icon, color = 'cyan' }: InteractiveCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const colorClasses = {
    gold: 'from-yellow-600 to-yellow-700 border-yellow-500/30',
    elixir: 'from-purple-600 to-purple-700 border-purple-500/30',
    dark: 'from-gray-700 to-gray-800 border-gray-600/30',
    cyan: 'from-cyan-600 to-chess-cyan border-cyan-500/30',
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative group rounded-2xl border-2 p-6 cursor-pointer overflow-hidden transition-all duration-300 transform
        ${colorClasses[color]}
        ${isHovered ? 'scale-110 -translate-y-2 shadow-2xl shadow-cyan-500/50' : 'scale-100 shadow-lg'}
      `}
    >
      {/* Animated background glow */}
      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity`} />

      {/* Content */}
      <div className="relative z-10 text-center">
        {icon && <div className="text-4xl mb-2">{icon}</div>}
        <div className="text-sm uppercase tracking-widest font-bold text-white/70">{title}</div>
        <div className={`text-4xl font-bold mt-3 transition-all duration-300 ${isHovered ? 'text-white scale-125' : 'text-white scale-100'}`}>
          {value}
        </div>
      </div>

      {/* Hover indicator */}
      {isHovered && (
        <div className="absolute inset-0 rounded-2xl border-2 border-white/20 animate-pulse" />
      )}
    </div>
  );
}

export default InteractiveResourceCard;

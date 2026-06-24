import React from 'react';
import { Chessboard } from 'react-chessboard';

interface ChessBoardProps {
  fen: string;
  onPieceDrop: (source: string, target: string) => boolean;
}

export function InteractiveChessboard({ fen, onPieceDrop }: ChessBoardProps) {
  return (
    <div className="relative group p-6 rounded-3xl border-4 border-chess-cyan shadow-chess-glow bg-gradient-to-br from-chess-dark to-chess-dark/80 transition-all duration-300 hover:shadow-lg hover:scale-105 transform">
      {/* Glow effect background */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-chess-cyan/10 to-chess-light/10 animate-pulse-glow opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Chessboard container */}
      <div className="relative z-10 animate-scale-in">
        <style>{`
          .chess-board-square-light {
            background-color: #4ade80;
            transition: all 0.2s ease;
          }
          .chess-board-square-light:hover {
            background-color: #22c55e;
            transform: scale(1.05);
          }
          .chess-board-square-dark {
            background-color: #059669;
            transition: all 0.2s ease;
          }
          .chess-board-square-dark:hover {
            background-color: #047857;
            transform: scale(1.05);
          }
          .square-55d63 {
            background-color: #4ade80 !important;
          }
          .square-55d63:hover {
            background-color: #22c55e !important;
          }
          .square-8418f {
            background-color: #059669 !important;
          }
          .square-8418f:hover {
            background-color: #047857 !important;
          }
        `}</style>
        <Chessboard
          position={fen}
          onPieceDrop={onPieceDrop}
          arePiecesDraggable={true}
          boardWidth={400}
        />
      </div>
    </div>
  );
}

export default InteractiveChessboard;

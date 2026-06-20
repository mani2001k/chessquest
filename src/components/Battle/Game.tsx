import { useEffect, useMemo, useRef, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useGameStore } from '../../stores/useGameStore';
import { createChessInstance, isValidMove, chooseAIMove, getPieceLevelBadge } from '../../lib/chessLogic';
import { useResourceStore } from '../../stores/useResourceStore';
import { calculateLoot, awardXp, getWinXp, getXpForCapture, pieceSymbolToType, type MatchLoot } from '../../lib/gameState';
import { usePieces } from '../../hooks/usePieces';
import { usePlayer } from '../../hooks/usePlayer';
import { createGameRecord, sendN8nWebhook, updatePlayerResources, updatePiece } from '../../lib/api';
import type { Move } from 'chess.js';
import type { Piece } from '../../types';

const initialFen = 'start';

export function Game() {
  const chessRef = useRef(createChessInstance());
  const fen = useGameStore((state) => state.fen);
  const result = useGameStore((state) => state.result);
  const setFen = useGameStore((state) => state.setFen);
  const setGameOver = useGameStore((state) => state.setGameOver);
  const setResult = useGameStore((state) => state.setResult);
  const { gold, elixir, darkElixir, addResources, resetResources } = useResourceStore((state) => ({
    gold: state.gold,
    elixir: state.elixir,
    darkElixir: state.darkElixir,
    addResources: state.addResources,
    resetResources: state.resetResources,
  }));
  const [statusMessage, setStatusMessage] = useState('Battle ready');
  const [playerTurn, setPlayerTurn] = useState(true);
  const [captureCount, setCaptureCount] = useState(0);
  const [battleLoot, setBattleLoot] = useState<MatchLoot>({ gold: 0, elixir: 0, dark_elixir: 0 });
  const [battleXp, setBattleXp] = useState(0);
  const [saved, setSaved] = useState(false);

  const { data: player, isLoading: playerLoading } = usePlayer();
  const { data: pieces } = usePieces();
  const queryClient = useQueryClient();

  const updatePlayerMutation = useMutation({
    mutationFn: (updates: Partial<Pick<import('../../types').Player, 'gold' | 'elixir' | 'dark_elixir' | 'total_games' | 'wins'>>) => updatePlayerResources(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['player'] });
      setSaved(true);
      setStatusMessage('Rewards saved to your village');
    },
  });

  const updatePieceMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Piece> }) => updatePiece(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pieces'] }),
  });

  useEffect(() => {
    chessRef.current = createChessInstance();
    setFen(initialFen);
    setGameOver(false);
    setResult(null);
    setPlayerTurn(true);
    resetResources();
    setCaptureCount(0);
    setBattleLoot({ gold: 0, elixir: 0, dark_elixir: 0 });
    setBattleXp(0);
    setSaved(false);
  }, [setFen, setGameOver, setResult, resetResources]);

  useEffect(() => {
    if (!result || saved || playerLoading) return;
    if (player) {
      saveBattleProgress(result);
    }
  }, [result, saved, playerLoading]);

  const saveBattleProgress = async (winner: 'white' | 'black' | 'draw') => {
    if (!player) return;

    const chess = chessRef.current;
    const playerWon = winner === 'white';
    const earnedXp = battleXp + (playerWon ? getWinXp() : 0);
    const targetPiece = pieces?.find((piece) => piece.active) ?? pieces?.[0];

    setStatusMessage('Saving battle progress...');

    try {
      let updatedPiece: Piece | null = null;
      if (targetPiece) {
        updatedPiece = awardXp(targetPiece, earnedXp);
        await updatePieceMutation.mutateAsync({
          id: updatedPiece.id,
          updates: {
            xp: updatedPiece.xp,
            level: updatedPiece.level,
            total_captures: updatedPiece.total_captures + captureCount,
          },
        });
      }

      const updatedPlayer = await updatePlayerMutation.mutateAsync({
        gold: player.gold + battleLoot.gold,
        elixir: player.elixir + battleLoot.elixir,
        dark_elixir: player.dark_elixir + battleLoot.dark_elixir,
        total_games: player.total_games + 1,
        wins: player.wins + (playerWon ? 1 : 0),
      });

      const gameRecord = await createGameRecord({
        white_player_id: player.id,
        black_player_id: null,
        winner,
        moves: chess.history({ verbose: true }) as unknown[],
        loot_earned: battleLoot,
        xp_awarded: {
          player: earnedXp,
          ...(updatedPiece ? { piece_id: updatedPiece.id, piece_xp: updatedPiece.xp } : {}),
        },
        game_state: {
          fen: chess.fen(),
          result: winner,
          captures: captureCount,
          battleLoot,
          totalXp: earnedXp,
        },
      });

      await sendN8nWebhook({
        gameId: gameRecord.id,
        whitePlayerId: player.id,
        blackPlayerId: null,
        winner,
        result: playerWon ? 'win' : winner === 'draw' ? 'draw' : 'loss',
        moves: gameRecord.moves,
        lootEarned: battleLoot,
        xpAwarded: {
          player: earnedXp,
          ...(updatedPiece ? { pieceId: updatedPiece.id, pieceXp: updatedPiece.xp } : {}),
        },
        finalScores: {
          gold: updatedPlayer.gold,
          elixir: updatedPlayer.elixir,
          dark_elixir: updatedPlayer.dark_elixir,
          total_games: updatedPlayer.total_games,
          wins: updatedPlayer.wins,
        },
        timestamp: new Date().toISOString(),
      });

      setSaved(true);
      setStatusMessage('Battle record saved and webhook sent.');
    } catch (error) {
        console.error('saveBattleProgress error', error);
        const msg = (error as any)?.message || JSON.stringify(error);
        setStatusMessage(`Failed to save battle progress: ${msg}`);
    }
  };

  const boardOrientation = useMemo(() => 'white' as const, []);

  const applyAIMove = () => {
    const chess = chessRef.current;
    if (chess.isGameOver()) return;
    const aiMove = chooseAIMove(chess);
    if (!aiMove) {
      if (chess.isGameOver()) {
        setStatusMessage('Draw or checkmate');
        setGameOver(true);
      }
      return;
    }

    chess.move({ from: aiMove.from, to: aiMove.to, promotion: 'q' });
    setFen(chess.fen());
    setStatusMessage('AI moved');
    setPlayerTurn(true);

    if (chess.isGameOver()) {
      setStatusMessage('Battle finished');
      setGameOver(true);
      setResult(chess.turn() === 'w' ? 'black' : 'white');
    }
  };

  const onPieceDrop = (sourceSquare: string, targetSquare: string) => {
    const chess = chessRef.current;
    const currentFen = chess.fen();

    if (!isValidMove(currentFen, sourceSquare, targetSquare)) {
      setStatusMessage('Invalid move');
      return false;
    }

    const move = chess.move({ from: sourceSquare, to: targetSquare, promotion: 'q' }) as Move | null;
    if (!move) {
      setStatusMessage('Invalid move');
      return false;
    }

    setFen(chess.fen());
    setStatusMessage('Move accepted');
    setPlayerTurn(false);

    if (move.captured) {
      const pieceType = pieceSymbolToType(move.piece as string);
      const loot = calculateLoot(pieceType);
      const xpGain = getXpForCapture(pieceType);

      setBattleLoot((current) => ({
        gold: current.gold + loot.gold,
        elixir: current.elixir + loot.elixir,
        dark_elixir: current.dark_elixir + loot.dark_elixir,
      }));
      setBattleXp((current) => current + xpGain);
      setCaptureCount((count) => count + 1);
      addResources(loot.gold, loot.elixir, loot.dark_elixir);
    }

    if (chess.isGameOver()) {
      setStatusMessage('Battle finished');
      setGameOver(true);
      setResult(chess.turn() === 'w' ? 'black' : 'white');
      return true;
    }

    window.setTimeout(() => {
      applyAIMove();
    }, 500);

    return true;
  };

  const resetBattle = () => {
    chessRef.current = createChessInstance();
    setFen(initialFen);
    setGameOver(false);
    setResult(null);
    setPlayerTurn(true);
    setStatusMessage('Battle ready');
    resetResources();
    setCaptureCount(0);
    setBattleLoot({ gold: 0, elixir: 0, dark_elixir: 0 });
    setBattleXp(0);
    setSaved(false);
  };

  const totalXp = battleXp + (result === 'white' ? getWinXp() : 0);

  return (
    <main className="min-h-screen bg-surface px-4 py-6 text-white">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border border-white/10 bg-panel p-6 shadow-glow">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold">Battle Arena</h1>
              <p className="mt-2 text-sm text-muted">Fight an AI opponent and earn loot on captures.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={resetBattle}
                className="rounded-2xl bg-white/5 px-4 py-3 text-sm transition hover:bg-white/10"
              >
                Reset Battle
              </button>
              <div className="rounded-3xl border border-white/10 bg-surface px-4 py-3">
                <p className="text-sm text-muted">Status</p>
                <p className="mt-1 text-lg font-semibold">{statusMessage}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-panel p-6 shadow-glow">
            <Chessboard
              position={fen}
              onPieceDrop={onPieceDrop}
              boardOrientation={boardOrientation}
              arePiecesDraggable
              customBoardStyle={{ borderRadius: '24px', boxShadow: '0 0 30px rgba(0,0,0,0.35)' }}
            />
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-surface p-6 shadow-glow">
              <h2 className="text-xl font-semibold">Battle Log</h2>
              <div className="mt-4 space-y-2 text-sm text-muted">
                <p>Player turn: {playerTurn ? 'You' : 'AI'}</p>
                <p>Current FEN: {fen}</p>
                <p>Captures: {captureCount}</p>
                <p>XP earned: {totalXp}</p>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-surface p-6 shadow-glow">
              <h2 className="text-xl font-semibold">Resources</h2>
              <div className="mt-4 grid gap-3">
                <div className="rounded-3xl bg-panel p-4">
                  <p className="text-sm text-muted">Gold</p>
                  <p className="mt-2 text-2xl font-semibold">{gold}</p>
                </div>
                <div className="rounded-3xl bg-panel p-4">
                  <p className="text-sm text-muted">Elixir</p>
                  <p className="mt-2 text-2xl font-semibold">{elixir}</p>
                </div>
                <div className="rounded-3xl bg-panel p-4">
                  <p className="text-sm text-muted">Dark Elixir</p>
                  <p className="mt-2 text-2xl font-semibold">{darkElixir}</p>
                </div>
              </div>
              <div className="mt-4 rounded-3xl border border-white/10 bg-panel p-4 text-sm text-muted">
                <p>Battle loot: {battleLoot.gold} gold, {battleLoot.elixir} elixir, {battleLoot.dark_elixir} dark elixir</p>
                {saved && <p className="mt-2 text-sm text-emerald-300">Progress saved.</p>}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

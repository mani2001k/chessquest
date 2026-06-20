# Chess Quest: Clash of Clans Edition

## Project Overview
A chess-based strategy game combining chess tactics with Clash of Clans-style base building and RPG progression.

## Architecture
- **Frontend**: React + TypeScript with Vite
- **Styling**: Tailwind CSS with custom gaming theme
- **State**: Zustand (client) + React Query (server)
- **Database**: Supabase with RLS policies
- **Chess Engine**: chess.js
- **Automation**: n8n webhooks

## Key Directories
- `/src/components`: All React components
- `/src/stores`: Zustand stores
- `/src/lib`: Utility functions and client configs
- `/src/hooks`: Custom React hooks
- `/src/types`: TypeScript interfaces
- `/supabase/migrations`: Database migrations

## Design Tokens
- Primary: #1a1a2e (dark)
- Secondary: #16213e
- Accent: #e94560 (red/gold for gaming)
- Font: Inter (default)
- Border radius: rounded-xl
- Transitions: duration-200

## Chess Piece Classes
- Pawn: Barbarian → Archer → Giant
- Knight: Cavalry → Dragoon
- Bishop: Priest → Archmage
- Rook: Warden → Guardian
- Queen: Empress → Celestial

## Resource System
- Gold: Pawn captures, daily rewards
- Elixir: Knight/Bishop captures
- Dark Elixir: Rook/Queen captures
- Trophies: Win/loss ranking

## Level System
- Max Level: 10
- XP per level: Progressive (100, 150, 250, etc.)
- Bonus XP: MVP +5, Win +10, Capture +2

## Development Commands
```bash
npm run dev        # Start dev server
npm run build      # TypeScript check + build
npm run preview    # Preview production build
```

## Game Flow

1. Auth → Village View
2. Train/Upgrade Pieces
3. Start Battle (AI or Player)
4. Chess Match with Loot Collection
5. Post-Match Processing (n8n)
6. Return to Village with Rewards

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Players table (extends auth.users)
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  gold INT DEFAULT 100,
  elixir INT DEFAULT 50,
  dark_elixir INT DEFAULT 0,
  trophies INT DEFAULT 1200,
  total_games INT DEFAULT 0,
  wins INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Function to create player on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.players (id, username)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Pieces table
CREATE TABLE pieces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  name TEXT DEFAULT 'Warrior',
  type TEXT CHECK (type IN ('pawn','knight','bishop','rook','queen','king')),
  class TEXT DEFAULT 'barbarian',
  level INT DEFAULT 1,
  xp INT DEFAULT 0,
  total_captures INT DEFAULT 0,
  games_survived INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Games table
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  white_player_id UUID REFERENCES players(id),
  black_player_id UUID REFERENCES players(id),
  winner TEXT CHECK (winner IN ('white','black','draw')),
  moves JSONB DEFAULT '[]',
  loot_earned JSONB DEFAULT '{}',
  xp_awarded JSONB DEFAULT '{}',
  game_state JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Buildings table
CREATE TABLE buildings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('barracks','army_camp','spell_factory','storage')),
  level INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE pieces ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;

-- Players: users can view and update own data
CREATE POLICY "Users can view own player data"
  ON players FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own player data"
  ON players FOR UPDATE USING (auth.uid() = id);

-- Pieces: users can CRUD their own pieces
CREATE POLICY "Users can view own pieces"
  ON pieces FOR SELECT USING (auth.uid() = player_id);
CREATE POLICY "Users can insert own pieces"
  ON pieces FOR INSERT WITH CHECK (auth.uid() = player_id);
CREATE POLICY "Users can update own pieces"
  ON pieces FOR UPDATE USING (auth.uid() = player_id);

-- Games: view games where user participated
CREATE POLICY "Users can view own games"
  ON games FOR SELECT USING (auth.uid() = white_player_id OR auth.uid() = black_player_id);

CREATE POLICY "Users can insert own games"
  ON games FOR INSERT WITH CHECK (auth.uid() = white_player_id OR auth.uid() = black_player_id);

-- Buildings: users can manage own buildings
CREATE POLICY "Users can view own buildings"
  ON buildings FOR SELECT USING (auth.uid() = player_id);
CREATE POLICY "Users can update own buildings"
  ON buildings FOR UPDATE USING (auth.uid() = player_id);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE games;
ALTER PUBLICATION supabase_realtime ADD TABLE players;

-- Seed initial buildings
CREATE OR REPLACE FUNCTION seed_buildings_for_player()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO buildings (player_id, type) VALUES
    (NEW.id, 'barracks'),
    (NEW.id, 'army_camp'),
    (NEW.id, 'spell_factory'),
    (NEW.id, 'storage');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_player_created
  AFTER INSERT ON players
  FOR EACH ROW EXECUTE FUNCTION seed_buildings_for_player();

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/useAuthStore';
import { Login } from './components/Auth/Login';
import { Signup } from './components/Auth/Signup';
import { VillageView } from './components/Village/VillageView';
import { Game } from './components/Battle/Game';
import { PlayerStats } from './components/Profile/PlayerStats';
import { Leaderboard } from './components/Profile/Leaderboard';
import { BattleHistory } from './components/History/BattleHistory';
import { Header } from './components/Header';
import { useEffect } from 'react';
import { supabase } from './lib/supabase';


function RequireAuth({ children }: { children: JSX.Element }) {
  const token = useAuthStore((state) => state.session?.access_token);
  const loading = useAuthStore((state) => state.loading);
  const setSession = useAuthStore((state) => state.setSession);

  // Handle OAuth callback on page load
  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Check if we have a session from OAuth redirect
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setSession(session);
      }
    };
    
    handleOAuthCallback();
  }, [setSession]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface text-white">
        <div className="rounded-3xl border border-white/10 bg-panel p-8 shadow-glow text-center">
          <p className="text-lg font-semibold">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <div className="min-h-screen bg-surface text-white">
      <Header />
      <Routes>
        {/* Root path now shows login page instead of redirecting */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/village"
          element={
            <RequireAuth>
              <VillageView />
            </RequireAuth>
          }
        />
        <Route
          path="/battle"
          element={
            <RequireAuth>
              <Game />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <PlayerStats />
            </RequireAuth>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <RequireAuth>
              <Leaderboard />
            </RequireAuth>
          }
        />
        <Route
          path="/history"
          element={
            <RequireAuth>
              <BattleHistory />
            </RequireAuth>
          }
        />
        {/* Catch-all route for 404s - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
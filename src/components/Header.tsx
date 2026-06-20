import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

export function Header() {
  const navigate = useNavigate();
  const signOut = useAuthStore((s) => s.signOut);

  return (
    <header className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold">Chess Quest</h1>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/history')}
          className="rounded-2xl bg-white/5 px-3 py-2 text-sm"
        >
          History
        </button>
        <button
          onClick={() => navigate('/profile')}
          className="rounded-2xl bg-white/5 px-3 py-2 text-sm"
        >
          Profile
        </button>
        <button
          onClick={async () => { await signOut(); navigate('/login'); }}
          className="rounded-2xl bg-accent px-3 py-2 text-sm"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}

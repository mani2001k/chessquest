import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/useAuthStore';

export function Signup() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const setError = useAuthStore((state) => state.setError);
  const setLoading = useAuthStore((state) => state.setLoading);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { username } } });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (!data.session) {
      setError('Signup succeeded but no session was returned. Please verify your email if required.');
      return;
    }

    setSession(data.session);
    navigate('/village');
  };



  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-panel p-8 shadow-glow">
        <h1 className="text-3xl font-semibold text-white">Signup</h1>
        <p className="mt-2 text-sm text-muted">Forge your first commander and build your chess village.</p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {useAuthStore((state) => state.error) ? (
            <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-200">
              {useAuthStore((state) => state.error)}
            </div>
          ) : null}
          <label className="block space-y-2 text-sm">
            <span>Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3"
            />
          </label>
          <label className="block space-y-2 text-sm">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3"
            />
          </label>
          <label className="block space-y-2 text-sm">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-2xl bg-accent px-4 py-3 text-sm font-semibold transition hover:bg-red-500"
          >
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already have a guild?{' '}
          <Link to="/login" className="text-white underline">Log in</Link>
        </p>
      </section>
    </main>
  );
}

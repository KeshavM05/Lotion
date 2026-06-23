'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

export default function AuthPage() {
  const router = useRouter();
  const { signIn, signUp, user } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (mode === 'forgot') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) {
        setError(error.message);
      } else {
        setMessage('Check your email for a password reset link');
      }
      setLoading(false);
      return;
    }

    const { error } =
      mode === 'signin' ? await signIn(email, password) : await signUp(email, password, name);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="glass-card p-10 rounded-3xl w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-['Playfair_Display'] text-[#F5F5F5] mb-2">Lotion</h1>
          <p className="text-[#9CA3AF] font-['Space_Grotesk']">Your AI Life Coach</p>
        </div>

        {/* Tab Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('signin')}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-['Space_Grotesk'] font-medium tracking-wide transition-all"
            style={{
              background: mode === 'signin' ? 'var(--accent-soft)' : 'transparent',
              color: mode === 'signin' ? 'var(--accent)' : 'var(--text-muted)',
              border: `1px solid ${mode === 'signin' ? 'rgba(193,122,114,0.3)' : 'transparent'}`,
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-['Space_Grotesk'] font-medium tracking-wide transition-all"
            style={{
              background: mode === 'signup' ? 'var(--accent-soft)' : 'transparent',
              color: mode === 'signup' ? 'var(--accent)' : 'var(--text-muted)',
              border: `1px solid ${mode === 'signup' ? 'rgba(193,122,114,0.3)' : 'transparent'}`,
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'forgot' && (
            <div>
              <label className="text-xs mb-2 block" style={{ color: 'var(--text-muted)' }}>
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-glass w-full"
              />
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="text-xs mb-2 block" style={{ color: 'var(--text-muted)' }}>
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-glass w-full"
              />
            </div>
          )}

          {mode !== 'forgot' && (
            <>
              <div>
                <label className="text-xs mb-2 block" style={{ color: 'var(--text-muted)' }}>
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-glass w-full"
                />
              </div>

              <div>
                <label className="text-xs mb-2 block" style={{ color: 'var(--text-muted)' }}>
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="input-glass w-full"
                />
              </div>
            </>
          )}

          {error && (
            <div
              className="text-xs px-3 py-2 rounded-lg"
              style={{ background: 'rgba(248, 113, 113, 0.1)', color: '#f87171' }}
            >
              {error}
            </div>
          )}

          {message && (
            <div
              className="text-xs px-3 py-2 rounded-lg"
              style={{ background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80' }}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-glow w-full py-3 rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? 'Loading...'
              : mode === 'forgot'
                ? 'Send Reset Link'
                : mode === 'signin'
                  ? 'Sign In'
                  : 'Create Account'}
          </button>
        </form>

        {/* Forgot password link */}
        {mode === 'signin' && (
          <p className="text-center text-xs mt-4">
            <button
              onClick={() => {
                setMode('forgot');
                setError('');
                setMessage('');
              }}
              className="font-medium"
              style={{ color: 'var(--text-muted)' }}
            >
              Forgot password?
            </button>
          </p>
        )}

        {/* Footer */}
        <p className="text-center text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
          {mode === 'forgot'
            ? 'Remember your password?'
            : mode === 'signin'
              ? "Don't have an account?"
              : 'Already have an account?'}{' '}
          <button
            onClick={() => {
              setMode(mode === 'signup' ? 'signin' : mode === 'forgot' ? 'signin' : 'signup');
              setError('');
              setMessage('');
            }}
            className="font-medium"
            style={{ color: 'var(--accent)' }}
          >
            {mode === 'forgot' ? 'Sign in' : mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}

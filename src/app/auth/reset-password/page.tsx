'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 2000);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="glass-card p-10 rounded-3xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-['Playfair_Display'] text-[#F5F5F5] mb-2">Reset Password</h1>
          <p className="text-[#9CA3AF] font-['Space_Grotesk']">Enter your new password</p>
        </div>

        {success ? (
          <div
            className="text-sm px-4 py-3 rounded-lg text-center"
            style={{ background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80' }}
          >
            Password updated! Redirecting...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs mb-2 block" style={{ color: 'var(--text-muted)' }}>
                New Password
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

            <div>
              <label className="text-xs mb-2 block" style={{ color: 'var(--text-muted)' }}>
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="input-glass w-full"
              />
            </div>

            {error && (
              <div
                className="text-xs px-3 py-2 rounded-lg"
                style={{ background: 'rgba(248, 113, 113, 0.1)', color: '#f87171' }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-glow w-full py-3 rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

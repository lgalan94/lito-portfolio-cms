import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../LoadingSpinner';
import { motion } from 'framer-motion';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await login(email, password);
      setSuccess('✅ Login successful! Redirecting...');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || '❌ Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Subtle background gradient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(56,189,248,0.08),_transparent_60%)]" />

      {/* Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900/10 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.4)] p-8 text-slate-100"
      >
        {/* Header / Branding */}
        <div className="text-center mb-8">
          <motion.img
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            src="/logo.png"
            alt="Logo"
            className="w-16 h-16 mx-auto mb-2 drop-shadow-[0_0_15px_rgba(56,189,248,0.3)]"
          />
          <h1 className="text-2xl font-semibold tracking-tight text-cyan-400">
            Portfolio – CMS
          </h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to continue</p>
        </div>

        {/* Feedback Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-lg bg-red-900/30 text-red-300 text-sm text-center border border-red-800/50"
          >
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-lg bg-green-900/30 text-green-300 text-sm text-center border border-green-800/50"
          >
            {success}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-slate-800/70 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-slate-800/70 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
              placeholder="••••••••"
            />
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileTap={{ scale: 0.97 }}
            className="w-full py-2.5 mt-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-cyan-500/30"
          >
            {isLoading ? (
              <span className="flex justify-center items-center gap-2">
                <LoadingSpinner /> Logging in...
              </span>
            ) : (
              'Sign In'
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6">
          © {new Date().getFullYear()} <span className="text-cyan-400 font-medium">Portfolio CMS</span> — All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;

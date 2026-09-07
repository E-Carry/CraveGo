import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, Mail, AlertCircle, X, KeyRound, Sparkles, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLoginModal: React.FC = () => {
  const { isAdminModalOpen, closeAdminModal, adminLogin } = useAuth();
  const [email, setEmail] = useState('admin@cravego.app');
  const [password, setPassword] = useState('crave2026');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isAdminModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const success = adminLogin(email, password);
      setIsLoading(false);
      if (!success) {
        setError('Invalid admin credentials. Please verify your portal passkey.');
      }
    }, 400);
  };

  const handleFillDemo = () => {
    setEmail('admin@cravego.app');
    setPassword('crave2026');
    setError(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        {/* Backdrop click to close */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAdminModal}
          className="absolute inset-0"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-neutral-900/95 p-6 md:p-8 shadow-2xl backdrop-blur-2xl text-white z-10"
        >
          {/* Header Glow */}
          <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-red-600/30 blur-3xl pointer-events-none" />
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-orange-600/30 blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={closeAdminModal}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Shield Icon & Titles */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-orange-500 shadow-lg shadow-red-500/30 mb-4 ring-4 ring-white/10">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
              Admin Portal Gateway
            </h2>
            <p className="text-sm text-neutral-400 mt-1">
              Restricted management console for CraveGo Operations
            </p>
          </div>

          {/* Demo Credentials Quick Pill */}
          <div className="mb-5 p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-between text-xs text-orange-300">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
              <span>
                Demo passkey: <strong className="text-white font-mono">crave2026</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="px-2.5 py-1 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-200 font-medium transition-colors"
            >
              Autofill
            </button>
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs flex items-center gap-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                Admin Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@cravego.app"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                Portal Security Key
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-sm font-mono"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-semibold text-sm shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Access Admin Control Room</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Security footnote */}
          <p className="text-[11px] text-center text-neutral-500 mt-5 flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3" />
            Protected by CraveGo Enterprise KMS & Role-Based Access Control
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

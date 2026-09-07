import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';
import { CraveLogo } from '../brand/CraveLogo';
import {
  X,
  Smartphone,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  KeyRound,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, adminLogin, setRole } = useAuth();
  const { playClick, playSuccess } = useAudio();

  // Mode: 'customer' (with sub-states login/otp) vs 'admin'
  const [activePortal, setActivePortal] = useState<'customer' | 'admin'>('customer');
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'otp'>('login');

  // Customer credentials
  const [identifier, setIdentifier] = useState('+91 98765 43210');
  const [fullName, setFullName] = useState('Rahul Sharma');
  const [otp, setOtp] = useState(['5', '8', '2', '9', '1', '0']);
  const [timer, setTimer] = useState(30);

  // Admin credentials
  const [adminEmail, setAdminEmail] = useState('admin@cravego.app');
  const [adminPassword, setAdminPassword] = useState('crave2026');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [adminLoading, setAdminLoading] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (authMode === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [authMode, timer]);

  if (!isAuthModalOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    playClick();
    setTimer(30);
    setAuthMode('otp');
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val[0];
    const updated = [...otp];
    updated[index] = val;
    setOtp(updated);

    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = () => {
    playSuccess();
    login(identifier || 'Rahul Sharma');
    closeAuthModal();
  };

  const handleQuickDemoCustomer = () => {
    playSuccess();
    login('Rahul Sharma');
    closeAuthModal();
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    setAdminLoading(true);

    setTimeout(() => {
      const success = adminLogin(adminEmail, adminPassword);
      setAdminLoading(false);
      if (success) {
        playSuccess();
        closeAuthModal();
        setRole('admin');
      } else {
        setAdminError('Invalid admin credentials. Please verify your portal passkey.');
      }
    }, 450);
  };

  const handleFillAdminDemo = () => {
    setAdminEmail('admin@cravego.app');
    setAdminPassword('crave2026');
    setAdminError(null);
    playClick();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 26, stiffness: 360 }}
          className="relative w-full max-w-md rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 shadow-2xl p-6 sm:p-8 overflow-hidden text-neutral-900 dark:text-white"
        >
          {/* Ambient Glows */}
          <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-red-600/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-orange-500/20 blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={() => {
              playClick();
              closeAuthModal();
            }}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-400 hover:text-neutral-600 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Logo Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <CraveLogo size="lg" showTagline={false} />

            {/* Segment Tab Switcher: Foodie vs Admin */}
            <div className="mt-5 w-full p-1 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center gap-1 border border-neutral-200/80 dark:border-white/5">
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setActivePortal('customer');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activePortal === 'customer'
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                <span>🍕 Foodie Login</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setActivePortal('admin');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activePortal === 'admin'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Gateway</span>
              </button>
            </div>
          </div>

          {/* PORTAL 1: CUSTOMER LOGIN */}
          {activePortal === 'customer' && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-center mb-5">
                <h3 className="font-black text-xl">
                  {authMode === 'otp'
                    ? 'Enter 6-Digit OTP'
                    : authMode === 'login'
                    ? 'India’s Tastiest Feast Awaits'
                    : 'Create Your CraveGo Account'}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  {authMode === 'otp'
                    ? `Verification code sent to ${identifier}`
                    : 'Sign in to access saved addresses, Crave Wallet, and live tracking'}
                </p>
              </div>

              {authMode === 'otp' ? (
                <div className="space-y-5">
                  <div className="flex justify-center gap-2">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        className="w-11 h-13 text-center text-xl font-black rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white focus:outline-none focus:border-red-500 shadow-inner"
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleVerifyOtp}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white font-extrabold text-sm shadow-xl shadow-red-500/30 hover:opacity-95 transition-opacity"
                  >
                    Verify &amp; Start Feasting
                  </button>

                  <div className="text-center text-xs text-neutral-400">
                    {timer > 0 ? (
                      <span>Resend OTP code in {timer}s</span>
                    ) : (
                      <button
                        onClick={() => {
                          playClick();
                          setTimer(30);
                        }}
                        className="font-bold text-red-600 dark:text-red-400 hover:underline"
                      >
                        Resend OTP Now
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  {authMode === 'register' && (
                    <div>
                      <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-4 py-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 text-xs focus:outline-none focus:border-red-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                      Phone Number or Email
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={identifier}
                        onChange={e => setIdentifier(e.target.value)}
                        placeholder="+91 98765 43210 or user@cravego.app"
                        className="w-full px-4 py-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 text-xs focus:outline-none focus:border-red-500 font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white font-extrabold text-sm shadow-xl shadow-red-500/30 flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
                  >
                    <span>Continue with OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* 1-Click Fast Demo Customer Login */}
                  <button
                    type="button"
                    onClick={handleQuickDemoCustomer}
                    className="w-full py-2.5 px-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Instant 1-Click Demo Login (Rahul Sharma)</span>
                  </button>

                  {/* Social SSO */}
                  <div className="pt-2 border-t border-neutral-200 dark:border-white/10 space-y-2">
                    <span className="block text-[10px] font-semibold text-neutral-400 text-center uppercase tracking-wider">
                      Or continue instantly with
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={handleQuickDemoCustomer}
                        className="py-2.5 px-3 rounded-2xl border border-neutral-200 dark:border-white/10 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                      >
                        <span className="font-bold">Google</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleQuickDemoCustomer}
                        className="py-2.5 px-3 rounded-2xl border border-neutral-200 dark:border-white/10 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                      >
                        <span className="font-bold">Apple</span>
                      </button>
                    </div>
                  </div>

                  {/* Footer link to switch to Admin */}
                  <div className="text-center pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        setActivePortal('admin');
                      }}
                      className="text-[11px] font-bold text-neutral-500 hover:text-red-500 transition-colors inline-flex items-center gap-1"
                    >
                      <Lock className="w-3 h-3 text-red-500" />
                      <span>CraveGo Employee or Ops Admin? Access Portal →</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}

          {/* PORTAL 2: ADMIN & OPS GATEWAY */}
          {activePortal === 'admin' && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-red-600/20 text-red-500 mb-2 border border-red-500/30 shadow-md">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-black text-xl">
                  Central Operations Gateway
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Restricted portal for CraveGo Dispatch, Finance &amp; Menu Governance
                </p>
              </div>

              {/* Demo passkey autofill banner */}
              <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-between text-xs text-orange-400">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>Passkey: <strong className="font-mono text-white">crave2026</strong></span>
                </div>
                <button
                  type="button"
                  onClick={handleFillAdminDemo}
                  className="px-2.5 py-1 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 font-bold transition-colors"
                >
                  Autofill
                </button>
              </div>

              {adminError && (
                <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{adminError}</span>
                </div>
              )}

              <form onSubmit={handleAdminSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Admin Work Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={e => setAdminEmail(e.target.value)}
                      placeholder="admin@cravego.app"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 text-xs focus:outline-none focus:border-red-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Security Passkey
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type={showAdminPassword ? 'text' : 'password'}
                      required
                      value={adminPassword}
                      onChange={e => setAdminPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 text-xs focus:outline-none focus:border-red-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
                    >
                      {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={adminLoading}
                  className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-bold text-xs shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                >
                  {adminLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Authorize Admin Access</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-neutral-400 pt-2 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>Encrypted by CraveGo Enterprise Security KMS</span>
                </p>
              </form>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

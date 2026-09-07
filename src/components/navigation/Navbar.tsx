import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CraveLogo } from '../brand/CraveLogo';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useAudio } from '../../context/AudioContext';
import {
  MapPin,
  Search,
  ShoppingBag,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Bell,
  User,
  ChevronDown,
  Sparkles,
  Tag,
  Wallet,
  LogOut,
  Package,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onNavigateSection: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  onNavigateSection
}) => {
  const {
    user,
    role,
    setRole,
    isAdminAuthenticated,
    adminLogout,
    selectedAddress,
    unreadNotificationCount,
    openLocationModal,
    openAuthModal,
    openProfileModal,
    openOffersModal,
    markNotificationsAsRead,
    activeOrder,
    openTracking,
    logout
  } = useAuth();

  const { openCart, totalQuantity, grandTotal } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { soundEnabled, toggleSound, playClick } = useAudio();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Exclusive Dedicated Admin Console Navigation (Cannot switch to user account)
  if (role === 'admin') {
    return (
      <header className="sticky top-0 z-40 w-full bg-[#070b14]/95 backdrop-blur-xl border-b border-red-500/30 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-5">
            <CraveLogo size="md" showTagline={false} />
            <div className="h-6 w-px bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-red-600/20 border border-red-500/40 text-red-400 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                Admin Operations Console
              </span>
              <span className="hidden md:inline text-[11px] text-neutral-400 font-semibold">
                KMS 256-Bit Encrypted • Superuser Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-neutral-300 font-semibold">Logged in as <strong>admin@cravego.app</strong></span>
            </div>

            <button
              onClick={() => {
                playClick();
                adminLogout();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition-all active:scale-[0.98]"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out of Admin</span>
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl border-b border-neutral-200/80 dark:border-white/10 transition-colors duration-200">
      {/* Top Micro-Bar: City announcement & Live order status */}
      <div className="bg-neutral-900 text-neutral-300 py-1.5 px-4 text-xs flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-0.5">
          <span className="flex items-center gap-1.5 text-orange-400 font-semibold text-[11px] tracking-wide shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            CraveGo Express 🇮🇳
          </span>
          <span className="hidden sm:inline text-neutral-400 text-[11px]">
            Fast 20-Min Gourmet Delivery across Bengaluru • Mumbai • Delhi NCR • Hyderabad • Pune
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          {/* Active order quick pill */}
          {activeOrder && (
            <button
              onClick={() => openTracking(activeOrder.id)}
              className="flex items-center gap-1.5 text-emerald-400 font-semibold hover:underline bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Order #{activeOrder.id}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Left: Logo & Indian Locality Selector */}
        <div className="flex items-center gap-3 sm:gap-6">
          <CraveLogo
            size="md"
            showTagline={false}
            onClick={() => {
              playClick();
              onNavigateSection('home');
            }}
          />

          {/* Location Selector Pill */}
          <button
            onClick={() => {
              playClick();
              openLocationModal();
            }}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200/80 dark:hover:bg-neutral-800 border border-neutral-200/80 dark:border-white/10 text-left transition-all text-xs group"
          >
            <div className="p-1.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-neutral-900 dark:text-white flex items-center gap-1">
                {selectedAddress?.city || 'Bengaluru'}
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate max-w-[140px]">
                {selectedAddress?.street || 'Indiranagar, 100 Ft Rd'}
              </span>
            </div>
          </button>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-lg hidden md:block">
          <div className="relative group">
            <Search className="w-4 h-4 text-neutral-400 group-focus-within:text-red-500 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search for restaurants, biryani, burgers, dosa, pizza..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-neutral-100/90 dark:bg-neutral-900/90 border border-transparent focus:border-red-500/50 focus:bg-white dark:focus:bg-neutral-900 text-neutral-900 dark:text-white text-xs sm:text-sm placeholder:text-neutral-400 focus:outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right: Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Offers Button */}
          <button
            onClick={() => {
              playClick();
              openOffersModal();
            }}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors"
          >
            <Tag className="w-3.5 h-3.5 text-red-500" />
            <span>Offers</span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-500 text-white">
              ₹ OFF
            </span>
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-red-500" />
            ) : (
              <VolumeX className="w-4 h-4 text-neutral-400" />
            )}
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => {
              playClick();
              toggleTheme();
            }}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-neutral-700 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => {
              playClick();
              markNotificationsAsRead();
              openProfileModal();
            }}
            className="relative p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-neutral-900 animate-pulse" />
            )}
          </button>

          {/* Indian Rupee Cart Trigger Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              playClick();
              openCart();
            }}
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white text-xs font-bold shadow-lg shadow-red-500/25 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {totalQuantity > 0 && (
              <>
                <span className="h-4 w-px bg-white/30 hidden sm:inline" />
                <span className="px-1.5 py-0.2 rounded-full bg-white text-red-600 text-[11px] font-black">
                  {totalQuantity}
                </span>
                <span className="hidden sm:inline text-white font-extrabold text-[12px]">
                  ₹{grandTotal}
                </span>
              </>
            )}
          </motion.button>

          {/* User Profile Avatar / Sign In Trigger */}
          <div className="relative">
            {user ? (
              <>
                <button
                  onClick={() => setIsUserMenuOpen(prev => !prev)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-white/10 transition-colors"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-white/20"
                  />
                  <span className="hidden sm:inline text-xs font-bold text-neutral-800 dark:text-neutral-100 max-w-[80px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-neutral-400" />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 shadow-2xl p-2 z-50 text-neutral-800 dark:text-white"
                      >
                        {/* User Header */}
                        <div className="p-2 border-b border-neutral-100 dark:border-white/10 mb-1">
                          <p className="font-bold text-sm truncate">{user.name}</p>
                          <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>
                          <div className="mt-2 flex items-center justify-between text-xs bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 px-2.5 py-1.5 rounded-xl font-bold">
                            <span className="flex items-center gap-1.5">
                              <Wallet className="w-3.5 h-3.5" />
                              Crave Wallet
                            </span>
                            <span>₹{user.walletBalance}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-0.5 text-xs font-medium">
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              openProfileModal();
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
                          >
                            <User className="w-4 h-4 text-neutral-400" />
                            <span>My Profile & Details</span>
                          </button>
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              openProfileModal();
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
                          >
                            <Package className="w-4 h-4 text-neutral-400" />
                            <span>Past Orders & Invoices</span>
                          </button>
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              openLocationModal();
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
                          >
                            <MapPin className="w-4 h-4 text-neutral-400" />
                            <span>Manage Addresses</span>
                          </button>

                          <div className="my-1 border-t border-neutral-100 dark:border-white/10" />

                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              logout();
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <button
                onClick={() => {
                  playClick();
                  openAuthModal();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/20 transition-all"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In / Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

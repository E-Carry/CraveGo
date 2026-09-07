import React from 'react';
import { Home, Search, Compass, Clock, Heart, User, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';

interface MobileNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSearch: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenSearch
}) => {
  const { totalQuantity, grandTotal, openCart } = useCart();
  const { openProfileModal, activeOrder, openTracking } = useAuth();
  const { playClick } = useAudio();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      {/* Floating Cart Bar if cart has items */}
      {totalQuantity > 0 && (
        <div className="px-3 pb-2">
          <button
            onClick={() => {
              playClick();
              openCart();
            }}
            className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-brand-500 via-brand-600 to-amber-500 text-white font-bold text-xs shadow-xl shadow-brand-500/30 flex items-center justify-between animate-in slide-in-from-bottom-2"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-black text-[11px]">
                {totalQuantity}
              </div>
              <div className="text-left">
                <span className="block text-[11px] leading-tight opacity-90">View Cart</span>
                <span className="text-xs font-black">₹{grandTotal}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span>Checkout</span>
              <ShoppingBag className="w-4 h-4 ml-1" />
            </div>
          </button>
        </div>
      )}

      {/* Main Bottom Bar */}
      <nav className="glass-panel border-t border-slate-200/80 dark:border-white/10 px-4 py-2 flex items-center justify-around">
        <button
          onClick={() => {
            playClick();
            onSelectTab('home');
          }}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-semibold transition-colors ${
            currentTab === 'home'
              ? 'text-brand-500'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => {
            playClick();
            onOpenSearch();
          }}
          className="flex flex-col items-center gap-1 p-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>

        <button
          onClick={() => {
            playClick();
            onSelectTab('restaurants');
          }}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-semibold transition-colors ${
            currentTab === 'restaurants'
              ? 'text-brand-500'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Explore</span>
        </button>

        {activeOrder ? (
          <button
            onClick={() => {
              playClick();
              openTracking(activeOrder.id);
            }}
            className="flex flex-col items-center gap-1 p-1 text-[10px] font-semibold text-accent-teal animate-pulse"
          >
            <Clock className="w-4 h-4" />
            <span>Track</span>
          </button>
        ) : (
          <button
            onClick={() => {
              playClick();
              openProfileModal();
            }}
            className="flex flex-col items-center gap-1 p-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <Heart className="w-4 h-4" />
            <span>Saved</span>
          </button>
        )}

        <button
          onClick={() => {
            playClick();
            openProfileModal();
          }}
          className="flex flex-col items-center gap-1 p-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <User className="w-4 h-4" />
          <span>Account</span>
        </button>
      </nav>
    </div>
  );
};

import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';
import { Tag, Sparkles, Copy, Check, Percent, CreditCard, Flame, X } from 'lucide-react';

export const OffersView: React.FC = () => {
  const { isOffersModalOpen, closeOffersModal } = useAuth();
  const { applyCoupon, openCart } = useCart();
  const { playClick, playSuccess } = useAudio();
  const { coupons } = usePlatform();

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOffersModalOpen) return null;

  const handleCopyApply = (code: string) => {
    playSuccess();
    applyCoupon(code);
    setCopiedCode(code);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md animate-in fade-in duration-200 flex justify-center p-2 sm:p-4 md:p-6">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-brand-600 via-brand-500 to-amber-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold">
              <Percent className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-black text-2xl">
                CraveGo Mega Deals &amp; Offers
              </h3>
              <p className="text-xs text-white/90">
                Unlock exclusive discounts on premier restaurants and late-night cravings
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playClick();
              closeOffersModal();
            }}
            className="p-2.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Offers Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Deal Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-white/10 flex flex-wrap items-center justify-between gap-4 shadow-xl">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-brand-500 text-white text-[10px] font-black uppercase tracking-wider">
                  Featured
                </span>
                <span className="text-xs text-amber-300 font-bold">Limited Weekend Bonanza</span>
              </div>
              <h4 className="font-display font-black text-2xl">50% OFF Up to ₹100</h4>
              <p className="text-xs text-slate-300 mt-1 max-w-md">
                Valid on all top-rated restaurants across Biryani, Pizza, North Indian, and Burgers.
              </p>
            </div>

            <button
              onClick={() => handleCopyApply('WELCOME50')}
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-brand-500 to-amber-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-brand-500/30 hover:opacity-95 transition-opacity"
            >
              {copiedCode === 'WELCOME50' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCode === 'WELCOME50' ? 'Code Applied!' : 'Apply WELCOME50'}</span>
            </button>
          </div>

          {/* Coupon Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {coupons.map(c => {
              const isApplied = copiedCode === c.code;

              return (
                <div
                  key={c.code}
                  className="p-4 rounded-3xl bg-slate-50 dark:bg-dark-surface/60 border border-slate-200/80 dark:border-white/5 flex flex-col justify-between gap-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center font-black">
                        <Tag className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm font-mono text-brand-600 dark:text-brand-400">
                            {c.code}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.2 rounded-md bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                            {c.category}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                          {c.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">
                      Min Order: ₹{c.minOrder}
                    </span>

                    <button
                      onClick={() => handleCopyApply(c.code)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                        isApplied
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 text-brand-500 hover:bg-brand-500 hover:text-white'
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Applied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Apply</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bank Partner Offers */}
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-accent-purple" />
              <span>Bank &amp; UPI Digital Perks</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { bank: 'HDFC Bank', offer: 'Flat 15% Cashback up to ₹150 on Millennia Credit Cards', code: 'HDFCFEAST' },
                { bank: 'CRED UPI', offer: 'Get ₹100 instant discount on orders above ₹499', code: 'CREDCRAVE' },
                { bank: 'ICICI Bank', offer: 'Flat ₹75 instant discount on Amazon Pay ICICI cards', code: 'ICICITREAT' }
              ].map(b => (
                <div key={b.bank} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-surface border border-slate-200/80 dark:border-white/5 text-xs">
                  <span className="font-black text-brand-500 block mb-1">{b.bank}</span>
                  <p className="text-slate-600 dark:text-slate-300 line-clamp-2">{b.offer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

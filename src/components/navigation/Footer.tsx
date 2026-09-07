import React from 'react';
import { CraveLogo } from '../brand/CraveLogo';
import { Heart, Sparkles, ShieldCheck, Zap } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (cat: string) => void;
  onNavigateSection: (sec: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onNavigateSection
}) => {
  return (
    <footer className="w-full bg-slate-950 text-white border-t border-white/10 pt-16 pb-24 md:pb-12 mt-16 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <CraveLogo size="lg" showTagline={true} />
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              CraveGo is the premium 2026 food-technology platform delivering extraordinary culinary meals from 2,400+ top kitchens in under 20 minutes.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                100% Certified Kitchens
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-300">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Zero Emission EV Fleet
              </span>
            </div>
          </div>

          {/* Popular Cuisines */}
          <div>
            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
              Popular Cuisines
            </h5>
            <ul className="space-y-2 text-xs text-slate-300">
              {['Burgers', 'Pizza', 'Biryani', 'Sushi & Japanese', 'Chinese', 'Italian & Pasta'].map(c => (
                <li key={c}>
                  <button
                    onClick={() => onSelectCategory(c)}
                    className="hover:text-brand-400 transition-colors"
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* For Partners */}
          <div>
            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
              Ecosystem
            </h5>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => onNavigateSection('restaurant')}
                  className="hover:text-brand-400 transition-colors"
                >
                  Restaurant Partner Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('delivery')}
                  className="hover:text-brand-400 transition-colors"
                >
                  Delivery Fleet Rider App
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('admin')}
                  className="hover:text-brand-400 transition-colors"
                >
                  Platform Admin Terminal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('offers')}
                  className="hover:text-brand-400 transition-colors"
                >
                  Promotions &amp; Coupons
                </button>
              </li>
            </ul>
          </div>

          {/* Download App Badges */}
          <div>
            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
              Get the CraveGo App
            </h5>
            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer flex items-center gap-3">
                <div className="text-xl"></div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400">Download on the</span>
                  <span className="font-bold text-xs">Apple App Store</span>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer flex items-center gap-3">
                <div className="text-xl">▶</div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400">Get it on</span>
                  <span className="font-bold text-xs">Google Play</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 CraveGo Technologies Inc. All rights reserved. “Cravings. Delivered.”</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

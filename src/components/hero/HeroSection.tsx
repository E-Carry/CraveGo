import React from 'react';
import { motion } from 'framer-motion';
import { FoodHero3D } from './FoodHero3D';
import { Search, Sparkles, Zap, Star, ArrowRight, MapPin, TrendingUp, ShieldCheck, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onExploreClick: () => void;
  onSelectCategory: (cat: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  onExploreClick,
  onSelectCategory
}) => {
  const { selectedAddress, openLocationModal } = useAuth();
  const { playClick } = useAudio();

  const quickSearchTags = [
    { name: 'Biryani', icon: '🍛', color: 'from-amber-500/20 to-orange-500/10' },
    { name: 'Pizza', icon: '🍕', color: 'from-red-500/20 to-amber-500/10' },
    { name: 'Burgers', icon: '🍔', color: 'from-orange-500/20 to-yellow-500/10' },
    { name: 'Sushi', icon: '🍣', color: 'from-rose-500/20 to-pink-500/10' },
    { name: 'Desserts', icon: '🍰', color: 'from-pink-500/20 to-purple-500/10' },
    { name: 'Healthy', icon: '🥗', color: 'from-emerald-500/20 to-teal-500/10' }
  ];

  return (
    <section className="relative w-full overflow-hidden pt-8 pb-14 md:pt-14 md:pb-20 bg-gradient-to-b from-red-500/5 via-orange-500/5 to-transparent">
      {/* Animated Glowing Ambient Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.25, 0.45, 0.25]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-10 left-1/4 w-[420px] h-[420px] bg-gradient-to-tr from-red-600/30 to-orange-500/20 rounded-full blur-[110px] pointer-events-none -z-10"
      />
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-28 right-10 w-[380px] h-[380px] bg-gradient-to-bl from-amber-500/30 to-emerald-500/15 rounded-full blur-[110px] pointer-events-none -z-10"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* Left Column: Headlines, Search & Live Floating Badges */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-6 flex flex-col items-start z-10"
          >
            {/* Top Live Badge */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-500/15 via-orange-500/15 to-amber-500/15 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-black mb-5 shadow-sm backdrop-blur-md"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span>20-Minute Flash Delivery Across 5 Metros 🇮🇳</span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-neutral-900 dark:text-white leading-[1.06] mb-5">
              Craving Something{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 drop-shadow-sm">
                Extraordinary?
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 font-normal leading-relaxed max-w-xl mb-6">
              Explore 105+ top-rated restaurants, authentic regional recipes, and sizzling hot delicacies delivered right to your doorstep in minutes.
            </p>

            {/* Floating Glassmorphic Search Container */}
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-xl p-2.5 rounded-3xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-2xl border border-neutral-200/90 dark:border-white/10 shadow-2xl shadow-red-500/10 mb-5"
            >
              {/* Delivery location selector */}
              <div className="flex items-center justify-between px-3 py-1.5 mb-1 border-b border-neutral-100 dark:border-white/5 text-xs text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    Delivering to:
                  </span>
                  <span className="truncate font-medium">{selectedAddress?.street || '100 Feet Rd, Indiranagar, Bengaluru'}</span>
                </div>
                <button
                  onClick={() => {
                    playClick();
                    openLocationModal();
                  }}
                  className="text-red-600 dark:text-red-400 hover:underline font-extrabold text-[11px] shrink-0 ml-2"
                >
                  Change
                </button>
              </div>

              {/* Main Search Input */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search for biryani, pizzas, burgers, rolls, desserts..."
                    className="w-full pl-10 pr-3 py-3 bg-transparent text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none font-medium"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    playClick();
                    onExploreClick();
                  }}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-red-600/30 transition-all shrink-0"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>

            {/* Quick Filter Tag Chips */}
            <div className="flex items-center gap-2 flex-wrap mb-8">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Trending:
              </span>
              {quickSearchTags.map(tag => (
                <motion.button
                  key={tag.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    playClick();
                    onSelectCategory(tag.name);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-neutral-800/80 hover:bg-red-500/15 hover:text-red-500 border border-neutral-200/80 dark:border-white/10 text-xs font-bold text-neutral-800 dark:text-neutral-200 shadow-sm transition-all`}
                >
                  <span className="text-sm">{tag.icon}</span>
                  <span>{tag.name}</span>
                </motion.button>
              ))}
            </div>

            {/* Trust Metrics Bar */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-5 border-t border-neutral-200/80 dark:border-white/10 w-full max-w-lg">
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-neutral-900 dark:text-white font-black text-xl sm:text-2xl font-display">
                  <span>18 mins</span>
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                </div>
                <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                  Avg Delivery Time
                </span>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-neutral-900 dark:text-white font-black text-xl sm:text-2xl font-display">
                  <span>105+</span>
                  <Sparkles className="w-4 h-4 text-red-500" />
                </div>
                <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                  Partner Kitchens
                </span>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-neutral-900 dark:text-white font-black text-xl sm:text-2xl font-display">
                  <span>4.95 ★</span>
                  <Award className="w-4 h-4 text-emerald-500" />
                </div>
                <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                  FSSAI Verified
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: 3D Interactive Canvas */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[380px] sm:min-h-[460px]">
            {/* 3D Canvas */}
            <FoodHero3D onSelectCuisine={onSelectCategory} />
          </div>
        </div>
      </div>
    </section>
  );
};

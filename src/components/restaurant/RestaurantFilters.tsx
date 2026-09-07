import React from 'react';
import { SlidersHorizontal, Sparkles, Star, Zap, Percent, ArrowUpDown } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

export interface FilterState {
  vegOnly: boolean;
  minRating: number;
  fastDeliveryOnly: boolean;
  offersOnly: boolean;
  priceTier: string; // 'all' | 'budget' | 'mid' | 'premium'
  sortBy: 'recommended' | 'rating' | 'delivery' | 'costAsc' | 'costDesc';
}

interface RestaurantFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalResultsCount: number;
}

export const RestaurantFilters: React.FC<RestaurantFiltersProps> = ({
  filters,
  setFilters,
  totalResultsCount
}) => {
  const { playClick } = useAudio();

  const toggleFilter = (key: keyof FilterState, value: unknown) => {
    playClick();
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-200/60 dark:border-white/5">
      {/* Left: Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto py-1">
        {/* Total count badge */}
        <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-dark-card border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">
          <SlidersHorizontal className="w-3.5 h-3.5 text-brand-500" />
          <span>{totalResultsCount} Restaurants</span>
        </div>

        {/* Veg Only Toggle */}
        <button
          onClick={() => toggleFilter('vegOnly', !filters.vegOnly)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all shrink-0 ${
            filters.vegOnly
              ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-bold'
              : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Pure Veg</span>
        </button>

        {/* Rating 4.5+ */}
        <button
          onClick={() => toggleFilter('minRating', filters.minRating === 4.5 ? 0 : 4.5)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all shrink-0 ${
            filters.minRating === 4.5
              ? 'bg-amber-500/15 border-amber-500 text-amber-700 dark:text-amber-400 font-bold'
              : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
          <span>Rating 4.5+</span>
        </button>

        {/* Fast Delivery (< 25 min) */}
        <button
          onClick={() => toggleFilter('fastDeliveryOnly', !filters.fastDeliveryOnly)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all shrink-0 ${
            filters.fastDeliveryOnly
              ? 'bg-brand-500/15 border-brand-500 text-brand-600 dark:text-brand-400 font-bold'
              : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-brand-500 fill-brand-500" />
          <span>Fast Delivery &lt;25m</span>
        </button>

        {/* Great Offers */}
        <button
          onClick={() => toggleFilter('offersOnly', !filters.offersOnly)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all shrink-0 ${
            filters.offersOnly
              ? 'bg-accent-purple/15 border-accent-purple text-accent-purple dark:text-purple-300 font-bold'
              : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <Percent className="w-3.5 h-3.5 text-accent-purple" />
          <span>Great Offers</span>
        </button>
      </div>

      {/* Right: Sort Dropdown */}
      <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
          <ArrowUpDown className="w-3 h-3 text-slate-400" />
          Sort by:
        </span>
        <select
          value={filters.sortBy}
          onChange={e =>
            toggleFilter(
              'sortBy',
              e.target.value as 'recommended' | 'rating' | 'delivery' | 'costAsc' | 'costDesc'
            )
          }
          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-dark-card border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="recommended">⭐ Recommended</option>
          <option value="rating">🏆 Highest Rated</option>
          <option value="delivery">⚡ Delivery Time</option>
          <option value="costAsc">💲 Cost: Low to High</option>
          <option value="costDesc">💰 Cost: High to Low</option>
        </select>
      </div>
    </div>
  );
};

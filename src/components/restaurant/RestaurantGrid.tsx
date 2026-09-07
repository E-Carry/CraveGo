import React, { useState } from 'react';
import { Restaurant } from '../../types';
import { RestaurantCard } from './RestaurantCard';
import { UtensilsCrossed, RotateCcw } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

interface RestaurantGridProps {
  restaurants: Restaurant[];
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onResetFilters: () => void;
}

export const RestaurantGrid: React.FC<RestaurantGridProps> = ({
  restaurants,
  onSelectRestaurant,
  onResetFilters
}) => {
  const [displayCount, setDisplayCount] = useState(16);
  const { playClick } = useAudio();

  const visibleRestaurants = restaurants.slice(0, displayCount);

  if (restaurants.length === 0) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 rounded-3xl bg-brand-500/10 dark:bg-brand-500/20 flex items-center justify-center mb-4 text-brand-500">
          <UtensilsCrossed className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
          No delicious matches found
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
          We couldn't find any restaurants matching your current filters or search term.
        </p>
        <button
          onClick={() => {
            playClick();
            onResetFilters();
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-lg shadow-brand-500/30 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset All Filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleRestaurants.map(rest => (
          <RestaurantCard
            key={rest.id}
            restaurant={rest}
            onSelect={onSelectRestaurant}
          />
        ))}
      </div>

      {/* Load More Button */}
      {displayCount < restaurants.length && (
        <div className="mt-10 flex flex-col items-center justify-center gap-2">
          <button
            onClick={() => {
              playClick();
              setDisplayCount(prev => prev + 16);
            }}
            className="px-8 py-3 rounded-2xl bg-white dark:bg-dark-card hover:bg-slate-100 dark:hover:bg-dark-hover border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
          >
            Load More Restaurants ({restaurants.length - displayCount} remaining)
          </button>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Showing {visibleRestaurants.length} of {restaurants.length} restaurants
          </span>
        </div>
      )}
    </div>
  );
};

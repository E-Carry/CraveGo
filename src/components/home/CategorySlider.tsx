import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { CATEGORIES } from '../../data/categories';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

interface CategorySliderProps {
  selectedCategory: string | null;
  onSelectCategory: (catId: string | null) => void;
}

export const CategorySlider: React.FC<CategorySliderProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const { playClick } = useAudio();

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const amount = direction === 'left' ? -350 : 350;
      sliderRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full py-8 border-b border-neutral-200/80 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-black font-display text-neutral-900 dark:text-white">
                What's On Your Mind?
              </h3>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
                <Sparkles className="w-3 h-3" />
                Handpicked
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              Explore mouth-watering delicacies across 14 curated culinary styles
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {selectedCategory && (
              <button
                onClick={() => {
                  playClick();
                  onSelectCategory(null);
                }}
                className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline mr-2"
              >
                Clear Filter
              </button>
            )}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => scroll('left')}
              className="p-2 rounded-full border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-700 dark:text-neutral-300 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => scroll('right')}
              className="p-2 rounded-full border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-700 dark:text-neutral-300 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Horizontal Category Track */}
        <div
          ref={sliderRef}
          className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-2 scroll-smooth"
        >
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.name || selectedCategory === cat.id;

            return (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  playClick();
                  onSelectCategory(isSelected ? null : cat.name);
                }}
                className={`group flex flex-col items-center shrink-0 w-24 sm:w-28 p-2 rounded-2xl transition-all duration-200 ${
                  isSelected
                    ? 'bg-red-500/10 dark:bg-red-500/20 ring-2 ring-red-500 scale-105'
                    : 'hover:bg-neutral-100 dark:hover:bg-white/5'
                }`}
              >
                {/* Category Circular Photo + Icon */}
                <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-md mb-2 group-hover:scale-105 transition-transform border-2 border-transparent group-hover:border-red-500/40">
                  <img
                    src={cat.image}
                    onError={(e: any) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80';
                    }}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center text-xl sm:text-2xl drop-shadow">
                    {cat.icon}
                  </div>
                </div>

                <span
                  className={`text-xs font-bold text-center truncate max-w-full leading-tight ${
                    isSelected
                      ? 'text-red-600 dark:text-red-400 font-black'
                      : 'text-neutral-800 dark:text-neutral-200'
                  }`}
                >
                  {cat.name}
                </span>
                <span className="text-[10px] text-neutral-400 mt-0.5">
                  {cat.dishCount}+ dishes
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

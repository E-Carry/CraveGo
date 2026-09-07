import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Restaurant } from '../../types';
import { Star, Clock, MapPin, Heart, Percent, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onSelect: (restaurant: Restaurant) => void;
}

const FALLBACK_RESTAURANT_IMG = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80';

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onSelect
}) => {
  const { favoriteRestaurantIds, toggleFavoriteRestaurant } = useAuth();
  const { playClick } = useAudio();
  const [imgSrc, setImgSrc] = useState(restaurant.image);

  const isFavorite = favoriteRestaurantIds.includes(restaurant.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.015 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      onClick={() => onSelect(restaurant)}
      className="group relative rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* Cover Image Container */}
      <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <img
          src={imgSrc}
          onError={() => setImgSrc(FALLBACK_RESTAURANT_IMG)}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Gradient Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Favorite Heart Button */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={e => {
            e.stopPropagation();
            playClick();
            toggleFavoriteRestaurant(restaurant.id);
          }}
          aria-label="Toggle favorite"
          className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors z-10"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'
            }`}
          />
        </motion.button>

        {/* Offer Ribbon (if any) */}
        {restaurant.hasOffers && restaurant.offerText && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white text-[10px] font-black shadow-lg shadow-red-600/30">
            <Percent className="w-3 h-3 stroke-[2.5]" />
            <span>{restaurant.offerText}</span>
          </div>
        )}

        {/* Bottom floating pills over image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 font-bold">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>{restaurant.deliveryTimeMin}-{restaurant.deliveryTimeMax} mins</span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 font-bold">
            <MapPin className="w-3.5 h-3.5 text-orange-400" />
            <span>{restaurant.distanceKm} km</span>
          </div>
        </div>
      </div>

      {/* Restaurant Info Card */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-extrabold text-base text-neutral-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-1">
              {restaurant.name}
            </h4>

            {/* Rating pill */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-600 text-white text-xs font-black shrink-0 shadow-sm">
              <span>{restaurant.rating}</span>
              <Star className="w-3 h-3 fill-white" />
            </div>
          </div>

          {/* Cuisines */}
          <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mb-2 font-medium">
            {restaurant.cuisines.join(' • ')}
          </p>
        </div>

        {/* Bottom meta: Cost & Veg badge */}
        <div className="pt-3 border-t border-neutral-100 dark:border-white/5 flex items-center justify-between text-xs">
          <span className="font-extrabold text-neutral-800 dark:text-neutral-200">
            ₹{restaurant.costForTwo} for two
          </span>

          <div className="flex items-center gap-1.5">
            {restaurant.isPureVeg && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Pure Veg
              </span>
            )}
            <span className="text-[11px] text-neutral-400">
              {restaurant.ratingCount}+ reviews
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

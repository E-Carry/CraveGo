import React, { useState, useMemo } from 'react';
import { Restaurant, FoodItem } from '../../types';
import { FOOD_ITEMS } from '../../data/foodItems';
import { FoodCard } from '../food/FoodCard';
import { FoodCustomizationModal } from '../food/FoodCustomizationModal';
import {
  X,
  Star,
  Clock,
  MapPin,
  Heart,
  Share2,
  Search,
  CheckCircle,
  Info,
  SlidersHorizontal
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';

interface RestaurantDetailModalProps {
  restaurant: Restaurant | null;
  onClose: () => void;
}

export const RestaurantDetailModal: React.FC<RestaurantDetailModalProps> = ({
  restaurant,
  onClose
}) => {
  const { favoriteRestaurantIds, toggleFavoriteRestaurant } = useAuth();
  const { playClick } = useAudio();

  const [menuSearch, setMenuSearch] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [selectedMenuCategory, setSelectedMenuCategory] = useState<string>('All');
  const [customizingItem, setCustomizingItem] = useState<FoodItem | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);

  // Dishes belonging to this restaurant
  const restaurantDishes = useMemo(() => {
    if (!restaurant) return [];
    return FOOD_ITEMS.filter(item => item.restaurantId === restaurant.id);
  }, [restaurant]);

  // Categories present in this restaurant's menu
  const menuCategories = useMemo(() => {
    const cats = Array.from(new Set(restaurantDishes.map(d => d.category)));
    return ['All', ...cats];
  }, [restaurantDishes]);

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    return restaurantDishes.filter(dish => {
      if (vegOnly && !dish.isVeg) return false;
      if (selectedMenuCategory !== 'All' && dish.category !== selectedMenuCategory) return false;
      if (menuSearch.trim()) {
        const q = menuSearch.toLowerCase();
        return dish.name.toLowerCase().includes(q) || dish.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [restaurantDishes, vegOnly, selectedMenuCategory, menuSearch]);

  if (!restaurant) return null;

  const isFavorite = favoriteRestaurantIds.includes(restaurant.id);

  const handleShare = () => {
    playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md animate-in fade-in duration-200 flex justify-center p-2 sm:p-4 md:p-6">
      <div className="relative w-full max-w-5xl rounded-3xl bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Cover Photo Header */}
        <div className="relative h-56 sm:h-72 w-full shrink-0 overflow-hidden bg-slate-200 dark:bg-dark-surface">
          <img
            src={restaurant.coverImage}
            onError={(e: any) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80';
            }}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* Navigation & Action Buttons */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold border border-white/10">
                {restaurant.city}
              </span>
              {restaurant.isOpen && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-bold shadow-md">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  Open Now
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2.5 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-md transition-colors"
                title="Share Restaurant"
              >
                {copiedShare ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => {
                  playClick();
                  toggleFavoriteRestaurant(restaurant.id);
                }}
                className="p-2.5 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-md transition-colors"
                title="Favorite"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'
                  }`}
                />
              </button>
              <button
                onClick={() => {
                  playClick();
                  onClose();
                }}
                className="p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-md transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Restaurant Title & Info Bar Overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-4xl font-black font-display tracking-tight drop-shadow-md">
                  {restaurant.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 mt-1 font-medium">
                  {restaurant.cuisines.join(' • ')}
                </p>
                <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-400" />
                  <span>{restaurant.address}</span>
                </p>
              </div>

              {/* Quick Metrics Bar */}
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center px-3 py-1.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10">
                  <div className="flex items-center gap-1 text-emerald-400 font-extrabold text-sm sm:text-base">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{restaurant.rating}</span>
                  </div>
                  <span className="text-[10px] text-slate-300 font-medium">
                    {restaurant.ratingCount}+ ratings
                  </span>
                </div>

                <div className="flex flex-col items-center px-3 py-1.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10">
                  <div className="flex items-center gap-1 text-accent-teal font-extrabold text-sm sm:text-base">
                    <Clock className="w-4 h-4" />
                    <span>{restaurant.deliveryTimeMin}-{restaurant.deliveryTimeMax}m</span>
                  </div>
                  <span className="text-[10px] text-slate-300 font-medium">
                    ₹{restaurant.costForTwo} for two
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Offers & Description Strip */}
        <div className="px-4 sm:px-6 py-3 bg-slate-50 dark:bg-dark-surface/60 border-b border-slate-200/80 dark:border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            {restaurant.description}
          </p>
          {restaurant.offerText && (
            <div className="px-3 py-1 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold border border-brand-500/30">
              🏷️ {restaurant.offerText}
            </div>
          )}
        </div>

        {/* Menu Search & Category Filter Navigation */}
        <div className="px-4 sm:px-6 py-3 border-b border-slate-200/80 dark:border-white/5 bg-white dark:bg-dark-card flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Horizontal category tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto py-1">
            {menuCategories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  playClick();
                  setSelectedMenuCategory(cat);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  selectedMenuCategory === cat
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                    : 'bg-slate-100 dark:bg-dark-surface hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search within Menu & Veg Only toggle */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Veg toggle */}
            <button
              onClick={() => {
                playClick();
                setVegOnly(!vegOnly);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                vegOnly
                  ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Veg Only</span>
            </button>

            {/* Dish search */}
            <div className="relative flex-1 md:w-52">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={menuSearch}
                onChange={e => setMenuSearch(e.target.value)}
                placeholder="Search dish in menu..."
                className="w-full pl-8 pr-3 py-1.5 rounded-full bg-slate-100 dark:bg-dark-surface border border-transparent focus:border-brand-500/40 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Dishes Listing Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Menu ({filteredDishes.length} items)
            </span>
          </div>

          {filteredDishes.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              No dishes found matching your selection in this menu.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDishes.map(dish => (
                <FoodCard
                  key={dish.id}
                  foodItem={dish}
                  restaurantName={restaurant.name}
                  onOpenCustomizer={item => setCustomizingItem(item)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Customization Modal */}
      {customizingItem && (
        <FoodCustomizationModal
          foodItem={customizingItem}
          restaurantName={restaurant.name}
          onClose={() => setCustomizingItem(null)}
        />
      )}
    </div>
  );
};

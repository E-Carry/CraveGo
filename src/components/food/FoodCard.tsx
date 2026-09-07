import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FoodItem } from '../../types';
import { Star, Flame, Plus, Minus, Clock, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAudio } from '../../context/AudioContext';

interface FoodCardProps {
  foodItem: FoodItem;
  restaurantName: string;
  onOpenCustomizer: (item: FoodItem) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  foodItem,
  restaurantName,
  onOpenCustomizer
}) => {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const { playClick, playAdd } = useAudio();
  const [imgSrc, setImgSrc] = useState(foodItem.image);

  // Find if this food item exists in cart (sum of quantities across variations)
  const matchingCartItems = cartItems.filter(item => item.foodItem.id === foodItem.id);
  const totalQtyInCart = matchingCartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  const handleAddClick = () => {
    if (foodItem.customizations && foodItem.customizations.length > 0) {
      onOpenCustomizer(foodItem);
    } else {
      addToCart(foodItem, [], 1, restaurantName);
    }
  };

  const handleMinusClick = () => {
    if (matchingCartItems.length > 0) {
      updateQuantity(matchingCartItems[0].cartItemId, -1);
    }
  };

  const handlePlusClick = () => {
    if (foodItem.customizations && foodItem.customizations.length > 0) {
      onOpenCustomizer(foodItem);
    } else if (matchingCartItems.length > 0) {
      updateQuantity(matchingCartItems[0].cartItemId, 1);
    } else {
      addToCart(foodItem, [], 1, restaurantName);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      className="group relative rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 p-4 sm:p-5 flex flex-col justify-between hover:shadow-xl hover:shadow-red-500/5 transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left Dish Details */}
        <div className="flex-1 pr-1">
          {/* Authentic FSSAI Veg / Non-Veg Indicator & Tags */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {foodItem.isVeg ? (
              // Authentic Veg: Green square border with solid green circular dot inside
              <span
                className="w-4 h-4 rounded-sm border-[1.5px] border-emerald-600 dark:border-emerald-500 flex items-center justify-center p-0.5"
                title="100% Vegetarian"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-500" />
              </span>
            ) : (
              // Authentic Non-Veg: Brown square border with solid brown triangle inside
              <span
                className="w-4 h-4 rounded-sm border-[1.5px] border-amber-800 dark:border-amber-700 flex items-center justify-center p-0.5"
                title="Non-Vegetarian"
              >
                <span
                  className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[7px] border-b-amber-800 dark:border-b-amber-700"
                />
              </span>
            )}

            {foodItem.isBestseller && (
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Bestseller
              </span>
            )}

            {foodItem.isSpicy && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <Flame className="w-3 h-3 fill-rose-500" />
                Spicy
              </span>
            )}
          </div>

          {/* Dish Name */}
          <h4 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white leading-snug group-hover:text-red-500 transition-colors line-clamp-2">
            {foodItem.name}
          </h4>

          {/* Indian Rupee (₹) Pricing */}
          <div className="flex items-baseline gap-2 mt-1.5 mb-2">
            <span className="font-extrabold text-base sm:text-lg text-neutral-900 dark:text-white">
              ₹{Math.round(foodItem.price)}
            </span>
            {foodItem.originalPrice && foodItem.originalPrice > foodItem.price && (
              <span className="text-xs text-neutral-400 line-through">
                ₹{Math.round(foodItem.originalPrice)}
              </span>
            )}
            {foodItem.originalPrice && foodItem.originalPrice > foodItem.price && (
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                {Math.round(((foodItem.originalPrice - foodItem.price) / foodItem.originalPrice) * 100)}% OFF
              </span>
            )}
          </div>

          {/* Rating & Prep time */}
          <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 mb-2 flex-wrap">
            <div className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
              <Star className="w-3 h-3 fill-current" />
              <span>{foodItem.rating}</span>
              <span className="text-neutral-400 font-normal">({foodItem.ratingCount})</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-neutral-400" />
              <span>{foodItem.preparationTimeMinutes} mins</span>
            </div>
            {foodItem.calories && <span>{foodItem.calories} kcal</span>}
          </div>

          {/* Description */}
          <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
            {foodItem.description}
          </p>
        </div>

        {/* Right Photo & Animated Action Stepper */}
        <div className="relative shrink-0 flex flex-col items-center">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shadow-md">
            <img
              src={imgSrc}
              onError={() => setImgSrc('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80')}
              alt={foodItem.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>

          {/* Add / Quantity Stepper Overlay */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[85%] z-10">
            {totalQtyInCart > 0 ? (
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                className="flex items-center justify-between px-2 py-1 rounded-xl bg-red-600 text-white font-black text-xs shadow-lg shadow-red-600/30 border border-red-500"
              >
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={e => {
                    e.stopPropagation();
                    handleMinusClick();
                  }}
                  className="p-1 hover:bg-black/20 rounded-md transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </motion.button>
                <span className="px-1 text-sm font-black">{totalQtyInCart}</span>
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={e => {
                    e.stopPropagation();
                    handlePlusClick();
                  }}
                  className="p-1 hover:bg-black/20 rounded-md transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.94 }}
                onClick={e => {
                  e.stopPropagation();
                  handleAddClick();
                }}
                className="w-full py-2 px-3 rounded-xl bg-white dark:bg-neutral-900 hover:bg-red-600 hover:text-white border-2 border-red-500/60 dark:border-red-500/80 text-red-600 dark:text-red-400 font-extrabold text-xs uppercase tracking-wider shadow-lg hover:shadow-red-500/30 transition-all flex items-center justify-center gap-1"
              >
                <span>ADD</span>
                <Plus className="w-3 h-3 stroke-[3]" />
              </motion.button>
            )}
          </div>

          {/* Customizable indicator flag */}
          {foodItem.customizations && foodItem.customizations.length > 0 && (
            <span className="text-[10px] text-neutral-400 font-medium tracking-wide mt-4">
              customisable
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

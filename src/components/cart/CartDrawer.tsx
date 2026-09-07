import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useAudio } from '../../context/AudioContext';
import { usePlatform } from '../../context/PlatformContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  Heart,
  HeartHandshake,
  Sparkles,
  Info
} from 'lucide-react';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
  onExploreFood: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onProceedToCheckout,
  onExploreFood
}) => {
  const {
    isCartOpen,
    closeCart,
    cartItems,
    restaurantName,
    updateQuantity,
    removeFromCart,
    clearCart,
    cookingInstructions,
    setCookingInstructions,
    riderTip,
    setRiderTip,
    donation,
    isDonationOpted,
    toggleDonation,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    itemTotal,
    deliveryFee,
    platformFee,
    taxes,
    discountAmount,
    grandTotal
  } = useCart();

  const { playClick, playSuccess } = useAudio();
  const { coupons } = usePlatform();
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (code: string) => {
    const res = applyCoupon(code);
    setCouponFeedback({
      message: res.message,
      isError: !res.success
    });
    if (res.success) {
      setCouponInput('');
    }
  };

  const freeDeliveryShortfall = 299 - itemTotal;
  const totalSavings = discountAmount + (deliveryFee === 0 && itemTotal >= 299 ? 35 : 0);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCart}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Sliding Drawer */}
        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="w-screen max-w-md bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-white/10 shadow-2xl flex flex-col h-full text-neutral-900 dark:text-white"
          >
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-neutral-200/80 dark:border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg leading-none">
                    My Food Cart
                  </h3>
                  {restaurantName && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium truncate max-w-[200px] mt-0.5">
                      from <span className="font-semibold text-neutral-700 dark:text-neutral-200">{restaurantName}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {cartItems.length > 0 && (
                  <button
                    onClick={() => {
                      playClick();
                      clearCart();
                    }}
                    className="text-xs text-rose-500 hover:underline font-semibold px-2 py-1 rounded-md hover:bg-rose-500/10 transition-colors"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={() => {
                    playClick();
                    closeCart();
                  }}
                  className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Free Delivery Banner if applicable */}
            {cartItems.length > 0 && freeDeliveryShortfall > 0 && (
              <div className="px-4 py-2 bg-gradient-to-r from-orange-500/10 to-amber-500/10 border-b border-orange-500/20 text-xs flex items-center justify-between text-orange-700 dark:text-orange-300 shrink-0">
                <span className="flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  Add ₹{freeDeliveryShortfall} more for <strong className="font-bold">FREE Delivery</strong>
                </span>
                <span className="text-[10px] font-bold bg-orange-500 text-white px-1.5 py-0.5 rounded">
                  ₹35 Saved
                </span>
              </div>
            )}

            {/* Cart Body */}
            {cartItems.length === 0 ? (
              /* Empty Cart State */
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="relative w-28 h-28 mb-4 flex items-center justify-center">
                  <div className="absolute inset-0 bg-red-500/10 rounded-full blur-xl animate-pulse" />
                  <div className="w-20 h-20 rounded-3xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 flex items-center justify-center text-4xl shadow-md">
                    🍲
                  </div>
                </div>

                <h4 className="font-black text-xl mb-1">
                  Your cart is empty
                </h4>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-xs mb-6">
                  Add items from top-rated restaurants around you and indulge in delicious cravings!
                </p>

                <button
                  onClick={() => {
                    playClick();
                    closeCart();
                    onExploreFood();
                  }}
                  className="py-3 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-extrabold text-sm shadow-xl shadow-red-500/30 hover:opacity-95 transition-opacity"
                >
                  Explore Restaurants & Menus
                </button>
              </div>
            ) : (
              /* Active Cart Items */
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                {/* Item Cards */}
                <div className="space-y-2.5">
                  {cartItems.map(item => (
                    <motion.div
                      layout
                      key={item.cartItemId}
                      className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/70 dark:border-white/5 flex items-start justify-between gap-3"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          {item.foodItem.isVeg ? (
                            <span className="w-3.5 h-3.5 rounded-sm border border-emerald-600 flex items-center justify-center p-0.5 shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            </span>
                          ) : (
                            <span className="w-3.5 h-3.5 rounded-sm border border-amber-800 flex items-center justify-center p-0.5 shrink-0">
                              <span className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[5px] border-b-amber-800" />
                            </span>
                          )}
                          <h5 className="font-bold text-sm leading-snug">
                            {item.foodItem.name}
                          </h5>
                        </div>

                        {/* Customizations */}
                        {item.selectedCustomizations.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {item.selectedCustomizations.map(c => (
                              <span
                                key={c.groupId}
                                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-white/5"
                              >
                                {c.choiceNames.join(', ')}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-1.5 font-extrabold text-sm text-neutral-900 dark:text-white">
                          ₹{item.totalPrice}
                        </div>
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center gap-2 p-1 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 shrink-0">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, -1)}
                          className="p-1 hover:bg-neutral-100 dark:hover:bg-white/10 rounded-md text-neutral-600 dark:text-neutral-300 transition-colors"
                        >
                          {item.quantity === 1 ? (
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          ) : (
                            <Minus className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <span className="font-black text-xs min-w-[16px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, 1)}
                          className="p-1 hover:bg-neutral-100 dark:hover:bg-white/10 rounded-md text-neutral-600 dark:text-neutral-300 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Cooking Instructions */}
                <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/70 dark:border-white/5">
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Cooking Instructions
                  </label>
                  <input
                    type="text"
                    value={cookingInstructions}
                    onChange={e => setCookingInstructions(e.target.value)}
                    placeholder="e.g. Less spicy, keep chutney extra, ring bell once..."
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                {/* Coupons Section */}
                <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/70 dark:border-white/5 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <Tag className="w-3.5 h-3.5 text-red-500" />
                    <span>Offers & Coupons</span>
                  </div>

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <div className="text-xs">
                          <span className="font-black uppercase">{appliedCoupon.code}</span>
                          <p className="text-[11px] opacity-90">Saved ₹{discountAmount} with this code</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          playClick();
                          removeCoupon();
                        }}
                        className="text-xs font-bold text-rose-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={e => setCouponInput(e.target.value.toUpperCase())}
                          placeholder="Enter Promo Code (e.g. WELCOME50)"
                          className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-xs font-bold uppercase placeholder:normal-case placeholder:font-normal placeholder:text-neutral-400 focus:outline-none"
                        />
                        <button
                          onClick={() => handleApplyCoupon(couponInput)}
                          className="py-1.5 px-3.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-bold text-xs hover:opacity-90 transition-opacity"
                        >
                          Apply
                        </button>
                      </div>

                      {couponFeedback && (
                        <p
                          className={`text-[11px] font-semibold ${
                            couponFeedback.isError ? 'text-rose-500' : 'text-emerald-500'
                          }`}
                        >
                          {couponFeedback.message}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {coupons.filter(cp => cp.isActive !== false).slice(0, 4).map(cp => (
                          <button
                            key={cp.code}
                            onClick={() => handleApplyCoupon(cp.code)}
                            className="text-[10px] font-extrabold px-2 py-1 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                          >
                            {cp.code} ({cp.discountPercentage ? `${cp.discountPercentage}% OFF` : `₹${cp.flatDiscount} OFF`})
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Feeding India Donation Checkbox */}
                <div className="p-3 rounded-2xl bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-red-500/10 text-red-500">
                      <Heart className="w-4 h-4 fill-red-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs">Feeding India by CraveGo</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-600 dark:text-red-400 font-extrabold">
                          ₹2
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                        Help feed someone in need with every meal
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isDonationOpted}
                    onChange={toggleDonation}
                    className="w-4 h-4 rounded text-red-600 focus:ring-red-500 accent-red-600 cursor-pointer"
                  />
                </div>

                {/* Delivery Tip */}
                <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/70 dark:border-white/5">
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <span className="flex items-center gap-1.5">
                      <HeartHandshake className="w-3.5 h-3.5 text-orange-500" />
                      <span>Delivery Partner Tip</span>
                    </span>
                    {riderTip > 0 && <span className="text-emerald-500 font-extrabold">₹{riderTip} added</span>}
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[20, 30, 50, 100].map(tip => (
                      <button
                        key={tip}
                        onClick={() => {
                          playClick();
                          setRiderTip(riderTip === tip ? 0 : tip);
                        }}
                        className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                          riderTip === tip
                            ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                            : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        ₹{tip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Detailed Zomato-style Indian Rupee Bill */}
                <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/70 dark:border-white/5 space-y-2 text-xs">
                  <h6 className="font-bold text-neutral-900 dark:text-white mb-1">
                    Bill Details (INR)
                  </h6>
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span>Item Total</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">
                      ₹{itemTotal}
                    </span>
                  </div>

                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span>Delivery Partner Fee</span>
                    <span className="font-semibold">
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <span className="line-through text-neutral-400 font-normal">₹35</span> FREE
                        </span>
                      ) : (
                        `₹${deliveryFee}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span className="flex items-center gap-1">
                      <span>Platform Fee</span>
                      <Info className="w-3 h-3 text-neutral-400" />
                    </span>
                    <span className="font-semibold text-neutral-900 dark:text-white">
                      ₹{platformFee.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span>GST & Restaurant Taxes (5%)</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">
                      ₹{taxes}
                    </span>
                  </div>

                  {donation > 0 && (
                    <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                      <span>Feeding India Donation</span>
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        ₹{donation}
                      </span>
                    </div>
                  )}

                  {riderTip > 0 && (
                    <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                      <span>Delivery Partner Tip</span>
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        ₹{riderTip}
                      </span>
                    </div>
                  )}

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                      <span>Coupon Discount ({appliedCoupon?.code})</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}

                  {totalSavings > 0 && (
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold text-center">
                      🎉 You saved ₹{totalSavings} on this order!
                    </div>
                  )}

                  <div className="pt-2 border-t border-neutral-200 dark:border-white/10 flex justify-between font-black text-sm text-neutral-900 dark:text-white">
                    <span>Grand Total</span>
                    <span className="text-base text-red-600 dark:text-red-400 font-extrabold">
                      ₹{grandTotal}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Checkout CTA */}
            {cartItems.length > 0 && (
              <div className="p-4 border-t border-neutral-200/80 dark:border-white/10 bg-white dark:bg-neutral-900 shrink-0">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    playClick();
                    closeCart();
                    onProceedToCheckout();
                  }}
                  className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-black text-sm flex items-center justify-between shadow-xl shadow-red-500/30 transition-all"
                >
                  <div className="text-left">
                    <span className="block text-[11px] font-semibold opacity-90 leading-tight">
                      Total: ₹{grandTotal}
                    </span>
                    <span className="text-sm font-bold">Proceed to Checkout</span>
                  </div>
                  <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-xl font-bold">
                    <span>Pay</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

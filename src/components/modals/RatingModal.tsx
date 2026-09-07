import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';
import { X, Star, Sparkles, ThumbsUp, Camera } from 'lucide-react';

interface RatingModalProps {
  orderId: string | null;
  onClose: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({ orderId, onClose }) => {
  const { orders, rateOrder } = useAuth();
  const { playClick, playSuccess } = useAudio();

  const [foodRating, setFoodRating] = useState(5);
  const [deliveryRating, setDeliveryRating] = useState(5);
  const [packagingRating, setPackagingRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const order = orders.find(o => o.id === orderId);

  if (!orderId || !order) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSuccess();
    rateOrder(order.id, {
      food: foodRating,
      delivery: deliveryRating,
      packaging: packagingRating,
      comment
    });
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const renderStarSelector = (
    label: string,
    currentVal: number,
    setter: (val: number) => void
  ) => (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/5 last:border-none">
      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => {
              playClick();
              setter(star);
            }}
            className="p-1 hover:scale-110 transition-transform"
          >
            <Star
              className={`w-5 h-5 ${
                star <= currentVal
                  ? 'fill-amber-400 text-amber-500'
                  : 'text-slate-300 dark:text-white/20'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md animate-in fade-in duration-200 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 shadow-2xl p-6 sm:p-7 animate-in zoom-in-95 duration-200">
        <button
          onClick={() => {
            playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <ThumbsUp className="w-8 h-8" />
            </div>
            <h3 className="font-display font-black text-xl text-slate-900 dark:text-white">
              Thank You for Your Review!
            </h3>
            <p className="text-xs text-slate-500">
              Your feedback helps {order.restaurantName} and our community enjoy delicious experiences.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-500">
                Rate Your Experience
              </span>
              <h3 className="font-display font-black text-xl text-slate-900 dark:text-white mt-0.5">
                {order.restaurantName}
              </h3>
              <p className="text-xs text-slate-400">Order #{order.id}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-surface border border-slate-200/80 dark:border-white/5 space-y-1">
              {renderStarSelector('Taste & Food Quality', foodRating, setFoodRating)}
              {renderStarSelector('Delivery Partner Service', deliveryRating, setDeliveryRating)}
              {renderStarSelector('Packaging & Warmth', packagingRating, setPackagingRating)}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Write a Review (Optional)
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="How was the flavor, temperature and presentation? Tell us what you loved!"
                className="w-full px-3 py-2 rounded-2xl bg-slate-100 dark:bg-dark-surface border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-500 to-amber-500 text-white font-extrabold text-sm shadow-xl shadow-brand-500/30 hover:opacity-95 transition-opacity"
            >
              Submit Rating &amp; Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

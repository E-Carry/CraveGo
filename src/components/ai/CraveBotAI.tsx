import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { usePlatform } from '../../context/PlatformContext';
import { useAudio } from '../../context/AudioContext';
import { FOOD_ITEMS } from '../../data/foodItems';
import { FoodItem, Coupon } from '../../types';
import {
  Sparkles,
  X,
  Send,
  Bike,
  Wallet,
  Tag,
  Utensils,
  MapPin,
  Clock,
  CheckCircle2,
  ExternalLink,
  Plus,
  RefreshCw,
  HelpCircle,
  PhoneCall,
  AlertCircle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  widgetType?: 'tracking' | 'refund' | 'food' | 'coupons';
  widgetData?: any;
}

export const CraveBotAI: React.FC = () => {
  const { user, openTracking, openHelpModal } = useAuth();
  const { addToCart, applyCoupon, openCart } = useCart();
  const { coupons } = usePlatform();
  const { playClick, playSuccess, playAdd } = useAudio();

  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [refundClaimed, setRefundClaimed] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'bot',
      text: `Namaste ${user?.name ? user.name.split(' ')[0] : 'Foodie'}! 🙏 I am CraveBot AI, your personal 2026 smart food concierge.\n\nI can track your live orders, recommend top culinary picks, find the highest discount vouchers, or process instant wallet compensations. How may I assist you today?`,
      timestamp: 'Just now'
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const addBotResponseWithDelay = (text: string, widgetType?: ChatMessage['widgetType'], widgetData?: any) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          widgetType,
          widgetData
        }
      ]);
      playSuccess();
    }, 600);
  };

  // Quick Action Handlers
  const handleTrackOrderChip = () => {
    playClick();
    setMessages(prev => [
      ...prev,
      {
        id: `usr-${Date.now()}`,
        sender: 'user',
        text: 'Where is my active order?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    addBotResponseWithDelay(
      "I've linked into our real-time GPS dispatch telemetry! Your order is speeding towards your location on an Ather 450X EV. Here is your live dispatch snapshot:",
      'tracking',
      {
        orderId: 'CRV-9824',
        restaurant: 'Paradise Biryani',
        eta: '18 mins',
        rider: 'Vikram Singh • Ather EV #42',
        status: 'Out for Delivery (On the way)'
      }
    );
  };

  const handleRefundChip = () => {
    playClick();
    setMessages(prev => [
      ...prev,
      {
        id: `usr-${Date.now()}`,
        sender: 'user',
        text: 'I want to request an instant wallet refund',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    addBotResponseWithDelay(
      "Under the CraveGo 100% Delight Guarantee, if any item had an issue or delivery took longer than estimated, we offer instant, zero-questions-asked wallet credits. You can claim your credit below:",
      'refund',
      { amount: 150 }
    );
  };

  const handleRecommendFoodChip = () => {
    playClick();
    setMessages(prev => [
      ...prev,
      {
        id: `usr-${Date.now()}`,
        sender: 'user',
        text: 'Recommend what I should eat today',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    // Pick 3 top-rated food items
    const topDishes = FOOD_ITEMS.filter(f => f.rating >= 4.7).slice(0, 3);

    addBotResponseWithDelay(
      "Here are 3 trending culinary creations heavily ordered by food lovers in your locality right now. Tap '+ Add to Cart' to add any dish instantly:",
      'food',
      { dishes: topDishes }
    );
  };

  const handleCouponsChip = () => {
    playClick();
    setMessages(prev => [
      ...prev,
      {
        id: `usr-${Date.now()}`,
        sender: 'user',
        text: 'Find me the best discount coupons',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    const activeCoupons = coupons.filter(c => c.isActive !== false).slice(0, 3);

    addBotResponseWithDelay(
      `I scanned the CraveGo promotion engine! Here are ${activeCoupons.length} verified coupons you can apply to save on your meal:`,
      'coupons',
      { coupons: activeCoupons }
    );
  };

  // Submit User Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    setInputText('');
    playClick();

    setMessages(prev => [
      ...prev,
      {
        id: `usr-${Date.now()}`,
        sender: 'user',
        text: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    const lower = userText.toLowerCase();

    // Intent recognition
    if (lower.includes('track') || lower.includes('order') || lower.includes('where') || lower.includes('status')) {
      addBotResponseWithDelay(
        "Here is your live delivery telemetry! Ather EV #42 has picked up your parcel and is navigating through the green corridor:",
        'tracking',
        {
          orderId: 'CRV-9824',
          restaurant: 'Paradise Biryani',
          eta: '18 mins',
          rider: 'Vikram Singh • Ather EV #42',
          status: 'Out for Delivery (On the way)'
        }
      );
    } else if (lower.includes('refund') || lower.includes('wallet') || lower.includes('cancel') || lower.includes('money')) {
      addBotResponseWithDelay(
        "I've initiated the CraveGo Instant Resolution protocol. You are eligible for an immediate ₹150 credit to your Super Wallet:",
        'refund',
        { amount: 150 }
      );
    } else if (lower.includes('coupon') || lower.includes('offer') || lower.includes('discount') || lower.includes('code') || lower.includes('promo')) {
      const activeCoupons = coupons.filter(c => c.isActive !== false).slice(0, 3);
      addBotResponseWithDelay(
        "Here are today's highest-saving promo codes valid across all restaurants:",
        'coupons',
        { coupons: activeCoupons }
      );
    } else if (
      lower.includes('biryani') ||
      lower.includes('burger') ||
      lower.includes('pizza') ||
      lower.includes('dessert') ||
      lower.includes('chinese') ||
      lower.includes('pasta') ||
      lower.includes('food') ||
      lower.includes('hungry') ||
      lower.includes('eat') ||
      lower.includes('veg')
    ) {
      let matching = FOOD_ITEMS.filter(f =>
        f.name.toLowerCase().includes(lower) ||
        f.category.toLowerCase().includes(lower) ||
        f.description.toLowerCase().includes(lower)
      );
      if (matching.length === 0) {
        matching = FOOD_ITEMS.filter(f => f.rating >= 4.7);
      }
      addBotResponseWithDelay(
        `I found these mouthwatering delicacies matching "${userText}". Tap to add directly to your feast:`,
        'food',
        { dishes: matching.slice(0, 3) }
      );
    } else if (lower.includes('help') || lower.includes('support') || lower.includes('call') || lower.includes('human')) {
      addBotResponseWithDelay(
        "Our customer care team is available 24x7. You can open our Help & Support Center or reach our emergency dispatch desk at +91 1800-CRAVE-GO."
      );
    } else {
      addBotResponseWithDelay(
        "I'm on it! Would you like me to recommend our top-rated dishes, check active promo codes, or track your current delivery?",
        undefined
      );
    }
  };

  // Claim Wallet Refund
  const handleClaimRefund = (amount: number) => {
    playSuccess();
    setRefundClaimed(true);
    // Add to user's wallet in localStorage
    const saved = localStorage.getItem('cravego-user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        u.walletBalance = (u.walletBalance || 0) + amount;
        localStorage.setItem('cravego-user', JSON.stringify(u));
      } catch {
        /* fallback */
      }
    }

    setMessages(prev => [
      ...prev,
      {
        id: `bot-ref-${Date.now()}`,
        sender: 'bot',
        text: `🎉 ₹${amount} has been instantly credited to your CraveGo Super Wallet! It will be automatically deducted from your next order total.`,
        timestamp: 'Just now'
      }
    ]);
  };

  // Add Recommended Dish to Cart
  const handleAddDish = (dish: FoodItem) => {
    playAdd();
    addToCart(dish, [], 1, 'CraveGo Gourmet Kitchen');
    openCart();
    setMessages(prev => [
      ...prev,
      {
        id: `bot-add-${Date.now()}`,
        sender: 'bot',
        text: `🛒 Added 1x "${dish.name}" (₹${dish.price}) to your cart! I've opened your Cart drawer for quick checkout.`,
        timestamp: 'Just now'
      }
    ]);
  };

  // Apply Coupon from Bot
  const handleApplyPromo = (code: string) => {
    playClick();
    const res = applyCoupon(code);
    setAppliedPromo(code);
    setMessages(prev => [
      ...prev,
      {
        id: `bot-promo-${Date.now()}`,
        sender: 'bot',
        text: res.success
          ? `✨ Great news! "${code}" has been applied to your cart. ${res.message}`
          : `Notice: ${res.message}`,
        timestamp: 'Just now'
      }
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button in Bottom Right */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            playClick();
            setIsOpen(!isOpen);
          }}
          className="relative group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-brand-600 via-brand-500 to-amber-500 text-white font-black text-xs shadow-2xl shadow-brand-500/40 border border-white/25 backdrop-blur-xl transition-all"
        >
          {/* Pulsing ring indicator */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-dark-bg" />
          </span>

          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-spin-slow" />
          </div>

          <span className="tracking-wide">✦ CraveBot AI</span>
        </motion.button>
      </div>

      {/* Expandable Chat Modal / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] max-h-[82vh] rounded-3xl bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-slate-950 via-brand-950 to-neutral-900 text-white flex items-center justify-between border-b border-white/10 relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-brand-500/20 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-600 to-amber-500 text-white flex items-center justify-center font-black shadow-lg shadow-brand-500/30">
                  <Sparkles className="w-5 h-5 text-amber-200" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-sm tracking-tight">CraveBot AI</h3>
                    <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-black border border-emerald-500/30">
                      LIVE
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">24/7 Smart Food &amp; Telemetry Concierge</p>
                </div>
              </div>

              <div className="flex items-center gap-1 relative z-10">
                <button
                  onClick={() => {
                    playClick();
                    setMessages([
                      {
                        id: 'msg-reset',
                        sender: 'bot',
                        text: `Chat reset! How can I help your feast right now, ${user?.name ? user.name.split(' ')[0] : 'Foodie'}?`,
                        timestamp: 'Just now'
                      }
                    ]);
                  }}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Reset conversation"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    playClick();
                    setIsOpen(false);
                  }}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Action Chips Bar */}
            <div className="px-3 py-2 bg-slate-50 dark:bg-dark-surface/60 border-b border-slate-100 dark:border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={handleTrackOrderChip}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-neutral-800 border border-slate-200 dark:border-white/10 text-[10px] font-extrabold text-slate-700 dark:text-slate-200 hover:border-brand-500 hover:text-brand-500 whitespace-nowrap transition-colors shadow-xs"
              >
                <Bike className="w-3 h-3 text-emerald-500" />
                <span>Track Order</span>
              </button>

              <button
                onClick={handleRefundChip}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-neutral-800 border border-slate-200 dark:border-white/10 text-[10px] font-extrabold text-slate-700 dark:text-slate-200 hover:border-brand-500 hover:text-brand-500 whitespace-nowrap transition-colors shadow-xs"
              >
                <Wallet className="w-3 h-3 text-amber-500" />
                <span>Instant Refund</span>
              </button>

              <button
                onClick={handleRecommendFoodChip}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-neutral-800 border border-slate-200 dark:border-white/10 text-[10px] font-extrabold text-slate-700 dark:text-slate-200 hover:border-brand-500 hover:text-brand-500 whitespace-nowrap transition-colors shadow-xs"
              >
                <Utensils className="w-3 h-3 text-brand-500" />
                <span>Food Picks</span>
              </button>

              <button
                onClick={handleCouponsChip}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-neutral-800 border border-slate-200 dark:border-white/10 text-[10px] font-extrabold text-slate-700 dark:text-slate-200 hover:border-brand-500 hover:text-brand-500 whitespace-nowrap transition-colors shadow-xs"
              >
                <Tag className="w-3 h-3 text-purple-500" />
                <span>Best Deals</span>
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] p-3 rounded-2xl whitespace-pre-wrap leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-brand-600 to-amber-500 text-white rounded-tr-xs shadow-md shadow-brand-500/20'
                        : 'bg-slate-100 dark:bg-dark-surface border border-slate-200/80 dark:border-white/5 text-slate-800 dark:text-slate-200 rounded-tl-xs shadow-xs'
                    }`}
                  >
                    {msg.text}

                    {/* WIDGET: ORDER TRACKING */}
                    {msg.widgetType === 'tracking' && msg.widgetData && (
                      <div className="mt-2.5 p-3 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white space-y-2 shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            {msg.widgetData.orderId}
                          </span>
                          <span className="text-[10px] font-extrabold text-emerald-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> ETA {msg.widgetData.eta}
                          </span>
                        </div>

                        <div>
                          <h5 className="font-black text-xs">{msg.widgetData.restaurant}</h5>
                          <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Bike className="w-3 h-3 text-emerald-500" /> {msg.widgetData.rider}
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            playClick();
                            openTracking(msg.widgetData.orderId);
                          }}
                          className="w-full py-2 rounded-lg bg-gradient-to-r from-brand-600 to-amber-500 hover:from-brand-500 hover:to-amber-400 text-white font-black text-[11px] flex items-center justify-center gap-1.5 shadow-md shadow-brand-500/25 transition-all"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Open 3D Live Map &amp; Telemetry</span>
                        </button>
                      </div>
                    )}

                    {/* WIDGET: WALLET REFUND */}
                    {msg.widgetType === 'refund' && msg.widgetData && (
                      <div className="mt-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-slate-900 dark:text-white space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            <Wallet className="w-3.5 h-3.5" /> ₹{msg.widgetData.amount} Compensation Credit
                          </span>
                          <span className="text-[10px] font-bold text-amber-500">Auto-Approved</span>
                        </div>
                        <p className="text-[10px] text-slate-600 dark:text-slate-300">
                          Credits apply directly to your CraveGo Super Wallet for zero payment deduction on your next feast.
                        </p>

                        <button
                          disabled={refundClaimed}
                          onClick={() => handleClaimRefund(msg.widgetData.amount)}
                          className={`w-full py-2 rounded-lg font-black text-[11px] flex items-center justify-center gap-1.5 transition-all ${
                            refundClaimed
                              ? 'bg-emerald-600 text-white cursor-default'
                              : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white shadow-md shadow-amber-500/25'
                          }`}
                        >
                          {refundClaimed ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>✓ ₹{msg.widgetData.amount} Credited to Wallet!</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Claim ₹{msg.widgetData.amount} to My Wallet</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* WIDGET: FOOD RECOMMENDATIONS */}
                    {msg.widgetType === 'food' && msg.widgetData && (
                      <div className="mt-2.5 space-y-2">
                        {msg.widgetData.dishes.map((dish: FoodItem) => (
                          <div
                            key={dish.id}
                            className="p-2.5 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 shadow-sm text-slate-900 dark:text-white"
                          >
                            <div className="flex items-center gap-2.5">
                              <img
                                src={dish.image}
                                alt={dish.name}
                                className="w-11 h-11 rounded-lg object-cover border border-slate-200 dark:border-white/10"
                              />
                              <div>
                                <h6 className="font-extrabold text-[11px]">{dish.name}</h6>
                                <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                                  <span className="font-black text-brand-600 dark:text-brand-400">₹{dish.price}</span>
                                  <span>★ {dish.rating}</span>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => handleAddDish(dish)}
                              className="px-2.5 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-black text-[10px] flex items-center gap-1 shadow-sm transition-colors"
                            >
                              <Plus className="w-3 h-3" /> Add
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* WIDGET: COUPONS */}
                    {msg.widgetType === 'coupons' && msg.widgetData && (
                      <div className="mt-2.5 space-y-2">
                        {msg.widgetData.coupons.map((cp: Coupon) => (
                          <div
                            key={cp.code}
                            className="p-2.5 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 shadow-sm text-slate-900 dark:text-white"
                          >
                            <div>
                              <span className="font-mono font-black text-xs px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                                {cp.code}
                              </span>
                              <p className="text-[10px] text-slate-500 mt-1">
                                {cp.discountPercentage ? `${cp.discountPercentage}% OFF` : `₹${cp.flatDiscount} Flat OFF`} • Min ₹{cp.minOrder}
                              </p>
                            </div>

                            <button
                              onClick={() => handleApplyPromo(cp.code)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] transition-colors"
                            >
                              {appliedPromo === cp.code ? 'Applied ✓' : 'Apply'}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-slate-100 dark:bg-dark-surface w-20 text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce [animation-delay:0.4s]" />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 bg-slate-50 dark:bg-dark-surface border-t border-slate-200 dark:border-white/10 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Ask CraveBot (e.g. recommend pizza, track order...)"
                className="flex-1 px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2 rounded-xl bg-gradient-to-r from-brand-600 to-amber-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:from-brand-500 hover:to-amber-400 transition-all shadow-md shadow-brand-500/25"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

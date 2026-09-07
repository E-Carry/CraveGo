import React, { useState } from 'react';
import { RESTAURANTS } from '../../data/restaurants';
import { FOOD_ITEMS } from '../../data/foodItems';
import { FoodItem } from '../../types';
import { useAudio } from '../../context/AudioContext';
import {
  Store,
  DollarSign,
  ShoppingBag,
  Clock,
  Star,
  CheckCircle,
  XCircle,
  Plus,
  Flame,
  ToggleLeft,
  ToggleRight,
  BarChart3,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export const RestaurantPartnerDashboard: React.FC = () => {
  const [selectedRestId, setSelectedRestId] = useState(RESTAURANTS[0].id);
  const { playClick, playSuccess, playDing } = useAudio();

  const currentRest = RESTAURANTS.find(r => r.id === selectedRestId) || RESTAURANTS[0];

  // Kitchen orders queue
  const [liveOrders, setLiveOrders] = useState<Array<{
    id: string;
    items: string;
    total: number;
    status: 'new' | 'preparing' | 'ready';
    timeAgo: string;
    customer: string;
  }>>([
    { id: 'ORD-9825', items: '2x Truffle Smash Burger, 1x Truffle Fries', total: 35.50, status: 'new', timeAgo: '1 min ago', customer: 'Sophia M.' },
    { id: 'ORD-9821', items: '1x Nashville Hot Chicken Burger, 1x Boba Milk', total: 19.10, status: 'preparing', timeAgo: '6 mins ago', customer: 'David K.' },
    { id: 'ORD-9818', items: '1x Smoked BBQ Bacon Stack, 1x Onion Rings', total: 21.70, status: 'ready', timeAgo: '14 mins ago', customer: 'Elena R.' }
  ]);

  // Menu items for this restaurant
  const [restaurantDishes, setRestaurantDishes] = useState<FoodItem[]>(() => {
    return FOOD_ITEMS.filter(f => f.restaurantId === currentRest.id);
  });

  const handleUpdateStatus = (orderId: string, nextStatus: 'preparing' | 'ready' | 'dispatched') => {
    playSuccess();
    if (nextStatus === 'dispatched') {
      setLiveOrders(prev => prev.filter(o => o.id !== orderId));
    } else {
      setLiveOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, status: nextStatus } : o))
      );
    }
  };

  const toggleDishAvailability = (dishId: string) => {
    playClick();
    setRestaurantDishes(prev =>
      prev.map(d => (d.id === dishId ? { ...d, available: !d.available } : d))
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Top Banner & Restaurant Switcher */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-wrap items-center justify-between gap-4 border border-white/10 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/20 text-brand-400 border border-brand-500/40 flex items-center justify-center font-bold text-2xl">
            🏪
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black font-display">{currentRest.name}</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                Kitchen Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live Kitchen Terminal • {currentRest.address}, {currentRest.city}
            </p>
          </div>
        </div>

        {/* Quick Restaurant Picker */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Select Outlet:</span>
          <select
            value={selectedRestId}
            onChange={e => {
              playClick();
              setSelectedRestId(e.target.value);
              setRestaurantDishes(FOOD_ITEMS.filter(f => f.restaurantId === e.target.value));
            }}
            className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-xs font-bold text-white focus:outline-none"
          >
            {RESTAURANTS.slice(0, 10).map(r => (
              <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-dark-card border border-slate-200/80 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Today's Revenue</span>
            <DollarSign className="w-5 h-5 text-emerald-500" />
          </div>
          <h4 className="text-3xl font-black text-slate-900 dark:text-white">$3,420.50</h4>
          <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18.4% vs yesterday
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-dark-card border border-slate-200/80 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Orders Dispatched</span>
            <ShoppingBag className="w-5 h-5 text-brand-500" />
          </div>
          <h4 className="text-3xl font-black text-slate-900 dark:text-white">142</h4>
          <span className="text-xs text-slate-400 mt-1 block">99.2% fulfillment rate</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-dark-card border border-slate-200/80 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Prep Speed</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <h4 className="text-3xl font-black text-slate-900 dark:text-white">13.5m</h4>
          <span className="text-xs font-bold text-emerald-500 mt-1 block">2.1m faster than target</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-dark-card border border-slate-200/80 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Customer Rating</span>
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          </div>
          <h4 className="text-3xl font-black text-slate-900 dark:text-white">{currentRest.rating} ★</h4>
          <span className="text-xs text-slate-400 mt-1 block">{currentRest.ratingCount}+ total reviews</span>
        </div>
      </div>

      {/* Live Kitchen Order Queue */}
      <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-slate-200/80 dark:border-white/5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-brand-500 animate-ping" />
            <h3 className="font-display font-black text-lg text-slate-900 dark:text-white">
              Live Kitchen Prep Station ({liveOrders.length} active)
            </h3>
          </div>
          <span className="text-xs text-slate-400">Audio chime enabled on new orders</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {liveOrders.map(order => (
            <div
              key={order.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                order.status === 'new'
                  ? 'border-brand-500 bg-brand-500/5 dark:bg-brand-500/10'
                  : order.status === 'preparing'
                  ? 'border-amber-500/50 bg-amber-500/5 dark:bg-amber-500/10'
                  : 'border-emerald-500/50 bg-emerald-500/5 dark:bg-emerald-500/10'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono font-bold text-xs text-brand-600 dark:text-brand-400">
                    #{order.id}
                  </span>
                  <span className="text-[11px] text-slate-400">{order.timeAgo}</span>
                </div>
                <h5 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  Customer: {order.customer}
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mb-3">
                  {order.items}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between">
                <span className="font-black text-sm text-slate-900 dark:text-white">
                  ${order.total.toFixed(2)}
                </span>

                {order.status === 'new' && (
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'preparing')}
                    className="px-3.5 py-1.5 rounded-xl bg-brand-500 text-white font-bold text-xs shadow-md hover:bg-brand-600 transition-colors"
                  >
                    Accept &amp; Cook
                  </button>
                )}

                {order.status === 'preparing' && (
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'ready')}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md hover:bg-amber-400 transition-colors"
                  >
                    Mark Ready
                  </button>
                )}

                {order.status === 'ready' && (
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'dispatched')}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-md hover:bg-emerald-600 transition-colors"
                  >
                    Hand to Rider
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Menu Item Availability Manager */}
      <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-slate-200/80 dark:border-white/5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-black text-lg text-slate-900 dark:text-white">
              Menu Item Availability &amp; Pricing
            </h3>
            <p className="text-xs text-slate-400">
              1-click toggle instantly pauses dishes across customer app
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {restaurantDishes.map(dish => (
            <div
              key={dish.id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-surface border border-slate-200/80 dark:border-white/5 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 truncate">
                <img src={dish.image} alt={dish.name} className="w-12 h-12 rounded-xl object-cover" />
                <div className="truncate">
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {dish.name}
                  </h5>
                  <span className="font-black text-xs text-brand-500">
                    ${dish.price.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* In-Stock Toggle Button */}
              <button
                onClick={() => toggleDishAvailability(dish.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  dish.available
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                }`}
              >
                {dish.available ? 'In Stock' : 'Sold Out'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

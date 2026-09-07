import React, { useState } from 'react';
import { useAudio } from '../../context/AudioContext';
import {
  Bike,
  Navigation,
  CheckCircle2,
  DollarSign,
  Clock,
  Phone,
  MapPin,
  Flame,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  Store
} from 'lucide-react';

export const DeliveryPartnerDashboard: React.FC = () => {
  const { playClick, playSuccess } = useAudio();

  const [isOnline, setIsOnline] = useState(true);
  const [deliveryStage, setDeliveryStage] = useState<
    'incoming' | 'heading_to_rest' | 'picked_up' | 'heading_to_customer' | 'completed'
  >('heading_to_customer');

  const [todayEarnings, setTodayEarnings] = useState({
    trips: 12,
    basePay: 84.0,
    tips: 32.5,
    incentives: 15.0
  });

  const totalPay = todayEarnings.basePay + todayEarnings.tips + todayEarnings.incentives;

  const handleNextStage = () => {
    playSuccess();
    if (deliveryStage === 'incoming') setDeliveryStage('heading_to_rest');
    else if (deliveryStage === 'heading_to_rest') setDeliveryStage('picked_up');
    else if (deliveryStage === 'picked_up') setDeliveryStage('heading_to_customer');
    else if (deliveryStage === 'heading_to_customer') {
      setDeliveryStage('completed');
      setTodayEarnings(e => ({
        ...e,
        trips: e.trips + 1,
        basePay: e.basePay + 7.5,
        tips: e.tips + 3.0
      }));
    } else {
      setDeliveryStage('incoming');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Top Rider HUD Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-wrap items-center justify-between gap-4 border border-white/10 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-accent-teal/20 text-accent-teal border border-accent-teal/40 flex items-center justify-center font-bold text-2xl">
            🚴
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black font-display">Rider Partner Portal</h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  isOnline
                    ? 'bg-accent-teal/20 text-accent-teal border-accent-teal/30'
                    : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                }`}
              >
                {isOnline ? 'Online (Duty On)' : 'Offline (Paused)'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Jordan Rivera (4.95 ★) • Ather 450X EV • CG-09-EV-8821
            </p>
          </div>
        </div>

        {/* Online / Offline Toggle Switch */}
        <button
          onClick={() => {
            playClick();
            setIsOnline(!isOnline);
          }}
          className={`px-6 py-2.5 rounded-2xl font-bold text-xs shadow-lg transition-all ${
            isOnline
              ? 'bg-rose-500 text-white hover:bg-rose-600'
              : 'bg-accent-teal text-slate-950 hover:bg-emerald-400'
          }`}
        >
          {isOnline ? 'Go Offline' : 'Go Online for Orders'}
        </button>
      </div>

      {/* Rider Earnings Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-dark-card border border-slate-200/80 dark:border-white/5 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Total Today's Payout
          </span>
          <h4 className="text-3xl font-black text-slate-900 dark:text-white">
            ${totalPay.toFixed(2)}
          </h4>
          <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3.5 h-3.5" /> Instant weekly bank transfer enabled
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-dark-card border border-slate-200/80 dark:border-white/5 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Completed Trips
          </span>
          <h4 className="text-3xl font-black text-slate-900 dark:text-white">
            {todayEarnings.trips} Trips
          </h4>
          <span className="text-xs text-slate-400 mt-1 block">Avg 18.2 mins per trip</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-dark-card border border-slate-200/80 dark:border-white/5 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Customer Tips
          </span>
          <h4 className="text-3xl font-black text-emerald-500">
            ${todayEarnings.tips.toFixed(2)}
          </h4>
          <span className="text-xs text-slate-400 mt-1 block">100% credited to partner</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-dark-card border border-slate-200/80 dark:border-white/5 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            EV Clean Fuel Bonus
          </span>
          <h4 className="text-3xl font-black text-accent-teal">
            ${todayEarnings.incentives.toFixed(2)}
          </h4>
          <span className="text-xs text-slate-400 mt-1 block">Green fleet daily reward</span>
        </div>
      </div>

      {/* Active Order Navigation HUD */}
      {isOnline ? (
        <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-slate-200/80 dark:border-white/5 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/5 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-accent-teal animate-ping" />
                <h3 className="font-display font-black text-lg text-slate-900 dark:text-white">
                  Active Dispatch Mission: Order #ORD-9824
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Turn-by-turn routing powered by CraveGo Telemetry
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block">Trip Value</span>
              <span className="font-black text-lg text-emerald-500">$9.80 + Tip</span>
            </div>
          </div>

          {/* Route Milestones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pickup */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-surface border border-slate-200/80 dark:border-white/5">
              <div className="flex items-center gap-2 font-bold text-xs text-brand-500 mb-1">
                <Store className="w-4 h-4" />
                <span>PICKUP LOCATION</span>
              </div>
              <h5 className="font-black text-sm text-slate-900 dark:text-white">The Burger Lab</h5>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                42 Silicon Boulevard, Tech Quarter
              </p>
            </div>

            {/* Dropoff */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-surface border border-slate-200/80 dark:border-white/5">
              <div className="flex items-center gap-2 font-bold text-xs text-accent-teal mb-1">
                <MapPin className="w-4 h-4" />
                <span>CUSTOMER DESTINATION</span>
              </div>
              <h5 className="font-black text-sm text-slate-900 dark:text-white">Alex Vance</h5>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Apt 4B, 88 Silicon Promenade (Leave at door)
              </p>
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="pt-2 flex items-center justify-between">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Customer paid via online UPI. Contactless delivery authorized.</span>
            </div>

            <button
              onClick={handleNextStage}
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-accent-teal to-emerald-500 text-slate-950 font-black text-sm shadow-lg hover:opacity-95 transition-opacity"
            >
              {deliveryStage === 'heading_to_rest' && 'Confirm Reached Kitchen'}
              {deliveryStage === 'picked_up' && 'Confirm Food Packed & Stowed'}
              {deliveryStage === 'heading_to_customer' && 'Mark Delivered at Doorstep ✓'}
              {deliveryStage === 'completed' && 'Look for Next Trip'}
            </button>
          </div>
        </div>
      ) : (
        <div className="py-16 text-center text-slate-400 text-sm">
          You are currently offline. Toggle "Go Online" at the top to receive incoming food delivery missions.
        </div>
      )}
    </div>
  );
};

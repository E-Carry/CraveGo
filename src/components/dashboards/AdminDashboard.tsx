import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlatform, PendingRestaurant } from '../../context/PlatformContext';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';
import { Restaurant, Coupon } from '../../types';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Store,
  IndianRupee,
  Bike,
  CheckCircle2,
  XCircle,
  Lock,
  Tag,
  TrendingUp,
  LogOut,
  Sparkles,
  Plus,
  Search,
  Trash2,
  Edit3,
  CloudRain,
  Zap,
  Download,
  Clock,
  MapPin,
  Percent,
  Check,
  X,
  AlertTriangle,
  Sliders,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

type AdminTab = 'overview' | 'restaurants' | 'coupons' | 'orders' | 'fleet';

interface SimulatedOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  restaurantName: string;
  items: string;
  total: number;
  stage: 'placed' | 'confirmed' | 'preparing' | 'picked_up' | 'delivered';
  time: string;
  rider: string;
}

const INITIAL_ORDERS: SimulatedOrder[] = [
  {
    id: 'CRV-9824',
    customerName: 'Aarav Sharma',
    customerPhone: '+91 98765 43210',
    restaurantName: 'Paradise Biryani',
    items: '2x Royal Hyderabadi Dum Biryani, 1x Mirchi Ka Salan',
    total: 780,
    stage: 'picked_up',
    time: '4 mins ago',
    rider: 'Vikram Singh (Ather EV #42)'
  },
  {
    id: 'CRV-9825',
    customerName: 'Priya Sundaram',
    customerPhone: '+91 98111 22334',
    restaurantName: 'Truffles Burger Bar',
    items: '1x All-American Cheese Burger, 1x Peri Peri Fries',
    total: 510,
    stage: 'preparing',
    time: '9 mins ago',
    rider: 'Ramesh Patel (Ather EV #18)'
  },
  {
    id: 'CRV-9826',
    customerName: 'Rohan Mehta',
    customerPhone: '+91 97222 55667',
    restaurantName: 'Bhartiya Jalpan',
    items: '3x Kesariya Jalebi, 2x Dal Kachori',
    total: 390,
    stage: 'confirmed',
    time: '14 mins ago',
    rider: 'Unassigned (Auto-matching...)'
  }
];

export const AdminDashboard: React.FC = () => {
  const { isAdminAuthenticated, adminLogout, openAdminModal } = useAuth();
  const { playClick, playSuccess, playError } = useAudio();
  const {
    restaurants,
    coupons,
    pendingRestaurants,
    isSurgeActive,
    isRainModeActive,
    addRestaurant,
    updateRestaurant,
    toggleRestaurantOpen,
    deleteRestaurant,
    approvePendingRestaurant,
    rejectPendingRestaurant,
    addCoupon,
    deleteCoupon,
    toggleSurge,
    toggleRainMode,
    resetToDefaults
  } = usePlatform();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Restaurant search & modal states
  const [restSearch, setRestSearch] = useState('');
  const [isAddRestModalOpen, setIsAddRestModalOpen] = useState(false);
  const [editingRest, setEditingRest] = useState<Restaurant | null>(null);

  // New Restaurant Form State
  const [newRestName, setNewRestName] = useState('');
  const [newRestCuisine, setNewRestCuisine] = useState('North Indian, Biryani');
  const [newRestCity, setNewRestCity] = useState('Indiranagar, Bengaluru');
  const [newRestTime, setNewRestTime] = useState(25);
  const [newRestPriceTier, setNewRestPriceTier] = useState<'₹' | '₹₹' | '₹₹₹'>('₹₹');
  const [newRestPureVeg, setNewRestPureVeg] = useState(false);
  const [newRestOffer, setNewRestOffer] = useState('FLAT 20% OFF');
  const [newRestFeatured, setNewRestFeatured] = useState('Chef Special Platter');
  const [newRestImage, setNewRestImage] = useState(
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'
  );

  // Coupon modal states
  const [isAddCouponModalOpen, setIsAddCouponModalOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscPct, setNewCouponDiscPct] = useState(25);
  const [newCouponMaxDisc, setNewCouponMaxDisc] = useState(120);
  const [newCouponMinOrder, setNewCouponMinOrder] = useState(299);
  const [newCouponDesc, setNewCouponDesc] = useState('Special promotional discount on your feast');
  const [couponError, setCouponError] = useState<string | null>(null);

  // Orders Live Dispatch State
  const [orders, setOrders] = useState<SimulatedOrder[]>(INITIAL_ORDERS);
  const [auditNotice, setAuditNotice] = useState<string | null>(null);

  // Guard view if not authenticated
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 shadow-2xl text-center space-y-5"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-500/15 text-brand-500 flex items-center justify-center font-bold">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Restricted Admin Operations Console
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              This master management console is exclusively reserved for authorized CraveGo System Administrators. You cannot switch to user mode from here.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => {
                playClick();
                openAdminModal();
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-amber-500 text-white font-bold text-xs shadow-lg shadow-brand-500/25 hover:from-brand-500 hover:to-amber-400 transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Login to Admin Portal</span>
            </button>

            <button
              onClick={() => {
                playClick();
                adminLogout();
              }}
              className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-semibold"
            >
              ← Exit to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Filtered restaurants in admin
  const filteredRestList = useMemo(() => {
    if (!restSearch.trim()) return restaurants;
    const q = restSearch.toLowerCase();
    return restaurants.filter(
      r =>
        r.name.toLowerCase().includes(q) ||
        r.cuisines.some(c => c.toLowerCase().includes(q)) ||
        r.city.toLowerCase().includes(q)
    );
  }, [restaurants, restSearch]);

  // Handle Add Restaurant
  const handleCreateRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRestName.trim()) return;

    playSuccess();
    const cuisinesArray = newRestCuisine.split(',').map(c => c.trim()).filter(Boolean);

    addRestaurant({
      name: newRestName.trim(),
      cuisines: cuisinesArray.length > 0 ? cuisinesArray : ['Multi-Cuisine'],
      city: newRestCity.trim(),
      deliveryTimeMin: Number(newRestTime) || 25,
      deliveryTimeMax: (Number(newRestTime) || 25) + 10,
      costForTwo: newRestPriceTier === '₹' ? 250 : newRestPriceTier === '₹₹' ? 500 : 900,
      isPureVeg: newRestPureVeg,
      offerText: newRestOffer.trim(),
      featuredDish: newRestFeatured.trim() || 'Special Delicacy',
      coverImage: newRestImage.trim() || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
      rating: 4.6,
      distanceKm: 1.8,
      isOpen: true,
      hasOffers: !!newRestOffer.trim(),
      openingHours: '10:00 AM - 11:30 PM',
      description: `Premium gourmet dining in ${newRestCity}. Fast delivery guaranteed with insulated packaging.`,
      menuItemIds: ['food-1', 'food-2']
    });

    // Reset & close
    setNewRestName('');
    setIsAddRestModalOpen(false);
  };

  // Handle Edit Restaurant Save
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRest) return;
    playSuccess();
    updateRestaurant(editingRest.id, {
      name: editingRest.name,
      city: editingRest.city,
      deliveryTimeMin: editingRest.deliveryTimeMin,
      deliveryTimeMax: editingRest.deliveryTimeMin + 10,
      offerText: editingRest.offerText,
      featuredDish: editingRest.featuredDish,
      isPureVeg: editingRest.isPureVeg
    });
    setEditingRest(null);
  };

  // Handle Add Coupon
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    if (!newCouponCode.trim()) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    const created = addCoupon({
      code: newCouponCode.trim().toUpperCase(),
      discountPercentage: Number(newCouponDiscPct) || 20,
      maxDiscount: Number(newCouponMaxDisc) || 100,
      minOrder: Number(newCouponMinOrder) || 199,
      description: newCouponDesc.trim() || 'Special instant discount on food delivery',
      expiry: '2026-12-31',
      expiresAt: '2026-12-31'
    });

    if (!created) {
      setCouponError(`Coupon code "${newCouponCode.toUpperCase()}" already exists!`);
      playError();
      return;
    }

    playSuccess();
    setNewCouponCode('');
    setIsAddCouponModalOpen(false);
  };

  // Advance Order Milestone
  const handleAdvanceOrder = (orderId: string) => {
    playSuccess();
    const stages: SimulatedOrder['stage'][] = ['placed', 'confirmed', 'preparing', 'picked_up', 'delivered'];
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id !== orderId) return ord;
        const currentIndex = stages.indexOf(ord.stage);
        const nextIndex = Math.min(stages.length - 1, currentIndex + 1);
        return { ...ord, stage: stages[nextIndex] };
      })
    );
  };

  // Export Audit Report
  const handleExportAudit = () => {
    playSuccess();
    const data = {
      timestamp: new Date().toISOString(),
      activeRestaurantsCount: restaurants.length,
      activeCouponsCount: coupons.length,
      pendingFSSAICount: pendingRestaurants.length,
      surgeActive: isSurgeActive,
      rainModeActive: isRainModeActive,
      ordersSnapshot: orders
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cravego-admin-audit-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setAuditNotice('System Operations Audit downloaded successfully!');
    setTimeout(() => setAuditNotice(null), 4000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in text-slate-900 dark:text-white">
      {/* Top Admin Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-brand-950 to-neutral-900 text-white flex flex-wrap items-center justify-between gap-4 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600 to-amber-500 text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-brand-500/30">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black tracking-tight">CraveGo Central Operations Console</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-extrabold border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Node v2.4
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Superuser Level 1 • Reactive Dispatch • Bengaluru • Mumbai • Delhi NCR • Hyderabad • Pune
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 relative z-10">
          <button
            onClick={handleExportAudit}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white border border-white/10 transition-all shadow-sm"
            title="Download Operations Audit Log"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Audit Log</span>
          </button>

          {/* Strictly Lock & Sign Out Admin (NO Switch to User) */}
          <button
            onClick={() => {
              playClick();
              adminLogout();
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-xs font-black text-white shadow-lg shadow-red-600/30 transition-all active:scale-[0.98]"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock &amp; Sign Out Admin</span>
          </button>
        </div>
      </div>

      {auditNotice && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {auditNotice}
          </span>
          <button onClick={() => setAuditNotice(null)}>
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Modern SaaS Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Financial & Ops Overview', icon: TrendingUp },
          { id: 'restaurants', label: `Kitchens & Merchants (${restaurants.length})`, icon: Store },
          { id: 'coupons', label: `Promo & Discount Engine (${coupons.length})`, icon: Tag },
          { id: 'orders', label: `Live Order Dispatch (${orders.length})`, icon: Bike },
          { id: 'fleet', label: 'Fleet & Weather Telemetry', icon: Sliders }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                playClick();
                setActiveTab(tab.id as AdminTab);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW & FINANCIAL KPIS */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-dark-card border border-slate-200/80 dark:border-white/5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Gross Merchandise Value</span>
                <IndianRupee className="w-5 h-5 text-emerald-500" />
              </div>
              <h4 className="text-3xl font-black">₹18,42,900</h4>
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" /> +32.4% vs last week
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-dark-card border border-slate-200/80 dark:border-white/5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Active Partner Kitchens</span>
                <Store className="w-5 h-5 text-amber-500" />
              </div>
              <h4 className="text-3xl font-black">{restaurants.length}</h4>
              <span className="text-xs text-amber-500 font-bold mt-1 block">
                {pendingRestaurants.length} awaiting FSSAI clearance
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-dark-card border border-slate-200/80 dark:border-white/5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Active Promo Codes</span>
                <Tag className="w-5 h-5 text-brand-500" />
              </div>
              <h4 className="text-3xl font-black">{coupons.length} Active</h4>
              <span className="text-xs text-brand-500 font-bold mt-1 block">
                100% reactive in customer checkout
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-dark-card border border-slate-200/80 dark:border-white/5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Ather EV Fleet</span>
                <Bike className="w-5 h-5 text-emerald-500" />
              </div>
              <h4 className="text-3xl font-black">312 Riders</h4>
              <span className="text-xs text-slate-400 mt-1 block">22.4 mins average fulfillment</span>
            </div>
          </div>

          {/* Quick Ops Controls */}
          <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-slate-200/80 dark:border-white/5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base flex items-center gap-2">
              <Sliders className="w-4 h-4 text-brand-500" />
              <span>Real-Time Network Switches</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-surface border border-slate-200/80 dark:border-white/5 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Peak Surge Pricing</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {isSurgeActive ? 'Surge +₹20 active on high demand' : 'Standard delivery rates'}
                  </p>
                </div>
                <button
                  onClick={toggleSurge}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs transition-colors ${
                    isSurgeActive
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
                      : 'bg-slate-200 dark:bg-neutral-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {isSurgeActive ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-surface border border-slate-200/80 dark:border-white/5 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <CloudRain className="w-3.5 h-3.5 text-blue-500" />
                    <span>Monsoon Rain Mode</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {isRainModeActive ? 'Safety speed caps & rain gear' : 'Normal delivery routes'}
                  </p>
                </div>
                <button
                  onClick={toggleRainMode}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs transition-colors ${
                    isRainModeActive
                      ? 'bg-blue-500 text-white shadow-md shadow-blue-500/25'
                      : 'bg-slate-200 dark:bg-neutral-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {isRainModeActive ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-surface border border-slate-200/80 dark:border-white/5 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-bold text-xs">Reset Platform Data</span>
                  <p className="text-[11px] text-slate-500">Restore factory catalog &amp; vouchers</p>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Reset all restaurants, coupons, and queues to default factory state?')) {
                      resetToDefaults();
                      playSuccess();
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs border border-rose-500/20 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: RESTAURANTS & KITCHENS MANAGER */}
      {/* ========================================================================= */}
      {activeTab === 'restaurants' && (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={restSearch}
                onChange={e => setRestSearch(e.target.value)}
                placeholder="Search by restaurant name, cuisine, city..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  playClick();
                  setIsAddRestModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-amber-500 hover:from-brand-500 hover:to-amber-400 text-white font-black text-xs shadow-lg shadow-brand-500/25 transition-all active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Restaurant</span>
              </button>
            </div>
          </div>

          {/* Pending FSSAI Verification Queue */}
          {pendingRestaurants.length > 0 && (
            <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>FSSAI Hygiene &amp; Onboarding Queue ({pendingRestaurants.length} Pending)</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Approving any restaurant here will immediately publish it to the customer homepage &amp; search catalog!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {pendingRestaurants.map(item => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 flex flex-col justify-between gap-3 shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">{item.name}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
                          {item.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">{item.cuisine}</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {item.city}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-white/5">
                      <button
                        onClick={() => {
                          approvePendingRestaurant(item.id);
                          playSuccess();
                        }}
                        className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] flex items-center justify-center gap-1 transition-colors"
                      >
                        <Check className="w-3 h-3" /> Approve Live
                      </button>
                      <button
                        onClick={() => {
                          rejectPendingRestaurant(item.id);
                          playClick();
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-slate-400 hover:text-rose-500 font-bold text-[11px] transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Restaurants List */}
          <div className="rounded-3xl bg-white dark:bg-dark-card border border-slate-200/80 dark:border-white/5 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm">Active Partner Restaurants ({filteredRestList.length})</h3>
                <p className="text-[11px] text-slate-500">Live operational kitchens currently accepting orders</p>
              </div>
              <span className="text-xs text-slate-400 font-mono">Real-Time Sync</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredRestList.slice(0, 15).map(r => (
                <div
                  key={r.id}
                  className="p-4 hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={r.coverImage}
                      alt={r.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-white/10"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{r.name}</h4>
                        {r.isPureVeg && (
                          <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 text-[10px] font-black border border-emerald-500/20">
                            VEG
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            r.isOpen
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                              : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {r.isOpen ? '🟢 Open' : '🔴 Closed'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {r.cuisines.join(', ')} • {r.city} • {r.deliveryTimeMin} mins
                      </p>
                      {r.offerText && (
                        <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1 mt-0.5">
                          <Tag className="w-2.5 h-2.5" /> {r.offerText}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Live Open/Closed Toggle */}
                    <button
                      onClick={() => {
                        toggleRestaurantOpen(r.id);
                        playClick();
                      }}
                      className={`px-3 py-1.5 rounded-xl font-black text-xs transition-colors ${
                        r.isOpen
                          ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {r.isOpen ? 'Pause Kitchen' : 'Resume Kitchen'}
                    </button>

                    {/* Edit Restaurant */}
                    <button
                      onClick={() => {
                        setEditingRest(r);
                        playClick();
                      }}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-600 dark:text-slate-300 transition-colors"
                      title="Quick Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Delist / Delete */}
                    <button
                      onClick={() => {
                        if (window.confirm(`Permanently delist "${r.name}" from CraveGo?`)) {
                          deleteRestaurant(r.id);
                          playSuccess();
                        }
                      }}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors"
                      title="Delist Restaurant"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredRestList.length > 15 && (
              <div className="p-3 text-center text-xs text-slate-400 border-t border-slate-100 dark:border-white/5">
                Showing first 15 of {filteredRestList.length} kitchens. Use search bar above to locate any restaurant.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PROMO & COUPON ENGINE */}
      {/* ========================================================================= */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Tag className="w-5 h-5 text-brand-500" />
                <span>Active Indian Rupee Discount Campaigns ({coupons.length})</span>
              </h3>
              <p className="text-xs text-slate-500">
                Any voucher added or deleted here will instantly reflect in the customer's Cart &amp; Offers modal.
              </p>
            </div>

            <button
              onClick={() => {
                playClick();
                setIsAddCouponModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-amber-500 hover:from-brand-500 hover:to-amber-400 text-white font-black text-xs shadow-lg shadow-brand-500/25 transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Promo Code</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coupons.map(cp => (
              <div
                key={cp.code}
                className="p-5 rounded-3xl bg-white dark:bg-dark-card border border-slate-200/80 dark:border-white/5 shadow-sm flex flex-col justify-between gap-4 relative overflow-hidden"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-base px-3 py-1 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 tracking-wider">
                      {cp.code}
                    </span>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete coupon "${cp.code}"? Customers will no longer be able to apply it.`)) {
                          deleteCoupon(cp.code);
                          playSuccess();
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Delete Coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    {cp.description}
                  </p>

                  <div className="flex flex-wrap gap-2 text-[11px] font-bold text-slate-500 pt-1">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-neutral-800">
                      {cp.discountPercentage ? `${cp.discountPercentage}% OFF` : `₹${cp.flatDiscount} Flat OFF`}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-neutral-800">
                      Min: ₹{cp.minOrder}
                    </span>
                    {cp.maxDiscount && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-neutral-800">
                        Max Cap: ₹{cp.maxDiscount}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-500 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 100% Active in Checkout
                  </span>
                  <span>Exp: {cp.expiresAt || 'No Expiry'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: LIVE ORDER DISPATCH & FULFILLMENT */}
      {/* ========================================================================= */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Bike className="w-5 h-5 text-emerald-500" />
                <span>Live Kitchen Fulfillment &amp; Ather EV Dispatch Stream</span>
              </h3>
              <p className="text-xs text-slate-500">
                Advance milestone stages in real time to simulate order progression from kitchen cooking to Ather delivery.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {orders.map(ord => {
              const stages = ['placed', 'confirmed', 'preparing', 'picked_up', 'delivered'];
              const currentStageIndex = stages.indexOf(ord.stage);

              return (
                <div
                  key={ord.id}
                  className="p-5 rounded-3xl bg-white dark:bg-dark-card border border-slate-200/80 dark:border-white/5 shadow-sm space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-xs px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-neutral-800 text-slate-800 dark:text-slate-200">
                        {ord.id}
                      </span>
                      <div>
                        <h4 className="font-extrabold text-sm">{ord.restaurantName}</h4>
                        <p className="text-[11px] text-slate-500">
                          Customer: <strong className="text-slate-700 dark:text-slate-300">{ord.customerName}</strong> ({ord.customerPhone}) • {ord.time}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-sm font-black text-brand-600 dark:text-brand-400">₹{ord.total}</span>
                        <p className="text-[10px] text-slate-400">{ord.rider}</p>
                      </div>

                      {ord.stage !== 'delivered' && (
                        <button
                          onClick={() => handleAdvanceOrder(ord.id)}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-colors flex items-center gap-1.5"
                        >
                          <span>Advance Milestone</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-dark-surface p-2.5 rounded-xl">
                    <strong className="text-slate-800 dark:text-slate-200">Dishes:</strong> {ord.items}
                  </div>

                  {/* Order Stage Stepper */}
                  <div className="grid grid-cols-5 gap-2 pt-1">
                    {[
                      { key: 'placed', label: 'Placed' },
                      { key: 'confirmed', label: 'Accepted' },
                      { key: 'preparing', label: 'Cooking' },
                      { key: 'picked_up', label: 'Out for Delivery' },
                      { key: 'delivered', label: 'Delivered' }
                    ].map((step, idx) => {
                      const isComplete = currentStageIndex >= idx;
                      const isCurrent = currentStageIndex === idx;

                      return (
                        <div key={step.key} className="text-center space-y-1">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              isComplete ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-neutral-800'
                            }`}
                          />
                          <span
                            className={`text-[10px] font-bold block truncate ${
                              isCurrent
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : isComplete
                                ? 'text-slate-600 dark:text-slate-300'
                                : 'text-slate-400'
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: FLEET & WEATHER TELEMETRY */}
      {/* ========================================================================= */}
      {activeTab === 'fleet' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-slate-200/80 dark:border-white/5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base flex items-center gap-2">
              <Bike className="w-5 h-5 text-emerald-500" />
              <span>Ather EV Fleet Telemetry &amp; Battery Hubs</span>
            </h3>
            <p className="text-xs text-slate-500">
              Live battery reserves and telemetry for the CraveGo zero-emission delivery squad.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
              {[
                { hub: 'Bengaluru Tech Corridor Hub', activeEVs: 142, avgBattery: '88%', health: 'Optimal' },
                { hub: 'Bandra-BKC Hub (Mumbai)', activeEVs: 98, avgBattery: '79%', health: 'Optimal' },
                { hub: 'Connaught Place Hub (Delhi)', activeEVs: 72, avgBattery: '84%', health: 'Optimal' }
              ].map(h => (
                <div key={h.hub} className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-surface border border-slate-200/80 dark:border-white/5 space-y-2">
                  <h4 className="font-bold text-xs">{h.hub}</h4>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Active Ather 450X:</span>
                    <strong className="text-slate-900 dark:text-white">{h.activeEVs}</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Fleet Avg Battery:</span>
                    <strong className="text-emerald-500">{h.avgBattery}</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Grid Status:</span>
                    <strong className="text-emerald-500">{h.health}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD RESTAURANT */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isAddRestModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-3xl bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-base flex items-center gap-2">
                  <Store className="w-5 h-5 text-brand-500" />
                  <span>Onboard New Partner Restaurant</span>
                </h3>
                <button
                  onClick={() => setIsAddRestModalOpen(false)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateRestaurant} className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Restaurant Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newRestName}
                    onChange={e => setNewRestName(e.target.value)}
                    placeholder="e.g. Copper Chimney or Burger Seigneur"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-white/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Cuisines (comma separated)
                    </label>
                    <input
                      type="text"
                      value={newRestCuisine}
                      onChange={e => setNewRestCuisine(e.target.value)}
                      placeholder="e.g. Biryani, North Indian"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-white/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      City &amp; Area
                    </label>
                    <input
                      type="text"
                      value={newRestCity}
                      onChange={e => setNewRestCity(e.target.value)}
                      placeholder="e.g. Indiranagar, Bengaluru"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-white/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Delivery (Mins)
                    </label>
                    <input
                      type="number"
                      value={newRestTime}
                      onChange={e => setNewRestTime(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-white/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Price Tier
                    </label>
                    <select
                      value={newRestPriceTier}
                      onChange={e => setNewRestPriceTier(e.target.value as any)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-white/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="₹">₹ (Budget)</option>
                      <option value="₹₹">₹₹ (Moderate)</option>
                      <option value="₹₹₹">₹₹₹ (Premium)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Pure Veg?
                    </label>
                    <button
                      type="button"
                      onClick={() => setNewRestPureVeg(!newRestPureVeg)}
                      className={`w-full py-2 rounded-xl text-xs font-bold border transition-colors ${
                        newRestPureVeg
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'
                          : 'bg-slate-100 dark:bg-neutral-800 border-slate-200 dark:border-white/10 text-slate-500'
                      }`}
                    >
                      {newRestPureVeg ? '✓ Pure Veg' : 'Non-Veg / Both'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Offer Banner Text
                    </label>
                    <input
                      type="text"
                      value={newRestOffer}
                      onChange={e => setNewRestOffer(e.target.value)}
                      placeholder="e.g. FLAT 20% OFF"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-white/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Featured Dish
                    </label>
                    <input
                      type="text"
                      value={newRestFeatured}
                      onChange={e => setNewRestFeatured(e.target.value)}
                      placeholder="e.g. Truffle Mushroom Risotto"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-white/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Cover Photo URL
                  </label>
                  <input
                    type="url"
                    value={newRestImage}
                    onChange={e => setNewRestImage(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-white/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                  />
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddRestModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-amber-500 hover:from-brand-500 hover:to-amber-400 text-xs font-black text-white shadow-md shadow-brand-500/25 transition-all"
                  >
                    Publish to Customer Live App
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL: EDIT RESTAURANT */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {editingRest && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-3xl bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-base flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-brand-500" />
                  <span>Edit Restaurant Details</span>
                </h3>
                <button
                  onClick={() => setEditingRest(null)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingRest.name}
                    onChange={e => setEditingRest({ ...editingRest, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-white/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      City &amp; Area
                    </label>
                    <input
                      type="text"
                      value={editingRest.city}
                      onChange={e => setEditingRest({ ...editingRest, city: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-white/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Delivery (Mins)
                    </label>
                    <input
                      type="number"
                      value={editingRest.deliveryTimeMin}
                      onChange={e => setEditingRest({ ...editingRest, deliveryTimeMin: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-white/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Offer Banner
                  </label>
                  <input
                    type="text"
                    value={editingRest.offerText || ''}
                    onChange={e => setEditingRest({ ...editingRest, offerText: e.target.value })}
                    placeholder="e.g. 50% OFF UPTO ₹100"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-white/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Featured Dish
                  </label>
                  <input
                    type="text"
                    value={editingRest.featuredDish}
                    onChange={e => setEditingRest({ ...editingRest, featuredDish: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-white/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingRest(null)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-black text-white shadow-md transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL: ADD COUPON */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isAddCouponModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-3xl bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-base flex items-center gap-2">
                  <Tag className="w-5 h-5 text-brand-500" />
                  <span>Launch New Promo Voucher</span>
                </h3>
                <button
                  onClick={() => setIsAddCouponModalOpen(false)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {couponError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold">
                  {couponError}
                </div>
              )}

              <form onSubmit={handleCreateCoupon} className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Coupon Code (Uppercase) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCouponCode}
                    onChange={e => setNewCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. MONSOON30 or CRAVE50"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-white/10 text-xs font-mono font-black uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Discount %
                    </label>
                    <input
                      type="number"
                      value={newCouponDiscPct}
                      onChange={e => setNewCouponDiscPct(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-white/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Max Discount (₹)
                    </label>
                    <input
                      type="number"
                      value={newCouponMaxDisc}
                      onChange={e => setNewCouponMaxDisc(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-white/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Minimum Order Value (₹)
                  </label>
                  <input
                    type="number"
                    value={newCouponMinOrder}
                    onChange={e => setNewCouponMinOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-white/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Campaign Description
                  </label>
                  <input
                    type="text"
                    value={newCouponDesc}
                    onChange={e => setNewCouponDesc(e.target.value)}
                    placeholder="e.g. Flat 30% OFF on all gourmet feasts"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-white/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddCouponModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-amber-500 hover:from-brand-500 hover:to-amber-400 text-xs font-black text-white shadow-md shadow-brand-500/25 transition-all"
                  >
                    Publish Promo Code
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

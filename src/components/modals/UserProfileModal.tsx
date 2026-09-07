import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useAudio } from '../../context/AudioContext';
import { RESTAURANTS } from '../../data/restaurants';
import {
  X,
  User,
  ShoppingBag,
  MapPin,
  Heart,
  Wallet,
  LogOut,
  RotateCcw,
  Star,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  FileText,
  Download,
  IndianRupee,
  Check,
  Printer
} from 'lucide-react';
import { DeliveryAddress, Order } from '../../types';
import { printInvoiceDocument, downloadInvoiceFile } from '../../utils/invoiceGenerator';

interface UserProfileModalProps {
  onOpenTracking: (orderId: string) => void;
  onOpenRating: (orderId: string) => void;
}

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  onOpenTracking,
  onOpenRating
}) => {
  const {
    user,
    updateProfile,
    addWalletFunds,
    logout,
    isProfileModalOpen,
    closeProfileModal,
    orders,
    favoriteRestaurantIds,
    addresses,
    addAddress,
    editAddress,
    deleteAddress,
    setDefaultAddress
  } = useAuth();

  const { addToCart, openCart } = useCart();
  const { playClick, playAdd, playSuccess } = useAudio();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'favorites' | 'addresses' | 'wallet'>('orders');
  const [orderFilter, setOrderFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Profile edit state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || AVATAR_OPTIONS[0]
  });
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  // Address create/edit state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<Omit<DeliveryAddress, 'id'>>({
    type: 'Home',
    label: 'Home',
    houseFlat: '',
    building: '',
    street: '',
    landmark: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pinCode: '560038',
    isDefault: false
  });

  // Wallet top up state
  const [walletAmount, setWalletAmount] = useState<number>(500);
  const [walletSuccessToast, setWalletSuccessToast] = useState(false);

  // Tax Invoice view state
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  if (!isProfileModalOpen || !user) return null;

  // Filter orders
  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'active') return o.status !== 'delivered' && o.status !== 'cancelled';
    if (orderFilter === 'completed') return o.status === 'delivered';
    return true;
  });

  const favoriteRestaurants = RESTAURANTS.filter(r => favoriteRestaurantIds.includes(r.id));

  // Handlers
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileForm);
    playSuccess();
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 2500);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.houseFlat || !addressForm.street) return;

    if (editingAddressId) {
      editAddress(editingAddressId, addressForm);
    } else {
      addAddress(addressForm);
    }

    setIsAddressModalOpen(false);
    setEditingAddressId(null);
    playSuccess();
  };

  const handleOpenEditAddress = (addr: DeliveryAddress) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      type: addr.type,
      label: addr.label,
      houseFlat: addr.houseFlat,
      building: addr.building,
      street: addr.street,
      landmark: addr.landmark,
      city: addr.city,
      state: addr.state,
      pinCode: addr.pinCode,
      isDefault: addr.isDefault
    });
    setIsAddressModalOpen(true);
  };

  const handleOpenNewAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      type: 'Home',
      label: 'Home',
      houseFlat: '',
      building: '',
      street: '',
      landmark: '',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560038',
      isDefault: false
    });
    setIsAddressModalOpen(true);
  };

  const handleAddFunds = (amount: number) => {
    addWalletFunds(amount);
    playSuccess();
    setWalletSuccessToast(true);
    setTimeout(() => setWalletSuccessToast(false), 2500);
  };

  const handleReorder = (orderId: string) => {
    const target = orders.find(o => o.id === orderId);
    if (!target) return;
    playAdd();
    target.items.forEach(item => {
      addToCart(item.foodItem, item.selectedCustomizations, item.quantity, target.restaurantName);
    });
    closeProfileModal();
    openCart();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex justify-center p-2 sm:p-4 md:p-6 text-neutral-900 dark:text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-4xl rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]"
        >
          {/* Header Profile Card */}
          <div className="p-6 bg-gradient-to-r from-neutral-950 via-neutral-900 to-red-950 text-white flex flex-wrap items-center justify-between gap-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 rounded-3xl object-cover border-2 border-red-500 shadow-xl"
                />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-neutral-900 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-xl sm:text-2xl">{user.name}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-extrabold uppercase tracking-wider">
                    CRAVE GOLD 🇮🇳
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">{user.email} • {user.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Wallet quick balance pill */}
              <div
                onClick={() => setActiveTab('wallet')}
                className="cursor-pointer px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors flex items-center gap-2.5"
              >
                <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-neutral-300">Crave Wallet</span>
                  <span className="font-black text-sm text-emerald-400">₹{user.walletBalance}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  playClick();
                  closeProfileModal();
                }}
                className="p-2.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-6 py-2.5 border-b border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/60 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar shrink-0">
            <div className="flex items-center gap-2">
              {[
                { id: 'orders', label: 'My Orders', icon: <ShoppingBag className="w-4 h-4" /> },
                { id: 'profile', label: 'Edit Profile', icon: <User className="w-4 h-4" /> },
                { id: 'addresses', label: 'Saved Addresses', icon: <MapPin className="w-4 h-4" /> },
                { id: 'wallet', label: 'Crave Wallet', icon: <Wallet className="w-4 h-4" /> },
                { id: 'favorites', label: 'Favorites', icon: <Heart className="w-4 h-4" /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    playClick();
                    setActiveTab(tab.id as typeof activeTab);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-white/5'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                playClick();
                logout();
                closeProfileModal();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Tab Body Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* TAB 1: MY ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {(['all', 'active', 'completed'] as const).map(f => (
                      <button
                        key={f}
                        onClick={() => {
                          playClick();
                          setOrderFilter(f);
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition-all ${
                          orderFilter === f
                            ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-950'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        {f} Orders
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-neutral-400 font-medium">
                    {filteredOrders.length} orders found
                  </span>
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="py-12 text-center text-neutral-400 text-sm">
                    No orders in this category yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredOrders.map(order => (
                      <div
                        key={order.id}
                        className="p-4 rounded-3xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={order.restaurantImage}
                            alt={order.restaurantName}
                            className="w-14 h-14 rounded-2xl object-cover border border-neutral-200 dark:border-white/10"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-bold text-sm">
                                {order.restaurantName}
                              </h5>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                  order.status === 'delivered'
                                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                    : order.status === 'cancelled'
                                    ? 'bg-rose-500/15 text-rose-500'
                                    : 'bg-red-500/15 text-red-600 animate-pulse'
                                }`}
                              >
                                {order.status}
                              </span>
                            </div>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                              {order.items.map(i => `${i.quantity}x ${i.foodItem.name}`).join(', ')}
                            </p>
                            <div className="flex items-center gap-3 text-[11px] text-neutral-400 mt-1">
                              <span>Total: <strong className="text-neutral-900 dark:text-white font-extrabold">₹{order.grandTotal}</strong></span>
                              <span>•</span>
                              <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                          </div>
                        </div>

                        {/* Order Actions */}
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          <button
                            onClick={() => setInvoiceOrder(order)}
                            className="px-3 py-2 rounded-xl border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300 font-bold text-xs hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors flex items-center gap-1"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Invoice</span>
                          </button>

                          {order.status !== 'delivered' && order.status !== 'cancelled' ? (
                            <button
                              onClick={() => {
                                playClick();
                                closeProfileModal();
                                onOpenTracking(order.id);
                              }}
                              className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs shadow-md shadow-red-600/30"
                            >
                              Track Live
                            </button>
                          ) : (
                            <>
                              {!order.rated && order.status === 'delivered' && (
                                <button
                                  onClick={() => {
                                    playClick();
                                    closeProfileModal();
                                    onOpenRating(order.id);
                                  }}
                                  className="px-3 py-2 rounded-xl border border-amber-500 text-amber-600 dark:text-amber-400 font-bold text-xs hover:bg-amber-500/10 transition-colors"
                                >
                                  Rate ★
                                </button>
                              )}
                              <button
                                onClick={() => handleReorder(order.id)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs shadow-md hover:bg-red-500 transition-colors"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Reorder</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: EDIT PROFILE */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="max-w-xl space-y-6">
                <div>
                  <h4 className="font-bold text-sm mb-1">Choose Profile Avatar</h4>
                  <div className="flex items-center gap-3 overflow-x-auto py-2">
                    {AVATAR_OPTIONS.map((av, idx) => (
                      <img
                        key={idx}
                        src={av}
                        alt="Avatar option"
                        onClick={() => setProfileForm(f => ({ ...f, avatar: av }))}
                        className={`w-14 h-14 rounded-2xl object-cover cursor-pointer transition-all border-2 ${
                          profileForm.avatar === av
                            ? 'border-red-500 scale-105 ring-2 ring-red-500/30'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={profileForm.email}
                      onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.phone}
                      onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>

                {profileSavedToast && (
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Profile details updated successfully!</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="py-3 px-6 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-colors"
                >
                  Save Profile Changes
                </button>
              </form>
            )}

            {/* TAB 3: ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm">
                    Saved Delivery Addresses ({addresses.length})
                  </h4>
                  <button
                    onClick={handleOpenNewAddress}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 text-white font-bold text-xs shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Address</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {addresses.map(addr => (
                    <div
                      key={addr.id}
                      className="p-4 rounded-3xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-white/10 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-extrabold text-xs flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-red-500" />
                            {addr.type}
                          </span>
                          {addr.isDefault && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600">
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                          {addr.houseFlat}, {addr.street}, {addr.city} - {addr.pinCode}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-neutral-200/60 dark:border-white/5">
                        {!addr.isDefault ? (
                          <button
                            onClick={() => setDefaultAddress(addr.id)}
                            className="text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline"
                          >
                            Set Default
                          </button>
                        ) : (
                          <span />
                        )}

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditAddress(addr)}
                            className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {addresses.length > 1 && (
                            <button
                              onClick={() => deleteAddress(addr.id)}
                              className="p-1.5 rounded-lg hover:bg-rose-500/20 text-rose-500"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: WALLET */}
            {activeTab === 'wallet' && (
              <div className="space-y-6 max-w-xl">
                {/* Balance Card */}
                <div className="p-6 rounded-3xl bg-gradient-to-tr from-neutral-950 via-neutral-900 to-red-950 text-white shadow-xl border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                      CraveGo Cash Balance
                    </span>
                    <h3 className="text-3xl sm:text-4xl font-black mt-1">₹{user.walletBalance}</h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      1-click instant payment with 100% success rate
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-2xl border border-red-500/30">
                    <IndianRupee className="w-7 h-7" />
                  </div>
                </div>

                {/* Top-up Engine */}
                <div className="p-5 rounded-3xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-white/10 space-y-4">
                  <h4 className="font-bold text-sm">Add Funds to Crave Wallet</h4>

                  <div className="grid grid-cols-3 gap-2">
                    {[500, 1000, 2000].map(amt => (
                      <button
                        key={amt}
                        onClick={() => setWalletAmount(amt)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          walletAmount === amt
                            ? 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400'
                            : 'border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        +₹{amt}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={walletAmount}
                      onChange={e => setWalletAmount(Number(e.target.value))}
                      placeholder="Enter amount"
                      className="flex-1 px-3.5 py-2.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-sm font-bold focus:outline-none"
                    />
                    <button
                      onClick={() => handleAddFunds(walletAmount)}
                      className="py-2.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
                    >
                      Top Up ₹{walletAmount}
                    </button>
                  </div>

                  {walletSuccessToast && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>₹{walletAmount} added to wallet successfully!</span>
                    </div>
                  )}
                </div>

                {/* Activity Passbook */}
                <div className="p-4 rounded-3xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-white/10 space-y-2.5 text-xs">
                  <span className="font-bold block mb-1">
                    Passbook &amp; Transaction History
                  </span>
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400 py-1 border-b border-neutral-200/60 dark:border-white/5">
                    <span>Cashback reward on #ORD-9824</span>
                    <span className="font-bold text-emerald-500">+₹50</span>
                  </div>
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400 py-1 border-b border-neutral-200/60 dark:border-white/5">
                    <span>UPI Wallet Top-up (PhonePe)</span>
                    <span className="font-bold text-emerald-500">+₹500</span>
                  </div>
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400 py-1">
                    <span>Welcome Bonus Crave Credits</span>
                    <span className="font-bold text-emerald-500">+₹300</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: FAVORITES */}
            {activeTab === 'favorites' && (
              <div>
                <h4 className="font-bold text-sm mb-4">
                  Saved Restaurants ({favoriteRestaurants.length})
                </h4>
                {favoriteRestaurants.length === 0 ? (
                  <div className="py-12 text-center text-neutral-400 text-sm">
                    No favorites saved yet. Click the heart icon on any restaurant card!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {favoriteRestaurants.map(rest => (
                      <div
                        key={rest.id}
                        className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-white/5 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <img src={rest.image} alt={rest.name} className="w-12 h-12 rounded-xl object-cover" />
                          <div className="truncate">
                            <h5 className="font-bold text-xs truncate">{rest.name}</h5>
                            <p className="text-[11px] text-neutral-400 truncate">{rest.cuisines.join(', ')}</p>
                            <span className="text-[10px] font-bold text-emerald-500">{rest.rating} ★</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Address Add / Edit Sub-Modal */}
          {isAddressModalOpen && (
            <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
              <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 shadow-2xl space-y-4 animate-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-3">
                  <h4 className="font-bold text-base">
                    {editingAddressId ? 'Edit Address' : 'Add New Address'}
                  </h4>
                  <button onClick={() => setIsAddressModalOpen(false)} className="text-neutral-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
                  <div className="grid grid-cols-3 gap-2">
                    {(['Home', 'Work', 'Other'] as const).map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setAddressForm(f => ({ ...f, type: t, label: t }))}
                        className={`py-2 rounded-xl font-bold transition-all ${
                          addressForm.type === t
                            ? 'bg-red-600 text-white'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    required
                    value={addressForm.houseFlat}
                    onChange={e => setAddressForm(f => ({ ...f, houseFlat: e.target.value }))}
                    placeholder="Flat / House No. / Building"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-white/10"
                  />

                  <input
                    type="text"
                    required
                    value={addressForm.street}
                    onChange={e => setAddressForm(f => ({ ...f, street: e.target.value }))}
                    placeholder="Street, Main Road, Locality"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-white/10"
                  />

                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={addressForm.city}
                      onChange={e => setAddressForm(f => ({ ...f, city: e.target.value }))}
                      placeholder="City"
                      className="px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-white/10"
                    />
                    <input
                      type="text"
                      value={addressForm.state}
                      onChange={e => setAddressForm(f => ({ ...f, state: e.target.value }))}
                      placeholder="State"
                      className="px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-white/10"
                    />
                    <input
                      type="text"
                      value={addressForm.pinCode}
                      onChange={e => setAddressForm(f => ({ ...f, pinCode: e.target.value }))}
                      placeholder="PIN Code"
                      className="px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-white/10"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-red-600 text-white font-bold mt-2"
                  >
                    Save Address
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Tax Invoice Sub-Modal */}
          {invoiceOrder && (
            <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
              <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 shadow-2xl text-neutral-900 dark:text-white space-y-4 animate-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-3">
                  <div>
                    <h4 className="font-black text-base">Tax Invoice / Bill of Supply</h4>
                    <p className="text-[11px] text-neutral-500">GSTIN: 29AABCC1234F1Z5 • CraveGo</p>
                  </div>
                  <button onClick={() => setInvoiceOrder(null)} className="text-neutral-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Invoice Ref</span>
                    <span className="font-mono font-bold">INV-{invoiceOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Restaurant</span>
                    <span className="font-bold">{invoiceOrder.restaurantName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Payment Mode</span>
                    <span className="font-semibold">{invoiceOrder.paymentMethod}</span>
                  </div>
                </div>

                <div className="border-t border-b border-neutral-200 dark:border-white/10 py-3 space-y-1.5 text-xs">
                  {invoiceOrder.items.map(it => (
                    <div key={it.cartItemId} className="flex justify-between">
                      <span>{it.quantity}x {it.foodItem.name}</span>
                      <span className="font-semibold">₹{it.totalPrice}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-neutral-500 pt-1">
                    <span>GST (5%)</span>
                    <span>₹{invoiceOrder.taxes}</span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>Platform Fee</span>
                    <span>₹{invoiceOrder.platformFee.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center font-black text-base">
                  <span>Grand Total</span>
                  <span className="text-red-600 dark:text-red-400">₹{invoiceOrder.grandTotal}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      playClick();
                      printInvoiceDocument(invoiceOrder, user);
                    }}
                    className="py-2.5 px-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-red-600/20 transition-all active:scale-[0.98]"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print / Save PDF</span>
                  </button>

                  <button
                    onClick={() => {
                      playClick();
                      downloadInvoiceFile(invoiceOrder, user);
                    }}
                    className="py-2.5 px-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-800 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-neutral-200 dark:border-white/10 transition-all active:scale-[0.98]"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download HTML</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';
import { X, MapPin, Navigation, Search, CheckCircle2, Plus } from 'lucide-react';
import { DeliveryAddress } from '../../types';

export const LocationModal: React.FC = () => {
  const {
    isLocationModalOpen,
    closeLocationModal,
    addresses,
    selectedAddress,
    setSelectedAddress,
    addAddress
  } = useAuth();

  const { playClick, playSuccess } = useAudio();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [form, setForm] = useState({
    type: 'Home' as 'Home' | 'Work' | 'Other',
    houseFlat: '',
    building: '',
    street: '',
    landmark: '',
    city: 'Downtown',
    state: 'CA',
    pinCode: '94016'
  });

  if (!isLocationModalOpen) return null;

  const handleDetectGPS = () => {
    playClick();
    setIsDetecting(true);
    setTimeout(() => {
      setIsDetecting(false);
      const detected: DeliveryAddress = {
        id: `addr-gps-${Date.now()}`,
        type: 'Other',
        label: 'Current Location',
        houseFlat: '45 Silicon Highway',
        building: 'Metro Innovation Center',
        street: 'Cyber Gateway Avenue',
        landmark: 'Near Central Clocktower',
        city: 'Downtown',
        state: 'CA',
        pinCode: '94016',
        isDefault: false
      };
      addAddress(detected);
      setSelectedAddress(detected);
      playSuccess();
      closeLocationModal();
    }, 1200);
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.street || !form.houseFlat) return;

    addAddress({
      type: form.type,
      label: form.type,
      houseFlat: form.houseFlat,
      building: form.building,
      street: form.street,
      landmark: form.landmark,
      city: form.city,
      state: form.state,
      pinCode: form.pinCode,
      isDefault: false
    });

    setIsAddingNew(false);
    playSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md animate-in fade-in duration-200 flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 shadow-2xl p-6 animate-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-slate-900 dark:text-white">
                Choose Delivery Address
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Accurate address ensures on-time delivery
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playClick();
              closeLocationModal();
            }}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="py-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search area, street name or landmark..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-dark-surface text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          {/* Detect Location Button */}
          <button
            onClick={handleDetectGPS}
            disabled={isDetecting}
            className="w-full mt-3 py-2.5 px-4 rounded-2xl bg-brand-500/10 dark:bg-brand-500/20 border border-brand-500/30 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center gap-2 hover:bg-brand-500/20 transition-colors"
          >
            <Navigation className={`w-4 h-4 ${isDetecting ? 'animate-spin' : ''}`} />
            <span>{isDetecting ? 'Detecting Precise Location...' : 'Use Current GPS Location'}</span>
          </button>
        </div>

        {/* Saved Addresses */}
        <div className="flex-1 overflow-y-auto space-y-3 pb-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Saved Addresses</span>
            <button
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="text-brand-500 hover:underline flex items-center gap-1 font-bold normal-case text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddingNew ? 'Cancel' : 'Add New'}</span>
            </button>
          </div>

          {isAddingNew && (
            <form onSubmit={handleCreateNew} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-white/10 space-y-2.5 text-xs">
              <div className="flex gap-2">
                {(['Home', 'Work', 'Other'] as const).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, type }))}
                    className={`px-3 py-1 rounded-xl text-xs font-bold ${
                      form.type === type ? 'bg-brand-500 text-white' : 'bg-white dark:bg-dark-card border text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="House / Flat / Suite *"
                required
                value={form.houseFlat}
                onChange={e => setForm(f => ({ ...f, houseFlat: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-dark-card border text-xs text-slate-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Street Address *"
                required
                value={form.street}
                onChange={e => setForm(f => ({ ...f, street: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-dark-card border text-xs text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-brand-500 text-white font-bold text-xs"
              >
                Save Address
              </button>
            </form>
          )}

          {addresses.map(addr => {
            const isSelected = selectedAddress?.id === addr.id;

            return (
              <div
                key={addr.id}
                onClick={() => {
                  playClick();
                  setSelectedAddress(addr);
                  closeLocationModal();
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'border-brand-500 bg-brand-500/10 dark:bg-brand-500/20'
                    : 'border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-white/10 flex items-center justify-center text-xs shrink-0 mt-0.5">
                    {addr.type === 'Home' ? '🏠' : addr.type === 'Work' ? '🏢' : '📍'}
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                      {addr.type}
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed line-clamp-2">
                      {addr.houseFlat}, {addr.street}, {addr.city} - {addr.pinCode}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-brand-500 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

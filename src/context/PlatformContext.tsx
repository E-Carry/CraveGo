import React, { createContext, useContext, useState, useEffect } from 'react';
import { Restaurant, Coupon } from '../types';
import { RESTAURANTS } from '../data/restaurants';
import { COUPONS } from '../data/coupons';

export interface PendingRestaurant {
  id: string;
  name: string;
  owner: string;
  cuisine: string;
  city: string;
  status: string;
  coverImage?: string;
}

interface PlatformContextType {
  restaurants: Restaurant[];
  coupons: Coupon[];
  pendingRestaurants: PendingRestaurant[];
  isSurgeActive: boolean;
  isRainModeActive: boolean;
  addRestaurant: (newRest: Partial<Restaurant> & { name: string }) => Restaurant;
  updateRestaurant: (id: string, updates: Partial<Restaurant>) => void;
  toggleRestaurantOpen: (id: string) => void;
  deleteRestaurant: (id: string) => void;
  approvePendingRestaurant: (pendingId: string) => void;
  rejectPendingRestaurant: (pendingId: string) => void;
  addCoupon: (coupon: Coupon) => boolean;
  deleteCoupon: (code: string) => void;
  toggleSurge: () => void;
  toggleRainMode: () => void;
  resetToDefaults: () => void;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

const INITIAL_PENDING: PendingRestaurant[] = [
  {
    id: 'pend-1',
    name: 'Artisan Woodfire Pizzeria',
    owner: 'Marco Rossi',
    cuisine: 'Pizza, Italian, Desserts',
    city: 'Indiranagar, Bengaluru',
    status: 'Pending FSSAI Inspection',
    coverImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'pend-2',
    name: 'Kyoto Matcha Tea Lounge',
    owner: 'Kenji Sato',
    cuisine: 'Coffee & Cafe, Japanese Bakery',
    city: 'Bandra West, Mumbai',
    status: 'Awaiting Kitchen Audit',
    coverImage: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'pend-3',
    name: 'Old Delhi Kebab Corner',
    owner: 'Farhan Ali',
    cuisine: 'Mughlai & Biryani, Kebabs',
    city: 'Chandni Chowk, Delhi NCR',
    status: 'License Verification Queue',
    coverImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80'
  }
];

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Reactive Restaurants List
  const [restaurants, setRestaurants] = useState<Restaurant[]>(() => {
    const saved = localStorage.getItem('cravego-restaurants');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        /* fallback */
      }
    }
    return RESTAURANTS;
  });

  // 2. Reactive Coupons List
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('cravego-coupons');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        /* fallback */
      }
    }
    return COUPONS;
  });

  // 3. Pending Restaurant Verification Queue
  const [pendingRestaurants, setPendingRestaurants] = useState<PendingRestaurant[]>(() => {
    const saved = localStorage.getItem('cravego-pending-restaurants');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        /* fallback */
      }
    }
    return INITIAL_PENDING;
  });

  // 4. Operations Toggles
  const [isSurgeActive, setIsSurgeActive] = useState<boolean>(false);
  const [isRainModeActive, setIsRainModeActive] = useState<boolean>(false);

  // Sync to LocalStorage on changes
  useEffect(() => {
    localStorage.setItem('cravego-restaurants', JSON.stringify(restaurants));
  }, [restaurants]);

  useEffect(() => {
    localStorage.setItem('cravego-coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('cravego-pending-restaurants', JSON.stringify(pendingRestaurants));
  }, [pendingRestaurants]);

  // RESTAURANT ACTIONS
  const addRestaurant = (newRest: Partial<Restaurant> & { name: string }): Restaurant => {
    const created: Restaurant = {
      ...newRest,
      id: newRest.id || `rest-${Date.now()}`,
      slug: newRest.slug || (newRest.name || 'restaurant').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      cuisines: newRest.cuisines || ['Indian & Curries'],
      rating: newRest.rating || 4.5,
      ratingCount: 120,
      deliveryTimeMin: newRest.deliveryTimeMin || 25,
      deliveryTimeMax: newRest.deliveryTimeMax || 35,
      distanceKm: newRest.distanceKm || 2.4,
      costForTwo: newRest.costForTwo || 450,
      image: newRest.coverImage || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
      coverImage: newRest.coverImage || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
      logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80',
      address: newRest.address || newRest.city || 'Indiranagar, Bengaluru',
      city: newRest.city || 'Bengaluru',
      isOpen: newRest.isOpen ?? true,
      isPureVeg: newRest.isPureVeg ?? false,
      hasOffers: newRest.hasOffers ?? true,
      offerText: newRest.offerText || 'FLAT 20% OFF',
      openingHours: newRest.openingHours || '10:00 AM - 11:00 PM',
      featuredDish: newRest.featuredDish || 'Signature Special',
      description: newRest.description || 'Authentic flavors prepared with premium quality ingredients.',
      menuItemIds: newRest.menuItemIds || ['food-1', 'food-2']
    };

    setRestaurants(prev => [created, ...prev]);
    return created;
  };

  const updateRestaurant = (id: string, updates: Partial<Restaurant>) => {
    setRestaurants(prev =>
      prev.map(r => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const toggleRestaurantOpen = (id: string) => {
    setRestaurants(prev =>
      prev.map(r => (r.id === id ? { ...r, isOpen: !r.isOpen } : r))
    );
  };

  const deleteRestaurant = (id: string) => {
    setRestaurants(prev => prev.filter(r => r.id !== id));
  };

  const approvePendingRestaurant = (pendingId: string) => {
    const pending = pendingRestaurants.find(p => p.id === pendingId);
    if (!pending) return;

    // Convert into active restaurant
    const publishedRest: Restaurant = {
      id: `rest-${Date.now()}`,
      name: pending.name,
      slug: pending.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      cuisines: [pending.cuisine],
      rating: 4.8,
      ratingCount: 42,
      deliveryTimeMin: 25,
      deliveryTimeMax: 35,
      distanceKm: 2.1,
      costForTwo: 500,
      image: pending.coverImage || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
      coverImage: pending.coverImage || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
      logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80',
      address: pending.city,
      city: pending.city,
      isPureVeg: false,
      hasOffers: true,
      offerText: 'NEW • 50% OFF',
      isOpen: true,
      openingHours: '11:00 AM - 11:00 PM',
      featuredDish: 'Chef Choice Platter',
      description: `Newly verified kitchen in ${pending.city}. Certified for hygienic preparation and safe packaging.`,
      menuItemIds: ['food-1', 'food-3']
    };

    setRestaurants(prev => [publishedRest, ...prev]);
    setPendingRestaurants(prev => prev.filter(p => p.id !== pendingId));
  };

  const rejectPendingRestaurant = (pendingId: string) => {
    setPendingRestaurants(prev => prev.filter(p => p.id !== pendingId));
  };

  // COUPON ACTIONS
  const addCoupon = (coupon: Coupon): boolean => {
    const exists = coupons.some(c => c.code.toUpperCase() === coupon.code.toUpperCase());
    if (exists) return false;

    const formatted: Coupon = {
      ...coupon,
      code: coupon.code.toUpperCase().trim()
    };

    setCoupons(prev => [formatted, ...prev]);
    return true;
  };

  const deleteCoupon = (code: string) => {
    setCoupons(prev => prev.filter(c => c.code.toUpperCase() !== code.toUpperCase()));
  };

  const toggleSurge = () => setIsSurgeActive(prev => !prev);
  const toggleRainMode = () => setIsRainModeActive(prev => !prev);

  const resetToDefaults = () => {
    setRestaurants(RESTAURANTS);
    setCoupons(COUPONS);
    setPendingRestaurants(INITIAL_PENDING);
    localStorage.removeItem('cravego-restaurants');
    localStorage.removeItem('cravego-coupons');
    localStorage.removeItem('cravego-pending-restaurants');
  };

  return (
    <PlatformContext.Provider
      value={{
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
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
};

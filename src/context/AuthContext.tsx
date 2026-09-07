import React, { createContext, useContext, useState, useEffect } from 'react';
import { DeliveryAddress, Order, AppNotification, EcosystemRole, OrderStatus } from '../types';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  walletBalance: number;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (phoneOrEmail: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<AuthUser>) => void;
  addWalletFunds: (amount: number) => void;
  // Admin auth
  isAdminAuthenticated: boolean;
  adminLogin: (email: string, pass: string) => boolean;
  adminLogout: () => void;
  isAdminModalOpen: boolean;
  openAdminModal: () => void;
  closeAdminModal: () => void;
  // Role
  role: EcosystemRole;
  setRole: (role: EcosystemRole) => void;
  // Addresses
  addresses: DeliveryAddress[];
  selectedAddress: DeliveryAddress;
  setSelectedAddress: (addr: DeliveryAddress) => void;
  addAddress: (addr: Omit<DeliveryAddress, 'id'>) => void;
  editAddress: (id: string, updated: Partial<DeliveryAddress>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  // Favorites
  favoriteRestaurantIds: string[];
  toggleFavoriteRestaurant: (id: string) => void;
  favoriteFoodIds: string[];
  toggleFavoriteFood: (id: string) => void;
  // Orders
  orders: Order[];
  activeOrder: Order | null;
  placeOrder: (newOrderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'progressPercent' | 'rider'>) => Order;
  cancelOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, progress: number) => void;
  rateOrder: (orderId: string, ratings: { food: number; delivery: number; packaging: number; comment: string }) => void;
  // Notifications
  notifications: AppNotification[];
  unreadNotificationCount: number;
  markNotificationsAsRead: () => void;
  // Tracking
  activeTrackingOrderId: string | null;
  openTracking: (orderId: string) => void;
  closeTracking: () => void;
  // Modals
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isProfileModalOpen: boolean;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  isLocationModalOpen: boolean;
  openLocationModal: () => void;
  closeLocationModal: () => void;
  isHelpModalOpen: boolean;
  openHelpModal: () => void;
  closeHelpModal: () => void;
  isOffersModalOpen: boolean;
  openOffersModal: () => void;
  closeOffersModal: () => void;
}

const DEFAULT_ADDRESSES: DeliveryAddress[] = [
  {
    id: 'addr-1',
    type: 'Home',
    label: 'Apartment 402',
    houseFlat: 'Flat 402, 4th Floor',
    building: 'Prestige Azure Heights',
    street: '12th Main Road, HAL 2nd Stage, Indiranagar',
    landmark: 'Near 100 Feet Road Metro Station',
    city: 'Bengaluru',
    state: 'Karnataka',
    pinCode: '560038',
    isDefault: true
  },
  {
    id: 'addr-2',
    type: 'Work',
    label: 'WeWork Galaxy',
    houseFlat: 'Desk 4B, 3rd Floor',
    building: 'WeWork Galaxy Office Park',
    street: '43 Residency Road, Shanthala Nagar, Ashok Nagar',
    landmark: 'Opposite Ritz-Carlton',
    city: 'Bengaluru',
    state: 'Karnataka',
    pinCode: '560025',
    isDefault: false
  },
  {
    id: 'addr-3',
    type: 'Other',
    label: "Parents' Home",
    houseFlat: 'Villa #18, Green Glen',
    building: 'Sobha Lavender',
    street: 'Green Glen Layout, Bellandur',
    landmark: 'Behind Central Mall',
    city: 'Bengaluru',
    state: 'Karnataka',
    pinCode: '560103',
    isDefault: false
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-9824',
    createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    restaurantId: 'rest-1',
    restaurantName: 'The Royal Biryani Co.',
    restaurantImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80',
    items: [
      {
        cartItemId: 'food-1__portion:full',
        foodItem: {
          id: 'food-1',
          restaurantId: 'rest-1',
          name: 'Hyderabadi Dum Biryani Feast',
          description: 'Slow cooked aromatic basmati rice with tender succulent spiced chicken, saffron, and fried onions.',
          price: 349,
          image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80',
          category: 'Biryani',
          rating: 4.9,
          ratingCount: 1420,
          isVeg: false,
          preparationTimeMinutes: 25,
          available: true
        },
        restaurantId: 'rest-1',
        restaurantName: 'The Royal Biryani Co.',
        quantity: 2,
        selectedCustomizations: [
          {
            groupId: 'portion',
            groupName: 'Portion',
            choiceIds: ['full'],
            choiceNames: ['Full (Serves 2)'],
            extraPrice: 0
          }
        ],
        unitPrice: 349,
        totalPrice: 698
      }
    ],
    itemTotal: 698,
    deliveryFee: 0,
    platformFee: 6.00,
    taxes: 35,
    discount: 100,
    tip: 30,
    donation: 2,
    grandTotal: 671,
    status: 'delivered',
    deliveryAddress: DEFAULT_ADDRESSES[0],
    paymentMethod: 'Google Pay (UPI)',
    estimatedDeliveryTime: 'Delivered',
    progressPercent: 100,
    rider: {
      id: 'rider-09',
      name: 'Rajesh Kumar',
      phone: '+91 98450 12345',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      rating: 4.95,
      vehicle: 'Ather 450X EV Scooter',
      vehicleNumber: 'KA 03 EV 2026',
      temperature: '98.4°F',
      sanitized: true
    },
    rated: true,
    foodRating: 5,
    deliveryRating: 5,
    packagingRating: 5,
    reviewComment: 'Aromatic, perfectly spiced dum biryani! Reached piping hot in under 22 mins.'
  }
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Welcome to CraveGo India! 🇮🇳🎉',
    message: 'Flat 50% OFF up to ₹100 on your first feast with code WELCOME50.',
    timestamp: 'Just now',
    type: 'offer',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Order Delivered ✓',
    message: 'Your order from The Royal Biryani Co. was safely delivered.',
    timestamp: '2 hours ago',
    type: 'delivery',
    read: true,
    orderId: 'ORD-9824'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('cravego-user');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return null;
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('cravego-admin-auth') === 'true';
  });

  const [role, setRoleState] = useState<EcosystemRole>(() => {
    return localStorage.getItem('cravego-admin-auth') === 'true' ? 'admin' : 'customer';
  });

  // Admin cannot switch to user account while admin session is active
  const setRole = (newRole: EcosystemRole) => {
    if (isAdminAuthenticated && newRole !== 'admin') {
      return;
    }
    setRoleState(newRole);
  };

  const [addresses, setAddresses] = useState<DeliveryAddress[]>(() => {
    const saved = localStorage.getItem('cravego-addresses');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return DEFAULT_ADDRESSES;
  });

  const [selectedAddress, setSelectedAddress] = useState<DeliveryAddress>(addresses[0] || DEFAULT_ADDRESSES[0]);
  const [favoriteRestaurantIds, setFavoriteRestaurantIds] = useState<string[]>(['rest-1', 'rest-2', 'rest-5']);
  const [favoriteFoodIds, setFavoriteFoodIds] = useState<string[]>(['food-1', 'food-3']);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | null>(null);

  // The Login page pops up first on load!
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('cravego-user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('cravego-addresses', JSON.stringify(addresses));
  }, [addresses]);

  // Live order active tracking
  const activeOrder = orders.find(o => o.status !== 'delivered' && o.status !== 'cancelled') || null;

  // Real-time order simulation timer for active orders
  useEffect(() => {
    if (!activeOrder) return;

    const interval = setInterval(() => {
      setOrders(prev => {
        return prev.map(order => {
          if (order.id !== activeOrder.id) return order;

          let nextStatus: OrderStatus = order.status;
          let nextProgress = order.progressPercent + 3;

          if (nextProgress >= 100) {
            nextStatus = 'delivered';
            nextProgress = 100;
          } else if (nextProgress >= 70) {
            nextStatus = 'out_for_delivery';
          } else if (nextProgress >= 45) {
            nextStatus = 'picked_up';
          } else if (nextProgress >= 20) {
            nextStatus = 'preparing';
          } else if (nextProgress >= 8) {
            nextStatus = 'accepted';
          }

          return {
            ...order,
            status: nextStatus,
            progressPercent: nextProgress
          };
        });
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [activeOrder]);

  const login = (phoneOrEmail: string) => {
    setUser({
      id: 'user-001',
      name: phoneOrEmail.includes('@') ? phoneOrEmail.split('@')[0] : 'Rahul Sharma',
      email: phoneOrEmail.includes('@') ? phoneOrEmail : 'rahul.sharma@cravego.app',
      phone: phoneOrEmail.includes('@') ? '+91 98765 43210' : phoneOrEmail,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      walletBalance: 850
    });
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cravego-user');
    setIsAuthModalOpen(true);
  };

  const updateProfile = (data: Partial<AuthUser>) => {
    setUser(prev => {
      if (!prev) return null;
      return { ...prev, ...data };
    });
  };

  const addWalletFunds = (amount: number) => {
    setUser(prev => {
      if (!prev) return null;
      return { ...prev, walletBalance: prev.walletBalance + amount };
    });
  };

  // Dedicated Admin Auth
  const adminLogin = (email: string, pass: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    if ((cleanEmail === 'admin@cravego.app' || cleanEmail === 'admin') && pass === 'crave2026') {
      setIsAdminAuthenticated(true);
      setRoleState('admin');
      localStorage.setItem('cravego-admin-auth', 'true');
      setIsAdminModalOpen(false);
      setIsAuthModalOpen(false);
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    setRoleState('customer');
    localStorage.removeItem('cravego-admin-auth');
    setIsAuthModalOpen(true);
  };

  // Address CRUD
  const addAddress = (addr: Omit<DeliveryAddress, 'id'>) => {
    const newAddr: DeliveryAddress = {
      ...addr,
      id: `addr-${Date.now()}`
    };
    setAddresses(prev => [newAddr, ...prev]);
    setSelectedAddress(newAddr);
  };

  const editAddress = (id: string, updated: Partial<DeliveryAddress>) => {
    setAddresses(prev =>
      prev.map(a => (a.id === id ? { ...a, ...updated } : a))
    );
    if (selectedAddress.id === id) {
      setSelectedAddress(prev => ({ ...prev, ...updated }));
    }
  };

  const deleteAddress = (id: string) => {
    setAddresses(prev => {
      const filtered = prev.filter(a => a.id !== id);
      if (selectedAddress.id === id && filtered.length > 0) {
        setSelectedAddress(filtered[0]);
      }
      return filtered;
    });
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(prev =>
      prev.map(a => ({
        ...a,
        isDefault: a.id === id
      }))
    );
    const chosen = addresses.find(a => a.id === id);
    if (chosen) setSelectedAddress(chosen);
  };

  const toggleFavoriteRestaurant = (id: string) => {
    setFavoriteRestaurantIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleFavoriteFood = (id: string) => {
    setFavoriteFoodIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const placeOrder = (
    newOrderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'progressPercent' | 'rider'>
  ): Order => {
    const newId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...newOrderData,
      id: newId,
      createdAt: new Date().toISOString(),
      status: 'placed',
      progressPercent: 6,
      estimatedDeliveryTime: '22-26 mins',
      rider: {
        id: 'rider-09',
        name: 'Rajesh Kumar',
        phone: '+91 98450 12345',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        rating: 4.95,
        vehicle: 'Ather 450X EV Scooter',
        vehicleNumber: 'KA 03 EV 2026',
        temperature: '98.4°F',
        sanitized: true
      }
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveTrackingOrderId(newId);

    // Add push notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Order Confirmed! 🚀',
      message: `Your feast from ${newOrder.restaurantName} is confirmed and in queue.`,
      timestamp: 'Just now',
      type: 'order',
      read: false,
      orderId: newId
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newOrder;
  };

  const cancelOrder = (orderId: string) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: 'cancelled', progressPercent: 0 } : o))
    );
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, progress: number) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status, progressPercent: progress } : o))
    );
  };

  const rateOrder = (
    orderId: string,
    ratings: { food: number; delivery: number; packaging: number; comment: string }
  ) => {
    setOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            rated: true,
            foodRating: ratings.food,
            deliveryRating: ratings.delivery,
            packagingRating: ratings.packaging,
            reviewComment: ratings.comment
          };
        }
        return o;
      })
    );
  };

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const openTracking = (orderId: string) => setActiveTrackingOrderId(orderId);
  const closeTracking = () => setActiveTrackingOrderId(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        logout,
        updateProfile,
        addWalletFunds,
        isAdminAuthenticated,
        adminLogin,
        adminLogout,
        isAdminModalOpen,
        openAdminModal: () => setIsAdminModalOpen(true),
        closeAdminModal: () => setIsAdminModalOpen(false),
        role,
        setRole,
        addresses,
        selectedAddress,
        setSelectedAddress,
        addAddress,
        editAddress,
        deleteAddress,
        setDefaultAddress,
        favoriteRestaurantIds,
        toggleFavoriteRestaurant,
        favoriteFoodIds,
        toggleFavoriteFood,
        orders,
        activeOrder,
        placeOrder,
        cancelOrder,
        updateOrderStatus,
        rateOrder,
        notifications,
        unreadNotificationCount,
        markNotificationsAsRead,
        activeTrackingOrderId,
        openTracking,
        closeTracking,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        isProfileModalOpen,
        openProfileModal: () => setIsProfileModalOpen(true),
        closeProfileModal: () => setIsProfileModalOpen(false),
        isLocationModalOpen,
        openLocationModal: () => setIsLocationModalOpen(true),
        closeLocationModal: () => setIsLocationModalOpen(false),
        isHelpModalOpen,
        openHelpModal: () => setIsHelpModalOpen(true),
        closeHelpModal: () => setIsHelpModalOpen(false),
        isOffersModalOpen,
        openOffersModal: () => setIsOffersModalOpen(true),
        closeOffersModal: () => setIsOffersModalOpen(false)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

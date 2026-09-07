import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, FoodItem, SelectedCustomization, Coupon } from '../types';
import { usePlatform } from './PlatformContext';
import { useAudio } from './AudioContext';

interface CartContextType {
  cartItems: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (
    foodItem: FoodItem,
    customizations: SelectedCustomization[],
    quantity: number,
    restName: string
  ) => boolean;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cookingInstructions: string;
  setCookingInstructions: (notes: string) => void;
  riderTip: number;
  setRiderTip: (tip: number) => void;
  donation: number;
  isDonationOpted: boolean;
  toggleDonation: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  itemTotal: number;
  deliveryFee: number;
  platformFee: number;
  taxes: number;
  discountAmount: number;
  grandTotal: number;
  totalQuantity: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cravego-cart');
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    return [];
  });

  const [restaurantId, setRestaurantId] = useState<string | null>(() => {
    return localStorage.getItem('cravego-rest-id') || null;
  });

  const [restaurantName, setRestaurantName] = useState<string | null>(() => {
    return localStorage.getItem('cravego-rest-name') || null;
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cookingInstructions, setCookingInstructions] = useState('');
  const [riderTip, setRiderTip] = useState(30); // ₹30 default
  const [isDonationOpted, setIsDonationOpted] = useState(true);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const { coupons } = usePlatform();
  const { playAdd, playRemove, playSuccess } = useAudio();

  useEffect(() => {
    localStorage.setItem('cravego-cart', JSON.stringify(cartItems));
    if (cartItems.length === 0) {
      setRestaurantId(null);
      setRestaurantName(null);
      localStorage.removeItem('cravego-rest-id');
      localStorage.removeItem('cravego-rest-name');
      setAppliedCoupon(null);
    } else {
      if (restaurantId) localStorage.setItem('cravego-rest-id', restaurantId);
      if (restaurantName) localStorage.setItem('cravego-rest-name', restaurantName);
    }
  }, [cartItems, restaurantId, restaurantName]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const toggleDonation = () => setIsDonationOpted(prev => !prev);

  const addToCart = (
    foodItem: FoodItem,
    customizations: SelectedCustomization[],
    quantity: number,
    restName: string
  ): boolean => {
    // Check if conflicting restaurant
    if (restaurantId && restaurantId !== foodItem.restaurantId && cartItems.length > 0) {
      const confirmSwitch = window.confirm(
        `Your cart contains delicious meals from "${restaurantName}". Reset cart and start an order from "${restName}"?`
      );
      if (!confirmSwitch) return false;
      setCartItems([]);
      setAppliedCoupon(null);
    }

    setRestaurantId(foodItem.restaurantId);
    setRestaurantName(restName);

    // Calculate extra customizations price
    const extraPrice = customizations.reduce((sum, c) => sum + c.extraPrice, 0);
    const unitPrice = Math.round(foodItem.price + extraPrice);
    const totalPrice = Math.round(unitPrice * quantity);

    // Unique key for same dish with identical customization choices
    const customKey = customizations
      .map(c => `${c.groupId}:${c.choiceIds.sort().join(',')}`)
      .sort()
      .join('|');
    const cartItemId = `${foodItem.id}__${customKey}`;

    setCartItems(prev => {
      const existingIdx = prev.findIndex(item => item.cartItemId === cartItemId);
      if (existingIdx > -1) {
        const updated = [...prev];
        const newQty = updated[existingIdx].quantity + quantity;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
          totalPrice: Math.round(updated[existingIdx].unitPrice * newQty)
        };
        return updated;
      } else {
        const newItem: CartItem = {
          cartItemId,
          foodItem,
          restaurantId: foodItem.restaurantId,
          restaurantName: restName,
          quantity,
          selectedCustomizations: customizations,
          unitPrice,
          totalPrice
        };
        return [...prev, newItem];
      }
    });

    playAdd();
    setIsCartOpen(true);
    return true;
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCartItems(prev => {
      return prev
        .map(item => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalPrice: Math.round(item.unitPrice * newQty)
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });

    if (delta > 0) playAdd();
    else playRemove();
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems(prev => prev.filter(i => i.cartItemId !== cartItemId));
    playRemove();
  };

  const clearCart = () => {
    setCartItems([]);
    setRestaurantId(null);
    setRestaurantName(null);
    setAppliedCoupon(null);
  };

  // Indian Rupee (₹) Pricing calculations
  const itemTotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Free delivery above ₹299 or if coupon FREEDEL is applied
  let deliveryFee = cartItems.length > 0 ? (itemTotal >= 299 ? 0 : 35) : 0;
  const platformFee = cartItems.length > 0 ? 6.00 : 0;
  const taxes = cartItems.length > 0 ? Math.round(itemTotal * 0.05) : 0; // 5% GST
  const donation = isDonationOpted && cartItems.length > 0 ? 2 : 0; // ₹2 Feeding India

  let discountAmount = 0;
  if (appliedCoupon && itemTotal >= appliedCoupon.minOrder) {
    if (appliedCoupon.code === 'FREEDEL') {
      discountAmount = deliveryFee;
      deliveryFee = 0;
    } else if (appliedCoupon.flatDiscount) {
      discountAmount = appliedCoupon.flatDiscount;
    } else if (appliedCoupon.discountPercentage) {
      const calculated = Math.round((itemTotal * appliedCoupon.discountPercentage) / 100);
      discountAmount = Math.min(calculated, appliedCoupon.maxDiscount);
    }
  }

  const grandTotal = Math.max(
    0,
    itemTotal + deliveryFee + platformFee + taxes + riderTip + donation - discountAmount
  );

  const applyCoupon = (code: string) => {
    const found = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!found) {
      return { success: false, message: 'Invalid coupon code.' };
    }
    if (itemTotal < found.minOrder) {
      return {
        success: false,
        message: `Min order value for ${found.code} is ₹${found.minOrder}.`
      };
    }
    setAppliedCoupon(found);
    playSuccess();
    return { success: true, message: `Hooray! "${found.code}" applied. You saved ₹${found.flatDiscount || ((itemTotal * found.discountPercentage) / 100).toFixed(0)}!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        restaurantId,
        restaurantName,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
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
        grandTotal,
        totalQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

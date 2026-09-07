import { Coupon } from '../types';

export const COUPONS: Coupon[] = [
  {
    code: 'WELCOME50',
    discountPercentage: 50,
    minOrder: 199,
    maxDiscount: 120,
    description: '50% OFF up to ₹120 on your first CraveGo feast!',
    expiry: '31 Dec 2026',
    category: 'New User'
  },
  {
    code: 'CRAVE20',
    discountPercentage: 20,
    minOrder: 249,
    maxDiscount: 100,
    description: '20% OFF up to ₹100 on all top-rated restaurants',
    expiry: 'Ongoing',
    category: 'Trending'
  },
  {
    code: 'FOODIE100',
    discountPercentage: 0,
    flatDiscount: 100,
    minOrder: 399,
    maxDiscount: 100,
    description: 'Flat ₹100 OFF on family & group feasts above ₹399',
    expiry: '15 Oct 2026',
    category: 'Mega Saver'
  },
  {
    code: 'FREEDEL',
    discountPercentage: 100,
    maxDiscount: 45,
    minOrder: 149,
    description: 'Zero Delivery Fee on orders above ₹149',
    expiry: 'No Expiry',
    category: 'Delivery'
  },
  {
    code: 'NIGHTOWL',
    discountPercentage: 25,
    minOrder: 299,
    maxDiscount: 150,
    description: '25% OFF on midnight cravings between 10 PM and 4 AM',
    expiry: 'Weekend Special',
    category: 'Late Night'
  }
];

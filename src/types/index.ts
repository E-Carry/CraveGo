export type CuisineType = 
  | 'Burgers'
  | 'Pizza'
  | 'Biryani'
  | 'Chinese'
  | 'Sushi & Japanese'
  | 'Mexican'
  | 'Italian & Pasta'
  | 'Healthy & Bowls'
  | 'Desserts & Bakery'
  | 'Coffee & Cafe'
  | 'Beverages'
  | 'Asian & Noodles'
  | 'Indian & Curries'
  | 'American BBQ';

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  dishCount: number;
  featured?: boolean;
}

export interface CustomizationOptionChoice {
  id: string;
  name: string;
  price: number; // in INR (₹)
  isDefault?: boolean;
}

export interface CustomizationGroup {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  minSelections?: number;
  maxSelections?: number;
  choices: CustomizationOptionChoice[];
}

export interface FoodItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number; // in INR (₹)
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  ratingCount: number;
  isVeg: boolean;
  isBestseller?: boolean;
  isSpicy?: boolean;
  calories?: number;
  preparationTimeMinutes: number;
  customizations?: CustomizationGroup[];
  available: boolean;
  allergens?: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  cuisines: (CuisineType | string)[];
  rating: number;
  ratingCount: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  distanceKm: number;
  costForTwo: number; // in INR (₹)
  image: string;
  coverImage: string;
  logo: string;
  address: string;
  city: string;
  isPureVeg: boolean;
  hasOffers: boolean;
  offerText?: string;
  isBestseller?: boolean;
  isOpen: boolean;
  openingHours: string;
  freeDeliveryOver?: number;
  featuredDish: string;
  description: string;
  menuItemIds: string[];
}

export interface SelectedCustomization {
  groupId: string;
  groupName: string;
  choiceIds: string[];
  choiceNames: string[];
  extraPrice: number;
}

export interface CartItem {
  cartItemId: string;
  foodItem: FoodItem;
  restaurantId: string;
  restaurantName: string;
  quantity: number;
  selectedCustomizations: SelectedCustomization[];
  unitPrice: number;
  totalPrice: number;
  specialInstructions?: string;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  flatDiscount?: number;
  minOrder: number; // in INR (₹)
  maxDiscount: number; // in INR (₹)
  description: string;
  expiry: string;
  expiresAt?: string;
  isActive?: boolean;
  category?: string;
}

export interface DeliveryAddress {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  label: string;
  houseFlat: string;
  building: string;
  street: string;
  landmark: string;
  city: string;
  state: string;
  pinCode: string;
  isDefault: boolean;
}

export type OrderStatus = 
  | 'placed'
  | 'accepted'
  | 'preparing'
  | 'picked_up'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderRider {
  id: string;
  name: string;
  phone: string;
  photo: string;
  rating: number;
  vehicle: string;
  vehicleNumber: string;
  temperature?: string;
  sanitized?: boolean;
}

export interface Order {
  id: string;
  createdAt: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  items: CartItem[];
  itemTotal: number;
  deliveryFee: number;
  platformFee: number;
  taxes: number;
  discount: number;
  tip: number;
  donation?: number;
  grandTotal: number;
  couponApplied?: string;
  status: OrderStatus;
  deliveryAddress: DeliveryAddress;
  deliveryInstructions?: string;
  paymentMethod: string;
  estimatedDeliveryTime: string;
  rider?: OrderRider;
  progressPercent: number;
  rated?: boolean;
  foodRating?: number;
  deliveryRating?: number;
  packagingRating?: number;
  reviewComment?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'order' | 'offer' | 'system' | 'delivery';
  read: boolean;
  orderId?: string;
}

export type EcosystemRole = 'customer' | 'restaurant' | 'delivery' | 'admin';

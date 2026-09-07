import React, { useState, useMemo } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AudioProvider } from './context/AudioContext';
import { PlatformProvider, usePlatform } from './context/PlatformContext';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Restaurant } from './types';
import { CraveBotAI } from './components/ai/CraveBotAI';

// Components
import { Navbar } from './components/navigation/Navbar';
import { MobileNav } from './components/navigation/MobileNav';
import { Footer } from './components/navigation/Footer';
import { HeroSection } from './components/hero/HeroSection';
import { CategorySlider } from './components/home/CategorySlider';
import { RestaurantFilters, FilterState } from './components/restaurant/RestaurantFilters';
import { RestaurantGrid } from './components/restaurant/RestaurantGrid';
import { RestaurantDetailModal } from './components/restaurant/RestaurantDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { LiveOrderTracking } from './components/tracking/LiveOrderTracking';
import { AuthModal } from './components/modals/AuthModal';
import { LocationModal } from './components/modals/LocationModal';
import { UserProfileModal } from './components/modals/UserProfileModal';
import { RatingModal } from './components/modals/RatingModal';
import { HelpCenterModal } from './components/modals/HelpCenterModal';
import { OffersView } from './components/offers/OffersView';

// Dashboards
import { RestaurantPartnerDashboard } from './components/dashboards/RestaurantPartnerDashboard';
import { DeliveryPartnerDashboard } from './components/dashboards/DeliveryPartnerDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';

const MainApp: React.FC = () => {
  const {
    role,
    setRole,
    activeTrackingOrderId,
    closeTracking,
    openTracking,
    openOffersModal
  } = useAuth();

  const { openCart } = useCart();
  const { restaurants } = usePlatform();

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState('home');

  const [filters, setFilters] = useState<FilterState>({
    vegOnly: false,
    minRating: 0,
    fastDeliveryOnly: false,
    offersOnly: false,
    priceTier: 'all',
    sortBy: 'recommended'
  });

  // Modals state
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [ratingOrderId, setRatingOrderId] = useState<string | null>(null);

  // Filter & Search computation on 105+ restaurants
  const filteredRestaurants = useMemo(() => {
    let result = [...restaurants];

    // 1. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(r => {
        const matchesName = r.name.toLowerCase().includes(q);
        const matchesCuisine = r.cuisines.some(c => c.toLowerCase().includes(q));
        const matchesCity = r.city.toLowerCase().includes(q);
        const matchesDish = r.featuredDish.toLowerCase().includes(q);
        return matchesName || matchesCuisine || matchesCity || matchesDish;
      });
    }

    // 2. Category Filter
    if (selectedCategory) {
      const catLower = selectedCategory.toLowerCase();
      result = result.filter(r => {
        return r.cuisines.some(c => {
          const cLower = c.toLowerCase();
          return cLower.includes(catLower) || catLower.includes(cLower);
        });
      });
    }

    // 3. Pure Veg Filter
    if (filters.vegOnly) {
      result = result.filter(r => r.isPureVeg);
    }

    // 4. Rating Filter
    if (filters.minRating > 0) {
      result = result.filter(r => r.rating >= filters.minRating);
    }

    // 5. Fast Delivery Filter (< 25 min)
    if (filters.fastDeliveryOnly) {
      result = result.filter(r => r.deliveryTimeMin <= 25);
    }

    // 6. Offers Only Filter
    if (filters.offersOnly) {
      result = result.filter(r => r.hasOffers);
    }

    // 7. Sorting
    if (filters.sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === 'delivery') {
      result.sort((a, b) => a.deliveryTimeMin - b.deliveryTimeMin);
    } else if (filters.sortBy === 'costAsc') {
      result.sort((a, b) => a.costForTwo - b.costForTwo);
    } else if (filters.sortBy === 'costDesc') {
      result.sort((a, b) => b.costForTwo - a.costForTwo);
    }

    return result;
  }, [restaurants, searchQuery, selectedCategory, filters]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setFilters({
      vegOnly: false,
      minRating: 0,
      fastDeliveryOnly: false,
      offersOnly: false,
      priceTier: 'all',
      sortBy: 'recommended'
    });
  };

  const handleNavigateSection = (section: string) => {
    if (role === 'admin') {
      // Admin cannot switch to user account while in Admin mode
      return;
    }
    if (section === 'restaurant') setRole('restaurant');
    else if (section === 'delivery') setRole('delivery');
    else if (section === 'offers') openOffersModal();
    else {
      setRole('customer');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToRestaurants = () => {
    const el = document.getElementById('restaurants-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Universal Top Navigation */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onNavigateSection={handleNavigateSection}
      />

      {/* Render Main Content based on Ecosystem Role */}
      <main className="flex-1">
        {role === 'customer' && (
          <>
            {/* Hero Section with Interactive 3D Canvas */}
            <HeroSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onExploreClick={scrollToRestaurants}
              onSelectCategory={cat => {
                setSelectedCategory(cat);
                scrollToRestaurants();
              }}
            />

            {/* Horizontal Category Carousel */}
            <CategorySlider
              selectedCategory={selectedCategory}
              onSelectCategory={cat => {
                setSelectedCategory(cat);
                scrollToRestaurants();
              }}
            />

            {/* Restaurant Discovery Section */}
            <section id="restaurants-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Header Title & Active Category badge */}
              <div className="flex flex-wrap items-end justify-between gap-4 mb-2">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
                    {selectedCategory
                      ? `${selectedCategory} Kitchens Near You`
                      : searchQuery
                      ? `Search Results for "${searchQuery}"`
                      : 'Popular Restaurants in Your City'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Authentic recipes, flash delivery, and safety inspected kitchens
                  </p>
                </div>
              </div>

              {/* Advanced Filter and Sorting Bar */}
              <RestaurantFilters
                filters={filters}
                setFilters={setFilters}
                totalResultsCount={filteredRestaurants.length}
              />

              {/* Responsive 100+ Restaurant Grid */}
              <RestaurantGrid
                restaurants={filteredRestaurants}
                onSelectRestaurant={rest => setSelectedRestaurant(rest)}
                onResetFilters={handleResetFilters}
              />
            </section>
          </>
        )}

        {role === 'restaurant' && <RestaurantPartnerDashboard />}
        {role === 'delivery' && <DeliveryPartnerDashboard />}
        {role === 'admin' && <AdminDashboard />}
      </main>

      {/* Universal Footer (Exclusive to non-admin) */}
      {role !== 'admin' && (
        <Footer
          onSelectCategory={cat => {
            setRole('customer');
            setSelectedCategory(cat);
            scrollToRestaurants();
          }}
          onNavigateSection={handleNavigateSection}
        />
      )}

      {/* Mobile Bottom Navigation Bar (Exclusive to non-admin) */}
      {role !== 'admin' && (
        <MobileNav
          currentTab={mobileTab}
          onSelectTab={tab => {
            setMobileTab(tab);
            if (tab === 'home') setRole('customer');
            if (tab === 'restaurants') scrollToRestaurants();
          }}
          onOpenSearch={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* MODALS */}
      {/* 1. Restaurant Detail Modal */}
      {selectedRestaurant && (
        <RestaurantDetailModal
          restaurant={restaurants.find(r => r.id === selectedRestaurant.id) || selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
        />
      )}

      {/* 2. Slide-out Cart Drawer */}
      <CartDrawer
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        onExploreFood={scrollToRestaurants}
      />

      {/* 3. Multi-step Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={orderId => openTracking(orderId)}
      />

      {/* 4. Live Order Real-time Tracking */}
      {activeTrackingOrderId && (
        <LiveOrderTracking
          orderId={activeTrackingOrderId}
          onClose={closeTracking}
          onRateOrder={orderId => {
            closeTracking();
            setRatingOrderId(orderId);
          }}
        />
      )}

      {/* 5. Authentication Modal */}
      <AuthModal />

      {/* 6. Location Selector Modal */}
      <LocationModal />

      {/* 7. User Profile Dashboard Modal */}
      <UserProfileModal
        onOpenTracking={orderId => openTracking(orderId)}
        onOpenRating={orderId => setRatingOrderId(orderId)}
      />

      {/* 8. Order Rating & Reviews Modal */}
      {ratingOrderId && (
        <RatingModal
          orderId={ratingOrderId}
          onClose={() => setRatingOrderId(null)}
        />
      )}

      {/* 9. Customer Support & Refund Center Modal */}
      <HelpCenterModal />

      {/* 10. Mega Offers & Deals Modal */}
      <OffersView />

      {/* 11. CraveBot AI Assistant (Visible for customer & partner roles; hidden in admin console) */}
      {role !== 'admin' && <CraveBotAI />}
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AudioProvider>
        <PlatformProvider>
          <AuthProvider>
            <CartProvider>
              <MainApp />
            </CartProvider>
          </AuthProvider>
        </PlatformProvider>
      </AudioProvider>
    </ThemeProvider>
  );
}

export default App;

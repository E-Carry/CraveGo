import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';
import confetti from 'canvas-confetti';
import {
  X,
  MapPin,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Lock,
  ArrowRight,
  ArrowLeft,
  Bike,
  Sparkles,
  Smartphone,
  Wallet,
  Coins,
  Receipt,
  QrCode,
  Building2,
  Printer,
  Download,
  Flame,
  Shield,
  Clock,
  Radio,
  ExternalLink,
  Check
} from 'lucide-react';
import { DeliveryAddress, Order } from '../../types';
import { printInvoiceDocument, downloadInvoiceFile } from '../../utils/invoiceGenerator';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (orderId: string) => void;
}

const TOP_BANKS = [
  { id: 'hdfc', name: 'HDFC Bank', code: 'HDFC', badgeColor: 'bg-blue-600 text-white' },
  { id: 'icici', name: 'ICICI Bank', code: 'ICICI', badgeColor: 'bg-orange-600 text-white' },
  { id: 'sbi', name: 'State Bank of India', code: 'SBI', badgeColor: 'bg-sky-700 text-white' },
  { id: 'axis', name: 'Axis Bank', code: 'AXIS', badgeColor: 'bg-pink-700 text-white' },
  { id: 'kotak', name: 'Kotak Mahindra', code: 'KOTAK', badgeColor: 'bg-red-700 text-white' }
];

const OTHER_BANKS = [
  'Punjab National Bank',
  'Bank of Baroda',
  'IndusInd Bank',
  'Canara Bank',
  'Union Bank of India',
  'IDFC FIRST Bank',
  'Federal Bank',
  'Yes Bank',
  'Bank of India'
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess
}) => {
  const {
    cartItems,
    restaurantId,
    restaurantName,
    itemTotal,
    deliveryFee,
    platformFee,
    taxes,
    discountAmount,
    grandTotal,
    riderTip,
    donation,
    cookingInstructions,
    appliedCoupon,
    clearCart
  } = useCart();

  const {
    addresses,
    selectedAddress,
    setSelectedAddress,
    addAddress,
    placeOrder,
    user
  } = useAuth();

  const { playClick, playSuccess } = useAudio();

  // Wizard Step: 1 = Address, 2 = Preferences, 3 = Payment, 4 = Processing/Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Delivery instruction option
  const [deliveryInstruction, setDeliveryInstruction] = useState('Leave at door');

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'wallet' | 'cod'>('upi');
  const [upiMode, setUpiMode] = useState<'apps' | 'qr'>('apps');
  const [upiApp, setUpiApp] = useState('Google Pay');
  const [upiId, setUpiId] = useState('rahul@okaxis');
  const [upiVerified, setUpiVerified] = useState(true);

  // Card state
  const [cardData, setCardData] = useState({
    number: '4532 8901 2345 8819',
    name: user?.name || 'Rahul Sharma',
    expiry: '09/29',
    cvv: '624'
  });

  // Net banking state
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [otherBank, setOtherBank] = useState('');

  // Wallet & Meal Card
  const [isMealCard, setIsMealCard] = useState(false);
  const [mealCardType, setMealCardType] = useState('Sodexo / Pluxee');

  // New address form toggle
  const [isAddingNewAddr, setIsAddingNewAddr] = useState(false);
  const [newAddrForm, setNewAddrForm] = useState({
    type: 'Home' as 'Home' | 'Work' | 'Other',
    houseFlat: '',
    building: '',
    street: '',
    landmark: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pinCode: '560038'
  });

  // Processing simulation state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('Initiating secure handshake...');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  // Dynamic QR Code Countdown timer simulation
  const [qrTimeLeft, setQrTimeLeft] = useState(299); // 4 mins 59s
  useEffect(() => {
    if (upiMode !== 'qr' || step !== 3) return;
    const timer = setInterval(() => {
      setQrTimeLeft(prev => (prev > 0 ? prev - 1 : 299));
    }, 1000);
    return () => clearInterval(timer);
  }, [upiMode, step]);

  if (!isOpen) return null;

  // Detect card network based on first digits
  const getCardBrand = (num: string) => {
    const clean = num.replace(/\s+/g, '');
    if (clean.startsWith('4')) return { name: 'VISA', color: 'text-blue-400', badge: 'VISA' };
    if (clean.startsWith('5')) return { name: 'Mastercard', color: 'text-orange-400', badge: 'Mastercard' };
    if (clean.startsWith('6') || clean.startsWith('8')) return { name: 'RuPay', color: 'text-emerald-400', badge: 'RuPay' };
    if (clean.startsWith('3')) return { name: 'American Express', color: 'text-sky-300', badge: 'AMEX' };
    return { name: 'Debit / Credit', color: 'text-amber-300', badge: 'RuPay / VISA' };
  };

  const cardBrand = getCardBrand(cardData.number);

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrForm.street || !newAddrForm.houseFlat) return;

    addAddress({
      type: newAddrForm.type,
      label: newAddrForm.type,
      houseFlat: newAddrForm.houseFlat,
      building: newAddrForm.building,
      street: newAddrForm.street,
      landmark: newAddrForm.landmark,
      city: newAddrForm.city,
      state: newAddrForm.state,
      pinCode: newAddrForm.pinCode,
      isDefault: false
    });

    setIsAddingNewAddr(false);
  };

  const handleProceedPayment = () => {
    setStep(4);
    setIsProcessing(true);
    setProcessingStatus('Securing 256-bit Banking Handshake...');

    setTimeout(() => {
      setProcessingStatus('Authorizing payment with UPI / Banking Gateway...');
    }, 600);

    setTimeout(() => {
      setProcessingStatus('Verifying token & issuing digital tax invoice...');
    }, 1200);

    setTimeout(() => {
      setIsProcessing(false);

      const paymentLabel =
        paymentMethod === 'upi'
          ? `UPI (${upiMode === 'qr' ? 'Dynamic QR Code' : upiApp})`
          : paymentMethod === 'card'
          ? `${cardBrand.name} Card`
          : paymentMethod === 'netbanking'
          ? `Net Banking (${otherBank || selectedBank})`
          : paymentMethod === 'wallet'
          ? isMealCard ? `${mealCardType} Meal Pass` : 'CraveGo Super Wallet'
          : 'Cash on Delivery (COD)';

      // Create new Indian Rupee Order
      const newOrder = placeOrder({
        restaurantId: restaurantId || 'rest-1',
        restaurantName: restaurantName || 'The Royal Biryani Co.',
        restaurantImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80',
        items: cartItems,
        itemTotal,
        deliveryFee,
        platformFee,
        taxes,
        discount: discountAmount,
        tip: riderTip,
        donation,
        grandTotal,
        couponApplied: appliedCoupon?.code,
        deliveryAddress: selectedAddress,
        deliveryInstructions: `${deliveryInstruction}${cookingInstructions ? ` | Notes: ${cookingInstructions}` : ''}`,
        paymentMethod: paymentLabel,
        estimatedDeliveryTime: '22-26 mins'
      });

      setConfirmedOrder(newOrder);
      setConfirmedOrderId(newOrder.id);
      clearCart();
      playSuccess();

      try {
        confetti({
          particleCount: 160,
          spread: 85,
          origin: { y: 0.6 }
        });
      } catch {
        /* ignore */
      }
    }, 1800);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `0${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 text-neutral-900 dark:text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col my-auto"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-200/80 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 text-red-600 dark:text-red-400 flex items-center justify-center font-black border border-red-500/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg flex items-center gap-2">
                  <span>Checkout &amp; Payment</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    ₹ INR Portal
                  </span>
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  RBI Compliant 256-bit Encrypted Payment Gateway
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playClick();
                onClose();
              }}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Step Tracker */}
          {step < 4 && (
            <div className="px-6 py-3 bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200/60 dark:border-white/5 flex items-center justify-between text-xs">
              <div
                onClick={() => setStep(1)}
                className={`flex items-center gap-2 cursor-pointer font-bold ${
                  step >= 1 ? 'text-red-600 dark:text-red-400' : 'text-neutral-400'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-[10px]">
                  1
                </span>
                <span>Address</span>
              </div>

              <div className="flex-1 h-[1px] bg-neutral-200 dark:bg-white/10 mx-3" />

              <div
                onClick={() => setStep(2)}
                className={`flex items-center gap-2 cursor-pointer font-bold ${
                  step >= 2 ? 'text-red-600 dark:text-red-400' : 'text-neutral-400'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-[10px]">
                  2
                </span>
                <span>Delivery Notes</span>
              </div>

              <div className="flex-1 h-[1px] bg-neutral-200 dark:bg-white/10 mx-3" />

              <div
                onClick={() => setStep(3)}
                className={`flex items-center gap-2 cursor-pointer font-bold ${
                  step >= 3 ? 'text-red-600 dark:text-red-400' : 'text-neutral-400'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-[10px]">
                  3
                </span>
                <span>Payment (₹)</span>
              </div>
            </div>
          )}

          {/* Step Body */}
          <div className="p-5 sm:p-6 flex-1 overflow-y-auto max-h-[68vh]">
            {/* STEP 1: Address Selection */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm">
                    Select Delivery Address
                  </h4>
                  <button
                    onClick={() => setIsAddingNewAddr(!isAddingNewAddr)}
                    className="text-xs text-red-600 dark:text-red-400 font-bold hover:underline"
                  >
                    {isAddingNewAddr ? '← Use Saved Address' : '+ Add New Address'}
                  </button>
                </div>

                {isAddingNewAddr ? (
                  <form onSubmit={handleCreateAddress} className="space-y-3 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-white/10 text-xs">
                    <div className="grid grid-cols-3 gap-2">
                      {(['Home', 'Work', 'Other'] as const).map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setNewAddrForm(f => ({ ...f, type: t }))}
                          className={`py-2 rounded-xl font-bold transition-all ${
                            newAddrForm.type === t
                              ? 'bg-red-600 text-white shadow-md'
                              : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        value={newAddrForm.houseFlat}
                        onChange={e => setNewAddrForm(f => ({ ...f, houseFlat: e.target.value }))}
                        placeholder="Flat / House No. / Floor"
                        className="px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-xs"
                      />
                      <input
                        type="text"
                        value={newAddrForm.building}
                        onChange={e => setNewAddrForm(f => ({ ...f, building: e.target.value }))}
                        placeholder="Apartment / Society Name"
                        className="px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-xs"
                      />
                    </div>

                    <input
                      type="text"
                      required
                      value={newAddrForm.street}
                      onChange={e => setNewAddrForm(f => ({ ...f, street: e.target.value }))}
                      placeholder="Street, Main Road, Locality"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-xs"
                    />

                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={newAddrForm.city}
                        onChange={e => setNewAddrForm(f => ({ ...f, city: e.target.value }))}
                        placeholder="City"
                        className="px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-xs"
                      />
                      <input
                        type="text"
                        value={newAddrForm.state}
                        onChange={e => setNewAddrForm(f => ({ ...f, state: e.target.value }))}
                        placeholder="State"
                        className="px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-xs"
                      />
                      <input
                        type="text"
                        value={newAddrForm.pinCode}
                        onChange={e => setNewAddrForm(f => ({ ...f, pinCode: e.target.value }))}
                        placeholder="PIN Code"
                        className="px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-red-600 text-white font-bold"
                    >
                      Save &amp; Deliver Here
                    </button>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {addresses.map(addr => {
                      const isSelected = selectedAddress?.id === addr.id;
                      return (
                        <div
                          key={addr.id}
                          onClick={() => {
                            playClick();
                            setSelectedAddress(addr);
                          }}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                            isSelected
                              ? 'border-red-500 bg-red-500/10 dark:bg-red-500/20 ring-1 ring-red-500'
                              : 'border-neutral-200 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-red-500" />
                              <span className="font-bold text-xs">
                                {addr.type}
                              </span>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-red-500" />
                            )}
                          </div>

                          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed line-clamp-2">
                            {addr.houseFlat}, {addr.street}, {addr.city} - {addr.pinCode}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: Instructions */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h4 className="font-bold text-sm mb-3">
                    Delivery Instructions for Valet
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: 'Leave at door', icon: '🚪', desc: 'Contactless drop at doorstep' },
                      { id: 'Hand it to me', icon: '🤝', desc: 'Direct person-to-person handover' },
                      { id: "Don't ring bell", icon: '🤫', desc: 'Baby/pets resting, text upon arrival' },
                      { id: 'Call on arrival', icon: '📞', desc: 'Call when rider reaches gate' }
                    ].map(opt => (
                      <div
                        key={opt.id}
                        onClick={() => {
                          playClick();
                          setDeliveryInstruction(opt.id);
                        }}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                          deliveryInstruction === opt.id
                            ? 'border-red-500 bg-red-500/10 dark:bg-red-500/20'
                            : 'border-neutral-200 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-white/5 text-neutral-600 dark:text-neutral-300'
                        }`}
                      >
                        <span className="text-2xl">{opt.icon}</span>
                        <div>
                          <span className="font-bold text-xs block text-neutral-900 dark:text-white">{opt.id}</span>
                          <span className="text-[10px] text-neutral-400">{opt.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Items preview in ₹ */}
                <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-white/5">
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <span>Order items from {restaurantName}</span>
                    <span>{cartItems.length} items</span>
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 space-y-1">
                    {cartItems.map(i => (
                      <div key={i.cartItemId} className="flex justify-between">
                        <span>{i.quantity}x {i.foodItem.name}</span>
                        <span className="font-semibold text-neutral-900 dark:text-white">₹{i.totalPrice}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Elevated Payment UI in ₹ */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm">
                    Select Payment Method
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    <Lock className="w-3 h-3" />
                    <span>256-Bit Encrypted</span>
                  </div>
                </div>

                {/* Primary Method Switcher Tabs */}
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                  {[
                    { id: 'upi', label: 'UPI', icon: <Smartphone className="w-4 h-4" /> },
                    { id: 'card', label: 'Cards', icon: <CreditCard className="w-4 h-4" /> },
                    { id: 'netbanking', label: 'NetBanking', icon: <Building2 className="w-4 h-4" /> },
                    { id: 'wallet', label: 'Wallet', icon: <Wallet className="w-4 h-4" /> },
                    { id: 'cod', label: 'Cash', icon: <Coins className="w-4 h-4" /> }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        playClick();
                        setPaymentMethod(tab.id as typeof paymentMethod);
                      }}
                      className={`py-2.5 px-1 sm:px-2 rounded-2xl flex flex-col items-center gap-1 text-[11px] sm:text-xs font-bold transition-all ${
                        paymentMethod === tab.id
                          ? 'bg-gradient-to-br from-red-600 to-orange-600 text-white shadow-lg shadow-red-600/25 scale-[1.02]'
                          : 'bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* TAB 1: UPI Options */}
                {paymentMethod === 'upi' && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-white/5 space-y-4">
                    {/* Sub-mode selector: UPI Apps vs QR */}
                    <div className="flex bg-neutral-200/60 dark:bg-neutral-900/80 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => {
                          playClick();
                          setUpiMode('apps');
                        }}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          upiMode === 'apps'
                            ? 'bg-white dark:bg-neutral-800 text-red-600 dark:text-red-400 shadow-sm'
                            : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Instant UPI Apps</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          playClick();
                          setUpiMode('qr');
                        }}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          upiMode === 'qr'
                            ? 'bg-white dark:bg-neutral-800 text-red-600 dark:text-red-400 shadow-sm'
                            : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Scan &amp; Pay QR</span>
                      </button>
                    </div>

                    {upiMode === 'apps' ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            { name: 'Google Pay', icon: '🌐', color: 'border-blue-500/30' },
                            { name: 'PhonePe', icon: '🟣', color: 'border-purple-500/30' },
                            { name: 'Paytm', icon: '🔷', color: 'border-sky-500/30' },
                            { name: 'CRED UPI', icon: '💎', color: 'border-amber-500/30' }
                          ].map(app => (
                            <button
                              key={app.name}
                              type="button"
                              onClick={() => {
                                playClick();
                                setUpiApp(app.name);
                              }}
                              className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all text-center flex flex-col items-center gap-1.5 ${
                                upiApp === app.name
                                  ? 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 ring-1 ring-red-500 shadow-sm'
                                  : 'border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800'
                              }`}
                            >
                              <span className="text-xl">{app.icon}</span>
                              <span>{app.name}</span>
                            </button>
                          ))}
                        </div>

                        <div className="pt-2">
                          <label className="block text-[11px] font-semibold text-neutral-500 mb-1">
                            Or Enter UPI VPA ID:
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={upiId}
                              onChange={e => {
                                setUpiId(e.target.value);
                                setUpiVerified(e.target.value.includes('@'));
                              }}
                              placeholder="e.g. rahul@okaxis, 9876543210@paytm"
                              className="w-full pl-3 pr-28 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-red-500"
                            />
                            {upiVerified && (
                              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                                <Check className="w-3 h-3" />
                                <span>Verified</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Dynamic 3D QR Code Mode */
                      <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-center space-y-3">
                        <div className="relative p-3 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 border border-white/20 shadow-xl group">
                          {/* Pulsing Scan Line */}
                          <div className="absolute inset-x-3 top-3 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse" />
                          
                          <svg viewBox="0 0 100 100" width="130" height="130" xmlns="http://www.w3.org/2000/svg">
                            <rect width="100" height="100" fill="#ffffff" rx="10"/>
                            {/* Position Anchors */}
                            <rect x="8" y="8" width="26" height="26" fill="#0f172a" rx="4"/>
                            <rect x="13" y="13" width="16" height="16" fill="#ffffff"/>
                            <rect x="17" y="17" width="8" height="8" fill="#ef4444"/>

                            <rect x="66" y="8" width="26" height="26" fill="#0f172a" rx="4"/>
                            <rect x="71" y="13" width="16" height="16" fill="#ffffff"/>
                            <rect x="75" y="17" width="8" height="8" fill="#ef4444"/>

                            <rect x="8" y="66" width="26" height="26" fill="#0f172a" rx="4"/>
                            <rect x="13" y="71" width="16" height="16" fill="#ffffff"/>
                            <rect x="17" y="75" width="8" height="8" fill="#ef4444"/>

                            {/* Data points */}
                            <rect x="38" y="12" width="8" height="8" fill="#0f172a"/>
                            <rect x="50" y="20" width="10" height="6" fill="#0f172a"/>
                            <rect x="12" y="40" width="8" height="18" fill="#0f172a"/>
                            <rect x="42" y="42" width="16" height="16" fill="#ef4444" rx="3"/>
                            <rect x="68" y="40" width="12" height="8" fill="#0f172a"/>
                            <rect x="84" y="48" width="8" height="8" fill="#0f172a"/>
                            <rect x="42" y="66" width="8" height="14" fill="#0f172a"/>
                            <rect x="56" y="72" width="20" height="10" fill="#0f172a"/>
                            <rect x="80" y="68" width="12" height="20" fill="#0f172a"/>
                          </svg>

                          <div className="absolute -bottom-2.5 inset-x-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider py-0.5 rounded-full shadow-md">
                            Scan with Any App
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-200 mt-2">
                            <span>Amount to Pay:</span>
                            <span className="text-red-600 dark:text-red-400 font-extrabold text-sm">₹{grandTotal}</span>
                          </div>
                          <p className="text-[11px] text-neutral-500 mt-1 flex items-center justify-center gap-1">
                            <Clock className="w-3 h-3 text-amber-500" />
                            <span>Expires in <strong>{formatTime(qrTimeLeft)}</strong></span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: 3D Interactive Card Form */}
                {paymentMethod === 'card' && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-white/5 space-y-4">
                    {/* 3D Visual Card Mockup */}
                    <div className="relative w-full h-44 rounded-3xl bg-gradient-to-tr from-[#0a0f1d] via-[#1a1c2e] to-[#2c0f18] p-5 text-white flex flex-col justify-between shadow-2xl border border-white/15 overflow-hidden group">
                      {/* Ambient Holographic Glow */}
                      <div className="absolute -right-10 -top-10 w-36 h-36 bg-red-600/20 rounded-full blur-2xl pointer-events-none" />
                      
                      <div className="flex justify-between items-center relative z-10">
                        <div className="flex items-center gap-2">
                          <Flame className="w-5 h-5 text-red-500" />
                          <span className="font-black tracking-widest text-xs text-neutral-300">
                            CRAVEGO PREMIER
                          </span>
                        </div>
                        <span className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-md bg-white/10 ${cardBrand.color}`}>
                          {cardBrand.badge}
                        </span>
                      </div>

                      {/* Golden EMV Chip & Contactless Waves */}
                      <div className="flex items-center gap-3 relative z-10">
                        <div className="w-9 h-7 rounded-md bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 p-1 flex flex-col justify-between shadow-inner border border-amber-200/50">
                          <div className="w-full h-0.5 bg-amber-800/30" />
                          <div className="w-full h-0.5 bg-amber-800/30" />
                        </div>
                        <Radio className="w-4 h-4 text-neutral-400 rotate-90" />
                      </div>

                      <div className="font-mono text-base tracking-[0.2em] text-neutral-100 font-bold relative z-10">
                        {cardData.number || '•••• •••• •••• ••••'}
                      </div>

                      <div className="flex justify-between items-end text-[11px] text-neutral-300 uppercase font-semibold relative z-10">
                        <div>
                          <span className="block text-[8px] text-neutral-400 tracking-wider">CARD HOLDER</span>
                          <span>{cardData.name || 'YOUR NAME'}</span>
                        </div>
                        <div className="text-right">
                          <span className="block text-[8px] text-neutral-400 tracking-wider">EXPIRES</span>
                          <span className="font-mono">{cardData.expiry || 'MM/YY'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Form Inputs */}
                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-500 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardData.number}
                          onChange={e => setCardData(c => ({ ...c, number: e.target.value }))}
                          placeholder="4532 8901 2345 8819"
                          maxLength={19}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-red-500 font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-neutral-500 mb-1">
                            Expiry (MM/YY)
                          </label>
                          <input
                            type="text"
                            value={cardData.expiry}
                            onChange={e => setCardData(c => ({ ...c, expiry: e.target.value }))}
                            placeholder="09/29"
                            maxLength={5}
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-red-500 font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-neutral-500 mb-1 flex items-center justify-between">
                            <span>CVV</span>
                            <span className="text-[10px] text-neutral-400">3 digits</span>
                          </label>
                          <input
                            type="password"
                            value={cardData.cvv}
                            onChange={e => setCardData(c => ({ ...c, cvv: e.target.value }))}
                            placeholder="•••"
                            maxLength={4}
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-red-500 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: Net Banking */}
                {paymentMethod === 'netbanking' && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-white/5 space-y-3">
                    <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block">
                      Popular Indian Banks:
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {TOP_BANKS.map(b => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => {
                            playClick();
                            setSelectedBank(b.name);
                            setOtherBank('');
                          }}
                          className={`py-3 px-1.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                            selectedBank === b.name && !otherBank
                              ? 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 ring-1 ring-red-500 font-bold'
                              : 'border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800'
                          }`}
                        >
                          <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${b.badgeColor}`}>
                            {b.code}
                          </span>
                          <span className="text-[11px] truncate w-full">{b.name}</span>
                        </button>
                      ))}
                    </div>

                    <div className="pt-2">
                      <label className="block text-[11px] font-semibold text-neutral-500 mb-1">
                        Or select from all other banks:
                      </label>
                      <select
                        value={otherBank}
                        onChange={e => {
                          setOtherBank(e.target.value);
                          if (e.target.value) setSelectedBank('');
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-xs text-neutral-900 dark:text-white focus:outline-none"
                      >
                        <option value="">-- Choose from 40+ Indian Banks --</option>
                        {OTHER_BANKS.map(bank => (
                          <option key={bank} value={bank}>{bank}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* TAB 4: Wallet & Corporate Meal Pass */}
                {paymentMethod === 'wallet' && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-white/5 space-y-4">
                    {/* CraveGo Super Wallet */}
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-300 flex items-center justify-between">
                      <div>
                        <div className="font-bold flex items-center gap-1.5">
                          <Wallet className="w-4 h-4 text-emerald-500" />
                          <span>CraveGo Super Wallet</span>
                        </div>
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                          Instant 1-tap checkout with zero OTP delay
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] block uppercase font-bold text-neutral-400">Available</span>
                        <span className="font-black text-lg text-emerald-600 dark:text-emerald-400">
                          ₹{user?.walletBalance ?? 850}
                        </span>
                      </div>
                    </div>

                    {/* Meal Card Toggle */}
                    <div className="pt-1 border-t border-neutral-200 dark:border-white/10">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                        <input
                          type="checkbox"
                          checked={isMealCard}
                          onChange={e => setIsMealCard(e.target.checked)}
                          className="rounded text-red-600 focus:ring-red-500"
                        />
                        <span>Pay with Corporate Meal Pass (Tax-exempt)</span>
                      </label>

                      {isMealCard && (
                        <div className="grid grid-cols-2 gap-2 mt-2 pt-1">
                          {['Sodexo / Pluxee', 'Zeta Meal Card'].map(card => (
                            <button
                              key={card}
                              type="button"
                              onClick={() => setMealCardType(card)}
                              className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                                mealCardType === card
                                  ? 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400'
                                  : 'border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300'
                              }`}
                            >
                              {card}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 5: Cash on Delivery */}
                {paymentMethod === 'cod' && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-white/5 space-y-2 text-xs text-neutral-600 dark:text-neutral-300">
                    <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white text-sm">
                      <Coins className="w-5 h-5 text-amber-500" />
                      <span>Pay on Delivery (Cash or Valet QR)</span>
                    </div>
                    <p className="text-[11.5px] leading-relaxed">
                      You can pay via exact cash of <strong className="text-red-600 dark:text-red-400 font-extrabold">₹{grandTotal}</strong> or scan your delivery partner’s live Ather EV QR code on arrival.
                    </p>
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-[11px] font-semibold flex items-center gap-1.5">
                      <span>💡 Delivery partners carry minimal change. Exact amount is recommended!</span>
                    </div>
                  </div>
                )}

                {/* Trust & Guarantee Banner */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800/40 text-[11px] text-neutral-500 dark:text-neutral-400">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <span>RBI 256-Bit SSL • PCI-DSS Level 1</span>
                  </div>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">100% Refund Assurance</span>
                </div>
              </div>
            )}

            {/* STEP 4: Cinematic Processing & Order Success */}
            {step === 4 && (
              <div className="py-8 flex flex-col items-center justify-center text-center">
                {isProcessing ? (
                  <div className="space-y-4">
                    <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                      <div className="w-20 h-20 border-4 border-red-500/20 border-t-red-600 rounded-full animate-spin" />
                      <Lock className="w-7 h-7 text-red-500 absolute" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-lg mb-1">
                        Authorizing Payment
                      </h4>
                      <p className="text-xs text-neutral-500 font-medium animate-pulse">
                        {processingStatus}
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 15 }}
                      className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-4 shadow-xl shadow-emerald-500/30"
                    >
                      <CheckCircle2 className="w-10 h-10" />
                    </motion.div>

                    <h4 className="font-black text-2xl mb-1 text-neutral-900 dark:text-white">
                      Order Placed Successfully! 🚀
                    </h4>
                    <p className="text-xs text-neutral-500 max-w-xs mb-4">
                      Your feast from {restaurantName} is confirmed and in kitchen queue.
                    </p>

                    <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 text-xs w-full max-w-sm mb-4 text-left space-y-1.5 shadow-sm">
                      <div className="flex justify-between font-bold">
                        <span>Order ID</span>
                        <span className="font-mono text-red-600 dark:text-red-400">#{confirmedOrderId}</span>
                      </div>
                      <div className="flex justify-between text-neutral-500">
                        <span>Amount Paid</span>
                        <span className="font-bold text-neutral-900 dark:text-white">₹{grandTotal}</span>
                      </div>
                      <div className="flex justify-between text-neutral-500">
                        <span>Delivery Location</span>
                        <span className="truncate max-w-[180px] font-medium">{selectedAddress?.street}</span>
                      </div>
                      <div className="flex justify-between text-neutral-500">
                        <span>Estimated Arrival</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">22-26 Mins</span>
                      </div>
                    </div>

                    {/* Official Tax Invoice Download Actions */}
                    <div className="w-full max-w-sm grid grid-cols-2 gap-2 mb-4">
                      <button
                        onClick={() => {
                          playClick();
                          if (confirmedOrder) printInvoiceDocument(confirmedOrder, user);
                        }}
                        className="py-2.5 px-3 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:opacity-90 transition-all active:scale-[0.98]"
                      >
                        <Printer className="w-4 h-4 text-red-500" />
                        <span>Print / Save PDF</span>
                      </button>

                      <button
                        onClick={() => {
                          playClick();
                          if (confirmedOrder) downloadInvoiceFile(confirmedOrder, user);
                        }}
                        className="py-2.5 px-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-800 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-neutral-200 dark:border-white/10 transition-all active:scale-[0.98]"
                      >
                        <Download className="w-4 h-4 text-neutral-500" />
                        <span>Download HTML</span>
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        playClick();
                        onClose();
                        if (confirmedOrderId) {
                          onOrderSuccess(confirmedOrderId);
                        }
                      }}
                      className="w-full max-w-sm py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-extrabold text-sm shadow-xl shadow-red-500/30 hover:opacity-95 transition-opacity flex items-center justify-center gap-2 active:scale-[0.99]"
                    >
                      <Bike className="w-4 h-4" />
                      <span>Track Live Order on 3D Map</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Wizard Navigation Footer */}
          {step < 4 && (
            <div className="p-4 border-t border-neutral-200/80 dark:border-white/10 bg-white dark:bg-neutral-900 flex items-center justify-between">
              {step > 1 ? (
                <button
                  onClick={() => {
                    playClick();
                    setStep(prev => (prev > 1 ? ((prev - 1) as 1 | 2 | 3) : 1));
                  }}
                  className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-white/10 text-xs font-bold flex items-center gap-1.5 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="block text-[10px] text-neutral-400 uppercase font-bold">
                    To Pay (INR)
                  </span>
                  <span className="font-black text-sm text-neutral-900 dark:text-white">
                    ₹{grandTotal}
                  </span>
                </div>

                {step < 3 ? (
                  <button
                    onClick={() => {
                      playClick();
                      setStep(prev => (prev < 3 ? ((prev + 1) as 2 | 3) : 3));
                    }}
                    className="py-2.5 px-5 rounded-2xl bg-red-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-red-600/30 hover:bg-red-500 transition-colors"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleProceedPayment}
                    className="py-2.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-xl shadow-red-500/30 hover:opacity-95 transition-opacity"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Pay ₹{grandTotal} Securely</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

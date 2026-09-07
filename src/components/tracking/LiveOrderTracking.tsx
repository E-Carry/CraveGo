import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';
import {
  X,
  Phone,
  MessageSquare,
  Bike,
  CheckCircle2,
  Clock,
  MapPin,
  Star,
  Send,
  ShieldCheck,
  ThermometerSnowflake,
  FileText,
  Download,
  Building,
  Navigation,
  Printer
} from 'lucide-react';
import { OrderStatus } from '../../types';
import { ThreeDLiveMap } from './ThreeDLiveMap';
import { printInvoiceDocument, downloadInvoiceFile } from '../../utils/invoiceGenerator';

interface LiveOrderTrackingProps {
  orderId: string | null;
  onClose: () => void;
  onRateOrder: (orderId: string) => void;
}

export const LiveOrderTracking: React.FC<LiveOrderTrackingProps> = ({
  orderId,
  onClose,
  onRateOrder
}) => {
  const { orders, user } = useAuth();
  const { playClick, playDing } = useAudio();

  const [isCallingRider, setIsCallingRider] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [isShowInvoice, setIsShowInvoice] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'rider' | 'me'; text: string; time: string }>>([
    { sender: 'rider', text: "Namaste! I've picked up your order from the restaurant. Reaching your gate shortly on my Ather EV.", time: '2 mins ago' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const order = orders.find(o => o.id === orderId) || orders[0];

  if (!orderId || !order) return null;

  // Stages definition
  const stages: { key: OrderStatus; label: string; timeOffset: string }[] = [
    { key: 'placed', label: 'Order Confirmed', timeOffset: '00:00' },
    { key: 'accepted', label: 'Accepted by Kitchen', timeOffset: '+02:00' },
    { key: 'preparing', label: 'Chef Simmering & Packing', timeOffset: '+08:00' },
    { key: 'picked_up', label: 'Valet Picked Up', timeOffset: '+16:00' },
    { key: 'out_for_delivery', label: 'Out for Delivery', timeOffset: '+20:00' },
    { key: 'delivered', label: 'Delivered Safely', timeOffset: '+26:00' }
  ];

  const getStageIndex = (status: OrderStatus) => {
    return stages.findIndex(s => s.key === status);
  };

  const currentStageIndex = getStageIndex(order.status);
  const riderProgress = Math.min(100, Math.max(0, order.progressPercent));

  // Cubic Bezier interpolation: P0(50,250), P1(150,100), P2(300,350), P3(450,120)
  const t = riderProgress / 100;
  const riderX = Math.round(
    Math.pow(1 - t, 3) * 50 +
    3 * Math.pow(1 - t, 2) * t * 150 +
    3 * (1 - t) * Math.pow(t, 2) * 300 +
    Math.pow(t, 3) * 450
  );
  const riderY = Math.round(
    Math.pow(1 - t, 3) * 250 +
    3 * Math.pow(1 - t, 2) * t * 100 +
    3 * (1 - t) * Math.pow(t, 2) * 350 +
    Math.pow(t, 3) * 120
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    playClick();
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'me', text: userMsg, time: 'Just now' }]);
    setChatInput('');

    setTimeout(() => {
      playDing();
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'rider',
          text: "Sure! Noted your instructions. Reaching in 3-4 minutes! 👍",
          time: 'Just now'
        }
      ]);
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex justify-center p-2 sm:p-4 md:p-6 text-neutral-900 dark:text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-4xl rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-200/80 dark:border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
                <Bike className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-lg">
                    Live Order GPS Tracking
                  </h3>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500/15 text-red-600 dark:text-red-400">
                    #{order.id}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  From {order.restaurantName} → {order.deliveryAddress?.street || 'Indiranagar, Bengaluru'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsShowInvoice(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-neutral-500" />
                <span>Tax Invoice</span>
              </button>
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
          </div>

          {/* Tracking Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* ETA Banner */}
            <div className="p-4 rounded-3xl bg-gradient-to-r from-red-600/10 via-orange-500/10 to-emerald-500/10 border border-red-500/20 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 text-white flex items-center justify-center font-black shadow-lg shadow-red-500/30">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    {order.status === 'delivered' ? 'Delivery Completed' : 'Estimated Delivery In'}
                  </span>
                  <h4 className="text-2xl font-black">
                    {order.status === 'delivered' ? 'Delivered Safely 🍲' : `${Math.max(3, 24 - Math.floor(riderProgress * 0.22))} Mins`}
                  </h4>
                </div>
              </div>

              {order.status !== 'delivered' && order.status !== 'cancelled' && (
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                    Live Telemetry Streaming
                  </span>
                </div>
              )}
            </div>

            {/* 3D Moving Ather EV Delivery Map */}
            <ThreeDLiveMap
              progressPercent={order.progressPercent}
              restaurantName={order.restaurantName}
              deliveryAddress={order.deliveryAddress?.street || '100 Feet Road, Indiranagar, Bengaluru'}
              riderName={order.rider?.name || 'Rajesh Kumar'}
            />

            {/* Stages Stepper */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-400">
                Order Milestones
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                {stages.map((stage, idx) => {
                  const isDone = currentStageIndex >= idx;
                  const isCurrent = currentStageIndex === idx;

                  return (
                    <div
                      key={stage.key}
                      className={`p-3 rounded-2xl border transition-all flex flex-col justify-between ${
                        isCurrent
                          ? 'border-red-500 bg-red-500/10 dark:bg-red-500/20 ring-1 ring-red-500'
                          : isDone
                          ? 'border-emerald-500/40 bg-emerald-500/5 text-neutral-800 dark:text-neutral-200'
                          : 'border-neutral-200 dark:border-white/5 opacity-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono text-neutral-400">{stage.timeOffset}</span>
                        {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      </div>
                      <span className="font-bold text-xs leading-snug">{stage.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Partner Safety & Bio Card */}
            <div className="p-4 rounded-3xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={order.rider?.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                  alt={order.rider?.name || 'Rajesh Kumar'}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-red-500 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="font-black text-sm text-neutral-900 dark:text-white">
                      {order.rider?.name || 'Rajesh Kumar'}
                    </h5>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-md">
                      <Star className="w-3 h-3 fill-amber-500" />
                      <span>{order.rider?.rating || 4.95}</span>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {order.rider?.vehicle || 'Ather 450X EV Scooter'} • <span className="font-mono">{order.rider?.vehicleNumber || 'KA 03 EV 2026'}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                    <span className="flex items-center gap-1 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                      <ThermometerSnowflake className="w-3 h-3" />
                      Temp: {order.rider?.temperature || '98.4°F'}
                    </span>
                    <span className="flex items-center gap-1 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                      <ShieldCheck className="w-3 h-3" />
                      Sanitized Daily
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    playClick();
                    setIsCallingRider(true);
                  }}
                  className="px-3.5 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 hover:bg-emerald-500 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Valet</span>
                </button>

                <button
                  onClick={() => {
                    playClick();
                    setIsChatting(true);
                  }}
                  className="px-3.5 py-2.5 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-md hover:opacity-90 transition-opacity"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat</span>
                </button>
              </div>
            </div>

            {/* Itemized Order Summary Preview in ₹ */}
            <div className="p-4 rounded-3xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span>Order Summary</span>
                <span className="text-red-600 dark:text-red-400 font-extrabold text-sm">₹{order.grandTotal}</span>
              </div>
              <div className="divide-y divide-neutral-200/60 dark:divide-white/5 text-xs text-neutral-600 dark:text-neutral-400">
                {order.items.map(it => (
                  <div key={it.cartItemId} className="py-1.5 flex justify-between">
                    <span>{it.quantity}x {it.foodItem.name}</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">₹{it.totalPrice}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivered Rating Trigger */}
            {order.status === 'delivered' && !order.rated && (
              <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-sm text-amber-600 dark:text-amber-400">
                    How was your feast from {order.restaurantName}?
                  </h5>
                  <p className="text-xs text-neutral-500">Rate your food and delivery experience to help us improve</p>
                </div>
                <button
                  onClick={() => {
                    playClick();
                    onRateOrder(order.id);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs shadow-md hover:bg-amber-400 transition-colors"
                >
                  Rate Order ★
                </button>
              </div>
            )}
          </div>

          {/* Calling Modal Simulation */}
          {isCallingRider && (
            <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
              <div className="w-full max-w-xs p-6 rounded-3xl bg-neutral-900 border border-white/10 text-center text-white space-y-4 animate-in zoom-in-95">
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 animate-pulse">
                  <Phone className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-black text-lg">{order.rider?.name || 'Rajesh Kumar'}</h4>
                  <p className="text-xs text-neutral-400">Masked Privacy Call (+91 98450 12345)</p>
                </div>
                <p className="text-xs text-emerald-400 font-bold">Connecting with delivery valet...</p>
                <button
                  onClick={() => setIsCallingRider(false)}
                  className="w-full py-2.5 rounded-2xl bg-rose-600 font-bold text-xs shadow-lg shadow-rose-600/30 hover:bg-rose-500 transition-colors"
                >
                  End Call
                </button>
              </div>
            </div>
          )}

          {/* Live Chat Modal Simulation */}
          {isChatting && (
            <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
              <div className="w-full max-w-sm h-[480px] rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 flex flex-col overflow-hidden animate-in zoom-in-95 shadow-2xl">
                <div className="p-3.5 border-b border-neutral-200 dark:border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-bold text-xs">
                      Chat with {order.rider?.name || 'Rajesh'}
                    </span>
                  </div>
                  <button onClick={() => setIsChatting(false)} className="text-neutral-400 hover:text-neutral-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex flex-col ${
                        msg.sender === 'me' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`p-2.5 rounded-2xl max-w-[80%] ${
                          msg.sender === 'me'
                            ? 'bg-red-600 text-white rounded-br-none'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-bl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-neutral-400 mt-0.5">{msg.time}</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="p-2 border-t border-neutral-200 dark:border-white/10 flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Type message to rider..."
                    className="flex-1 px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-none"
                  />
                  <button type="submit" className="p-2 rounded-xl bg-red-600 text-white">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Tax Invoice Modal */}
          {isShowInvoice && (
            <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
              <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 shadow-2xl text-neutral-900 dark:text-white space-y-4 animate-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-3">
                  <div>
                    <h4 className="font-black text-base">Tax Invoice / Bill of Supply</h4>
                    <p className="text-[11px] text-neutral-500">GSTIN: 29AABCC1234F1Z5 • CraveGo India Pvt Ltd</p>
                  </div>
                  <button onClick={() => setIsShowInvoice(false)} className="text-neutral-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Invoice No.</span>
                    <span className="font-mono font-bold">INV-2026-{order.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Restaurant</span>
                    <span className="font-semibold">{order.restaurantName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Delivery Address</span>
                    <span className="font-medium truncate max-w-[200px]">{order.deliveryAddress?.street}</span>
                  </div>
                </div>

                <div className="border-t border-b border-neutral-200 dark:border-white/10 py-3 space-y-1.5 text-xs">
                  {order.items.map(it => (
                    <div key={it.cartItemId} className="flex justify-between">
                      <span>{it.quantity} x {it.foodItem.name}</span>
                      <span className="font-semibold">₹{it.totalPrice}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-neutral-500 pt-1">
                    <span>GST &amp; Restaurant Tax (5%)</span>
                    <span>₹{order.taxes}</span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>Platform Service Fee</span>
                    <span>₹{order.platformFee.toFixed(2)}</span>
                  </div>
                  {order.donation && (
                    <div className="flex justify-between text-neutral-500">
                      <span>Feeding India Contribution</span>
                      <span>₹{order.donation}</span>
                    </div>
                  )}
                  {order.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount ({order.couponApplied || 'OFFER'})</span>
                      <span>-₹{order.discount}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center font-black text-base">
                  <span>Grand Total Paid</span>
                  <span className="text-red-600 dark:text-red-400">₹{order.grandTotal}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      playClick();
                      printInvoiceDocument(order, user);
                    }}
                    className="py-3 px-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition-all active:scale-[0.98]"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print / Save PDF</span>
                  </button>

                  <button
                    onClick={() => {
                      playClick();
                      downloadInvoiceFile(order, user);
                    }}
                    className="py-3 px-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-800 dark:text-white font-bold text-xs flex items-center justify-center gap-2 border border-neutral-200 dark:border-white/10 transition-all active:scale-[0.98]"
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

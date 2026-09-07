import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';
import {
  X,
  HelpCircle,
  MessageSquare,
  RefreshCw,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Send,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const HelpCenterModal: React.FC = () => {
  const { isHelpModalOpen, closeHelpModal, orders, user } = useAuth();
  const { playClick, playDing, playSuccess } = useAudio();

  const [activeTab, setActiveTab] = useState<'faq' | 'refund' | 'chat'>('faq');
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);

  // Refund request state
  const [refundReason, setRefundReason] = useState('Missing item');
  const [refundOrderId, setRefundOrderId] = useState(orders[0]?.id || 'ORD-9824');
  const [refundStatus, setRefundStatus] = useState<'idle' | 'requested' | 'review' | 'approved' | 'processed'>('idle');

  // Live support chat state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'bot' | 'me'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: "👋 Hello! I'm CraveBot, your 24/7 culinary assistant. How can I assist you today?",
      time: 'Just now'
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  if (!isHelpModalOpen) return null;

  const handleStartRefund = () => {
    playClick();
    setRefundStatus('requested');

    setTimeout(() => {
      setRefundStatus('review');
      setTimeout(() => {
        setRefundStatus('approved');
        setTimeout(() => {
          setRefundStatus('processed');
          playSuccess();
          if (user) {
            user.walletBalance += 14.50;
          }
        }, 1200);
      }, 1200);
    }, 1200);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    playClick();
    const query = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'me', text: query, time: 'Just now' }]);
    setChatInput('');

    setTimeout(() => {
      playDing();
      let reply = "I've checked our database! Our live delivery team has been alerted and will ensure your request is prioritized.";
      if (query.toLowerCase().includes('refund')) {
        reply = "You can request an instant automated refund using the 'Instant Refund' tab! Funds are credited directly to your CraveGo Wallet.";
      } else if (query.toLowerCase().includes('late') || query.toLowerCase().includes('time')) {
        reply = "Orders typically take 18-28 minutes. You can monitor your rider's live GPS speed and path in the Live Tracking view.";
      } else if (query.toLowerCase().includes('coupon') || query.toLowerCase().includes('offer')) {
        reply = "Try using code WELCOME50 for 50% off or CRAVE20 for 20% off your order!";
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: reply, time: 'Just now' }]);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md animate-in fade-in duration-200 flex justify-center p-2 sm:p-4 md:p-6">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center font-bold">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-slate-900 dark:text-white">
                CraveGo Help &amp; Support
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Fast resolutions, automated refunds, and 24/7 live assistance
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playClick();
              closeHelpModal();
            }}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2.5 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-dark-surface flex items-center gap-2">
          {[
            { id: 'faq', label: 'FAQ & Guides', icon: <HelpCircle className="w-4 h-4" /> },
            { id: 'refund', label: 'Instant Refund Engine', icon: <RefreshCw className="w-4 h-4" /> },
            { id: 'chat', label: 'Live CraveBot AI Chat', icon: <MessageSquare className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                playClick();
                setActiveTab(tab.id as typeof activeTab);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-white/5'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-3">
              {[
                {
                  q: 'How does CraveGo Flash Delivery work?',
                  a: 'Our smart routing matches orders with high-efficiency EV delivery partners located within 1.5 km of the restaurant kitchen, ensuring steaming hot food in 18-25 minutes.'
                },
                {
                  q: 'Can I cancel or modify an order after placing it?',
                  a: 'Orders can be modified or cancelled directly from Live Tracking within 90 seconds before the kitchen begins food preparation.'
                },
                {
                  q: 'How do I redeem coupons and vouchers?',
                  a: 'Simply tap "Apply" next to any coupon in the cart drawer or checkout view. The savings are deducted instantly.'
                },
                {
                  q: 'What should I do if an item is missing or incorrect?',
                  a: 'Navigate to the "Instant Refund Engine" tab right here. Select your order and reason to receive an immediate credit to your CraveGo Wallet!'
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedIssue(selectedIssue === item.q ? null : item.q)}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-surface border border-slate-200/80 dark:border-white/5 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {item.q}
                    </h5>
                    <ChevronRight
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        selectedIssue === item.q ? 'rotate-90' : ''
                      }`}
                    />
                  </div>
                  {selectedIssue === item.q && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed border-t border-slate-200 dark:border-white/5 pt-2">
                      {item.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: INSTANT REFUND */}
          {activeTab === 'refund' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-xs">
                <div className="flex items-center gap-2 font-bold text-brand-600 dark:text-brand-400 mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Automated Guarantee Policy</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  If any part of your culinary feast was missing, late, or below standard, our automated bot will verify and credit your CraveGo Wallet instantly.
                </p>
              </div>

              {refundStatus === 'idle' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Select Order for Refund
                    </label>
                    <select
                      value={refundOrderId}
                      onChange={e => setRefundOrderId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-dark-surface border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
                    >
                      {orders.map(o => (
                        <option key={o.id} value={o.id}>
                          #{o.id} - {o.restaurantName} (₹{o.grandTotal})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Reason for Resolution
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        'Missing item',
                        'Wrong item delivered',
                        'Food spilled or cold',
                        'Late delivery >45 mins'
                      ].map(r => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRefundReason(r)}
                          className={`p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                            refundReason === r
                              ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400'
                              : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleStartRefund}
                    className="w-full py-3 rounded-2xl bg-brand-500 text-white font-extrabold text-xs shadow-lg shadow-brand-500/25 hover:bg-brand-600 transition-colors"
                  >
                    Submit Resolution Request
                  </button>
                </div>
              ) : (
                /* Refund Status Timeline */
                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-white/10 text-center space-y-6">
                  <div className="flex justify-between items-center max-w-md mx-auto text-xs">
                    {[
                      { s: 'requested', label: 'Requested' },
                      { s: 'review', label: 'AI Review' },
                      { s: 'approved', label: 'Approved' },
                      { s: 'processed', label: 'Credited' }
                    ].map((step, idx) => {
                      const statuses = ['requested', 'review', 'approved', 'processed'];
                      const currentIdx = statuses.indexOf(refundStatus);
                      const isDone = currentIdx >= idx;

                      return (
                        <div key={step.s} className="flex flex-col items-center gap-1">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                              isDone
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-200 dark:bg-white/10 text-slate-400'
                            }`}
                          >
                            {isDone ? '✓' : idx + 1}
                          </div>
                          <span className="font-semibold text-[11px] text-slate-600 dark:text-slate-300">
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {refundStatus === 'processed' ? (
                    <div className="space-y-2">
                      <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-xl">
                        ✓
                      </div>
                      <h4 className="font-black text-lg text-slate-900 dark:text-white">
                        ₹349.00 Refund Credited to Crave Wallet!
                      </h4>
                      <p className="text-xs text-slate-500">
                        We apologize for the inconvenience with your feast. The credit is immediately available for your next order.
                      </p>
                    </div>
                  ) : (
                    <div className="text-xs text-brand-500 font-bold animate-pulse">
                      Analyzing order dispatch logs and kitchen packaging telemetry...
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LIVE CHAT */}
          {activeTab === 'chat' && (
            <div className="h-96 flex flex-col rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden bg-slate-50 dark:bg-dark-surface">
              <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
                {chatMessages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${
                      m.sender === 'me' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                        m.sender === 'me'
                          ? 'bg-brand-500 text-white rounded-br-none'
                          : 'bg-white dark:bg-dark-card text-slate-800 dark:text-slate-200 rounded-bl-none shadow-sm'
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1">{m.time}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChat} className="p-3 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-dark-card flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Ask anything about restaurants, delivery, or refunds..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-dark-surface text-xs text-slate-900 dark:text-white focus:outline-none"
                />
                <button type="submit" className="p-2.5 rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

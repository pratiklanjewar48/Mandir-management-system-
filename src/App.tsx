import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DevoteeBotModal } from './components/DevoteeBotModal';
import { ArtiScheduler } from './components/ArtiScheduler';
import { PrasadManager } from './components/PrasadManager';
import { DonationLedger } from './components/DonationLedger';
import { OfferingAuction } from './components/OfferingAuction';
import { NotificationRouter } from './components/NotificationRouter';
import { SystemArchitecture } from './components/SystemArchitecture';
import { DevoteePortal } from './components/DevoteePortal';
import {
  ArtiSchedule,
  AuctionItem,
  DonationRecord,
  INITIAL_ARTIS,
  INITIAL_AUCTIONS,
  INITIAL_DONATIONS,
  MahaprasadToken,
  NotificationLog,
  TempleConfig,
} from './data/templeData';
import {
  Flame,
  Clock,
  Utensils,
  Receipt,
  Gavel,
  Radio,
  Layers,
  Bot,
  Sparkles,
  Users,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Share2,
} from 'lucide-react';

const INITIAL_CONFIG: TempleConfig = {
  templeName: 'Shree Siddhivinayak Temple Trust',
  shortName: 'Siddhivinayak TMS',
  location: 'Prabhadevi, Mumbai, Maharashtra 400028, India',
  contactPhone: '+91 22 2422 3206',
  trusteeEmail: 'trustee@siddhivinayak.org',
  currency: 'INR',
  currencySymbol: '₹',
  supportedLanguages: [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  ],
  modulesEnabled: {
    artiTimings: true,
    visarjanAlerts: true,
    mahaprasadTokens: true,
    sareeAuction: true,
    donationLedger: true,
    autoReceiptOCR: true,
    crowdPrediction: true,
  },
  aiEngine: {
    provider: 'gemini',
    model: 'gemini-3.8-flash',
    multilingualBotEnabled: true,
    autoValueAuctionItems: true,
    fairBidSentinel: true,
    ocrSlipProcessor: true,
    smartQueueStaggering: true,
  },
  notificationChannels: {
    whatsapp: {
      enabled: true,
      priority: 1,
      costPerMsg: 0.005,
      webhookUrl: 'https://api.whatsapp.com/v16.0/tms/messages',
    },
    telegram: {
      enabled: true,
      priority: 2,
      costPerMsg: 0.0,
      channelHandle: '@SiddhivinayakOfficialLive',
    },
    sms: {
      enabled: true,
      priority: 3,
      costPerMsg: 0.002,
      senderId: 'SVDNYK',
    },
  },
  diningHall: {
    totalSeats: 350,
    batchDurationMinutes: 45,
    slots: [
      { id: 'slot-1', time: '11:30 AM - 12:15 PM', capacity: 350, booked: 298 },
      { id: 'slot-2', time: '12:15 PM - 01:00 PM', capacity: 350, booked: 342 },
      { id: 'slot-3', time: '01:00 PM - 01:45 PM', capacity: 350, booked: 310 },
      { id: 'slot-4', time: '01:45 PM - 02:30 PM', capacity: 350, booked: 185 },
      { id: 'slot-5', time: '07:30 PM - 08:30 PM', capacity: 350, booked: 220 },
    ],
  },
};

const INITIAL_TOKENS: MahaprasadToken[] = [
  {
    tokenNumber: 'MP-8491',
    devoteeName: 'Gajanan V. Patil',
    phone: '+91 98221 09412',
    slotId: 'slot-1',
    slotTime: '11:30 AM - 12:15 PM',
    headcount: 4,
    priorityCategory: 'Regular',
    timestamp: '09:15 AM',
    status: 'CHECKED_IN',
  },
  {
    tokenNumber: 'MP-8492',
    devoteeName: 'Sneha Mohan Kadam',
    phone: '+91 97654 81092',
    slotId: 'slot-2',
    slotTime: '12:15 PM - 01:00 PM',
    headcount: 2,
    priorityCategory: 'Senior Citizen',
    timestamp: '09:40 AM',
    status: 'ISSUED',
  },
  {
    tokenNumber: 'MP-8493',
    devoteeName: 'Vijay Shankar Hegde',
    phone: '+91 94481 22904',
    slotId: 'slot-3',
    slotTime: '01:00 PM - 01:45 PM',
    headcount: 3,
    priorityCategory: 'Regular',
    timestamp: '10:05 AM',
    status: 'ISSUED',
  },
];

const INITIAL_LOGS: NotificationLog[] = [
  {
    id: 'log-1',
    timestamp: '05:15 AM',
    recipientPhone: '+91 98201 49821',
    channelAttempted: 'Telegram',
    channelDelivered: 'Telegram',
    purpose: 'Arti Reminder',
    messageText: 'Kakad Arti will commence at 05:30 AM at Sanctum Sanctorum.',
    costIncurred: 0.0,
    status: 'DELIVERED',
  },
  {
    id: 'log-2',
    timestamp: '09:42 AM',
    recipientPhone: '+91 97654 81092',
    channelAttempted: 'WhatsApp',
    channelDelivered: 'WhatsApp',
    purpose: 'Prasad Token',
    messageText: 'Mahaprasad Pass #MP-8492 confirmed for 12:15 PM slot.',
    costIncurred: 0.005,
    status: 'DELIVERED',
  },
  {
    id: 'log-3',
    timestamp: '10:30 AM',
    recipientPhone: '+91 98220 54109',
    channelAttempted: 'WhatsApp',
    channelDelivered: 'WhatsApp',
    purpose: '80G Receipt',
    messageText: 'Official 80G Tax Exemption Certificate #TMS-80G-2026-0841 issued.',
    costIncurred: 0.005,
    status: 'DELIVERED',
  },
];

export default function App() {
  const [config, setConfig] = useState<TempleConfig>(INITIAL_CONFIG);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedLang, setSelectedLang] = useState<string>('en');
  const [isDevoteeView, setIsDevoteeView] = useState<boolean>(false);
  const [isBotOpen, setIsBotOpen] = useState<boolean>(false);

  // Core Data States
  const [artis, setArtis] = useState<ArtiSchedule[]>(INITIAL_ARTIS);
  const [tokens, setTokens] = useState<MahaprasadToken[]>(INITIAL_TOKENS);
  const [donations, setDonations] = useState<DonationRecord[]>(INITIAL_DONATIONS);
  const [auctions, setAuctions] = useState<AuctionItem[]>(INITIAL_AUCTIONS);
  const [logs, setLogs] = useState<NotificationLog[]>(INITIAL_LOGS);

  // Fetch initial config from backend
  useEffect(() => {
    fetch('/api/temple/config')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.templeName) {
          setConfig((prev) => ({ ...prev, ...data }));
        }
      })
      .catch((err) => console.log('Using initial temple configuration:', err));
  }, []);

  // Handlers
  const handleUpdateConfig = async (newConfig: TempleConfig) => {
    setConfig(newConfig);
    try {
      await fetch('/api/temple/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig),
      });
    } catch (err) {
      console.error('Failed to sync config to backend:', err);
    }
  };

  const handleAddToken = (newToken: MahaprasadToken) => {
    setTokens((prev) => [newToken, ...prev]);
    // Also record dispatch log
    const newLog: NotificationLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recipientPhone: newToken.phone,
      channelAttempted: 'WhatsApp',
      channelDelivered: 'WhatsApp',
      purpose: 'Prasad Token',
      messageText: `Pass #${newToken.tokenNumber} issued for ${newToken.slotTime}`,
      costIncurred: 0.005,
      status: 'DELIVERED',
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleAddDonation = (newDonation: DonationRecord) => {
    setDonations((prev) => [newDonation, ...prev]);
    const newLog: NotificationLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recipientPhone: newDonation.devoteePhone,
      channelAttempted: 'WhatsApp',
      channelDelivered: 'WhatsApp',
      purpose: '80G Receipt',
      messageText: `80G Receipt #${newDonation.receiptNumber} generated for ₹${newDonation.amount}`,
      costIncurred: 0.005,
      status: 'DELIVERED',
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const handlePlaceBid = (
    itemId: string,
    bidAmount: number,
    devoteeName: string,
    phone: string,
    channel: 'WhatsApp' | 'Telegram' | 'Web Portal'
  ) => {
    setAuctions((prev) =>
      prev.map((item) => {
        if (item.itemId === itemId) {
          return {
            ...item,
            currentBid: bidAmount,
            highestBidderName: devoteeName,
            highestBidderPhone: phone,
            highestBidderChannel: channel,
            bidsCount: item.bidsCount + 1,
          };
        }
        return item;
      })
    );

    // Record Log
    const newLog: NotificationLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recipientPhone: phone,
      channelAttempted: channel === 'Telegram' ? 'Telegram' : 'WhatsApp',
      channelDelivered: channel === 'Telegram' ? 'Telegram' : 'WhatsApp',
      purpose: 'Auction Outbid',
      messageText: `Leading bid placed on Lot #${itemId} for ₹${bidAmount}`,
      costIncurred: channel === 'Telegram' ? 0.0 : 0.005,
      status: 'DELIVERED',
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleAddNewAuction = (newAuction: AuctionItem) => {
    setAuctions((prev) => [newAuction, ...prev]);
  };

  const handleTriggerNotification = (
    channel: 'WhatsApp' | 'Telegram' | 'SMS',
    purpose: 'Arti Reminder' | 'Prasad Token' | 'Auction Outbid' | '80G Receipt',
    recipient: string,
    message: string
  ) => {
    const isFallback = channel === 'SMS';
    const newLog: NotificationLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recipientPhone: recipient,
      channelAttempted: isFallback ? 'WhatsApp' : channel,
      channelDelivered: channel,
      purpose,
      messageText: message,
      costIncurred: channel === 'Telegram' ? 0.0 : channel === 'SMS' ? 0.002 : 0.005,
      status: isFallback ? 'FALLBACK_USED' : 'DELIVERED',
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  // Aggregated Stats
  const totalCollections = donations.reduce((sum, d) => sum + d.amount, 0);
  const totalBookedSeats = config.diningHall.slots.reduce((sum, s) => sum + s.booked, 0);
  const totalCapacitySeats = config.diningHall.totalSeats * config.diningHall.slots.length;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* Top Navigation */}
      <Navbar
        config={config}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedLang={selectedLang}
        setSelectedLang={setSelectedLang}
        isDevoteeView={isDevoteeView}
        setIsDevoteeView={setIsDevoteeView}
        openChatBot={() => setIsBotOpen(true)}
        crowdLevel="MODERATE"
        sanctumWaitMinutes={28}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {isDevoteeView ? (
          /* Devotee Kiosk / Pilgrim Mobile View */
          <DevoteePortal
            config={config}
            artis={artis}
            auctions={auctions}
            tokens={tokens}
            onAddToken={handleAddToken}
            onAddDonation={handleAddDonation}
            onPlaceBid={handlePlaceBid}
            openChatBot={() => setIsBotOpen(true)}
            selectedLang={selectedLang}
          />
        ) : (
          /* Admin / Trustee Portal Views */
          <div>
            {/* TAB: DASHBOARD OVERVIEW */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Hero Greeting & Status */}
                <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 border border-amber-600/40 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 text-2xl shadow-inner">
                      🛕
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-amber-300 font-mono uppercase tracking-wider">
                          Open-Source Temple Management System (TMS)
                        </span>
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                          All 4 Pillars Active
                        </span>
                      </div>
                      <h2 className="font-serif text-xl sm:text-2xl font-bold text-amber-100 mt-1">
                        {config.templeName} • Trustee Control Center
                      </h2>
                      <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
                        Configured via `temple.config.json`. Layer B Service & AI Engine is active with Multilingual Bot, Saree Vision Auto-Tagger, Fair-Bid Sentinel, and Layer D Fallback Routing.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <button
                      onClick={() => setIsBotOpen(true)}
                      className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-medium px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer whitespace-nowrap"
                    >
                      <Bot className="w-4 h-4" />
                      <span>Launch Mandir Sevak AI</span>
                    </button>
                    <button
                      onClick={() => setIsDevoteeView(true)}
                      className="bg-stone-800 hover:bg-stone-700 text-amber-200 border border-stone-700 px-3 py-2.5 rounded-xl text-xs font-medium cursor-pointer"
                    >
                      Devotee View
                    </button>
                  </div>
                </div>

                {/* 4 Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Stat 1: Next Arti */}
                  <div
                    onClick={() => setActiveTab('schedule')}
                    className="bg-stone-900 border border-amber-900/40 hover:border-amber-600/60 p-4 rounded-xl shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-400 flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        Next Sacred Arti
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <span className="font-serif text-lg font-bold text-amber-200 mt-1 block">
                      Madhyahn Bhog
                    </span>
                    <span className="text-xs text-amber-400 font-mono font-semibold">
                      12:05 PM • Sanctum Open
                    </span>
                  </div>

                  {/* Stat 2: Mahaprasad */}
                  <div
                    onClick={() => setActiveTab('prasad')}
                    className="bg-stone-900 border border-amber-900/40 hover:border-amber-600/60 p-4 rounded-xl shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-400 flex items-center gap-1.5 font-medium">
                        <Utensils className="w-3.5 h-3.5 text-amber-400" />
                        Mahaprasad Hall
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <span className="font-serif text-lg font-bold text-stone-100 mt-1 block">
                      {totalBookedSeats} / {totalCapacitySeats} Seats
                    </span>
                    <span className="text-xs text-emerald-400 font-medium">
                      5 Batches • Hall Gate 3
                    </span>
                  </div>

                  {/* Stat 3: Collections */}
                  <div
                    onClick={() => setActiveTab('donations')}
                    className="bg-stone-900 border border-amber-900/40 hover:border-amber-600/60 p-4 rounded-xl shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-400 flex items-center gap-1.5 font-medium">
                        <Receipt className="w-3.5 h-3.5 text-amber-400" />
                        Total Collections
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <span className="font-serif text-lg font-bold text-amber-300 mt-1 block">
                      ₹{totalCollections.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-stone-400 font-medium">
                      100% 80G Tax Exempt
                    </span>
                  </div>

                  {/* Stat 4: Live Auction */}
                  <div
                    onClick={() => setActiveTab('auctions')}
                    className="bg-stone-900 border border-amber-900/40 hover:border-amber-600/60 p-4 rounded-xl shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-400 flex items-center gap-1.5 font-medium">
                        <Gavel className="w-3.5 h-3.5 text-amber-400" />
                        Live Saree Auction
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <span className="font-serif text-lg font-bold text-amber-200 mt-1 block">
                      {auctions.length} Sacred Lots
                    </span>
                    <span className="text-xs text-emerald-400 font-medium">
                      Fair-Bid Sentinel Active
                    </span>
                  </div>
                </div>

                {/* 4 Core Pillars Detailed Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pillar 1: Timing & Schedule */}
                  <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                          <Clock className="w-4 h-4" />
                        </div>
                        <h3 className="font-serif font-bold text-stone-100 text-base">
                          Pillar 1: Timing & Schedule (Arti & Visarjan)
                        </h3>
                      </div>
                      <button
                        onClick={() => setActiveTab('schedule')}
                        className="text-xs text-amber-400 hover:text-amber-300 font-medium"
                      >
                        Manage →
                      </button>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      AI dynamic crowd prediction calculates real-time sanctum wait times (28 mins) and automatically staggers daily devotees across Kakad, Bhog, Sandhya, and Shej Artis.
                    </p>
                    <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 text-xs flex items-center justify-between">
                      <span className="text-stone-400">Next Bell Chime:</span>
                      <span className="font-mono text-amber-300 font-bold">11:55 AM (10 min warning)</span>
                    </div>
                  </div>

                  {/* Pillar 2: Prasad Management */}
                  <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
                          <Utensils className="w-4 h-4" />
                        </div>
                        <h3 className="font-serif font-bold text-stone-100 text-base">
                          Pillar 2: Mahaprasad Token Engine
                        </h3>
                      </div>
                      <button
                        onClick={() => setActiveTab('prasad')}
                        className="text-xs text-amber-400 hover:text-amber-300 font-medium"
                      >
                        Manage →
                      </button>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      Token distribution, seating capacity (350 seats/batch), and slot tracking. Devotees receive instant printable QR passes with automated WhatsApp delivery.
                    </p>
                    <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 text-xs flex items-center justify-between">
                      <span className="text-stone-400">Active Hall Status:</span>
                      <span className="text-emerald-400 font-medium">Batch #1 Seated • Batch #2 Calling</span>
                    </div>
                  </div>

                  {/* Pillar 3: Financial Records */}
                  <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                          <Receipt className="w-4 h-4" />
                        </div>
                        <h3 className="font-serif font-bold text-stone-100 text-base">
                          Pillar 3: Collections & 80G Receipts
                        </h3>
                      </div>
                      <button
                        onClick={() => setActiveTab('donations')}
                        className="text-xs text-amber-400 hover:text-amber-300 font-medium"
                      >
                        Manage →
                      </button>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      Automated 80G tax exemption certificates. Auto-Receipt OCR scans donor cheques and UPI slips, extracting payee details with zero human data-entry errors.
                    </p>
                    <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 text-xs flex items-center justify-between">
                      <span className="text-stone-400">Audit Trail:</span>
                      <span className="text-amber-300 font-mono">100% Immutable Receipts</span>
                    </div>
                  </div>

                  {/* Pillar 4: Offering Auction */}
                  <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                          <Gavel className="w-4 h-4" />
                        </div>
                        <h3 className="font-serif font-bold text-stone-100 text-base">
                          Pillar 4: Saree & Gold Auction Engine
                        </h3>
                      </div>
                      <button
                        onClick={() => setActiveTab('auctions')}
                        className="text-xs text-amber-400 hover:text-amber-300 font-medium"
                      >
                        Manage →
                      </button>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      Vision AI recognizes donated saree fabrics (Paithani, Kanjeevaram) and ornaments. Fair-Bid AI Sentinel monitors live bids from WhatsApp, Telegram, and Web for fraud.
                    </p>
                    <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 text-xs flex items-center justify-between">
                      <span className="text-stone-400">Leading Lot:</span>
                      <span className="text-amber-300 font-bold">92.5 Silver Mukut (₹34,500)</span>
                    </div>
                  </div>
                </div>

                {/* Layer D & GitHub Architecture Banner */}
                <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
                      <Radio className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-stone-100 text-sm">
                        Multi-Channel Notification Pipeline & GitHub Repository Core
                      </h4>
                      <p className="text-xs text-stone-400 mt-0.5">
                        Fallback routing: WhatsApp (Primary) → Telegram (Free Broadcast) → SMS (DLT Fallback). Ready for 1-click self-hosting with Docker.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setActiveTab('notifications')}
                      className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer"
                    >
                      View Layer D
                    </button>
                    <button
                      onClick={() => setActiveTab('architecture')}
                      className="bg-amber-600 hover:bg-amber-500 text-white px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer shadow"
                    >
                      System Config (JSON)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ARTI & VISARJAN */}
            {activeTab === 'schedule' && (
              <ArtiScheduler
                artis={artis}
                config={config}
                onBroadcast={(ch, msg) => handleTriggerNotification(ch, 'Arti Reminder', '+91 98201 49821', msg)}
                selectedLang={selectedLang}
              />
            )}

            {/* TAB: PRASAD */}
            {activeTab === 'prasad' && (
              <PrasadManager
                config={config}
                tokens={tokens}
                onAddToken={handleAddToken}
                onSendPass={(ch, txt) => handleTriggerNotification(ch, 'Prasad Token', '+91 98201 49821', txt)}
              />
            )}

            {/* TAB: DONATIONS */}
            {activeTab === 'donations' && (
              <DonationLedger
                config={config}
                donations={donations}
                onAddDonation={handleAddDonation}
                onSendReceiptNotification={(ch, txt) => handleTriggerNotification(ch, '80G Receipt', '+91 98201 49821', txt)}
              />
            )}

            {/* TAB: AUCTIONS */}
            {activeTab === 'auctions' && (
              <OfferingAuction
                config={config}
                auctions={auctions}
                onPlaceBid={handlePlaceBid}
                onAddNewAuction={handleAddNewAuction}
                onBroadcastCatalog={(ch, txt) => handleTriggerNotification(ch, 'Auction Outbid', '+91 98201 49821', txt)}
              />
            )}

            {/* TAB: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <NotificationRouter
                config={config}
                logs={logs}
                onTriggerTestBroadcast={handleTriggerNotification}
              />
            )}

            {/* TAB: ARCHITECTURE */}
            {activeTab === 'architecture' && (
              <SystemArchitecture
                config={config}
                onUpdateConfig={handleUpdateConfig}
              />
            )}
          </div>
        )}
      </main>

      {/* Floating Mandir Sevak AI Bot Modal */}
      <DevoteeBotModal
        isOpen={isBotOpen}
        onClose={() => setIsBotOpen(false)}
        config={config}
        currentLanguage={selectedLang}
      />

      {/* Sacred Footer */}
      <footer className="bg-stone-900 border-t border-amber-900/40 py-6 px-4 text-center text-xs text-stone-400 space-y-2 mt-auto">
        <div className="flex items-center justify-center gap-2 text-amber-300 font-serif font-bold">
          <span>॥</span>
          <span>{config.templeName}</span>
          <span>•</span>
          <span>MandirOS Open-Source Engine</span>
          <span>॥</span>
        </div>
        <p className="text-stone-500 max-w-xl mx-auto">
          AI-Powered, Open-Source (GitHub Modular Template) & Multi-Channel Temple Management System specification. Developed for sacred trusts and worldwide devotee seva.
        </p>
      </footer>
    </div>
  );
}

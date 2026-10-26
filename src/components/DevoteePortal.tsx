import React, { useState } from 'react';
import {
  ArtiSchedule,
  AuctionItem,
  DonationRecord,
  MahaprasadToken,
  TempleConfig,
} from '../data/templeData';
import {
  Flame,
  Clock,
  Utensils,
  Receipt,
  Gavel,
  Bot,
  QrCode,
  Share2,
  Sparkles,
  CheckCircle2,
  Phone,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface DevoteePortalProps {
  config: TempleConfig;
  artis: ArtiSchedule[];
  auctions: AuctionItem[];
  tokens: MahaprasadToken[];
  onAddToken: (token: MahaprasadToken) => void;
  onAddDonation: (donation: DonationRecord) => void;
  onPlaceBid: (itemId: string, bidAmount: number, devoteeName: string, phone: string, channel: 'WhatsApp' | 'Telegram' | 'Web Portal') => void;
  openChatBot: () => void;
  selectedLang: string;
}

export const DevoteePortal: React.FC<DevoteePortalProps> = ({
  config,
  artis,
  auctions,
  tokens,
  onAddToken,
  onAddDonation,
  onPlaceBid,
  openChatBot,
  selectedLang,
}) => {
  const [activeDevoteeTab, setActiveDevoteeTab] = useState<'HOME' | 'PRASAD' | 'DONATE' | 'AUCTION'>('HOME');

  // Quick Prasad Token Form
  const [devoteeName, setDevoteeName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [headcount, setHeadcount] = useState(2);
  const [selectedSlot, setSelectedSlot] = useState(config.diningHall.slots[0].time);
  const [issuedPass, setIssuedPass] = useState<MahaprasadToken | null>(null);

  // Quick Donation Form
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('+91 ');
  const [donorAmount, setDonorAmount] = useState<number>(1100);
  const [donorPan, setDonorPan] = useState('');
  const [issuedReceipt, setIssuedReceipt] = useState<DonationRecord | null>(null);

  const handlePrasadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!devoteeName.trim()) return;

    const tokenNum = `MP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newToken: MahaprasadToken = {
      tokenNumber: tokenNum,
      devoteeName: devoteeName.trim(),
      phone: phone.trim(),
      slotId: 'slot-1',
      slotTime: selectedSlot,
      headcount,
      priorityCategory: 'Regular',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'ISSUED',
    };

    onAddToken(newToken);
    setIssuedPass(newToken);
  };

  const handleDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim() || !donorAmount) return;

    const receiptSeq = Math.floor(1000 + Math.random() * 9000);
    const newDonation: DonationRecord = {
      transactionId: `TXN-${Date.now().toString().slice(-7)}`,
      devoteeName: donorName.trim(),
      devoteePhone: donorPhone.trim(),
      panNumber: donorPan.trim().toUpperCase() || undefined,
      amount: donorAmount,
      paymentMode: 'UPI',
      purpose: 'Annadan (Mahaprasad)',
      date: new Date().toISOString().split('T')[0],
      receiptNumber: `TMS-80G-2026-${receiptSeq}`,
      receiptStatus: 'DISPATCHED_WHATSAPP',
      taxExempt80G: true,
    };

    onAddDonation(newDonation);
    setIssuedReceipt(newDonation);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Devotee Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-amber-600/50 shadow-2xl bg-gradient-to-b from-amber-950 via-stone-900 to-stone-950 p-6 sm:p-8 text-center space-y-3">
        <span className="text-xs font-semibold text-amber-300 tracking-widest uppercase block">
          ॥ श्री गणेशाय नमः ॥
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-amber-100">
          {config.templeName}
        </h1>
        <p className="text-xs sm:text-sm text-amber-200/90 max-w-xl mx-auto">
          Welcome to the official digital pilgrim portal. Check live Arti timings, book your free Mahaprasad dining pass, place live auction bids, and offer tax-deductible seva.
        </p>

        {/* Quick Pilgrim Actions */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          <button
            onClick={() => setActiveDevoteeTab('HOME')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeDevoteeTab === 'HOME'
                ? 'bg-amber-600 text-white font-bold shadow-md'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
            }`}
          >
            Today's Artis
          </button>
          <button
            onClick={() => setActiveDevoteeTab('PRASAD')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeDevoteeTab === 'PRASAD'
                ? 'bg-amber-600 text-white font-bold shadow-md'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
            }`}
          >
            🍲 Free Prasad Pass
          </button>
          <button
            onClick={() => setActiveDevoteeTab('DONATE')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeDevoteeTab === 'DONATE'
                ? 'bg-amber-600 text-white font-bold shadow-md'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
            }`}
          >
            🧾 E-Donation (80G)
          </button>
          <button
            onClick={() => setActiveDevoteeTab('AUCTION')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeDevoteeTab === 'AUCTION'
                ? 'bg-amber-600 text-white font-bold shadow-md'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
            }`}
          >
            ⚖️ Sacred Saree Auction
          </button>
          <button
            onClick={openChatBot}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-orange-600 to-amber-600 text-white flex items-center gap-1.5 shadow-md hover:from-orange-500 hover:to-amber-500 cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Ask Mandir Sevak AI</span>
          </button>
        </div>
      </div>

      {/* TAB 1: HOME (Artis & Live darshan) */}
      {activeDevoteeTab === 'HOME' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-stone-100 text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Today’s Sacred Arti Schedule</span>
            </h3>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Sanctum Open
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {artis.map((arti) => (
              <div
                key={arti.id}
                className="bg-stone-900 border border-stone-800 hover:border-amber-600/50 rounded-xl p-4 transition-all shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {arti.startTime} - {arti.endTime}
                    </span>
                    <h4 className="font-serif font-bold text-amber-100 text-base mt-0.5">
                      {arti.name}
                    </h4>
                    <span className="text-xs text-stone-400">{arti.marathiName}</span>
                  </div>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-semibold">
                    {arti.crowdLevel} CROWD
                  </span>
                </div>
                <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                  {arti.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PRASAD PASS */}
      {activeDevoteeTab === 'PRASAD' && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3 border-b border-stone-800 pb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-amber-100 text-base">
                Book Free Mahaprasad Token
              </h3>
              <p className="text-xs text-stone-400">
                Blessed meals prepared fresh with holy ghee and distributed free daily.
              </p>
            </div>
          </div>

          {issuedPass ? (
            <div className="bg-stone-950 border border-emerald-500/40 rounded-xl p-6 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-amber-200 text-lg">
                Your Mahaprasad Entry Pass is Confirmed!
              </h4>
              <div className="inline-block bg-amber-500/20 border border-amber-500/40 px-4 py-1.5 rounded-full font-mono text-xl font-bold text-amber-100">
                Token #{issuedPass.tokenNumber}
              </div>

              <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl flex items-center justify-center">
                <QrCode className="w-24 h-24 text-stone-900" />
              </div>

              <p className="text-xs text-stone-300 max-w-sm mx-auto">
                <strong>Slot:</strong> {issuedPass.slotTime} • <strong>Headcount:</strong> {issuedPass.headcount} persons.
                Please report to <strong>Bhojanalaya Hall Gate 3</strong>.
              </p>

              <button
                onClick={() => setIssuedPass(null)}
                className="bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs px-4 py-2 rounded-xl"
              >
                Book Another Pass
              </button>
            </div>
          ) : (
            <form onSubmit={handlePrasadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-stone-300 block mb-1 font-medium">Your Name *</label>
                <input
                  type="text"
                  required
                  value={devoteeName}
                  onChange={(e) => setDevoteeName(e.target.value)}
                  placeholder="e.g. Dattatray Shinde"
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 block mb-1 font-medium">WhatsApp Phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98220 00000"
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 font-mono outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-stone-300 block mb-1 font-medium">Number of Devotees</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={headcount}
                    onChange={(e) => setHeadcount(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-300 block mb-1 font-medium">Select Slot</label>
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 outline-none focus:border-amber-500"
                >
                  {config.diningHall.slots.map((s) => (
                    <option key={s.id} value={s.time}>
                      {s.time}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-medium py-2.5 rounded-xl transition-all shadow-md text-xs sm:text-sm"
              >
                Generate Free Digital Prasad Pass
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB 3: E-DONATION (80G) */}
      {activeDevoteeTab === 'DONATE' && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3 border-b border-stone-800 pb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-amber-100 text-base">
                Sacred Temple E-Donation (Instant 80G Receipt)
              </h3>
              <p className="text-xs text-stone-400">
                100% transparent. Eligible for Section 80G Indian Income Tax rebate.
              </p>
            </div>
          </div>

          {issuedReceipt ? (
            <div className="bg-stone-950 border border-emerald-500/40 rounded-xl p-6 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-amber-200 text-lg">
                Thank You for Your Generous Offering!
              </h4>
              <p className="font-mono text-xs text-amber-300">
                Receipt #{issuedReceipt.receiptNumber} • Amount: ₹{issuedReceipt.amount.toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-stone-300 max-w-sm mx-auto">
                An official digitally-sealed 80G tax exemption certificate has been generated and dispatched to your WhatsApp number.
              </p>
              <button
                onClick={() => setIssuedReceipt(null)}
                className="bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs px-4 py-2 rounded-xl"
              >
                Make Another Offering
              </button>
            </div>
          ) : (
            <form onSubmit={handleDonationSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-stone-300 block mb-1 font-medium">Donor Name *</label>
                <input
                  type="text"
                  required
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="e.g. Sumanth Radhakrishnan"
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 block mb-1 font-medium">WhatsApp Mobile *</label>
                  <input
                    type="tel"
                    required
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    placeholder="+91 98220 00000"
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 font-mono outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-stone-300 block mb-1 font-medium">PAN Card (For 80G)</label>
                  <input
                    type="text"
                    value={donorPan}
                    onChange={(e) => setDonorPan(e.target.value)}
                    placeholder="ABCDE1234F"
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 font-mono uppercase outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-300 block mb-1 font-medium">Donation Amount (INR ₹)</label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[501, 1100, 2100, 5100].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setDonorAmount(amt)}
                      className={`py-1.5 rounded-lg border font-mono font-bold text-xs ${
                        donorAmount === amt
                          ? 'bg-amber-600 text-white border-amber-500'
                          : 'bg-stone-950 text-stone-300 border-stone-800'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="51"
                  required
                  value={donorAmount}
                  onChange={(e) => setDonorAmount(Number(e.target.value))}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-amber-300 font-serif font-bold text-sm outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-medium py-2.5 rounded-xl transition-all shadow-md text-xs sm:text-sm"
              >
                Proceed with Online Offering (UPI / Card)
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB 4: SACRED SAREE AUCTION */}
      {activeDevoteeTab === 'AUCTION' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-stone-100 text-base flex items-center gap-2">
              <Gavel className="w-4 h-4 text-amber-400" />
              <span>Sacred Offering Live Auctions</span>
            </h3>
            <span className="text-xs text-amber-400 font-mono">
              Fair-Bid AI Protected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {auctions.map((item) => (
              <div
                key={item.itemId}
                className="bg-stone-900 border border-stone-800 hover:border-amber-600/50 rounded-2xl overflow-hidden shadow-lg transition-all"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-44 object-cover"
                />
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono">
                      {item.category} • #{item.itemId}
                    </span>
                    <span className="font-serif font-bold text-amber-200 text-base">
                      ₹{item.currentBid.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-stone-100 text-sm">
                    {item.title}
                  </h4>
                  <p className="text-xs text-stone-400 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() =>
                        onPlaceBid(
                          item.itemId,
                          item.currentBid + 500,
                          'Devotee Pilgrim',
                          '+91 98200 99881',
                          'Web Portal'
                        )
                      }
                      className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-medium px-4 py-1.5 rounded-xl text-xs transition-all cursor-pointer shadow"
                    >
                      Bid ₹{(item.currentBid + 500).toLocaleString('en-IN')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

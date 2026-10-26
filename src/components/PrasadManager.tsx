import React, { useState } from 'react';
import { MahaprasadToken, TempleConfig } from '../data/templeData';
import {
  Utensils,
  Plus,
  QrCode,
  Users,
  Clock,
  Printer,
  CheckCircle2,
  AlertCircle,
  Share2,
  Sparkles,
  Phone,
  Search,
  Filter,
} from 'lucide-react';

interface PrasadManagerProps {
  config: TempleConfig;
  tokens: MahaprasadToken[];
  onAddToken: (token: MahaprasadToken) => void;
  onSendPass: (channel: 'WhatsApp' | 'SMS', passText: string) => void;
}

export const PrasadManager: React.FC<PrasadManagerProps> = ({
  config,
  tokens,
  onAddToken,
  onSendPass,
}) => {
  const [activeModal, setActiveModal] = useState<'NEW_TOKEN' | 'PASS_VIEW' | null>(null);
  const [selectedTokenForPass, setSelectedTokenForPass] = useState<MahaprasadToken | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [headcount, setHeadcount] = useState(2);
  const [selectedSlotId, setSelectedSlotId] = useState(config.diningHall.slots[0].id);
  const [priorityCategory, setPriorityCategory] = useState<
    'Regular' | 'Senior Citizen' | 'Divyang / Special' | 'Temple Sevak'
  >('Regular');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ISSUED' | 'CHECKED_IN'>('ALL');
  const [notificationStatus, setNotificationStatus] = useState<string | null>(null);

  const totalSeats = config.diningHall.totalSeats;
  const currentTotalBooked = config.diningHall.slots.reduce((sum, s) => sum + s.booked, 0);
  const totalCapacityAllSlots = totalSeats * config.diningHall.slots.length;
  const overallOccupancyPct = Math.round((currentTotalBooked / totalCapacityAllSlots) * 100);

  const handleCreateToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const chosenSlot = config.diningHall.slots.find((s) => s.id === selectedSlotId);
    const tokenNum = `MP-${Math.floor(1000 + Math.random() * 9000)}`;

    const newToken: MahaprasadToken = {
      tokenNumber: tokenNum,
      devoteeName: name.trim(),
      phone: phone.trim(),
      slotId: selectedSlotId,
      slotTime: chosenSlot ? chosenSlot.time : '11:30 AM - 12:15 PM',
      headcount: Number(headcount),
      priorityCategory,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'ISSUED',
    };

    onAddToken(newToken);
    setSelectedTokenForPass(newToken);
    setActiveModal('PASS_VIEW');

    // Reset Form
    setName('');
    setPhone('+91 ');
    setHeadcount(2);
  };

  const handleSharePass = (channel: 'WhatsApp' | 'SMS', t: MahaprasadToken) => {
    const text = `🍲 *${config.templeName} - Mahaprasad Pass*\n\n` +
      `🎫 Token No: #${t.tokenNumber}\n` +
      `👤 Devotee: ${t.devoteeName} (${t.headcount} Persons)\n` +
      `⏰ Slot Time: ${t.slotTime}\n` +
      `🏷️ Category: ${t.priorityCategory}\n` +
      `📍 Hall: Annadan Bhojanalaya Hall 2, Ground Floor Gate 3\n\n` +
      `Please display this token at Bhojanalaya entrance 10 minutes before slot. Blessed meals are served free.`;

    onSendPass(channel, text);
    setNotificationStatus(`Pass dispatched to ${t.phone} via ${channel}!`);
    setTimeout(() => setNotificationStatus(null), 3500);
  };

  const filteredTokens = tokens.filter((t) => {
    const matchesSearch =
      t.devoteeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 border border-amber-600/40 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-serif font-bold text-amber-200">
                Mahaprasad & Annadan Token Engine
              </h2>
              <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full border border-amber-500/30 font-medium">
                Layer B Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl">
              Free Prasad token distribution, seating slot allocation ({totalSeats} seats/batch), real-time kitchen preparation gauge, and AI dynamic queue staggering.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveModal('NEW_TOKEN')}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-medium px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Issue New Prasad Pass</span>
        </button>
      </div>

      {notificationStatus && (
        <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notificationStatus}</span>
        </div>
      )}

      {/* Seating Capacity & Slots Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {config.diningHall.slots.map((slot, index) => {
          const bookedPct = Math.round((slot.booked / slot.capacity) * 100);
          const isNearFull = bookedPct >= 90;
          return (
            <div
              key={slot.id}
              className={`bg-stone-900 border rounded-xl p-3.5 flex flex-col justify-between transition-all ${
                isNearFull
                  ? 'border-amber-600/60 shadow-md shadow-amber-950/40'
                  : 'border-stone-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono text-amber-400 font-semibold">
                    Batch #{index + 1}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                      isNearFull
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {isNearFull ? 'Filling Fast' : 'Seats Open'}
                  </span>
                </div>
                <h4 className="font-serif font-bold text-stone-200 text-xs">
                  {slot.time}
                </h4>
              </div>

              <div className="mt-3">
                <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                  <span>Tokens: {slot.booked}</span>
                  <span>Cap: {slot.capacity}</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isNearFull ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, bookedPct)}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-stone-500 text-right block mt-1">
                  {slot.capacity - slot.booked} seats remaining
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Queue Staggering Notice */}
      <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-serif font-bold text-amber-200 block text-xs sm:text-sm">
              Smart Crowd Staggering Recommendation Active
            </span>
            <p className="text-stone-300 text-xs mt-0.5">
              Batch #2 (12:15 PM) is nearing full capacity. The system has automatically shifted new walk-in allocations to Batch #4 (01:45 PM) with priority vouchers.
            </p>
          </div>
        </div>
        <div className="bg-stone-900 px-3 py-1.5 rounded-lg border border-stone-800 font-mono text-amber-300 text-xs shrink-0">
          Daily Total: {currentTotalBooked} / {totalCapacityAllSlots} ({overallOccupancyPct}%)
        </div>
      </div>

      {/* Token Ledger Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl shadow-xl overflow-hidden">
        {/* Controls */}
        <div className="p-4 border-b border-stone-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-stone-900/60">
          <div className="flex items-center gap-2">
            <h3 className="font-serif font-bold text-stone-100 text-sm sm:text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Today’s Issued Mahaprasad Tokens</span>
            </h3>
            <span className="bg-stone-800 text-stone-300 text-xs px-2 py-0.5 rounded-full font-mono">
              {filteredTokens.length} records
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search token # or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-stone-200 placeholder-stone-500 outline-none focus:border-amber-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-stone-950 border border-stone-700 text-stone-300 text-xs rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="ISSUED">Issued</option>
              <option value="CHECKED_IN">Checked-in</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950/80 text-stone-400 uppercase tracking-wider font-mono text-[10px] border-b border-stone-800">
              <tr>
                <th className="py-3 px-4">Token #</th>
                <th className="py-3 px-4">Devotee</th>
                <th className="py-3 px-4">Headcount</th>
                <th className="py-3 px-4">Slot Time</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 text-stone-300">
              {filteredTokens.map((t) => (
                <tr key={t.tokenNumber} className="hover:bg-stone-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-amber-300">
                    #{t.tokenNumber}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-stone-100 block">
                      {t.devoteeName}
                    </span>
                    <span className="text-stone-400 text-[11px] flex items-center gap-1">
                      <Phone className="w-3 h-3 text-stone-500" />
                      {t.phone}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-stone-200">
                    {t.headcount} Devotees
                  </td>
                  <td className="py-3 px-4 text-stone-300 font-mono">
                    {t.slotTime}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                        t.priorityCategory === 'Regular'
                          ? 'bg-stone-800 text-stone-300 border-stone-700'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {t.priorityCategory}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        t.status === 'CHECKED_IN'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        setSelectedTokenForPass(t);
                        setActiveModal('PASS_VIEW');
                      }}
                      className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      View QR Pass
                    </button>
                    <button
                      onClick={() => handleSharePass('WhatsApp', t)}
                      className="bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-600/40 px-2 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
                      title="Send via WhatsApp"
                    >
                      WhatsApp
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Issue New Prasad Token */}
      {activeModal === 'NEW_TOKEN' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-amber-700/50 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif font-bold text-amber-100 text-base">
                  Issue Free Mahaprasad Token
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-stone-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateToken} className="space-y-4 text-xs">
              <div>
                <label className="text-stone-300 block mb-1 font-medium">
                  Devotee / Family Head Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Shankar Rao"
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 block mb-1 font-medium">
                    WhatsApp / Mobile *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98220 00000"
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-stone-300 block mb-1 font-medium">
                    Headcount (Devotees)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={headcount}
                    onChange={(e) => setHeadcount(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-300 block mb-1 font-medium">
                  Select Dining Hall Slot
                </label>
                <select
                  value={selectedSlotId}
                  onChange={(e) => setSelectedSlotId(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 outline-none focus:border-amber-500 cursor-pointer"
                >
                  {config.diningHall.slots.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.time} ({s.capacity - s.booked} seats left)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-stone-300 block mb-1 font-medium">
                  Priority / Special Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Regular', 'Senior Citizen', 'Divyang / Special', 'Temple Sevak'] as const).map(
                    (cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setPriorityCategory(cat)}
                        className={`py-1.5 px-2 rounded-lg border text-[11px] font-medium transition-all cursor-pointer ${
                          priorityCategory === cat
                            ? 'bg-amber-600/30 text-amber-200 border-amber-500'
                            : 'bg-stone-950 text-stone-400 border-stone-800'
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 hover:bg-stone-700 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-medium rounded-xl transition-all cursor-pointer shadow-md"
                >
                  Generate Digital Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Printable QR Pass View */}
      {activeModal === 'PASS_VIEW' && selectedTokenForPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-amber-600/60 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
            {/* Sacred Card Header */}
            <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 p-4 text-center border-b border-amber-600/40 relative">
              <span className="text-[10px] text-amber-300 font-semibold tracking-widest uppercase block">
                ॥ श्री गणेशाय नमः ॥
              </span>
              <h3 className="font-serif font-bold text-amber-100 text-base mt-0.5">
                {config.templeName}
              </h3>
              <p className="text-[11px] text-amber-200/90">
                Official Mahaprasad Entry Pass
              </p>
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-3 right-3 text-amber-200 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Pass Body */}
            <div className="p-5 space-y-4 bg-stone-900 text-center">
              {/* Token Number Pill */}
              <div className="inline-block bg-amber-500/20 border border-amber-500/40 rounded-full px-4 py-1">
                <span className="text-xs text-amber-300 uppercase tracking-wider">
                  Token Number
                </span>
                <span className="block font-mono text-xl font-bold text-amber-100">
                  #{selectedTokenForPass.tokenNumber}
                </span>
              </div>

              {/* QR Code Graphic */}
              <div className="w-36 h-36 mx-auto bg-white p-2.5 rounded-xl border-2 border-amber-500/30 shadow-inner flex flex-col items-center justify-center">
                <QrCode className="w-28 h-28 text-stone-900" />
                <span className="text-[9px] font-mono text-stone-600 font-bold uppercase mt-1">
                  VERIFIED • {selectedTokenForPass.tokenNumber}
                </span>
              </div>

              {/* Devotee Details */}
              <div className="bg-stone-950/80 rounded-xl p-3 border border-stone-800 text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-stone-400">Devotee Name:</span>
                  <span className="font-semibold text-stone-200">
                    {selectedTokenForPass.devoteeName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Headcount:</span>
                  <span className="font-semibold text-stone-200">
                    {selectedTokenForPass.headcount} Persons
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Dining Batch Time:</span>
                  <span className="font-semibold text-amber-300 font-mono">
                    {selectedTokenForPass.slotTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Category:</span>
                  <span className="font-semibold text-stone-200">
                    {selectedTokenForPass.priorityCategory}
                  </span>
                </div>
                <div className="flex justify-between border-t border-stone-800 pt-1 text-[11px]">
                  <span className="text-stone-400">Bhojanalaya Hall:</span>
                  <span className="text-amber-200">Gate #3, Ground Floor</span>
                </div>
              </div>

              {/* Share & Print Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleSharePass('WhatsApp', selectedTokenForPass)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Send WhatsApp</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-stone-700"
                >
                  <Printer className="w-3.5 h-3.5 text-stone-400" />
                  <span>Print Pass</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

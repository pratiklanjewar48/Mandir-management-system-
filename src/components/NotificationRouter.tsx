import React, { useState } from 'react';
import { NotificationLog, TempleConfig } from '../data/templeData';
import {
  Radio,
  Send,
  MessageSquare,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  DollarSign,
  ShieldCheck,
  RefreshCw,
  Bell,
} from 'lucide-react';

interface NotificationRouterProps {
  config: TempleConfig;
  logs: NotificationLog[];
  onTriggerTestBroadcast: (
    channel: 'WhatsApp' | 'Telegram' | 'SMS',
    purpose: 'Arti Reminder' | 'Prasad Token' | 'Auction Outbid' | '80G Receipt',
    recipient: string,
    message: string
  ) => void;
}

export const NotificationRouter: React.FC<NotificationRouterProps> = ({
  config,
  logs,
  onTriggerTestBroadcast,
}) => {
  const [recipient, setRecipient] = useState('+91 98201 49821');
  const [messageType, setMessageType] = useState<
    'Arti Reminder' | 'Prasad Token' | 'Auction Outbid' | '80G Receipt'
  >('Arti Reminder');
  const [simulateFallback, setSimulateFallback] = useState(false);
  const [customText, setCustomText] = useState(
    '🔔 Kakad Arti at 05:30 AM tomorrow. Sanctum gates open at 05:00 AM. Live Darshan available on official portal.'
  );

  const totalCost = logs.reduce((acc, l) => acc + l.costIncurred, 0);
  const totalDelivered = logs.filter((l) => l.status !== 'FAILED').length;
  const telegramFreeCount = logs.filter((l) => l.channelDelivered === 'Telegram').length;

  const handleSendTest = (e: React.FormEvent) => {
    e.preventDefault();
    const primaryChannel = simulateFallback ? 'SMS' : 'WhatsApp';
    onTriggerTestBroadcast(primaryChannel, messageType, recipient, customText);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 border border-amber-600/40 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-serif font-bold text-amber-200">
                Layer D: Multi-Channel Notification Router
              </h2>
              <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full border border-amber-500/30 font-medium">
                Fallback Pipeline (WhatsApp → Telegram → SMS)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl">
              Guarantees 99.9% notification delivery to devotees at minimal cost through prioritized fallback routing and free Telegram broadcast channels.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Channel Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* WhatsApp (Priority 1) */}
        <div className="bg-stone-900 border border-emerald-500/40 rounded-xl p-4 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
              PRIORITY 1 (PRIMARY)
            </span>
            <span className="text-emerald-400 font-mono text-xs font-bold">~$0.005 / msg</span>
          </div>
          <div className="flex items-center gap-2.5 mt-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h4 className="font-serif font-bold text-stone-100 text-base">WhatsApp Meta API</h4>
          </div>
          <p className="text-xs text-stone-300 mt-2 leading-relaxed">
            Interactive AI Chatbot, Live Offering Auction Bids, and Instant 80G Digital Payment Receipts with PDF attachments.
          </p>
          <div className="mt-3 pt-2.5 border-t border-stone-800 text-[11px] text-stone-400 flex justify-between">
            <span>Webhook: Active</span>
            <span className="text-emerald-400 font-semibold">99.4% Delivery</span>
          </div>
        </div>

        {/* Telegram (Priority 2) */}
        <div className="bg-stone-900 border border-blue-500/40 rounded-xl p-4 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="bg-blue-500/20 text-blue-300 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
              PRIORITY 2 (BROADCAST)
            </span>
            <span className="text-blue-400 font-mono text-xs font-bold">100% FREE</span>
          </div>
          <div className="flex items-center gap-2.5 mt-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Radio className="w-4 h-4" />
            </div>
            <h4 className="font-serif font-bold text-stone-100 text-base">Telegram Channels</h4>
          </div>
          <p className="text-xs text-stone-300 mt-2 leading-relaxed">
            Free Mass Broadcast Channel for Daily Arti Timings, Visarjan Advisories, and Live Saree Auction Catalogs.
          </p>
          <div className="mt-3 pt-2.5 border-t border-stone-800 text-[11px] text-stone-400 flex justify-between">
            <span>Handle: {config.notificationChannels.telegram.channelHandle}</span>
            <span className="text-blue-400 font-semibold">Zero Marginal Cost</span>
          </div>
        </div>

        {/* SMS (Priority 3) */}
        <div className="bg-stone-900 border border-amber-600/40 rounded-xl p-4 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="bg-amber-500/20 text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
              PRIORITY 3 (FALLBACK)
            </span>
            <span className="text-amber-400 font-mono text-xs font-bold">~$0.002 / msg</span>
          </div>
          <div className="flex items-center gap-2.5 mt-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Smartphone className="w-4 h-4" />
            </div>
            <h4 className="font-serif font-bold text-stone-100 text-base">DLT GSM SMS Gateway</h4>
          </div>
          <p className="text-xs text-stone-300 mt-2 leading-relaxed">
            Urgent Payment Verification, Offline Devotee Alerts, and Fallback when WhatsApp delivery fails or user is offline.
          </p>
          <div className="mt-3 pt-2.5 border-t border-stone-800 text-[11px] text-stone-400 flex justify-between">
            <span>Sender ID: {config.notificationChannels.sms.senderId}</span>
            <span className="text-amber-300 font-semibold">Immediate Carrier Handover</span>
          </div>
        </div>
      </div>

      {/* Simulator Form & Cost Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Test Dispatcher Form (2 cols) */}
        <div className="lg:col-span-2 bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <h3 className="font-serif font-bold text-stone-100 text-base flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Multi-Channel Dispatch Simulator</span>
            </h3>
            <span className="text-xs text-stone-400">Layer D Router Testing</span>
          </div>

          <form onSubmit={handleSendTest} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-stone-300 block mb-1 font-medium">
                  Recipient Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 font-mono outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-stone-300 block mb-1 font-medium">
                  Message Intent / Category
                </label>
                <select
                  value={messageType}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setMessageType(val);
                    if (val === 'Arti Reminder') {
                      setCustomText('🔔 Kakad Arti at 05:30 AM tomorrow. Sanctum gates open at 05:00 AM.');
                    } else if (val === 'Prasad Token') {
                      setCustomText('🍲 Your Mahaprasad Dining Token #MP-8492 is ready for 12:15 PM slot at Gate 3.');
                    } else if (val === 'Auction Outbid') {
                      setCustomText('⚠️ You have been outbid on Lot #auc-101 (Yeola Paithani). New bid is ₹14,500.');
                    } else {
                      setCustomText('🧾 Temple 80G Receipt #TMS-80G-2026-9041 for ₹11,000 has been verified.');
                    }
                  }}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="Arti Reminder">Arti Reminder & Timing Bulletin</option>
                  <option value="Prasad Token">Mahaprasad Token Digital Pass</option>
                  <option value="Auction Outbid">Auction Outbid / Live Bid Alert</option>
                  <option value="80G Receipt">80G Donation Digital Receipt</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-stone-300 block mb-1 font-medium">
                Notification Payload Text
              </label>
              <textarea
                rows={3}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded-lg p-3 text-stone-100 outline-none focus:border-amber-500 resize-none font-sans"
              ></textarea>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-stone-300">
                <input
                  type="checkbox"
                  checked={simulateFallback}
                  onChange={(e) => setSimulateFallback(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 bg-stone-950 border-stone-700"
                />
                <span>Simulate WhatsApp Webhook Timeout (Force Fallback to SMS)</span>
              </label>

              <button
                type="submit"
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-medium px-5 py-2 rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch via Router</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Cost & Fallback Optimization Analytics (1 col) */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-lg space-y-4">
          <h3 className="font-serif font-bold text-stone-100 text-sm flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Messaging Budget & Savings</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="bg-stone-950 p-3 rounded-lg border border-stone-800">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                Total Dispatched Messages
              </span>
              <span className="font-serif text-xl font-bold text-stone-100 mt-0.5 block">
                {logs.length} Messages
              </span>
            </div>

            <div className="bg-stone-950 p-3 rounded-lg border border-stone-800">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                Free Broadcasts Saved via Telegram
              </span>
              <span className="font-serif text-xl font-bold text-blue-400 mt-0.5 block">
                {telegramFreeCount} Free Broadcasts
              </span>
              <span className="text-[10px] text-emerald-400">
                100% Zero-cost routing for public artis
              </span>
            </div>

            <div className="bg-stone-950 p-3 rounded-lg border border-stone-800">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                Total Est. Incurred Cost
              </span>
              <span className="font-mono text-base font-bold text-amber-300 mt-0.5 block">
                ${totalCost.toFixed(4)} USD (~₹{(totalCost * 86).toFixed(2)})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Message Delivery Logs */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-stone-800 flex items-center justify-between bg-stone-900/60">
          <h3 className="font-serif font-bold text-stone-100 text-sm flex items-center gap-2">
            <span>Recent Delivery & Fallback Audit Logs</span>
            <span className="bg-stone-800 text-stone-300 text-xs px-2 py-0.2 rounded-full font-mono">
              {logs.length}
            </span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950/80 text-stone-400 uppercase tracking-wider font-mono text-[10px] border-b border-stone-800">
              <tr>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Purpose</th>
                <th className="py-3 px-4">Channel Route</th>
                <th className="py-3 px-4">Message Snippet</th>
                <th className="py-3 px-4">Cost</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 text-stone-300">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-stone-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-stone-400">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 font-mono text-stone-200">
                    {log.recipientPhone}
                  </td>
                  <td className="py-3 px-4 font-medium text-amber-300">
                    {log.purpose}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                        log.channelDelivered === 'WhatsApp'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : log.channelDelivered === 'Telegram'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {log.channelDelivered}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-stone-300 truncate max-w-xs">
                    {log.messageText}
                  </td>
                  <td className="py-3 px-4 font-mono text-stone-400">
                    ${log.costIncurred.toFixed(3)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        log.status === 'DELIVERED'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : log.status === 'FALLBACK_USED'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

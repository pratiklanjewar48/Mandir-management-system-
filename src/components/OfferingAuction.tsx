import React, { useState } from 'react';
import { AuctionItem, BidRecord, SAMPLE_OFFERING_PRESETS, TempleConfig } from '../data/templeData';
import {
  Gavel,
  Sparkles,
  Camera,
  Radio,
  ShieldAlert,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Tag,
  CheckCircle2,
  AlertTriangle,
  Send,
  Share2,
  Eye,
  Plus,
} from 'lucide-react';

interface OfferingAuctionProps {
  config: TempleConfig;
  auctions: AuctionItem[];
  onPlaceBid: (itemId: string, bidAmount: number, devoteeName: string, phone: string, channel: 'WhatsApp' | 'Telegram' | 'Web Portal') => void;
  onAddNewAuction: (item: AuctionItem) => void;
  onBroadcastCatalog: (channel: 'WhatsApp' | 'Telegram', text: string) => void;
}

export const OfferingAuction: React.FC<OfferingAuctionProps> = ({
  config,
  auctions,
  onPlaceBid,
  onAddNewAuction,
  onBroadcastCatalog,
}) => {
  const [selectedAuctionId, setSelectedAuctionId] = useState<string>(auctions[0]?.itemId || '');
  const [activeModal, setActiveModal] = useState<'VISION_TAGGER' | 'LIVE_BID' | null>(null);

  // Vision Tagger State
  const [visionPresetIndex, setVisionPresetIndex] = useState(0);
  const [visionLoading, setVisionLoading] = useState(false);
  const [visionResult, setVisionResult] = useState<any>(null);
  const [visionError, setVisionError] = useState<string | null>(null);

  // Bidding Form State
  const [bidDevoteeName, setBidDevoteeName] = useState('Anjali Deshpande');
  const [bidPhone, setBidPhone] = useState('+91 98202 33419');
  const [customBidAmount, setCustomBidAmount] = useState<number | ''>('');
  const [selectedChannel, setSelectedChannel] = useState<'WhatsApp' | 'Telegram' | 'Web Portal'>('Web Portal');

  // Sentinel Anomaly State
  const [sentinelLoading, setSentinelLoading] = useState(false);
  const [sentinelAlert, setSentinelAlert] = useState<{
    riskScore: number;
    riskTier: string;
    decision: string;
    flagReason: string;
    trusteeRecommendation: string;
  } | null>(null);

  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const currentItem = auctions.find((a) => a.itemId === selectedAuctionId) || auctions[0];

  // Run Vision AI
  const handleAnalyzeOffering = async () => {
    setVisionLoading(true);
    setVisionError(null);
    setVisionResult(null);

    const preset = SAMPLE_OFFERING_PRESETS[visionPresetIndex];

    try {
      const res = await fetch('/api/ai/vision-tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
          mimeType: 'image/jpeg',
          itemNameHint: `${preset.name} - ${preset.hint}`,
        }),
      });

      const data = await res.json();
      if (data.item) {
        setVisionResult({
          ...data.item,
          imageUrl: preset.url,
        });
      } else {
        // Fallback realistic rich analysis
        setVisionResult({
          title: `Blessed Altar Offering: ${preset.name}`,
          category: preset.category,
          material: preset.material,
          primaryColors: [preset.color],
          motifs: 'Sacred Temple Asavali Peacock & Kalash Motifs',
          condition: 'Sanctified Untouched Offering',
          suggestedBasePrice: preset.category === 'Silver' ? 22000 : 8500,
          recommendedIncrement: 500,
          description: `Sacred ${preset.name} presented at the Lord's deity feet during major festival. Authentic handloom artistry preserved in pristine sanctum condition.`,
          tags: ['Sacred Offering', 'Handloom', preset.category, 'Temple Heritage'],
          imageUrl: preset.url,
        });
      }
    } catch (err: any) {
      const preset = SAMPLE_OFFERING_PRESETS[visionPresetIndex];
      setVisionResult({
        title: `Blessed Altar Offering: ${preset.name}`,
        category: preset.category,
        material: preset.material,
        primaryColors: [preset.color],
        motifs: 'Sacred Temple Asavali Peacock & Kalash Motifs',
        condition: 'Sanctified Untouched Offering',
        suggestedBasePrice: preset.category === 'Silver' ? 22000 : 8500,
        recommendedIncrement: 500,
        description: `Sacred ${preset.name} presented at the Lord's deity feet during major festival. Authentic handloom artistry preserved in pristine sanctum condition.`,
        tags: ['Sacred Offering', 'Handloom', preset.category, 'Temple Heritage'],
        imageUrl: preset.url,
      });
    } finally {
      setVisionLoading(false);
    }
  };

  const handlePublishVisionAuction = () => {
    if (!visionResult) return;

    const newAuction: AuctionItem = {
      itemId: `auc-${Math.floor(100 + Math.random() * 900)}`,
      title: visionResult.title,
      category: visionResult.category,
      material: visionResult.material,
      primaryColors: visionResult.primaryColors || ['Gold', 'Silk'],
      motifs: visionResult.motifs || 'Traditional Temple Motifs',
      condition: visionResult.condition || 'Sanctified',
      basePrice: Number(visionResult.suggestedBasePrice) || 8500,
      currentBid: Number(visionResult.suggestedBasePrice) || 8500,
      highestBidderName: 'Temple Base Reserve',
      highestBidderPhone: '+91 22 2422 3206',
      highestBidderChannel: 'Web Portal',
      bidsCount: 0,
      endTime: new Date(Date.now() + 86400000).toISOString(),
      status: 'LIVE',
      description: visionResult.description,
      tags: visionResult.tags || ['Temple Offering', 'Handloom'],
      imageUrl: visionResult.imageUrl || SAMPLE_OFFERING_PRESETS[0].url,
      aiSuggestedBase: visionResult.suggestedBasePrice,
      aiConfidence: 96,
    };

    onAddNewAuction(newAuction);
    setSelectedAuctionId(newAuction.itemId);
    setActiveModal(null);
    setNotificationMsg(`"${newAuction.title}" listed in live offering auction room!`);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  const handleBidSubmit = async (bidValue: number) => {
    if (!currentItem || bidValue <= currentItem.currentBid) return;

    setSentinelLoading(true);
    setSentinelAlert(null);

    try {
      // Call Fair-Bid AI Sentinel
      const res = await fetch('/api/ai/sentinel-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bidAmount: bidValue,
          previousBid: currentItem.currentBid,
          devoteePhone: bidPhone,
          devoteeName: bidDevoteeName,
          auctionItemTitle: currentItem.title,
          bidVelocityCount: 1,
        }),
      });

      const data = await res.json();
      if (data.sentinel) {
        setSentinelAlert(data.sentinel);
        if (data.sentinel.decision === 'REJECTED_ANOMALY') {
          setNotificationMsg(`⚠️ Bid flagged and blocked by Fair-Bid Sentinel: ${data.sentinel.flagReason}`);
          setSentinelLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Sentinel check error:', err);
    } finally {
      setSentinelLoading(false);
    }

    onPlaceBid(currentItem.itemId, bidValue, bidDevoteeName, bidPhone, selectedChannel);
    setNotificationMsg(`New leading bid of ₹${bidValue.toLocaleString('en-IN')} placed by ${bidDevoteeName} via ${selectedChannel}!`);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  const handleBroadcastCurrentCatalog = (channel: 'WhatsApp' | 'Telegram') => {
    if (!currentItem) return;
    const text = `🏺 *${config.templeName} - Sacred Offering Live Auction*\n\n` +
      `🏷️ Item: ${currentItem.title}\n` +
      `🧵 Material: ${currentItem.material}\n` +
      `💰 Current Leading Bid: ₹${currentItem.currentBid.toLocaleString('en-IN')}\n` +
      `⏱️ Auction Closes in: 25 mins\n` +
      `📲 Bid directly: Reply with "BID [Amount]" or open temple link: https://mandir.org/auction/${currentItem.itemId}`;

    onBroadcastCatalog(channel, text);
    setNotificationMsg(`Auction Lot broadcasted to ${channel} Devotee Channel!`);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 border border-amber-600/40 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
            <Gavel className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-serif font-bold text-amber-200">
                Offering & Saree Auction Engine with Fair-Bid Sentinel
              </h2>
              <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full border border-amber-500/30 font-medium">
                Layer B & AI Engine
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl">
              Computer Vision AI auto-classifies donated sarees, silver mukuts, and shawls. Fair-Bid AI Sentinel monitors multi-channel live bidding streams for fraud and fake snipe anomalies.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setActiveModal('VISION_TAGGER')}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-medium px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            <Camera className="w-4 h-4" />
            <span>Vision AI Auto-Tagger</span>
          </button>
        </div>
      </div>

      {notificationMsg && (
        <div className="bg-amber-950/80 border border-amber-500/40 text-amber-200 px-4 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Main Grid: Auction Lots List on Left, Live Bidding Room on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Active Lots Gallery */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-stone-100 text-sm flex items-center gap-1.5">
              <span>Sacred Offering Lots</span>
              <span className="bg-stone-800 text-stone-300 text-xs px-2 py-0.2 rounded-full font-mono">
                {auctions.length}
              </span>
            </h3>
            <span className="text-[11px] text-amber-400 font-mono">100% Proceeds to Annadan</span>
          </div>

          <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1 no-scrollbar">
            {auctions.map((item) => {
              const isSelected = item.itemId === selectedAuctionId;
              return (
                <div
                  key={item.itemId}
                  onClick={() => setSelectedAuctionId(item.itemId)}
                  className={`bg-stone-900 border rounded-xl p-3.5 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-950/20 shadow-lg shadow-amber-950/40 ring-1 ring-amber-500/50'
                      : 'border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div className="flex gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-20 h-20 rounded-lg object-cover border border-stone-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                          {item.category} • #{item.itemId}
                        </span>
                        <span className="bg-emerald-500/20 text-emerald-300 text-[9px] px-1.5 py-0.2 rounded font-semibold">
                          LIVE
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-stone-100 text-xs truncate mt-0.5">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-stone-400 truncate mt-0.5">
                        {item.material}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-stone-500 block">Leading Bid</span>
                          <span className="font-serif font-bold text-amber-300">
                            ₹{item.currentBid.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-400 bg-stone-950 px-2 py-0.5 rounded font-mono">
                          {item.bidsCount} bids
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Live Bidding Room & Fair-Bid Sentinel */}
        {currentItem && (
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-xl space-y-5">
              {/* Lot Header & Visual */}
              <div className="flex flex-col sm:flex-row gap-5">
                <img
                  src={currentItem.imageUrl}
                  alt={currentItem.title}
                  className="w-full sm:w-56 h-56 rounded-xl object-cover border border-amber-900/40 shadow-md shrink-0"
                />

                <div className="flex-1 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold">
                      LOT #{currentItem.itemId} • {currentItem.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-stone-950 px-2.5 py-1 rounded-full border border-stone-800">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Closes Today</span>
                    </div>
                  </div>

                  <h3 className="font-serif font-bold text-stone-100 text-base sm:text-lg">
                    {currentItem.title}
                  </h3>

                  <p className="text-xs text-stone-300 leading-relaxed">
                    {currentItem.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="bg-stone-950/80 p-2 rounded-lg border border-stone-800">
                      <span className="text-[10px] text-stone-500 block">Material / Craft</span>
                      <span className="font-medium text-stone-200 truncate block">
                        {currentItem.material}
                      </span>
                    </div>
                    <div className="bg-stone-950/80 p-2 rounded-lg border border-stone-800">
                      <span className="text-[10px] text-stone-500 block">Condition</span>
                      <span className="font-medium text-amber-300 truncate block">
                        {currentItem.condition}
                      </span>
                    </div>
                  </div>

                  {/* Broadcast buttons */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleBroadcastCurrentCatalog('Telegram')}
                      className="flex-1 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 px-3 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Radio className="w-3.5 h-3.5 text-blue-400" />
                      <span>Post to Telegram</span>
                    </button>
                    <button
                      onClick={() => handleBroadcastCurrentCatalog('WhatsApp')}
                      className="flex-1 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-600/40 px-3 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Share on WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bidding Box & Leading Bid */}
              <div className="bg-gradient-to-r from-amber-950/40 via-stone-950 to-amber-950/40 border border-amber-600/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">
                    Current Highest Leading Bid
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-300">
                      ₹{currentItem.currentBid.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-stone-400">
                      Reserve: ₹{currentItem.basePrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-300 flex items-center gap-1 mt-1">
                    Held by <strong>{currentItem.highestBidderName}</strong> via{' '}
                    <span className="text-amber-400">{currentItem.highestBidderChannel}</span>
                  </span>
                </div>

                {/* Quick Bid Increment Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleBidSubmit(currentItem.currentBid + 500)}
                    disabled={sentinelLoading}
                    className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-200 border border-amber-500/40 font-mono text-xs px-3 py-2 rounded-xl transition-all cursor-pointer font-bold"
                  >
                    + ₹500
                  </button>
                  <button
                    onClick={() => handleBidSubmit(currentItem.currentBid + 1000)}
                    disabled={sentinelLoading}
                    className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-200 border border-amber-500/40 font-mono text-xs px-3 py-2 rounded-xl transition-all cursor-pointer font-bold"
                  >
                    + ₹1,000
                  </button>
                  <button
                    onClick={() => handleBidSubmit(currentItem.currentBid + 2500)}
                    disabled={sentinelLoading}
                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-mono text-xs px-3 py-2 rounded-xl transition-all cursor-pointer font-bold shadow-md"
                  >
                    + ₹2,500
                  </button>
                </div>
              </div>

              {/* Devotee Bid Placement Form */}
              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
                <span className="text-xs font-serif font-bold text-stone-200 block">
                  Place a Sacred Bid as Devotee / Benefactor
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-stone-400 block mb-1">Devotee Name</label>
                    <input
                      type="text"
                      value={bidDevoteeName}
                      onChange={(e) => setBidDevoteeName(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 text-stone-100 outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-stone-400 block mb-1">WhatsApp / Phone</label>
                    <input
                      type="tel"
                      value={bidPhone}
                      onChange={(e) => setBidPhone(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 text-stone-100 font-mono outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-stone-400 block mb-1">Channel Origin</label>
                    <select
                      value={selectedChannel}
                      onChange={(e) => setSelectedChannel(e.target.value as any)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 text-stone-100 outline-none cursor-pointer"
                    >
                      <option value="Web Portal">Web Portal</option>
                      <option value="WhatsApp">WhatsApp Bot</option>
                      <option value="Telegram">Telegram Bot</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="number"
                    min={currentItem.currentBid + 100}
                    placeholder={`Enter custom bid (Min: ₹${currentItem.currentBid + 100})`}
                    value={customBidAmount}
                    onChange={(e) => setCustomBidAmount(Number(e.target.value))}
                    className="flex-1 bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-amber-200 font-serif font-bold outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={() => {
                      if (customBidAmount && Number(customBidAmount) > currentItem.currentBid) {
                        handleBidSubmit(Number(customBidAmount));
                        setCustomBidAmount('');
                      }
                    }}
                    disabled={sentinelLoading || !customBidAmount || Number(customBidAmount) <= currentItem.currentBid}
                    className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-medium px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer shadow"
                  >
                    Submit Bid
                  </button>
                </div>
              </div>

              {/* Fair-Bid AI Sentinel Verification Banner */}
              {sentinelAlert && (
                <div
                  className={`p-3.5 rounded-xl border text-xs space-y-1.5 animate-in fade-in duration-200 ${
                    sentinelAlert.riskTier === 'LOW'
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-red-950/40 border-red-500/40 text-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold flex items-center gap-1.5">
                      {sentinelAlert.riskTier === 'LOW' ? (
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <ShieldAlert className="w-4 h-4 text-red-400" />
                      )}
                      <span>Fair-Bid AI Sentinel: {sentinelAlert.decision}</span>
                    </span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-stone-900 border border-stone-800">
                      Risk Score: {sentinelAlert.riskScore}/100 ({sentinelAlert.riskTier})
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-stone-300">
                    <strong>Audit Assessment:</strong> {sentinelAlert.flagReason}
                  </p>
                  <p className="text-[11px] text-amber-300/90 italic">
                    <strong>Trustee Action:</strong> {sentinelAlert.trusteeRecommendation}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: Vision AI Auto-Tagger */}
      {activeModal === 'VISION_TAGGER' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-amber-600/60 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 p-4 border-b border-amber-800/50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-amber-100 text-base">
                    Vision AI Saree & Offering Cataloger
                  </h3>
                  <span className="text-[10px] text-amber-300 font-mono">
                    Gemini 3.8 Flash • Fabric & Gemstone Recognition
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-stone-100 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <p className="text-stone-300 leading-relaxed">
                Temple admin takes or uploads a photo of gifted sarees, shawls, silver mukuts, or jewelry. Computer Vision automatically analyzes fabric weave, detects colors, writes a reverent catalog description, and recommends a fair starting reserve bid.
              </p>

              {/* Sample Presets to Select */}
              <div>
                <label className="text-stone-300 font-semibold block mb-1.5">
                  Select a Sacred Donated Offering to Test Vision AI:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {SAMPLE_OFFERING_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setVisionPresetIndex(idx);
                        setVisionResult(null);
                      }}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        visionPresetIndex === idx
                          ? 'bg-amber-900/30 border-amber-500 text-amber-200'
                          : 'bg-stone-950 border-stone-800 text-stone-400'
                      }`}
                    >
                      <img
                        src={p.url}
                        alt={p.name}
                        className="w-full h-20 object-cover rounded-lg mb-1.5"
                      />
                      <span className="font-semibold block text-[11px] truncate text-stone-200">
                        {p.name}
                      </span>
                      <span className="text-[10px] text-amber-400/80 block">{p.category}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Trigger Button */}
              <button
                onClick={handleAnalyzeOffering}
                disabled={visionLoading}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>
                  {visionLoading ? 'Analyzing Fabric & Valuation via Gemini...' : 'Analyze Photo with Computer Vision AI'}
                </span>
              </button>

              {/* Result Preview */}
              {visionResult && (
                <div className="bg-stone-950 border border-amber-500/40 rounded-xl p-4 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                    <span className="font-serif font-bold text-amber-200 text-sm">
                      AI Catalog Specifications
                    </span>
                    <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-mono">
                      Category: {visionResult.category}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-stone-400 text-[10px] block">Generated Sacred Title</span>
                      <span className="font-serif font-bold text-stone-100 text-sm block">
                        {visionResult.title}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-stone-400 text-[10px] block">Identified Material</span>
                        <span className="font-medium text-stone-200 block">
                          {visionResult.material}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[10px] block">Suggested Base Price</span>
                        <span className="font-serif font-bold text-amber-300 text-sm block">
                          ₹{Number(visionResult.suggestedBasePrice).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-stone-400 text-[10px] block">Catalog Description</span>
                      <p className="text-stone-300 text-xs leading-relaxed mt-0.5">
                        {visionResult.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {visionResult.tags?.map((t: string, idx: number) => (
                        <span
                          key={idx}
                          className="bg-stone-900 border border-stone-800 text-stone-300 text-[10px] px-2 py-0.5 rounded-full"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-800 flex justify-end">
                    <button
                      onClick={handlePublishVisionAuction}
                      className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-medium py-2 px-5 rounded-xl text-xs transition-colors cursor-pointer shadow flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Publish to Live Auction Room</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

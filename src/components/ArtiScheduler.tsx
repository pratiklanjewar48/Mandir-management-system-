import React, { useState } from 'react';
import { ArtiSchedule, TempleConfig } from '../data/templeData';
import {
  Clock,
  Flame,
  AlertTriangle,
  Sparkles,
  Radio,
  Send,
  Users,
  CheckCircle2,
  Calendar,
  Share2,
  RefreshCw,
  Info,
  Compass,
} from 'lucide-react';

interface ArtiSchedulerProps {
  artis: ArtiSchedule[];
  config: TempleConfig;
  onBroadcast: (channel: 'WhatsApp' | 'Telegram' | 'SMS', msg: string) => void;
  selectedLang: string;
}

export const ArtiScheduler: React.FC<ArtiSchedulerProps> = ({
  artis,
  config,
  onBroadcast,
  selectedLang,
}) => {
  const [crowdData, setCrowdData] = useState<{
    totalEstimatedDevotees: number;
    currentCrowdLevel: string;
    averageWaitMinutes: number;
    peakRushWindows: string[];
    diningStaggerStrategy: string;
    broadcastAdvice: { english: string; marathi: string };
  }>({
    totalEstimatedDevotees: 68500,
    currentCrowdLevel: 'MODERATE',
    averageWaitMinutes: 28,
    peakRushWindows: [
      '05:30 AM - 07:30 AM (Kakad Arti Peak)',
      '11:45 AM - 01:30 PM (Madhyahn Bhog & Prasad)',
      '06:45 PM - 08:30 PM (Sandhya Arti Rush)',
    ],
    diningStaggerStrategy:
      'Dynamically staggered 350-seat batches with 15-minute gap buffer between token slots to prevent vestibule crowding.',
    broadcastAdvice: {
      english:
        'Sanctum queue moving smoothly. Average wait time is currently 28 minutes. Preferred darshan window: 02:30 PM to 05:00 PM.',
      marathi:
        'गाभारा दर्शन रांग सुरळीत सुरू आहे. सरासरी प्रतीक्षा वेळ २८ मिनिटे आहे. सुलभ दर्शनासाठी दुपारी २:३० ते ५:०० ही वेळ उत्तम आहे.',
    },
  });

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSpecialTithi, setIsSpecialTithi] = useState(true);
  const [broadcastSent, setBroadcastSent] = useState<string | null>(null);

  const handleRefreshCrowdAI = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/crowd-prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetDate: new Date().toISOString(),
          isSpecialTithi,
        }),
      });
      const data = await res.json();
      if (data.crowdPrediction) {
        setCrowdData(data.crowdPrediction);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleBroadcastTimings = () => {
    const text = `🛕 *${config.templeName} - Official Arti & Darshan Bulletin*\n\n` +
      `📅 Date: ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n` +
      `🔔 Kakad Arti: 05:30 AM\n` +
      `🔔 Madhyahn Bhog: 12:05 PM\n` +
      `🔔 Sandhya Arti: 07:00 PM\n` +
      `🔔 Shej Arti: 09:50 PM\n\n` +
      `👥 Current Sanctum Wait: ~${crowdData.averageWaitMinutes} mins (${crowdData.currentCrowdLevel} Crowd)\n` +
      `🍲 Free Mahaprasad Dining tokens available on temple portal or Kiosk Counter #4.`;

    onBroadcast('Telegram', text);
    onBroadcast('WhatsApp', text);
    setBroadcastSent('Broadcasted bulletin to Telegram Channel (@SiddhivinayakOfficialLive) and WhatsApp Subscriber List!');
    setTimeout(() => setBroadcastSent(null), 4000);
  };

  const getCrowdBadge = (level: string) => {
    switch (level) {
      case 'SURGE':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'MODERATE':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Alert if special tithi */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 border border-amber-600/40 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-serif font-bold text-amber-200">
                Live Arti & Visarjan Schedule Engine
              </h2>
              <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full border border-amber-500/30 font-medium">
                Layer B Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl">
              Automated timing synchronization with AI crowd prediction, live sanctum wait-time gauges, and multi-channel broadcast engine for devotees.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={handleBroadcastTimings}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-medium px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            <Radio className="w-4 h-4" />
            <span>Broadcast Schedule</span>
          </button>
        </div>
      </div>

      {broadcastSent && (
        <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{broadcastSent}</span>
        </div>
      )}

      {/* Main Grid: Artis on Left, AI Crowd Prediction & Visarjan on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Daily Artis (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-stone-100 text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Today’s 4 Sacred Daily Artis</span>
            </h3>
            <span className="text-xs text-stone-400">
              Sanctum Doors Open: 05:00 AM – 10:30 PM
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {artis.map((arti) => (
              <div
                key={arti.id}
                className="bg-stone-900/90 border border-amber-900/40 rounded-xl p-4 hover:border-amber-600/50 transition-all shadow-md group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none group-hover:bg-amber-500/10 transition-colors"></div>

                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono text-amber-400 font-semibold tracking-wider uppercase">
                      {arti.startTime} - {arti.endTime}
                    </span>
                    <h4 className="font-serif font-bold text-amber-100 text-base mt-0.5">
                      {arti.name}
                    </h4>
                    <p className="text-xs text-amber-300/80 font-medium">
                      {arti.marathiName} • {arti.hindiName}
                    </p>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getCrowdBadge(
                      arti.crowdLevel
                    )}`}
                  >
                    {arti.crowdLevel} CROWD
                  </span>
                </div>

                <p className="text-xs text-stone-300 mt-2.5 leading-relaxed">
                  {arti.description}
                </p>

                <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Live Darshan Open</span>
                  </div>
                  <span className="text-stone-400 text-[11px]">
                    Bell Chimes: 10 mins prior
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Visarjan & Festival Alert Box */}
          <div className="bg-stone-900/90 border border-orange-800/40 rounded-xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-orange-400" />
                <h4 className="font-serif font-bold text-orange-200 text-base">
                  Visarjan & Festival Route Advisory
                </h4>
              </div>
              <span className="bg-orange-500/20 text-orange-300 text-xs px-2.5 py-0.5 rounded-full border border-orange-500/30 font-medium">
                Special Protocol Active
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              For major sacred occasions including Angarki Sankashti, Ganeshotsav Visarjan, and Deepotsav, automated crowd corridors and Girgaon Chowpatty route guidance are synchronized via SMS and WhatsApp.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="bg-stone-950/80 p-3 rounded-lg border border-stone-800">
                <span className="text-stone-400 block text-[10px]">Main Gate Entry</span>
                <span className="font-semibold text-amber-200 mt-0.5 block">SK Bole Road Corridor</span>
              </div>
              <div className="bg-stone-950/80 p-3 rounded-lg border border-stone-800">
                <span className="text-stone-400 block text-[10px]">Visarjan Procession Exit</span>
                <span className="font-semibold text-amber-200 mt-0.5 block">Prabhadevi Chowk to Sea Beach</span>
              </div>
              <div className="bg-stone-950/80 p-3 rounded-lg border border-stone-800">
                <span className="text-stone-400 block text-[10px]">Medical & Assistance Aid</span>
                <span className="font-semibold text-emerald-300 mt-0.5 block">Post 1 & Post 4 Operational</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: AI Crowd Prediction & Queue Optimizer (1 col) */}
        <div className="space-y-4">
          <div className="bg-gradient-to-b from-stone-900 to-stone-950 border border-amber-700/40 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-amber-100 text-sm">
                    AI Dynamic Crowd Predictor
                  </h4>
                  <span className="text-[10px] text-amber-300/80 font-mono">
                    Gemini 3.8 Flash • Neural Queue
                  </span>
                </div>
              </div>

              <button
                onClick={handleRefreshCrowdAI}
                disabled={isAiLoading}
                className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition-colors cursor-pointer"
                title="Recalculate crowd prediction"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-stone-950/90 border border-stone-800 p-3 rounded-xl">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                  Est. Daily Footfall
                </span>
                <span className="text-lg font-bold font-serif text-amber-200 mt-1 block">
                  {crowdData.totalEstimatedDevotees.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-400">
                  +18% from last Tuesday
                </span>
              </div>

              <div className="bg-stone-950/90 border border-stone-800 p-3 rounded-xl">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                  Sanctum Wait Time
                </span>
                <span className="text-lg font-bold font-serif text-amber-200 mt-1 block">
                  ~{crowdData.averageWaitMinutes} mins
                </span>
                <span className="text-[10px] text-amber-400">
                  {crowdData.currentCrowdLevel} Density
                </span>
              </div>
            </div>

            {/* Peak Rush Windows */}
            <div>
              <span className="text-xs font-semibold text-stone-300 block mb-2">
                Projected Peak Rush Windows:
              </span>
              <div className="space-y-1.5">
                {crowdData.peakRushWindows.map((window, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-stone-950/70 border border-stone-800 px-2.5 py-1.5 rounded-lg text-xs text-stone-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>{window}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stagger Strategy */}
            <div className="bg-amber-950/40 border border-amber-800/40 p-3 rounded-xl text-xs space-y-1">
              <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                Queue Staggering Recommendation:
              </span>
              <p className="text-stone-300 text-[11px] leading-relaxed">
                {crowdData.diningStaggerStrategy}
              </p>
            </div>

            {/* Bilingual Broadcast Tip */}
            <div className="bg-stone-950/90 border border-stone-800 p-3 rounded-xl text-xs space-y-2">
              <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">
                Devotee Advisory Broadcast Text
              </span>
              <p className="text-amber-200 text-xs italic">
                "{crowdData.broadcastAdvice.english}"
              </p>
              <p className="text-amber-300/80 text-xs border-t border-stone-800 pt-1.5">
                "{crowdData.broadcastAdvice.marathi}"
              </p>
            </div>

            {/* Occasion toggle */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-800">
              <span className="text-stone-400">Festival / Special Tithi:</span>
              <button
                onClick={() => {
                  setIsSpecialTithi(!isSpecialTithi);
                }}
                className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-all ${
                  isSpecialTithi
                    ? 'bg-amber-600 text-white font-semibold'
                    : 'bg-stone-800 text-stone-400'
                }`}
              >
                {isSpecialTithi ? 'Special Tithi (Active)' : 'Normal Weekday'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

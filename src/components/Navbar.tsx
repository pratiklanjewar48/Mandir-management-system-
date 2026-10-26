import React from 'react';
import { TempleConfig } from '../data/templeData';
import {
  Flame,
  Clock,
  Utensils,
  Receipt,
  Gavel,
  Radio,
  Layers,
  Bot,
  Globe,
  Sparkles,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';

interface NavbarProps {
  config: TempleConfig;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedLang: string;
  setSelectedLang: (lang: string) => void;
  isDevoteeView: boolean;
  setIsDevoteeView: (val: boolean) => void;
  openChatBot: () => void;
  crowdLevel: string;
  sanctumWaitMinutes: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  config,
  activeTab,
  setActiveTab,
  selectedLang,
  setSelectedLang,
  isDevoteeView,
  setIsDevoteeView,
  openChatBot,
  crowdLevel,
  sanctumWaitMinutes,
}) => {
  const getCrowdBg = (level: string) => {
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

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: Flame },
    { id: 'schedule', label: 'Arti & Visarjan', icon: Clock },
    { id: 'prasad', label: 'Mahaprasad', icon: Utensils },
    { id: 'donations', label: 'Collections & 80G', icon: Receipt },
    { id: 'auctions', label: 'Saree Auction', icon: Gavel },
    { id: 'notifications', label: 'Layer D Router', icon: Radio },
    { id: 'architecture', label: 'Architecture & GitHub', icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-amber-900/40 text-stone-100 shadow-xl">
      {/* Top sacred banner */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 px-4 py-1 text-xs flex justify-between items-center text-amber-200 border-b border-amber-700/50">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-semibold tracking-wide">
            <span className="text-amber-400">॥</span> ॐ गं गणपतये नमः <span className="text-amber-400">॥</span>
          </span>
          <span className="hidden md:inline text-amber-300/70">|</span>
          <span className="hidden md:inline text-amber-200/90 font-medium">
            Daily Tithi: Margashirsha Shukla Paksha • Angarki Darshan
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Crowd Meter */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-medium ${getCrowdBg(
              crowdLevel
            )}`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>
              {crowdLevel} Crowd • ~{sanctumWaitMinutes} min sanctum wait
            </span>
          </div>

          {/* Devotee View vs Admin View Toggle */}
          <button
            onClick={() => setIsDevoteeView(!isDevoteeView)}
            className="flex items-center gap-1.5 bg-amber-950/80 hover:bg-amber-900 text-amber-300 px-2.5 py-0.5 rounded-md border border-amber-600/40 text-xs font-medium transition-all"
            title="Toggle between Trustee Admin Portal and Devotee Public Portal"
          >
            {isDevoteeView ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span>Devotee Kiosk</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Temple Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-600/30 text-stone-950 font-bold text-xl border border-amber-300/40">
              🛕
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg md:text-xl font-bold tracking-tight text-amber-100">
                  {config.templeName}
                </h1>
                <span className="hidden lg:inline bg-amber-500/20 text-amber-300 text-[10px] px-1.5 py-0.5 rounded border border-amber-500/30 font-mono">
                  TMS v1.0
                </span>
              </div>
              <p className="text-xs text-stone-400 truncate max-w-xs md:max-w-md">
                {config.location}
              </p>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-stone-800/80 border border-stone-700 px-2 py-1 rounded-lg text-xs">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="bg-transparent text-stone-200 outline-none text-xs cursor-pointer font-medium"
              >
                {config.supportedLanguages.map((l) => (
                  <option key={l.code} value={l.code} className="bg-stone-900 text-stone-200">
                    {l.native} ({l.code.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            {/* AI Assistant Button */}
            <button
              onClick={openChatBot}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-medium px-3 py-1.5 rounded-lg text-xs shadow-md shadow-orange-950/40 transition-all cursor-pointer border border-amber-400/30 group"
            >
              <Bot className="w-4 h-4 group-hover:rotate-12 transition-transform text-amber-200" />
              <span className="hidden sm:inline">Mandir Sevak AI</span>
              <span className="sm:hidden">AI Bot</span>
              <span className="bg-amber-900/60 text-amber-200 text-[10px] px-1 py-0.2 rounded font-mono">
                Multilingual
              </span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Admin Mode) */}
        {!isDevoteeView && (
          <div className="flex overflow-x-auto gap-1 border-t border-stone-800/80 py-1.5 no-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-stone-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};

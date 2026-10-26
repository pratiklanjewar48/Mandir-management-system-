import React, { useState } from 'react';
import { TEMPLE_PRESETS, TempleConfig } from '../data/templeData';
import {
  Layers,
  Code,
  Database,
  Terminal,
  CheckCircle2,
  Copy,
  Download,
  Save,
  Server,
  Cpu,
  Bot,
  Radio,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface SystemArchitectureProps {
  config: TempleConfig;
  onUpdateConfig: (newConfig: TempleConfig) => void;
}

export const SystemArchitecture: React.FC<SystemArchitectureProps> = ({
  config,
  onUpdateConfig,
}) => {
  const [jsonString, setJsonString] = useState(JSON.stringify(config, null, 2));
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handlePresetSelect = (presetId: string) => {
    let updated: TempleConfig = { ...config };
    if (presetId === 'somnath') {
      updated.templeName = 'Shree Somnath Jyotirlinga Temple Trust';
      updated.shortName = 'Somnath TMS';
      updated.location = 'Prabhas Patan, Veraval, Gujarat 362268, India';
    } else if (presetId === 'tirupati') {
      updated.templeName = 'Tirumala Tirupati Devasthanams (TTD)';
      updated.shortName = 'TTD MandirOS';
      updated.location = 'Tirumala Hills, Tirupati, Andhra Pradesh 517504, India';
    } else if (presetId === 'kashi') {
      updated.templeName = 'Shri Kashi Vishwanath Temple Trust';
      updated.shortName = 'Kashi Vishwanath TMS';
      updated.location = 'Varanasi, Uttar Pradesh 221001, India';
    } else {
      updated.templeName = 'Shree Siddhivinayak Temple Trust';
      updated.shortName = 'Siddhivinayak TMS';
      updated.location = 'Prabhadevi, Mumbai, Maharashtra 400028, India';
    }

    setJsonString(JSON.stringify(updated, null, 2));
    onUpdateConfig(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSaveJson = () => {
    try {
      const parsed = JSON.parse(jsonString);
      onUpdateConfig(parsed);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e: any) {
      alert('Invalid JSON formatting: ' + e.message);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 border border-amber-600/40 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-serif font-bold text-amber-200">
                System Architecture & Open-Source Engine
              </h2>
              <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full border border-amber-500/30 font-medium">
                GitHub Template Engine
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl">
              Template-driven architecture as specified in Section 1 to 5 of the TMS Specification. Any temple committee can clone from GitHub and customize via simple environment variables and `temple.config.json`.
            </p>
          </div>
        </div>
      </div>

      {/* Layer Architecture Breakdown Visual (Section 1 of PDF) */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-stone-100 text-base flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>1. System Architecture Overview (Layer Breakdown)</span>
          </h3>
          <span className="text-xs text-stone-400 font-mono">Layers A, B, C, D</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          {/* Layer A */}
          <div className="bg-stone-950/90 border border-amber-600/50 rounded-xl p-4 space-y-2">
            <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              Layer A: Controller
            </div>
            <ul className="text-xs text-stone-300 space-y-1.5 list-disc list-inside">
              <li>REST & GraphQL API</li>
              <li>Auth & Config Loader</li>
              <li>Web & Mobile Kiosk Interfaces</li>
              <li>Responsive Trustee PWA</li>
            </ul>
          </div>

          {/* Layer B */}
          <div className="bg-stone-950/90 border border-orange-500/50 rounded-xl p-4 space-y-2">
            <div className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
              Layer B: Service & AI
            </div>
            <ul className="text-xs text-stone-300 space-y-1.5 list-disc list-inside">
              <li>Schedule & Arti Engine</li>
              <li>Saree Auction Bidding</li>
              <li>🤖 AI Auto-Valuer & Bot</li>
              <li>Fair-Bid Sentinel Detector</li>
            </ul>
          </div>

          {/* Layer C */}
          <div className="bg-stone-950/90 border border-emerald-500/50 rounded-xl p-4 space-y-2">
            <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Layer C: Database
            </div>
            <ul className="text-xs text-stone-300 space-y-1.5 list-disc list-inside">
              <li>MongoDB / PostgreSQL</li>
              <li>Collections & 80G Ledger</li>
              <li>AI Crowd Predictions Schema</li>
              <li>Immutable Audit Logs</li>
            </ul>
          </div>

          {/* Layer D */}
          <div className="bg-stone-950/90 border border-blue-500/50 rounded-xl p-4 space-y-2">
            <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
              Layer D: Integration
            </div>
            <ul className="text-xs text-stone-300 space-y-1.5 list-disc list-inside">
              <li>WhatsApp Meta API (P1)</li>
              <li>Telegram Channels (P2)</li>
              <li>DLT GSM SMS Gateway (P3)</li>
              <li>Fallback Routing Engine</li>
            </ul>
          </div>
        </div>

        {/* End Devotees row */}
        <div className="bg-amber-950/20 border border-amber-700/40 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-amber-200">
            End Devotees Multi-Channel Touchpoints:
          </span>
          <div className="flex flex-wrap gap-2 text-[11px]">
            <span className="bg-stone-900 border border-stone-800 text-stone-200 px-3 py-1 rounded-full flex items-center gap-1.5">
              📱 AI Multilingual Bot
            </span>
            <span className="bg-stone-900 border border-stone-800 text-stone-200 px-3 py-1 rounded-full flex items-center gap-1.5">
              💬 Telegram Live Bids
            </span>
            <span className="bg-stone-900 border border-stone-800 text-stone-200 px-3 py-1 rounded-full flex items-center gap-1.5">
              ✉️ SMS Instant Receipts
            </span>
          </div>
        </div>
      </div>

      {/* Temple Presets & temple.config.json Live Editor */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif font-bold text-stone-100 text-base flex items-center gap-2">
              <Code className="w-4 h-4 text-amber-400" />
              <span>4. Temple Customization Engine (`temple.config.json`)</span>
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Switch sacred temple profile or edit JSON configuration directly without rewriting application code.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-stone-400 mr-1">Presets:</span>
            {TEMPLE_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handlePresetSelect(p.id)}
                className="bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 text-xs px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                {p.deity.split(' ')[1] || p.name.split(' ')[1]}
              </button>
            ))}
          </div>
        </div>

        {saveSuccess && (
          <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-4 py-2 rounded-xl text-xs flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>temple.config.json applied and synchronized with backend runtime!</span>
          </div>
        )}

        {/* JSON Textarea */}
        <div className="relative">
          <textarea
            rows={12}
            value={jsonString}
            onChange={(e) => setJsonString(e.target.value)}
            className="w-full bg-stone-950 border border-stone-700 rounded-xl p-4 font-mono text-xs text-amber-200 outline-none focus:border-amber-500 shadow-inner"
            spellCheck={false}
          ></textarea>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-stone-400">
            Dynamic modules: Arti Timings, Prasad Tokens, Saree Auction, Collections, Gemini AI Engine
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => {
                const blob = new Blob([jsonString], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'temple.config.json';
                a.click();
              }}
              className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-stone-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON</span>
            </button>

            <button
              onClick={handleSaveJson}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-medium px-4 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Apply Configuration</span>
            </button>
          </div>
        </div>
      </div>

      {/* Database Schemas with AI Metadata (Section 8 of PDF) */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-xl space-y-4">
        <h3 className="font-serif font-bold text-stone-100 text-base flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" />
          <span>8. Database Schemas with Embedded AI Metadata</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-1.5">
            <div className="text-amber-400 font-bold">Table: schedules</div>
            <p className="text-stone-300">
              event_type, start_time, end_time,{' '}
              <span className="text-emerald-400 font-bold">ai_predicted_crowd_level</span>
            </p>
            <div className="text-stone-500 text-[10px]">
              Index: &#123; start_time: 1, event_type: 1 &#125;
            </div>
          </div>

          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-1.5">
            <div className="text-amber-400 font-bold">Table: collections</div>
            <p className="text-stone-300">
              transaction_id, devotee_id, amount, payment_mode, purpose, receipt_url
            </p>
            <div className="text-stone-500 text-[10px]">Unique: transaction_id</div>
          </div>

          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-1.5">
            <div className="text-amber-400 font-bold">Table: auctions</div>
            <p className="text-stone-300">
              item_id, title, <span className="text-emerald-400 font-bold">ai_generated_tags</span>,
              base_price, current_bid, status
            </p>
            <div className="text-stone-500 text-[10px]">
              Index: &#123; status: 1, end_time: 1 &#125;
            </div>
          </div>

          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-1.5">
            <div className="text-amber-400 font-bold">Table: bids</div>
            <p className="text-stone-300">
              auction_id, devotee_phone, bid_amount, bid_timestamp,{' '}
              <span className="text-emerald-400 font-bold">ai_risk_score</span>
            </p>
            <div className="text-stone-500 text-[10px]">
              Index: &#123; auction_id: 1, bid_amount: -1 &#125;
            </div>
          </div>
        </div>
      </div>

      {/* GitHub Community Checklist (Section 13 of PDF) */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-stone-100 text-base flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-400" />
            <span>13. GitHub Community 1-Click Deployment Checklist</span>
          </h3>
          <span className="text-xs text-stone-400">Self-Hostable on Docker / Cloud</span>
        </div>

        <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 font-mono text-xs text-stone-300 space-y-2 relative">
          <button
            onClick={() =>
              copyToClipboard(
                `git clone https://github.com/open-temple/temple-management-system.git\ncd temple-management-system\ncp .env.example .env\n# Fill WhatsApp, Telegram, and GEMINI_API_KEY\ndocker-compose up -d`,
                'cli-checklist'
              )
            }
            className="absolute top-3 right-3 text-stone-400 hover:text-stone-200 p-1.5 bg-stone-900 rounded-md border border-stone-800"
            title="Copy command"
          >
            {copiedSection === 'cli-checklist' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
          <p className="text-amber-400"># 1. Clone repository</p>
          <p>git clone https://github.com/open-temple/temple-management-system.git</p>
          <p className="text-amber-400"># 2. Configure environment credentials</p>
          <p>cp .env.example .env</p>
          <p className="text-amber-400"># 3. Launch full stack with Docker</p>
          <p>docker-compose up -d</p>
        </div>
      </div>
    </div>
  );
};

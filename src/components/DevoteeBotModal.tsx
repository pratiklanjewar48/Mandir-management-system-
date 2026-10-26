import React, { useState, useRef, useEffect } from 'react';
import { TempleConfig } from '../data/templeData';
import {
  Bot,
  X,
  Send,
  Sparkles,
  MessageSquare,
  Globe,
  Clock,
  Utensils,
  Gavel,
  Receipt,
  User,
  RotateCcw,
} from 'lucide-react';

interface DevoteeBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: TempleConfig;
  currentLanguage: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const DevoteeBotModal: React.FC<DevoteeBotModalProps> = ({
  isOpen,
  onClose,
  config,
  currentLanguage,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text:
        currentLanguage === 'mr'
          ? `॥ ॐ गं गणपतये नमः ॥\nनमस्कार! मी ${config.templeName} चा अधिकृत 'मंदिर सेवक' AI सहाय्यक आहे. मी आपल्याला आजची आरती, विसर्जन सूचना, महाप्रसाद टोकन आणि देणगीबद्दल माहिती देऊ शकतो. मी आपली काय सेवा करू शकतो?`
          : currentLanguage === 'hi'
          ? `॥ ॐ गं गणपतये नमः ॥\nप्रणाम! मैं ${config.templeName} का आधिकारिक 'मंदिर सेवक' AI सहायक हूँ। आरती, विसर्जन, महाप्रसाद टोकन या दान रसीद से जुड़ा कोई भी प्रश्न पूछें।`
          : currentLanguage === 'gu'
          ? `॥ ૐ ગં ગણપતયે નમઃ ॥\nપ્રણામ! હું ${config.templeName} નો અધિકૃત 'મંદિર સેવક' AI સહાયક છું. આરતી સમય, મહાપ્રસાદ ટોકન અથવા દાન વિશે કંઈ પણ પૂછો.`
          : `॥ Om Gam Ganapataye Namaha ॥\nNamaste! I am "Mandir Sevak", the official multilingual AI assistant of ${config.templeName}. How may I assist you with today's Arti timings, Visarjan guidelines, Mahaprasad tokens, or sacred offering auctions?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [botLang, setBotLang] = useState(currentLanguage);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const quickQuestionsByLang: Record<string, string[]> = {
    mr: [
      'आजची काकड आरती किती वाजता आहे?',
      'महाप्रसाद टोकन कधी मिळतील आणि वेळ काय आहे?',
      'साडी लिलावात सहभाग कसा घ्यावा?',
      '८०G कर सवलत देणगी पावती कशी मिळेल?',
      'विसर्जन आणि दर्शन गर्दीची सध्याची स्थिती काय आहे?',
    ],
    hi: [
      'आज की काकड़ और दोपहर आरती का समय क्या है?',
      'महाप्रसाद टोकन कब और कैसे मिलेगा?',
      'पवित्र साड़ी नीलामी में कैसे भाग लें?',
      'क्या 80G आयकर छूट वाली रसीद तुरंत मिलती है?',
      'दर्शन के लिए मंदिर में भीड़ की स्थिति क्या है?',
    ],
    gu: [
      'આજની આરતીનો સમય શું છે?',
      'મહાપ્રસાદ ટોકન ક્યારે મળશે?',
      'સાડી હરાજીમાં ભાગ કેવી રીતે લેવો?',
      'શું 80G દાન રસીદ ઓનલાઈન મળે છે?',
    ],
    en: [
      'What are today’s Arti and Darshan timings?',
      'How do I book a Mahaprasad dining token?',
      'How does the Saree & Offering live auction work?',
      'Can I get an instant Section 80G tax receipt?',
      'What is the current crowd wait time at the sanctum?',
    ],
  };

  const currentQuestions = quickQuestionsByLang[botLang] || quickQuestionsByLang.en;

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const history = messages.slice(-5).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language: botLang,
          history,
        }),
      });

      const data = await res.json();
      const replyText =
        data.reply ||
        data.fallbackReply ||
        'नमस्कार! Temple server is processing your request. Please check timings tab.';

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text:
            'नमस्कार! Temple Assistant connection is experiencing network delay. Please feel free to retry.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'reset-msg',
        role: 'assistant',
        text:
          botLang === 'mr'
            ? 'संभाषण पुन्हा सुरू केले आहे. आपण पुन्हा विचारू शकता.'
            : 'Conversation reset. How may I assist you today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-amber-800/60 rounded-2xl w-full max-w-2xl h-[85vh] flex flex-col shadow-2xl shadow-orange-950/60 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 px-4 py-3.5 border-b border-amber-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Bot className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-amber-200 text-sm sm:text-base">
                  Mandir Sevak (मंदिर सेवक)
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Active AI
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Official Multilingual Devotee Assistant • {config.templeName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Picker */}
            <div className="flex items-center gap-1 bg-stone-800 border border-stone-700 rounded-lg px-2 py-1 text-xs">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <select
                value={botLang}
                onChange={(e) => setBotLang(e.target.value)}
                className="bg-transparent text-stone-200 outline-none text-xs cursor-pointer font-medium"
              >
                <option value="en" className="bg-stone-900">English</option>
                <option value="mr" className="bg-stone-900">मराठी (Marathi)</option>
                <option value="hi" className="bg-stone-900">हिन्दी (Hindi)</option>
                <option value="gu" className="bg-stone-900">ગુજરાતી (Gujarati)</option>
              </select>
            </div>

            <button
              onClick={handleReset}
              className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
              title="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick prompt pills */}
        <div className="bg-stone-950/70 border-b border-stone-800 px-3 py-2 overflow-x-auto no-scrollbar flex gap-1.5">
          {currentQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] whitespace-nowrap bg-stone-800/80 hover:bg-amber-900/40 text-stone-300 hover:text-amber-200 border border-stone-700/60 hover:border-amber-600/40 px-2.5 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{q}</span>
            </button>
          ))}
        </div>

        {/* Message history */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-stone-900 to-stone-950">
          {messages.map((m) => {
            const isBot = m.role === 'assistant';
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="w-7 h-7 rounded-lg bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-md ${
                    isBot
                      ? 'bg-stone-800/90 text-stone-200 border border-amber-900/30 rounded-tl-sm'
                      : 'bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-tr-sm'
                  }`}
                >
                  <p>{m.text}</p>
                  <span
                    className={`block text-[10px] mt-1 text-right ${
                      isBot ? 'text-stone-400' : 'text-amber-200/80'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
                {!isBot && (
                  <div className="w-7 h-7 rounded-lg bg-orange-700/30 border border-orange-500/40 flex items-center justify-center text-orange-300 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-7 h-7 rounded-lg bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-stone-800/90 border border-amber-900/30 rounded-2xl rounded-tl-sm px-4 py-3 text-xs text-stone-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"></span>
                <span
                  className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                ></span>
                <span
                  className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"
                  style={{ animationDelay: '0.4s' }}
                ></span>
                <span className="text-stone-400 text-xs ml-1">
                  Mandir Sevak is fetching verified temple details...
                </span>
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="bg-stone-950 p-3 border-t border-stone-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder={
              botLang === 'mr'
                ? 'आरती, विसर्जन, महाप्रसाद किंवा देणगीबद्दल काहीही विचारा...'
                : botLang === 'hi'
                ? 'आरती, विसर्जन, महाप्रसाद या दान के बारे में पूछें...'
                : 'Ask anything about Arti timings, Prasad passes, Auctions, or Donations...'
            }
            className="flex-1 bg-stone-900 border border-stone-700 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-stone-100 placeholder-stone-500 outline-none transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isLoading}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all cursor-pointer shadow-md shadow-orange-950/40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

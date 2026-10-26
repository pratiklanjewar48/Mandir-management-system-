export interface TempleConfig {
  templeName: string;
  shortName: string;
  location: string;
  contactPhone: string;
  trusteeEmail: string;
  currency: string;
  currencySymbol: string;
  supportedLanguages: { code: string; name: string; native: string }[];
  modulesEnabled: {
    artiTimings: boolean;
    visarjanAlerts: boolean;
    mahaprasadTokens: boolean;
    sareeAuction: boolean;
    donationLedger: boolean;
    autoReceiptOCR: boolean;
    crowdPrediction: boolean;
  };
  aiEngine: {
    provider: string;
    model: string;
    multilingualBotEnabled: boolean;
    autoValueAuctionItems: boolean;
    fairBidSentinel: boolean;
    ocrSlipProcessor: boolean;
    smartQueueStaggering: boolean;
  };
  notificationChannels: {
    whatsapp: { enabled: boolean; priority: number; costPerMsg: number; webhookUrl: string };
    telegram: { enabled: boolean; priority: number; costPerMsg: number; channelHandle: string };
    sms: { enabled: boolean; priority: number; costPerMsg: number; senderId: string };
  };
  diningHall: {
    totalSeats: number;
    batchDurationMinutes: number;
    slots: { id: string; time: string; capacity: number; booked: number }[];
  };
}

export interface ArtiSchedule {
  id: string;
  name: string;
  marathiName: string;
  hindiName: string;
  startTime: string;
  endTime: string;
  description: string;
  crowdLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'SURGE';
  darshanAllowed: boolean;
  liveStreamActive: boolean;
}

export interface MahaprasadToken {
  tokenNumber: string;
  devoteeName: string;
  phone: string;
  slotId: string;
  slotTime: string;
  headcount: number;
  priorityCategory: 'Regular' | 'Senior Citizen' | 'Divyang / Special' | 'Temple Sevak';
  timestamp: string;
  status: 'ISSUED' | 'CHECKED_IN' | 'COMPLETED';
}

export interface DonationRecord {
  transactionId: string;
  devoteeName: string;
  devoteePhone: string;
  panNumber?: string;
  amount: number;
  paymentMode: 'UPI' | 'Cheque' | 'Cash' | 'Card' | 'NEFT';
  purpose: 'Annadan (Mahaprasad)' | 'General Temple Corpus' | 'Veda Pathshala' | 'Deity Alankaram / Puja' | 'Temple Renovation';
  date: string;
  receiptNumber: string;
  receiptStatus: 'GENERATED' | 'DISPATCHED_WHATSAPP' | 'DISPATCHED_SMS';
  taxExempt80G: boolean;
}

export interface AuctionItem {
  itemId: string;
  title: string;
  category: 'Saree' | 'Shawl' | 'Gold' | 'Silver' | 'Sacred Alankaram';
  material: string;
  primaryColors: string[];
  motifs: string;
  condition: string;
  basePrice: number;
  currentBid: number;
  highestBidderPhone: string;
  highestBidderName: string;
  highestBidderChannel: 'WhatsApp' | 'Telegram' | 'Web Portal';
  bidsCount: number;
  endTime: string;
  status: 'LIVE' | 'SCHEDULED' | 'SETTLED';
  description: string;
  tags: string[];
  imageUrl: string;
  aiSuggestedBase: number;
  aiConfidence: number;
}

export interface BidRecord {
  bidId: string;
  itemId: string;
  devoteeName: string;
  devoteePhone: string;
  bidAmount: number;
  channel: 'WhatsApp' | 'Telegram' | 'Web Portal';
  timestamp: string;
  aiRiskScore: number;
  aiRiskTier: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'APPROVED' | 'FLAGGED_FOR_REVIEW' | 'REJECTED';
  flagReason?: string;
}

export interface NotificationLog {
  id: string;
  timestamp: string;
  recipientPhone: string;
  channelAttempted: 'WhatsApp' | 'Telegram' | 'SMS';
  channelDelivered: 'WhatsApp' | 'Telegram' | 'SMS';
  purpose: 'Arti Reminder' | 'Prasad Token' | 'Auction Outbid' | '80G Receipt';
  messageText: string;
  costIncurred: number;
  status: 'DELIVERED' | 'FALLBACK_USED' | 'FAILED';
}

export const INITIAL_ARTIS: ArtiSchedule[] = [
  {
    id: 'arti-1',
    name: 'Kakad Arti',
    marathiName: 'काकड आरती',
    hindiName: 'काकड़ आरती',
    startTime: '05:30 AM',
    endTime: '06:00 AM',
    description: 'Auspicious morning awakening arti of the Lord with conch shells and sacred chants.',
    crowdLevel: 'HIGH',
    darshanAllowed: true,
    liveStreamActive: true,
  },
  {
    id: 'arti-2',
    name: 'Madhyahn Bhog Arti',
    marathiName: 'माध्यान्ह भोग आरती',
    hindiName: 'मध्याह्न भोग आरती',
    startTime: '12:05 PM',
    endTime: '12:35 PM',
    description: 'Noon sacred offerings of traditional Modak and consecrated Naivedya to the deity.',
    crowdLevel: 'SURGE',
    darshanAllowed: true,
    liveStreamActive: true,
  },
  {
    id: 'arti-3',
    name: 'Sandhya Dhoop Arti',
    marathiName: 'संध्या धूप आरती',
    hindiName: 'संध्या धूप आरती',
    startTime: '07:00 PM',
    endTime: '07:35 PM',
    description: 'Evening sunset arti with sacred fragrant dhoop, camphor lamps, and devotional bhajans.',
    crowdLevel: 'SURGE',
    darshanAllowed: true,
    liveStreamActive: true,
  },
  {
    id: 'arti-4',
    name: 'Shej Arti',
    marathiName: 'शेज आरती',
    hindiName: 'शेज आरती',
    startTime: '09:50 PM',
    endTime: '10:20 PM',
    description: 'Night slumber arti concluding the daily temple rituals before the sanctum doors close.',
    crowdLevel: 'MODERATE',
    darshanAllowed: true,
    liveStreamActive: false,
  },
];

export const INITIAL_AUCTIONS: AuctionItem[] = [
  {
    itemId: 'auc-101',
    title: 'Blessed Yeola Paithani Pure Silk Saree with Peacock Border',
    category: 'Saree',
    material: 'Pure Mulberry Silk & Antique Golden Zari',
    primaryColors: ['Deep Maroon', 'Antique Gold', 'Emerald Green'],
    motifs: 'Royal Asavali Peacock (Mor) Pallu with Kanthi Border',
    condition: 'Pristine Sanctum Sanctified Offering',
    basePrice: 8500,
    currentBid: 14200,
    highestBidderName: 'Sunita Rajesh Kulkarni',
    highestBidderPhone: '+91 98201 49821',
    highestBidderChannel: 'WhatsApp',
    bidsCount: 16,
    endTime: new Date(Date.now() + 1800000).toISOString(), // 30 mins from now
    status: 'LIVE',
    description: 'Sacred handloom Paithani saree offered at the sanctum sanctorum during Ganesh Chaturthi. Woven with pure silk threads and traditional gold zari pallu.',
    tags: ['Paithani', 'Mulberry Silk', 'Gold Zari', 'Temple Offering', 'Handloom'],
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    aiSuggestedBase: 8500,
    aiConfidence: 96,
  },
  {
    itemId: 'auc-102',
    title: 'Sanctified 92.5 Sterling Silver Mukut (Crown) with Floral Engravings',
    category: 'Silver',
    material: '92.5 Hallmark Sterling Silver (420 grams)',
    primaryColors: ['Mirror Silver Finish'],
    motifs: 'Sacred Trishul & Kalash Nakashi Chased Work',
    condition: 'Handcrafted Heritage Masterpiece',
    basePrice: 22000,
    currentBid: 34500,
    highestBidderName: 'Venkatesh Rao',
    highestBidderPhone: '+91 94480 32190',
    highestBidderChannel: 'Telegram',
    bidsCount: 22,
    endTime: new Date(Date.now() + 4500000).toISOString(),
    status: 'LIVE',
    description: 'Exquisite silver crown adorned on the Lord during Special Purnima Abhishek. Hand-carved by master silversmiths with hallmark purity certification.',
    tags: ['Silver Crown', 'Mukut', 'Hallmark 925', 'Sacred Alankaram'],
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    aiSuggestedBase: 22000,
    aiConfidence: 94,
  },
  {
    itemId: 'auc-103',
    title: 'Blessed Kanjeevaram Bridal Silk Saree with Temple Korvai Border',
    category: 'Saree',
    material: 'Kanchipuram Heavy Silk with Silver-Gold Tested Zari',
    primaryColors: ['Royal Blue', 'Vermillion Crimson'],
    motifs: 'Rudraksha and Mayil (Peacock) Korvai Weave',
    condition: 'Pristine Divine Offering',
    basePrice: 12000,
    currentBid: 16500,
    highestBidderName: 'Meenakshi Iyer',
    highestBidderPhone: '+91 98410 77621',
    highestBidderChannel: 'Web Portal',
    bidsCount: 9,
    endTime: new Date(Date.now() + 7200000).toISOString(),
    status: 'LIVE',
    description: 'Grand Kanjeevaram silk saree presented to the Mother Goddess altar. Genuine 3-ply twisted silk with heavy pallu craftsmanship.',
    tags: ['Kanjeevaram', 'Korvai', 'Temple Border', 'Silk'],
    imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    aiSuggestedBase: 12000,
    aiConfidence: 98,
  },
  {
    itemId: 'auc-104',
    title: 'Handcrafted Kashmiri Pashmina Cashmere Shawl with Sozni Needlework',
    category: 'Shawl',
    material: '100% Changthangi Grade-A Cashmere Wool',
    primaryColors: ['Natural Cream', 'Amber Gold', 'Ruby Thread'],
    motifs: 'Jamawar Paisley and Floral Chinar Leaf Needlework',
    condition: 'Supreme Hand-Spun Elegance',
    basePrice: 9500,
    currentBid: 11000,
    highestBidderName: 'Harpreet Singh Sethi',
    highestBidderPhone: '+91 98111 65420',
    highestBidderChannel: 'WhatsApp',
    bidsCount: 5,
    endTime: new Date(Date.now() + 10800000).toISOString(),
    status: 'LIVE',
    description: 'Devotional offering of pure Kashmiri Pashmina shawl. Exquisite needle embroidery requiring over 180 days of artisan dedication.',
    tags: ['Pashmina', 'Cashmere', 'Sozni', 'Handloom'],
    imageUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80',
    aiSuggestedBase: 9500,
    aiConfidence: 95,
  },
];

export const INITIAL_DONATIONS: DonationRecord[] = [
  {
    transactionId: 'TXN-9021841',
    devoteeName: 'Anand Gopal Joshi',
    devoteePhone: '+91 98220 54109',
    panNumber: 'ABCDE1234F',
    amount: 11000,
    paymentMode: 'UPI',
    purpose: 'Annadan (Mahaprasad)',
    date: '2026-10-26',
    receiptNumber: 'TMS-80G-2026-0841',
    receiptStatus: 'DISPATCHED_WHATSAPP',
    taxExempt80G: true,
  },
  {
    transactionId: 'TXN-9021842',
    devoteeName: 'Kishore M. Shah & Family',
    devoteePhone: '+91 99201 88472',
    panNumber: 'AKLPX8734Q',
    amount: 25000,
    paymentMode: 'Cheque',
    purpose: 'Temple Renovation',
    date: '2026-10-26',
    receiptNumber: 'TMS-80G-2026-0842',
    receiptStatus: 'DISPATCHED_WHATSAPP',
    taxExempt80G: true,
  },
  {
    transactionId: 'TXN-9021843',
    devoteeName: 'Sumantha Radhakrishnan',
    devoteePhone: '+91 98450 12984',
    amount: 5100,
    paymentMode: 'UPI',
    purpose: 'Deity Alankaram / Puja',
    date: '2026-10-25',
    receiptNumber: 'TMS-80G-2026-0843',
    receiptStatus: 'DISPATCHED_SMS',
    taxExempt80G: true,
  },
  {
    transactionId: 'TXN-9021844',
    devoteeName: 'Rameshwar Patil Trust',
    devoteePhone: '+91 98230 44109',
    panNumber: 'AAETR5519P',
    amount: 51000,
    paymentMode: 'NEFT',
    purpose: 'Veda Pathshala',
    date: '2026-10-25',
    receiptNumber: 'TMS-80G-2026-0844',
    receiptStatus: 'DISPATCHED_WHATSAPP',
    taxExempt80G: true,
  },
  {
    transactionId: 'TXN-9021845',
    devoteeName: 'Pooja Nitin Deshmukh',
    devoteePhone: '+91 97654 32100',
    amount: 2100,
    paymentMode: 'Cash',
    purpose: 'Annadan (Mahaprasad)',
    date: '2026-10-25',
    receiptNumber: 'TMS-80G-2026-0845',
    receiptStatus: 'GENERATED',
    taxExempt80G: true,
  },
];

export const SAMPLE_OFFERING_PRESETS = [
  {
    name: 'Yeola Paithani Silk Saree',
    category: 'Saree',
    material: 'Pure Mulberry Silk with Golden Zari',
    url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    color: 'Crimson Red with Antique Gold',
    hint: 'Handwoven Paithani with authentic peacock pallu',
  },
  {
    name: 'South Indian Kanjeevaram Silk',
    category: 'Saree',
    material: 'Pure Handloom Kanchipuram Silk',
    url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    color: 'Royal Blue and Gold Korvai Border',
    hint: 'Sacred altar offering Kanjeevaram sari',
  },
  {
    name: '92.5 Hallmarked Silver Deity Crown (Mukut)',
    category: 'Silver',
    material: '92.5 Sterling Silver with Nakashi Enameling',
    url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    color: 'Silver Bright Polish',
    hint: 'Deity ornamental mukut with peacock feather motif',
  },
  {
    name: 'Kashmiri Hand-Embroidered Pashmina Shawl',
    category: 'Shawl',
    material: 'Grade-A Cashmere Pashmina',
    url: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80',
    color: 'Cream with Multi-Color Sozni Embroidery',
    hint: 'Imperial Jamawar Kashmiri Pashmina wrap',
  },
];

export const SAMPLE_RECEIPT_SLIPS = [
  {
    title: 'HDFC Bank Cheque Slip - ₹25,000',
    type: 'Cheque',
    donor: 'Mahesh B. Kulkarni',
    bank: 'HDFC Bank Ltd, Prabhadevi Branch',
    ref: 'CHQ-882194',
    amount: 25000,
    purpose: 'Annadan (Mahaprasad)',
    date: '2026-10-24',
    previewUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'State Bank of India UPI Transfer Screenshot - ₹11,000',
    type: 'UPI',
    donor: 'Prakash Chandra Sharma',
    bank: 'State Bank of India',
    ref: 'UPI/629011883921/CR',
    amount: 11000,
    purpose: 'Temple Renovation',
    date: '2026-10-25',
    previewUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'ICICI Bank Deposit Counterfoil - ₹51,000',
    type: 'Bank Slip',
    donor: 'Laxmi Narayan Charitable Trust',
    bank: 'ICICI Bank',
    ref: 'UTR-ICIC2026102599',
    amount: 51000,
    purpose: 'Veda Pathshala',
    date: '2026-10-26',
    previewUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=700&q=80',
  },
];

export const TEMPLE_PRESETS = [
  {
    id: 'siddhivinayak',
    name: 'Shree Siddhivinayak Temple Trust',
    city: 'Mumbai, Maharashtra',
    languages: ['mr', 'hi', 'en', 'gu'],
    deity: 'Lord Shree Ganesha',
    accent: 'amber',
  },
  {
    id: 'somnath',
    name: 'Shree Somnath Jyotirlinga Temple Trust',
    city: 'Prabhas Patan, Gujarat',
    languages: ['gu', 'hi', 'en'],
    deity: 'Lord Somnath (Shiva)',
    accent: 'emerald',
  },
  {
    id: 'tirupati',
    name: 'Tirumala Tirupati Devasthanams (TTD)',
    city: 'Tirupati, Andhra Pradesh',
    languages: ['te', 'ta', 'en', 'hi', 'kn'],
    deity: 'Lord Sri Venkateswara (Balaji)',
    accent: 'yellow',
  },
  {
    id: 'kashi',
    name: 'Shri Kashi Vishwanath Temple Trust',
    city: 'Varanasi, Uttar Pradesh',
    languages: ['hi', 'en', 'sa'],
    deity: 'Lord Shiva (Vishwanath)',
    accent: 'orange',
  },
];

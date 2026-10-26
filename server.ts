import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Increase payload limit for image uploads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Server-side Gemini initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const CONFIG_PATH = path.resolve(process.cwd(), 'temple.config.json');

function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading temple.config.json:', err);
  }
  return {
    templeName: 'Shree Siddhivinayak Temple Trust',
    location: 'Mumbai, Maharashtra, India',
    currency: 'INR',
    supportedLanguages: ['en', 'hi', 'mr', 'gu'],
  };
}

// 1. Get temple configuration
app.get('/api/temple/config', (req: Request, res: Response) => {
  const config = loadConfig();
  res.json(config);
});

// 2. Update temple configuration
app.post('/api/temple/config', (req: Request, res: Response) => {
  try {
    const updated = req.body;
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(updated, null, 2), 'utf-8');
    res.json({ success: true, config: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update config: ' + err.message });
  }
});

// 3. AI Multilingual Devotee Assistant
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  try {
    const { message, language = 'en', history = [] } = req.body;
    const config = loadConfig();

    const systemInstruction = `You are "Mandir Sevak", the official multilingual AI assistant of ${config.templeName} located at ${config.location}.
Your primary role is to answer queries from devotees regarding:
1. Daily Arti Timings: Kakad Arti (05:30 AM), Madhyahn Bhog Arti (12:05 PM), Sandhya Dhoop Arti (07:00 PM), Shej Arti (09:50 PM).
2. Visarjan & Festival Alerts: Angarki Sankashti Chaturthi, Ganesh Chaturthi, Hanuman Jayanti, Maha Shivratri, special darshan guidelines.
3. Mahaprasad (Prasad Dining): Free Bhojanalaya tokens distributed daily from 09:00 AM. Slots run from 11:30 AM to 02:30 PM and 07:30 PM to 08:30 PM.
4. Offerings & Saree / Gold Auction: Devotees can bid online via WhatsApp, Telegram, or Web. Live auction runs every weekend for gifted sacred sarees and ornaments.
5. Donations & Tax Exemptions: All donations are 100% transparent and eligible for Section 80G Indian Income Tax exemption with automated instant digital receipt.

Language instruction:
- The devotee prefers responses in language code: "${language}" (e.g., 'mr' for Marathi, 'hi' for Hindi, 'gu' for Gujarati, 'en' for English).
- Always answer respectfully in the devotee's chosen language with warm, devotional greetings (e.g. "जय श्री गणेश", "नमस्कार", "ॐ नमः शिवाय", "जय श्री कृष्ण").
- Be concise, helpful, and dignified. Include actionable guidance if they ask how to book or participate.`;

    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      history.slice(-6).forEach((h: any) => {
        contents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }],
        });
      });
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      reply: response.text || 'प्रणाम! आम्ही आपल्या सेवेत आहोत. कृपया पुन्हा विचारा.',
    });
  } catch (err: any) {
    console.error('AI chat error:', err);
    res.status(500).json({
      error: 'AI assistant service temporary delay: ' + (err.message || 'Unknown error'),
      fallbackReply: 'नमस्कार! Temple assistant is connecting. Please check Arti timings on the dashboard.',
    });
  }
});

// 4. Computer Vision AI: Saree & Sacred Offering Cataloging
app.post('/api/ai/vision-tag', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', itemNameHint = '' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required' });
    }

    // Strip prefix if included
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, '');

    const prompt = `Analyze this donated sacred temple offering (clothing, saree, shawl, ornament, metal vessel, or jewelry).
Item name hint if provided: "${itemNameHint}".
Perform expert temple auction cataloging:
1. Identify the exact category: "Saree", "Shawl", "Gold", "Silver", or "Sacred Alankaram".
2. Determine material/fabric: e.g., "Pure Paithani Silk with Zari", "Banarasi Katan Silk", "Kanjeevaram Silk", "Fine Cashmere / Pashmina", "22K Gold Foil", "Sterling 92.5 Silver".
3. Detect primary colors and intricate motifs (e.g., Mayur/Peacock, Lotus, Temple Border, Paisley, Floral Jaal).
4. Craft & weave style heritage (e.g., Yeola, Varanasi, Kanchipuram, Kashmir).
5. Quality/Condition assessment: "Pristine Unworn Sacred Offering", "Excellent Handloom Heritage".
6. Generate a reverent, attractive auction title.
7. Generate a 2-3 sentence auction catalog description honoring the deity and craftsmanship.
8. Suggest a fair starting base auction reserve price in Indian Rupees (INR) between ₹1,500 and ₹50,000 depending on richness.
9. Suggest recommended bid increment (e.g. ₹200, ₹500, ₹1,000).
10. Generate 4-6 search tags (e.g. ["Paithani", "Pure Silk", "Gold Zari", "Temple Offering", "Handloom"]).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, description: 'Saree, Shawl, Gold, Silver, or Sacred Alankaram' },
            title: { type: Type.STRING, description: 'Sacred auction title' },
            material: { type: Type.STRING, description: 'Material or fabric weave' },
            primaryColors: { type: Type.ARRAY, items: { type: Type.STRING } },
            motifs: { type: Type.STRING, description: 'Notable motifs or borders' },
            condition: { type: Type.STRING },
            suggestedBasePrice: { type: Type.INTEGER, description: 'Base price in INR' },
            recommendedIncrement: { type: Type.INTEGER, description: 'Minimum bid step in INR' },
            description: { type: Type.STRING, description: 'Full catalog description' },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['category', 'title', 'material', 'suggestedBasePrice', 'description', 'tags'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, item: parsed });
  } catch (err: any) {
    console.error('Vision tag error:', err);
    res.status(500).json({ error: 'Vision AI failed: ' + (err.message || 'Unknown error') });
  }
});

// 5. Fair-Bid AI Sentinel: Live Bidding Stream Anomaly & Fraud Detection
app.post('/api/ai/sentinel-check', async (req: Request, res: Response) => {
  try {
    const { bidAmount, previousBid, devoteePhone, devoteeName, auctionItemTitle, bidVelocityCount = 1 } = req.body;

    const prompt = `You are "Fair-Bid Sentinel", an automated auction integrity AI for sacred temple offering auctions.
Evaluate this incoming bid for fraud, snipe bots, or unnatural bidding irregularities:
- Item: "${auctionItemTitle}"
- Current Leading Bid: ₹${previousBid}
- Incoming Bid: ₹${bidAmount}
- Devotee Phone: "${devoteePhone}"
- Devotee Name: "${devoteeName}"
- Bids placed by this phone in last 60 seconds: ${bidVelocityCount}

Rules & Heuristics:
1. Normal bid: Increments between 2% and 50% above current bid.
2. Suspicious Jump: If incoming bid is > 300% of current bid without prior bidding history, risk is High.
3. Bot Velocity: If > 4 bids within 5 seconds, velocity anomaly detected.
4. Fake phone: Incomplete phone digits or spam numbers.

Return risk score (0 to 100), risk tier ("LOW", "MEDIUM", "HIGH", "CRITICAL"), decision ("APPROVED", "FLAGGED_FOR_TRUSTEE_REVIEW", "REJECTED_ANOMALY"), and a clear trustee reason summary.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: { type: Type.INTEGER, description: '0 to 100 risk score' },
            riskTier: { type: Type.STRING, description: 'LOW, MEDIUM, HIGH, CRITICAL' },
            decision: { type: Type.STRING, description: 'APPROVED, FLAGGED_FOR_TRUSTEE_REVIEW, REJECTED_ANOMALY' },
            flagReason: { type: Type.STRING, description: 'Short technical rationale' },
            trusteeRecommendation: { type: Type.STRING, description: 'Advice for the temple admin' },
          },
          required: ['riskScore', 'riskTier', 'decision', 'flagReason', 'trusteeRecommendation'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, sentinel: parsed });
  } catch (err: any) {
    console.error('Fair-Bid Sentinel error:', err);
    res.status(500).json({ error: 'Sentinel check failed: ' + err.message });
  }
});

// 6. Auto-Receipt OCR: Extracts cheque / payment slip details for instant ledger entry
app.post('/api/ai/ocr-receipt', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 required' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, '');

    const prompt = `You are an expert OCR and financial ledger parsing engine for Indian Temple Trusts.
Analyze this image of a bank cheque, UPI payment screenshot, or bank deposit counterfoil.
Extract the following donation fields accurately:
- Donor/Devotee Name (Payee/Payer)
- Amount in INR (both numerical and words if available)
- Payment Mode: "Cheque", "UPI", "NEFT / RTGS", "Bank Counterfoil"
- Bank Name (e.g. State Bank of India, HDFC Bank, ICICI Bank, Bank of Baroda, etc.)
- Cheque Number OR UTR / Transaction Reference ID
- Date of Payment (format YYYY-MM-DD or DD/MM/YYYY)
- Suggested Donation Purpose: "Annadan (Mahaprasad)", "General Temple Corpus", "Veda Pathshala", "Deity Alankaram / Puja", "Temple Renovation"
- Confidence score (0 to 100)
- Notes / Verification warnings (if signature or date is unclear)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            donorName: { type: Type.STRING },
            amount: { type: Type.NUMBER },
            paymentMode: { type: Type.STRING },
            bankName: { type: Type.STRING },
            referenceNumber: { type: Type.STRING, description: 'Cheque No or UTR' },
            paymentDate: { type: Type.STRING },
            purpose: { type: Type.STRING },
            confidence: { type: Type.INTEGER },
            verificationNotes: { type: Type.STRING },
          },
          required: ['donorName', 'amount', 'paymentMode', 'referenceNumber', 'confidence'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, receipt: parsed });
  } catch (err: any) {
    console.error('Auto-receipt OCR error:', err);
    res.status(500).json({ error: 'OCR processing failed: ' + err.message });
  }
});

// 7. Dynamic Crowd Prediction & Mahaprasad Queue Optimization
app.post('/api/ai/crowd-prediction', async (req: Request, res: Response) => {
  try {
    const { targetDate = new Date().toISOString(), isSpecialTithi = true } = req.body;
    const config = loadConfig();

    const prompt = `You are the Crowd Analytics & Queue Optimizer AI for ${config.templeName}.
Analyze temple crowd traffic for:
- Date: ${targetDate}
- Special Occasion / Tithi: ${isSpecialTithi ? 'Sankashti Chaturthi / Festival Rush' : 'Regular Weekday'}
- Dining Hall Capacity: ${config.diningHall?.totalSeats || 350} seats per batch

Generate:
1. Expected total footfall estimate for the day.
2. Peak rush hours (e.g. Morning 06:00-08:30 during Kakad Arti, Evening 06:30-08:45 during Sandhya Arti).
3. Current crowd status level: "LOW", "MODERATE", "HEAVY", "SURGE / PEAK".
4. Estimated average sanctum wait time in minutes (e.g., 25 vs 90 mins).
5. Dynamic Mahaprasad Staggering Recommendation: How to stagger token distribution across 5 dining batches to eliminate hallway bottlenecks.
6. Devotee advice broadcast tip in Marathi & English.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            totalEstimatedDevotees: { type: Type.INTEGER },
            currentCrowdLevel: { type: Type.STRING, description: 'LOW, MODERATE, HEAVY, SURGE' },
            averageWaitMinutes: { type: Type.INTEGER },
            peakRushWindows: { type: Type.ARRAY, items: { type: Type.STRING } },
            diningStaggerStrategy: { type: Type.STRING },
            recommendedBatchAllocations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  slotTime: { type: Type.STRING },
                  recommendedTokens: { type: Type.INTEGER },
                  rationale: { type: Type.STRING },
                },
                required: ['slotTime', 'recommendedTokens', 'rationale'],
              },
            },
            broadcastAdvice: {
              type: Type.OBJECT,
              properties: {
                english: { type: Type.STRING },
                marathi: { type: Type.STRING },
              },
              required: ['english', 'marathi'],
            },
          },
          required: [
            'totalEstimatedDevotees',
            'currentCrowdLevel',
            'averageWaitMinutes',
            'peakRushWindows',
            'diningStaggerStrategy',
            'broadcastAdvice',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, crowdPrediction: parsed });
  } catch (err: any) {
    console.error('Crowd prediction error:', err);
    res.status(500).json({ error: 'Crowd prediction failed: ' + err.message });
  }
});

// Setup Vite dev server or static files
async function startServer() {
  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.resolve(process.cwd(), 'dist'))) {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Temple Management System server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

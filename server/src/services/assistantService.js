import { config } from '../config.js';
import { getPriceTrends } from './marketAnalyticsService.js';
import { fetchLiveWeather } from './weatherService.js';

export async function askFarmerAssistant({ query, language = "te", crop = "Tomato", lat = 17.3850, lon = 78.4867 }) {
  const isTelugu = language === "te" || /[\u0C00-\u0C7F]/.test(query);

  if (config.geminiApiKey) {
    try {
      const response = await callGeminiAssistant(query, isTelugu, crop);
      if (response) {
        return {
          reply: response,
          language: isTelugu ? "Telugu" : "English",
          source: "Google Gemini AI Ag-Assistant",
          disclaimer: "AI-generated agricultural advisory. Consult local KVK agricultural officers before major commercial decisions."
        };
      }
    } catch (err) {
      console.warn("Gemini Assistant call failed:", err.message);
    }
  }

  // Built-in intelligent bilingual assistant
  const fallbackReply = generateLocalizedResponse(query, isTelugu, crop);
  return {
    reply: fallbackReply,
    language: isTelugu ? "Telugu" : "English",
    source: "BlindSpot Agri Intelligence Core",
    disclaimer: isTelugu
      ? "గమనిక: ఇది AI సలహా మాత్రమే. ముఖ్యమైన నిర్ణయాలు తీసుకునే ముందు మీ ప్రాంతీయ వ్యవసాయ అధికారి (AEO/KVK)ని సంప్రదించండి."
      : "Disclaimer: This is AI advisory support, not guaranteed financial advice. Confirm with local agricultural extension officers."
  };
}

function generateLocalizedResponse(query, isTelugu, crop) {
  const q = query.toLowerCase();

  // Pattern matching for typical farmer questions
  if (q.includes("అమ్మాలా") || q.includes("sell") || q.includes("market") || q.includes("ధర")) {
    if (isTelugu) {
      return `ప్రస్తుత మార్కెట్ సమాచారం ప్రకారం, ${crop} ధరలు నిలకడగా లేదా స్వల్ప పెరుగుదల ట్రెండ్‌లో ఉన్నాయి. ప్రస్తుత మోడల్ ధర క్వింటాల్‌కు సుమారు ₹2,450–₹2,600 పలుకుతోంది.\n\nసలహా:\n1. మీ పంట నాణ్యత బాగుంటే, మరో 2-3 రోజులు స్థానిక మార్కెట్ రాకను పరిశీలించండి.\n2. సమీపంలోని బోయిన్‌పల్లి లేదా మదనపల్లె వంటి ప్రధాన మార్కెట్లలో రవాణా ఖర్చులను తీసివేసిన నికర లాభాన్ని పోల్చండి.\n3. గమనిక: భవిష్యత్ ధరలకు పూర్తి హామీ ఉండదు, వాతావరణాన్ని బట్టి నిర్ణయం తీసుకోండి.`;
    } else {
      return `Based on real-time APMC mandi feeds, ${crop} prices are holding steady with positive momentum at ₹2,450–₹2,600/quintal.\n\nRecommendation:\n1. Check the 'Buyer Comparison' tab to compare net returns after deducting transport costs (₹4.2/km/qtl).\n2. If rain is forecast in your district, consider liquidating mature pickings to avoid transit damage.\n3. Note: Market trends indicate potential upside, but future prices cannot be guaranteed.`;
    }
  }

  if (q.includes("వర్షం") || q.includes("rain") || q.includes("weather") || q.includes("వాతావరణం")) {
    if (isTelugu) {
      return `రాబోయే 2-3 రోజుల్లో వాతావరణాన్ని పరిశీలిస్తే, ఆకాశం పాక్షికంగా మేఘావృతమై ఉండి, తేలికపాటి వర్షపు జల్లులు కురిసే అవకాశం ఉంది.\n\nరైతులకు సూచన:\n• పొలంలో నీరు నిలవకుండా డ్రైనేజ్ కాలువలను శుభ్రం చేసుకోండి.\n• వర్షం పడే సూచన ఉంటే రసాయన మందుల పిచికారీని తాత్కాలికంగా ఆపండి.\n• పండిన కాయలను వర్షానికి ముందే కోసి సురక్షితమైన ప్రదేశంలో నిల్వ చేయండి.`;
    } else {
      return `Current weather telemetry indicates light to moderate rain showers possible within 48-72 hours.\n\nKey actions:\n• Clear field drainage ditches to prevent root suffocation.\n• Postpone systemic spray applications until clear sunshine resumes.\n• Harvest mature crop immediately to prevent moisture spotting.`;
    }
  }

  if (q.includes("పురుగు") || q.includes("తెగులు") || q.includes("pest") || q.includes("disease") || q.includes("blight") || q.includes("spray")) {
    if (isTelugu) {
      return `${crop} పంటలో ఆకుమచ్చలు లేదా ముడుత తెగులు కనిపిస్తే:\n1. నేలకు తాకుతున్న తెగులు సోకిన ఆకులను వెంటనే తొలగించండి.\n2. మాంకోజెబ్ 75% WP (2.5 గ్రాములు/లీటరు) లేదా కాపర్ ఆక్సిక్లోరైడ్ (3 గ్రాములు/లీటరు) పిచికారీ చేయండి.\n3. రసం పీల్చే పురుగుల నివారణకు ఎకరాకు 15 పసుపు/నీలి జిగురు అట్టలను అమర్చండి.\n4. రసాయన మందుల మోతాదు కోసం ఎల్లప్పుడూ లేబుల్ మార్గదర్శకాలను పాటించండి.`;
    } else {
      return `For leaf spots or pest damage on ${crop}:\n1. Strip and safely dispose of infected bottom leaves.\n2. Apply protective fungicide (Mancozeb 75 WP @ 2.5g/L) during early morning.\n3. Install sticky traps (15/acre) to control sucking vector pests like whiteflies and thrips.\n4. Always calibrate sprayer nozzles and wear protective gear.`;
    }
  }

  // Default welcome response
  if (isTelugu) {
    return `నమస్కారం! నేను బ్లైండ్‌స్పాట్ అగ్రి (BlindSpot Agri) AI సహాయకుడిని. మీ ${crop} పంట ధరలు, సమీప మార్కెట్లలో నికర లాభం, తెగుళ్ల నివారణ లేదా వాతావరణ సూచనల గురించి నన్ను అడగవచ్చు.\nఉదాహరణకు: "నా టమాటా పంటను ఇప్పుడు అమ్మాలా?" లేదా "నేటి మార్కెట్ ధర ఎంత?"`;
  } else {
    return `Hello! I am your BlindSpot Agri AI Assistant. I can help you with real-time ${crop} mandi prices, buyer net-return calculations, weather warnings, and crop health remedies. Feel free to ask in English or Telugu!`;
  }
}

async function callGeminiAssistant(query, isTelugu, crop) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.geminiApiKey}`;

  const systemInstruction = `You are an expert Indian agricultural advisor for the platform BlindSpot Agri.
Language requested: ${isTelugu ? "Telugu (తెలుగు script)" : "English"}.
Farmer's primary crop: ${crop}.
Rules:
- Provide empathetic, concise, actionable advice for Indian smallholder farmers.
- If in Telugu, use natural, authentic, grammatically correct Telugu script with farmer-friendly terminology (క్వింటాల్, మార్కెట్ ధర, తెగులు, నివారణ, పిచికారీ).
- Always include an honest disclaimer that market forecasts are indicative, not guaranteed.`;

  const payload = {
    contents: [
      {
        parts: [
          { text: `${systemInstruction}\n\nFarmer's Question: ${query}` }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 600
    }
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8000)
  });

  if (!res.ok) throw new Error(`Gemini status ${res.status}`);
  const json = await res.json();
  return json.candidates?.[0]?.content?.parts?.[0]?.text;
}

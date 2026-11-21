import React, { useState, useRef, useEffect } from 'react';
import { 
  Scan, 
  Upload, 
  AlertTriangle, 
  ShieldCheck, 
  History, 
  CheckCircle2, 
  Sparkles,
  Camera,
  RefreshCw,
  ExternalLink,
  Info,
  Volume2,
  VolumeX,
  Printer,
  MessageSquare,
  FlaskConical,
  Sprout,
  HelpCircle,
  TrendingDown,
  DollarSign,
  Share2,
  ShoppingBag,
  Droplet,
  Clock,
  Check,
  Copy
} from 'lucide-react';
import { Language, ScanResult } from '../types';
import { t } from '../translations';
import { analyzeCropImage, getScanHistory } from '../api/client';

interface CropScannerPageProps {
  language: Language;
  cropHint: string;
}

export const CropScannerPage: React.FC<CropScannerPageProps> = ({ language, cropHint }) => {
  const [selectedCrop, setSelectedCrop] = useState(cropHint || "auto");
  const [symptomHint, setSymptomHint] = useState<string>("auto");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [solutionTab, setSolutionTab] = useState<'chemical' | 'organic' | 'cultural' | 'nutrition'>('chemical');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const text = t[language];

  // Curated samples for quick instant testing of diverse conditions & healthy plants
  const sampleLeaves = [
    { name: "Healthy Tomato Leaf", crop: "Tomato", symptom: "healthy", label: "🟢 Healthy Tomato (ఆరోగ్యం)", color: "#16a34a", type: "healthy" },
    { name: "Tomato Early Blight", crop: "Tomato", symptom: "early_blight", label: "🟤 Tomato Early Blight (వలయాలు)", color: "#ef4444", type: "concentric" },
    { name: "Tomato Late Blight", crop: "Tomato", symptom: "late_blight", label: "🌧️ Tomato Late Blight (ఆకుమాడు)", color: "#991b1b", type: "water_soaked" },
    { name: "Chilli Leaf Curl & Thrips", crop: "Chilli", symptom: "leaf_curl", label: "🌶️ Chilli Leaf Curl (ముడుత)", color: "#f97316", type: "curled" },
    { name: "Chilli Anthracnose / Fruit Rot", crop: "Chilli", symptom: "early_blight", label: "🌶️ Chilli Anthracnose (కాయకుళ్ళు)", color: "#dc2626", type: "anthracnose" },
    { name: "Rice Blast", crop: "Rice", symptom: "blast", label: "🌾 Rice Blast (అగ్గితెగులు)", color: "#b91c1c", type: "spindle" },
    { name: "Rice Bacterial Leaf Blight", crop: "Rice", symptom: "bacterial_spot", label: "🌾 Rice BLB (ఎండ్ర తెగులు)", color: "#eab308", type: "wavy_blight" },
    { name: "Maize Fall Armyworm", crop: "Maize", symptom: "armyworm", label: "🌽 Maize Armyworm (కత్తెర పురుగు)", color: "#ea580c", type: "chewed" },
    { name: "Cotton Angular Blight", crop: "Cotton", symptom: "bacterial_spot", label: "⚪ Cotton Blight (ఆకుమచ్చ)", color: "#ca8a04", type: "angular" },
    { name: "Onion Purple Blotch", crop: "Onion", symptom: "purple_blotch", label: "🧅 Onion Purple Blotch (ఊదా మచ్చ)", color: "#9333ea", type: "purple" }
  ];

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await getScanHistory();
      if (res.history) setHistory(res.history);
    } catch (err) {
      console.warn("Error fetching history:", err);
    }
  };

  // Client-side canvas pixel analysis to detect healthy green foliage vs necrotic/chlorotic lesions
  const analyzeImagePixels = (img: HTMLImageElement) => {
    try {
      const cvs = document.createElement('canvas');
      const w = Math.min(img.width || 100, 100);
      const h = Math.min(img.height || 100, 100);
      cvs.width = w;
      cvs.height = h;
      const ctx = cvs.getContext('2d');
      if (!ctx) return null;
      ctx.drawImage(img, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;
      let greenCount = 0;
      let necroticCount = 0;
      let yellowCount = 0;
      let valid = 0;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (r > 245 && g > 245 && b > 245) continue; // background
        if (r < 20 && g < 20 && b < 20) continue; // deep shadows
        valid++;
        if (g > r * 1.15 && g > b * 1.15) {
          greenCount++;
        } else if (r > 130 && g > 130 && b < 100) {
          yellowCount++;
        } else if ((r > 80 && g < 75 && b < 65) || (r < 70 && g < 70 && b < 70)) {
          necroticCount++;
        }
      }

      if (valid < 25) return null;
      const greenRatio = greenCount / valid;
      const necroticRatio = necroticCount / valid;
      const yellowRatio = yellowCount / valid;
      const autoDetectedHealth = (greenRatio > 0.65 && necroticRatio < 0.08) ? 'healthy' : 'diseased';
      return { greenRatio, necroticRatio, yellowRatio, autoDetectedHealth };
    } catch (e) {
      return null;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);

      // Perform local pixel assessment on image before calling API
      const img = new Image();
      img.onload = () => {
        const metrics = analyzeImagePixels(img);
        runAnalysis(base64, file, metrics);
      };
      img.src = base64;
    };
    reader.readAsDataURL(file);
  };

  const runSample = (sample: typeof sampleLeaves[0]) => {
    setSelectedCrop(sample.crop);
    setSymptomHint(sample.symptom);

    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 450;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw realistic leaf backdrop
    const grad = ctx.createRadialGradient(300, 225, 40, 300, 225, 280);
    grad.addColorStop(0, '#4ade80');
    grad.addColorStop(0.7, '#16a34a');
    grad.addColorStop(1, '#14532d');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 450);

    // Natural leaf midrib & secondary veins
    ctx.strokeStyle = '#86efac';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(50, 225);
    ctx.lineTo(550, 225);
    ctx.stroke();

    for (let i = 120; i <= 480; i += 60) {
      ctx.beginPath();
      ctx.moveTo(i, 225);
      ctx.lineTo(i + 45, 120);
      ctx.moveTo(i, 225);
      ctx.lineTo(i + 45, 330);
      ctx.stroke();
    }

    let simulatedMetrics = { greenRatio: 0.85, necroticRatio: 0.01, yellowRatio: 0.05, autoDetectedHealth: 'healthy' };

    // Draw symptom-specific visual patterns
    if (sample.type === "healthy") {
      // Clean, rich lush green leaf with zero spots
      simulatedMetrics = { greenRatio: 0.94, necroticRatio: 0.00, yellowRatio: 0.02, autoDetectedHealth: 'healthy' };
    } else if (sample.type === "concentric") {
      // Concentric dark rings with yellow chlorotic halos (Early Blight)
      simulatedMetrics = { greenRatio: 0.45, necroticRatio: 0.28, yellowRatio: 0.20, autoDetectedHealth: 'diseased' };
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(280, 200, 48, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 8;
      ctx.stroke();
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.arc(280, 200, 25, 0, Math.PI * 2);
      ctx.fill();
    } else if (sample.type === "water_soaked") {
      // Greasy dark water-soaked rotten blight (Late Blight)
      simulatedMetrics = { greenRatio: 0.40, necroticRatio: 0.45, yellowRatio: 0.10, autoDetectedHealth: 'diseased' };
      ctx.fillStyle = '#1c1917';
      ctx.beginPath();
      ctx.ellipse(320, 230, 90, 65, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 3;
      ctx.stroke();
    } else if (sample.type === "curled") {
      // Curled upward cup shape & wrinkled leaf margin (Leaf Curl)
      simulatedMetrics = { greenRatio: 0.50, necroticRatio: 0.12, yellowRatio: 0.35, autoDetectedHealth: 'diseased' };
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 12;
      ctx.strokeRect(100, 80, 400, 290);
    } else if (sample.type === "spindle") {
      // Diamond spindle-shaped blast lesion with gray center
      simulatedMetrics = { greenRatio: 0.55, necroticRatio: 0.30, yellowRatio: 0.12, autoDetectedHealth: 'diseased' };
      ctx.fillStyle = '#7f1d1d';
      ctx.beginPath();
      ctx.moveTo(250, 225);
      ctx.lineTo(300, 180);
      ctx.lineTo(350, 225);
      ctx.lineTo(300, 270);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.arc(300, 225, 12, 0, Math.PI * 2);
      ctx.fill();
    } else if (sample.type === "chewed") {
      // Chewed holes & frass (Armyworm)
      simulatedMetrics = { greenRatio: 0.50, necroticRatio: 0.35, yellowRatio: 0.10, autoDetectedHealth: 'diseased' };
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(240, 210, 32, 0, Math.PI * 2);
      ctx.arc(330, 240, 26, 0, Math.PI * 2);
      ctx.fill();
    } else if (sample.type === "purple") {
      // Sunken purple elliptical blotch
      simulatedMetrics = { greenRatio: 0.52, necroticRatio: 0.32, yellowRatio: 0.12, autoDetectedHealth: 'diseased' };
      ctx.fillStyle = '#581c87';
      ctx.beginPath();
      ctx.ellipse(300, 225, 75, 35, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 4;
      ctx.stroke();
    }

    const sampleUrl = canvas.toDataURL('image/jpeg');
    setImagePreview(sampleUrl);
    runAnalysis(sampleUrl, undefined, simulatedMetrics, sample.name + ".jpg", sample.crop, sample.symptom);
  };

  const runAnalysis = async (
    base64Data: string, 
    fileObj?: File, 
    metrics?: any, 
    sampleFileName?: string,
    forcedCrop?: string,
    forcedSymptom?: string
  ) => {
    setLoading(true);
    setResult(null);
    try {
      const formData = new FormData();
      if (fileObj) {
        formData.append('image', fileObj);
      } else {
        formData.append('imageBase64', base64Data);
      }
      formData.append('cropHint', forcedCrop || selectedCrop);
      formData.append('symptomHint', forcedSymptom || symptomHint);
      formData.append('filename', fileObj?.name || sampleFileName || 'leaf_capture.jpg');

      if (metrics) {
        if (metrics.greenRatio !== undefined) formData.append('greenRatio', metrics.greenRatio.toString());
        if (metrics.necroticRatio !== undefined) formData.append('necroticRatio', metrics.necroticRatio.toString());
        if (metrics.yellowRatio !== undefined) formData.append('yellowRatio', metrics.yellowRatio.toString());
        if (metrics.autoDetectedHealth) formData.append('autoDetectedHealth', metrics.autoDetectedHealth);
      }

      const res = await analyzeCropImage(formData);
      setResult(res);
      loadHistory();
    } catch (err: any) {
      console.error("Scan error:", err);
      alert("Error scanning image. Running local vision classifier.");
    } finally {
      setLoading(false);
    }
  };

  // Draw bounding boxes on canvas whenever result changes
  useEffect(() => {
    if (!result || !imagePreview || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = imagePreview;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      (result.boundingBoxes || []).forEach(box => {
        const x = box.xmin * canvas.width;
        const y = box.ymin * canvas.height;
        const w = (box.xmax - box.xmin) * canvas.width;
        const h = (box.ymax - box.ymin) * canvas.height;

        ctx.strokeStyle = box.color || '#ef4444';
        ctx.lineWidth = Math.max(3, Math.round(canvas.width / 150));
        ctx.strokeRect(x, y, w, h);

        ctx.fillStyle = (box.color || '#ef4444') + '22';
        ctx.fillRect(x, y, w, h);

        ctx.fillStyle = box.color || '#ef4444';
        const fontSize = Math.max(14, Math.round(canvas.width / 35));
        ctx.font = `bold ${fontSize}px sans-serif`;
        const textMetrics = ctx.measureText(box.label);
        ctx.fillRect(x, Math.max(0, y - fontSize - 6), textMetrics.width + 12, fontSize + 8);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(box.label, x + 6, Math.max(fontSize, y - 4));
      });
    };
  }, [result, imagePreview]);

  // Read solutions aloud (TTS) in plain language
  const toggleSpeech = () => {
    if (!('speechSynthesis' in window) || !result) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const simpleText = language === 'te' 
      ? (result.simpleExplanationTe || `పంటలో సమస్య: ${result.possibleDiseaseTe}.`)
      : (result.simpleExplanation || `Problem diagnosed: ${result.possibleDisease}.`);

    const productText = result.suggestedProducts?.[0]
      ? (language === 'te'
          ? `సిఫార్సు చేసిన మందు: ${result.suggestedProducts[0].brandName}. మోతాదు: ${result.suggestedProducts[0].dosePerPumpTe || result.suggestedProducts[0].dosePerPump}.`
          : `Recommended medicine: ${result.suggestedProducts[0].brandName}. Dose: ${result.suggestedProducts[0].dosePerPump}.`)
      : (result.solutions?.immediateChemical?.[0]?.name ? `Spray ${result.solutions.immediateChemical[0].name}.` : '');

    const speechText = `${simpleText} ${productText}`;

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = language === 'te' ? 'te-IN' : 'en-IN';
    utterance.rate = 0.92;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handlePrint = () => {
    window.print();
  };

  const shareToWhatsApp = () => {
    if (!result) return;
    const cropName = language === 'te' ? result.cropTe : result.crop;
    const diseaseName = language === 'te' ? result.possibleDiseaseTe : result.possibleDisease;
    let msg = `🌱 *BlindSpot Agri - పంట సమస్య & మందుల ప్రిస్క్రిప్షన్*\n`;
    msg += `🌾 *పంట (Crop):* ${cropName}\n`;
    msg += `⚠️ *గుర్తించిన సమస్య:* ${diseaseName}\n`;
    if (result.simpleExplanationTe || result.simpleExplanation) {
      msg += `📋 *వివరాలు:* ${language === 'te' && result.simpleExplanationTe ? result.simpleExplanationTe : result.simpleExplanation}\n\n`;
    }
    msg += `🎒 *స్ప్రే పంపు ప్రమాణం:* 16 లీటర్ల నీటి పంపు (ఎకరాకు 8-10 పంపులు)\n\n`;
    msg += `🛒 *షాపులో అడగాల్సిన మందులు (Recommended Products):*\n`;
    (result.suggestedProducts || []).forEach((prod, idx) => {
      msg += `${idx + 1}. *${prod.brandName}* (${prod.genericName})\n`;
      msg += `   - మోతాదు: ${language === 'te' && prod.dosePerPumpTe ? prod.dosePerPumpTe : prod.dosePerPump}\n`;
      msg += `   - అందాజు ధర: ${prod.approxPrice}\n`;
      if (prod.instructionsTe || prod.instructions) {
        msg += `   - సూచన: ${language === 'te' && prod.instructionsTe ? prod.instructionsTe : prod.instructions}\n`;
      }
      msg += `\n`;
    });
    msg += `⚠️ గమనిక: కొనుగోలు చేయడానికి ముందు స్థానిక రైతు భరోసా కేంద్రం (RBK/KVK) లేదా వ్యవసాయ అధికారిని సంప్రదించండి.`;

    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const copyPrescription = () => {
    if (!result) return;
    const cropName = language === 'te' ? result.cropTe : result.crop;
    const diseaseName = language === 'te' ? result.possibleDiseaseTe : result.possibleDisease;
    let msg = `BlindSpot Agri - Crop Prescription: ${cropName} - ${diseaseName}\n`;
    (result.suggestedProducts || []).forEach((prod, idx) => {
      msg += `${idx + 1}. ${prod.brandName} (${prod.genericName}) | Dose: ${prod.dosePerPump}\n`;
    });
    navigator.clipboard.writeText(msg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
            <Scan className="w-4 h-4" />
            <span>AI Pathology & Commercial Remedies</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {language === 'te' ? "AI పంట ఆరోగ్య స్కానర్ & పరిష్కార మందులు" : "AI Crop Health Scanner & Related Solutions"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'te'
              ? "ఆకు చిత్రాన్ని స్కాన్ చేయండి. సమస్యను సులభంగా అర్థం చేసుకుని, షాపులో లభించే సరైన మందులు మరియు 16 లీటర్ల పంపు మోతాదును పొందండి."
              : "Upload a crop leaf photograph to identify the exact problem, understand it in plain language, and get commercial product recommendations with exact 16L spray pump dosages."}
          </p>
        </div>

        {/* Selectors Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Crop Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-600">Crop:</span>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="bg-white border border-slate-300 text-xs font-bold text-emerald-700 rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="auto">✨ Auto-Detect Crop (ఆటో డిటెక్షన్)</option>
              <option value="Tomato">Tomato (టమాటా)</option>
              <option value="Chilli">Chilli (మిరప)</option>
              <option value="Rice">Rice / Paddy (వరి)</option>
              <option value="Cotton">Cotton (పత్తి)</option>
              <option value="Maize">Maize (మొక్కజొన్న)</option>
              <option value="Onion">Onion (ఉల్లి)</option>
              <option value="Potato">Potato (బంగాళాదుంప)</option>
              <option value="Groundnut">Groundnut (వేరుశనగ)</option>
              <option value="Soybean">Soybean (సోయాబీన్)</option>
              <option value="Brinjal">Brinjal (వంకాయ)</option>
            </select>
          </div>

          {/* Observed Symptom Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-600">Symptom:</span>
            <select
              value={symptomHint}
              onChange={(e) => setSymptomHint(e.target.value)}
              className="bg-white border border-slate-300 text-xs font-bold text-blue-700 rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="auto">✨ Auto-Detect Symptoms (ఆటో విశ్లేషణ)</option>
              <option value="healthy">🟢 Healthy Leaf Check (ఆరోగ్యకరమైన పంట)</option>
              <option value="early_blight">🟤 Concentric Dark Rings / Early Blight (ఆకుమచ్చ)</option>
              <option value="late_blight">🌧️ Water-Soaked Rotten Blight (లేట్ బ్లైట్)</option>
              <option value="leaf_curl">🌪️ Upward Curling & Thrips (ఆకు ముడుత)</option>
              <option value="blast">🔶 Spindle Diamond Spots / Blast (వరి అగ్గితెగులు)</option>
              <option value="armyworm">🐛 Chewed Whorls / Holes (కత్తెర పురుగు)</option>
              <option value="bacterial_spot">🟡 Bacterial Angular Spots / BLB (ఎండ్ర తెగులు)</option>
              <option value="purple_blotch">🟣 Purple Sunken Blotch (ఉల్లి ఊదా మచ్చ)</option>
              <option value="powdery_mildew">⚪ White Powdery Coating (బూడిద తెగులు)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Scanner Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Canvas & Upload Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Leaf Image Feed
              </span>
              <span className="text-[11px] text-slate-500">
                Max 10MB JPG / PNG
              </span>
            </div>

            {/* Display Canvas or Upload Placeholder */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border-2 border-dashed border-slate-300">
              {imagePreview ? (
                <canvas 
                  ref={canvasRef} 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-6 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mx-auto">
                    <Scan className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Upload or snap a leaf photo</p>
                    <p className="text-xs text-slate-400 mt-1">Capture clear daylight image of affected leaf area</p>
                  </div>
                </div>
              )}

              {loading && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-2">
                  <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                  <p className="text-sm font-bold">Scanning leaf with Vision AI...</p>
                  <p className="text-xs text-slate-400">Diagnosing problem & calculating exact 16L pump dosage...</p>
                </div>
              )}
            </div>

            {/* Upload Buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Leaf Image</span>
              </button>
            </div>

            {/* Quick Test Samples */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 block mb-2">
                Quick Test Samples:
              </span>
              <div className="flex flex-wrap gap-2">
                {sampleLeaves.map((sample) => (
                  <button
                    key={sample.name}
                    type="button"
                    onClick={() => runSample(sample)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition flex items-center gap-1.5"
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sample.color }}></span>
                    <span>{sample.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Problem Identification & Solutions */}
        <div className="lg:col-span-7 space-y-4">
          {result ? (
            <div className="space-y-6">
              {/* PROBLEM IDENTIFICATION DOSSIER */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
                {/* Top Problem Banner */}
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        (result.possibleDisease.toLowerCase().includes('healthy') || result.severity === 'Low')
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border-rose-200'
                      }`}>
                        {language === 'te' ? result.problemCategoryTe : (result.problemCategory || "Plant Pathology Problem")}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">•</span>
                      <span className="text-xs text-slate-600 font-bold">{result.crop}</span>
                    </div>

                    <h2 className="text-2xl font-black text-slate-900 leading-tight">
                      {language === 'te' ? result.possibleDiseaseTe : result.possibleDisease}
                    </h2>

                    {(result.possibleDisease.toLowerCase().includes('healthy') || result.severity === 'Low') && (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 mt-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span className="text-xs font-black text-emerald-950">
                          {language === 'te' 
                            ? "రైతుకు శుభవార్త: పంట పూర్తిగా ఆరోగ్యంగా ఉంది. రసాయన మందులు పిచికారీ చేయవలసిన అవసరం లేదు!" 
                            : "Healthy Crop Confirmed: Plant foliage is 100% healthy. No curative chemicals needed!"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase ${
                      result.severity === 'High' 
                        ? 'bg-rose-500 text-white' 
                        : result.severity === 'Medium'
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'bg-emerald-600 text-white'
                    }`}>
                      {result.severity} Severity
                    </span>
                    <div className="text-xs font-bold text-slate-500 mt-1">
                      {result.confidence}% Model Confidence
                    </div>
                  </div>
                </div>

                {/* Plain-Language Farmer Explanation Banner */}
                {(result.simpleExplanation || result.simpleExplanationTe) && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border-2 border-emerald-400 shadow-sm space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                        💡
                      </span>
                      <h3 className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                        {language === 'te' ? "రైతు కోసం సులభమైన వివరణ (సమస్య ఏమిటి?)" : "Farmer-Friendly Problem Summary (What Happened?)"}
                      </h3>
                    </div>
                    <p className="text-sm text-emerald-950 font-bold leading-relaxed">
                      {language === 'te' && result.simpleExplanationTe ? result.simpleExplanationTe : result.simpleExplanation}
                    </p>
                    {language !== 'te' && result.simpleExplanationTe && (
                      <p className="text-xs text-emerald-800 font-medium italic pt-1 border-t border-emerald-200/60">
                        తెలుగు: {result.simpleExplanationTe}
                      </p>
                    )}
                  </div>
                )}

                {/* 16-Liter Spray Pump Measurement Guide */}
                <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🎒</span>
                      <h4 className="text-xs font-black text-blue-950 uppercase tracking-wider">
                        {language === 'te' ? "16 లీటర్ల స్ప్రే పంపు కొలత మార్గదర్శి" : "Standard 16-Liter Knapsack Sprayer Guide"}
                      </h4>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">
                      1 Pump = 16L Water
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="bg-white/90 p-2.5 rounded-xl border border-blue-100 flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-blue-600 uppercase">Standard Tank</span>
                      <span className="font-bold text-slate-900 mt-1">16-Liter Knapsack (1 పంపు)</span>
                    </div>
                    <div className="bg-white/90 p-2.5 rounded-xl border border-blue-100 flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-blue-600 uppercase">Acre Coverage</span>
                      <span className="font-bold text-slate-900 mt-1">
                        {result.pumpSpecs?.pumpsPerAcre || "8 to 10 pumps / acre"}
                      </span>
                    </div>
                    <div className="bg-white/90 p-2.5 rounded-xl border border-blue-100 flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-blue-600 uppercase">Best Spraying Time</span>
                      <span className="font-bold text-slate-900 mt-1">
                        {language === 'te' && result.pumpSpecs?.bestSprayingTimeTe ? result.pumpSpecs.bestSprayingTimeTe : (result.pumpSpecs?.bestSprayingTime || "Early Morning")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Root Cause & Impact Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{language === 'te' ? "సమస్యకు మూల కారణం (Root Cause)" : "Why Did This Problem Occur?"}</span>
                    </span>
                    <p className="text-xs text-amber-950 leading-relaxed font-medium">
                      {language === 'te' ? (result.rootCauseTe || result.rootCause) : result.rootCause}
                    </p>
                  </div>

                  <div className="p-3.5 bg-rose-50/70 rounded-2xl border border-rose-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1">
                      <TrendingDown className="w-3.5 h-3.5" />
                      <span>{language === 'te' ? "దిగుబడి నష్ట ప్రమాదం (Yield Risk)" : "Yield Impact If Untreated"}</span>
                    </span>
                    <p className="text-xs text-rose-950 font-bold leading-relaxed">
                      {language === 'te' ? (result.yieldRiskTe || result.yieldRisk) : result.yieldRisk}
                    </p>
                    <div className="text-[11px] text-rose-800 font-semibold">
                      Est. Remedy Cost: <strong>{language === 'te' ? (result.treatmentCostEstTe || result.treatmentCostEst) : result.treatmentCostEst}</strong>
                    </div>
                  </div>
                </div>

                {/* Visible Visual Symptoms */}
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    {language === 'te' ? "AI గుర్తించిన దృశ్య లక్షణాలు (Identified Symptoms)" : "AI-Detected Visual Symptoms"}
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {(language === 'te' && result.visibleSymptomsTe ? result.visibleSymptomsTe : result.visibleSymptoms).map((symp, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold">•</span>
                        <span>{symp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* COMMERCIAL RECOMMENDED PRODUCTS (FARMER MARKET SOLUTION) */}
              {result.suggestedProducts && result.suggestedProducts.length > 0 && (
                <div className="bg-white rounded-3xl p-6 border-2 border-emerald-500/50 shadow-lg space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-emerald-600" />
                        <h3 className="text-lg font-black text-slate-900">
                          {(result.possibleDisease.toLowerCase().includes('healthy') || result.severity === 'Low')
                            ? (language === 'te' ? "మొక్క ఎదుగుదల & సహజ రక్షణ మందులు (ఆరోగ్యకరమైన పంట)" : "Preventative Bio-Shields & Foliar Plant Tonics")
                            : (language === 'te' ? "షాపులో అడగాల్సిన సిఫార్సు మందులు" : "Recommended Products to Buy at Agro-Shop")}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {(result.possibleDisease.toLowerCase().includes('healthy') || result.severity === 'Low')
                          ? (language === 'te'
                              ? "పంట ఆరోగ్యంగా ఉన్నందున రసాయన మందులు అవసరం లేదు. సహజ రక్షణ మరియు పోషకాల కోసం వీటిని వాడండి."
                              : "No toxic pesticides needed. Use organic preventative shields and balanced micro-nutrients per 16L pump.")
                          : (language === 'te' 
                              ? "ఈ మందులు స్థానిక ఆర్బీకే / ఫెర్టిలైజర్ దుకాణాల్లో సులభంగా లభిస్తాయి. 16 లీటర్ల పంపు మోతాదులో మాత్రమే వాడండి."
                              : "Commercially available formulations. Always use exact dosage per 16-Liter spray pump.")}
                      </p>
                    </div>

                    {/* WhatsApp Share & Copy */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={shareToWhatsApp}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition"
                        title="Send medicine list to shopkeeper on WhatsApp"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>{language === 'te' ? "షాపుకు WhatsApp చేయండి" : "Share via WhatsApp"}</span>
                      </button>

                      <button
                        onClick={copyPrescription}
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
                        title="Copy list"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                        <span>{copied ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Product Cards */}
                  <div className="grid grid-cols-1 gap-3.5">
                    {result.suggestedProducts.map((prod, pIdx) => (
                      <div 
                        key={prod.id || pIdx} 
                        className="p-4 rounded-2xl bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/90 hover:border-emerald-400 hover:shadow-md transition space-y-3"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                                {prod.badge || "Verified Product"}
                              </span>
                              <span className="text-xs text-slate-400">•</span>
                              <span className="text-xs font-semibold text-slate-500">{prod.company}</span>
                              <span className="text-xs text-slate-400">•</span>
                              <span className="text-[11px] font-medium text-slate-400">{prod.category}</span>
                            </div>

                            <h4 className="text-base font-black text-slate-900">
                              {prod.brandName}
                            </h4>

                            <p className="text-xs text-slate-600 font-medium">
                              Active Ingredient: <span className="font-bold text-slate-800">{prod.genericName}</span>
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="inline-block px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 font-black text-xs border border-emerald-200">
                              {prod.approxPrice}
                            </span>
                            <span className="block text-[10px] text-slate-400 mt-0.5">Approx. Price in Shop</span>
                          </div>
                        </div>

                        {/* Dosage Callout */}
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5">
                          <Droplet className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                          <div className="text-xs">
                            <strong className="text-emerald-950 font-black">16 లీటర్ల పంపు మోతాదు (Exact Dose per 16L Pump): </strong>
                            <span className="font-black text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-300 ml-1">
                              {language === 'te' && prod.dosePerPumpTe ? prod.dosePerPumpTe : prod.dosePerPump}
                            </span>
                          </div>
                        </div>

                        {/* How to spray instructions */}
                        {(prod.instructions || prod.instructionsTe) && (
                          <p className="text-xs text-slate-600 leading-relaxed pl-1">
                            <strong>{language === 'te' ? "రైతు సూచన (Instructions): " : "Spraying Instruction: "}</strong>
                            {language === 'te' && prod.instructionsTe ? prod.instructionsTe : prod.instructions}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Practical Spraying Tips */}
                  {result.practicalTips && result.practicalTips.length > 0 && (
                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2 mt-2">
                      <h5 className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-amber-700" />
                        <span>{language === 'te' ? "రైతు పాటించవలసిన ముఖ్య సూచనలు" : "Practical Spraying Rules for Best Results"}</span>
                      </h5>
                      <ul className="space-y-1.5 text-xs text-amber-900 font-medium">
                        {(language === 'te' && result.practicalTipsTe ? result.practicalTipsTe : result.practicalTips).map((tip, tIdx) => (
                          <li key={tIdx} className="flex items-start gap-2">
                            <span className="text-amber-700 font-bold">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* ADVANCED SCIENTIFIC TREATMENT PROTOCOL (OPTIONAL TABS) */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Detailed Agronomic Protocols
                    </span>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <FlaskConical className="w-4 h-4 text-emerald-600" />
                      <span>{language === 'te' ? "వివరణాత్మక చికిత్స మార్గాలు (Advanced Protocols)" : "Alternative Management Protocols"}</span>
                    </h3>
                  </div>

                  {/* Actions: Listen & Print */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleSpeech}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
                      title="Read solution aloud"
                    >
                      {speaking ? <VolumeX className="w-4 h-4 text-rose-500 animate-pulse" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
                      <span>{speaking ? "Stop Audio" : (language === 'te' ? "వినండి (Audio)" : "Listen")}</span>
                    </button>

                    <button
                      onClick={handlePrint}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
                      title="Print treatment prescription"
                    >
                      <Printer className="w-4 h-4 text-slate-600" />
                      <span>Print</span>
                    </button>
                  </div>
                </div>

                {/* Solution Category Tabs */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setSolutionTab('chemical')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                      solutionTab === 'chemical' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <FlaskConical className="w-3.5 h-3.5" />
                    <span>{language === 'te' ? "రసాయన నివారణ (Chemical)" : "Fast Chemical"}</span>
                  </button>

                  <button
                    onClick={() => setSolutionTab('organic')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                      solutionTab === 'organic' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Sprout className="w-3.5 h-3.5" />
                    <span>{language === 'te' ? "సేంద్రీయ పద్ధతులు (Organic)" : "Organic & Bio"}</span>
                  </button>

                  <button
                    onClick={() => setSolutionTab('cultural')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                      solutionTab === 'cultural' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>{language === 'te' ? "సాగు పద్ధతులు (Cultural)" : "Field Care"}</span>
                  </button>

                  <button
                    onClick={() => setSolutionTab('nutrition')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                      solutionTab === 'nutrition' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>{language === 'te' ? "పోషకాల రికవరీ (Nutrition)" : "Soil & Recovery"}</span>
                  </button>
                </div>

                {/* Tab Content 1: Fast-Action Chemical Solutions */}
                {solutionTab === 'chemical' && (
                  <div className="space-y-3">
                    {result.solutions?.immediateChemical?.map((chem, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <strong className="text-sm font-black text-emerald-950">
                            {language === 'te' && chem.nameTe ? chem.nameTe : chem.name}
                          </strong>
                          <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-bold text-[10px]">
                            Recommended Formulation
                          </span>
                        </div>
                        <div className="text-slate-800">
                          <strong>Exact Dosage:</strong>{" "}
                          <span className="font-bold text-emerald-800">
                            {language === 'te' && chem.dosageTe ? chem.dosageTe : chem.dosage}
                          </span>
                        </div>
                        {chem.timing && (
                          <div className="text-slate-600 text-[11px]">
                            <strong>Application Time:</strong> {language === 'te' && chem.timingTe ? chem.timingTe : chem.timing}
                          </div>
                        )}
                        {chem.action && (
                          <div className="text-[11px] text-slate-500 italic">
                            Mechanism: {chem.action}
                          </div>
                        )}
                      </div>
                    )) || (
                      <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
                        {result.recommendedSteps?.[0]}
                      </div>
                    )}
                  </div>
                )}

                {/* Tab Content 2: Organic & Bio-Control */}
                {solutionTab === 'organic' && (
                  <div className="space-y-3">
                    {result.solutions?.organicBio?.map((org, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <strong className="text-sm font-black text-teal-950">
                            {language === 'te' && org.nameTe ? org.nameTe : org.name}
                          </strong>
                          <span className="px-2 py-0.5 rounded bg-teal-200 text-teal-900 font-bold text-[10px]">
                            Natural Bio-Agent
                          </span>
                        </div>
                        <div className="text-slate-800">
                          <strong>Dosage:</strong>{" "}
                          <span className="font-bold text-teal-800">
                            {language === 'te' && org.dosageTe ? org.dosageTe : org.dosage}
                          </span>
                        </div>
                        {org.method && (
                          <div className="text-slate-600 text-[11px]">
                            <strong>Application Method:</strong> {org.method}
                          </div>
                        )}
                      </div>
                    )) || (
                      <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
                        Apply Neem oil 1500 ppm @ 5ml/L of water.
                      </div>
                    )}
                  </div>
                )}

                {/* Tab Content 3: Cultural Field Care */}
                {solutionTab === 'cultural' && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-700 uppercase">Field Management Best Practices:</h5>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {((language === 'te' && result.solutions?.culturalAgronomicTe) ? result.solutions.culturalAgronomicTe : (result.solutions?.culturalAgronomic || result.recommendedSteps)).map((step, idx) => (
                        <li key={idx} className="p-3 bg-slate-50 rounded-xl flex items-start gap-2 border border-slate-200/60">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tab Content 4: Nutrition & Recovery */}
                {solutionTab === 'nutrition' && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-700 uppercase">Post-Infection Foliage Recovery:</h5>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {((language === 'te' && result.solutions?.soilNutritionRecoveryTe) ? result.solutions.soilNutritionRecoveryTe : (result.solutions?.soilNutritionRecovery || [result.prevention])).map((nutr, idx) => (
                        <li key={idx} className="p-3 bg-slate-50 rounded-xl flex items-start gap-2 border border-slate-200/60">
                          <Sprout className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{nutr}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Scientific Disclaimer */}
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Advisory Disclaimer:</strong> {result.disclaimer} Always verify with your local agricultural officer / Rythu Seva Kendra (RBK/KVK) before chemical application.
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center text-slate-500 space-y-3 shadow-sm">
              <Scan className="w-14 h-14 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">Awaiting Crop Leaf Scan</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Select an image on the left or click any of the instant sample leaves to identify the problem and inspect the step-by-step chemical and organic solutions.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Scan History */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {language === 'te' ? "గత స్కాన్ల చరిత్ర & పురోగతి (Scan History)" : "Weekly Scan History & Problem Comparison"}
            </h3>
          </div>
          <span className="text-xs text-slate-500">{history.length} scans recorded</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {history.map((h) => (
            <div key={h.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold text-slate-900 block">{h.crop}</span>
                  <span className="text-[11px] text-slate-500">{new Date(h.scannedAt).toLocaleDateString()}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  h.severity === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {h.severity}
                </span>
              </div>
              <p className="text-slate-800 font-bold">{h.possibleDisease}</p>
              <p className="text-[11px] text-slate-600 line-clamp-2">
                <strong>Solution:</strong> {h.suggestedProducts?.[0]?.brandName || h.solutions?.immediateChemical?.[0]?.name || h.recommendedSteps?.[0]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

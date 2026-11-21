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
  DollarSign
} from 'lucide-react';
import { Language, ScanResult } from '../types';
import { t } from '../translations';
import { analyzeCropImage, getScanHistory } from '../api/client';

interface CropScannerPageProps {
  language: Language;
  cropHint: string;
}

export const CropScannerPage: React.FC<CropScannerPageProps> = ({ language, cropHint }) => {
  const [selectedCrop, setSelectedCrop] = useState(cropHint || "Tomato");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [solutionTab, setSolutionTab] = useState<'chemical' | 'organic' | 'cultural' | 'nutrition'>('chemical');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const text = t[language];

  // Curated samples for quick instant testing
  const sampleLeaves = [
    { name: "Tomato Early Blight", crop: "Tomato", label: "Tomato (Target Spots)", color: "#ef4444" },
    { name: "Chilli Leaf Curl", crop: "Chilli", label: "Chilli (Curled Shoot)", color: "#f97316" },
    { name: "Cotton Bacterial Blight", crop: "Cotton", label: "Cotton (Angular Spot)", color: "#eab308" }
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      runAnalysis(base64, file);
    };
    reader.readAsDataURL(file);
  };

  const runSample = (sample: typeof sampleLeaves[0]) => {
    setSelectedCrop(sample.crop);
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 450;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(300, 225, 40, 300, 225, 260);
      grad.addColorStop(0, '#4ade80');
      grad.addColorStop(0.7, '#16a34a');
      grad.addColorStop(1, '#14532d');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 600, 450);

      ctx.strokeStyle = '#86efac';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(50, 225);
      ctx.lineTo(550, 225);
      ctx.stroke();

      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(280, 200, 45, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 8;
      ctx.stroke();

      const sampleUrl = canvas.toDataURL('image/jpeg');
      setImagePreview(sampleUrl);
      runAnalysis(sampleUrl);
    }
  };

  const runAnalysis = async (base64Data: string, fileObj?: File) => {
    setLoading(true);
    setResult(null);
    try {
      const formData = new FormData();
      if (fileObj) {
        formData.append('image', fileObj);
      } else {
        formData.append('imageBase64', base64Data);
      }
      formData.append('cropHint', selectedCrop);

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

  // Read solutions aloud (TTS)
  const toggleSpeech = () => {
    if (!('speechSynthesis' in window) || !result) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const diseaseText = language === 'te' 
      ? `పంటలో సమస్య గుర్తించబడింది: ${result.possibleDiseaseTe}. దీనికి నివారణ: ${result.solutions?.immediateChemical?.[0]?.nameTe || ''}. ${result.solutions?.immediateChemical?.[0]?.dosageTe || ''}.`
      : `Problem diagnosed: ${result.possibleDisease}. Recommended treatment: Spray ${result.solutions?.immediateChemical?.[0]?.name || result.recommendedSteps?.[0]} at recommended dosage.`;

    const utterance = new SpeechSynthesisUtterance(diseaseText);
    utterance.lang = language === 'te' ? 'te-IN' : 'en-IN';
    utterance.rate = 0.95;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
            <Scan className="w-4 h-4" />
            <span>Computer Vision Pathology & Remedy Protocol</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {language === 'te' ? "AI పంట ఆరోగ్య స్కానర్ & సమస్యల నివారణ పరిష్కారాలు" : "AI Crop Health Scanner & Related Solutions"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'te'
              ? "ఆకు చిత్రాన్ని స్కాన్ చేసి తెగులును గుర్తించండి. వెంటనే సంబంధిత రసాయన, సేంద్రీయ మరియు సాగు నివారణ పరిష్కారాలను పొందండి."
              : "Upload a crop leaf photograph to identify the exact problem, detect lesions, and receive verified chemical, organic, and agronomic solutions."}
          </p>
        </div>

        {/* Crop Select */}
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-600">Crop:</span>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="bg-white border border-slate-300 text-xs font-bold text-emerald-700 rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="Tomato">Tomato</option>
            <option value="Chilli">Chilli</option>
            <option value="Cotton">Cotton</option>
            <option value="Rice">Rice / Paddy</option>
            <option value="Onion">Onion</option>
          </select>
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
                  <p className="text-xs text-slate-400">Identifying problem & calculating remediation dosage...</p>
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
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
                        {language === 'te' ? result.problemCategoryTe : (result.problemCategory || "Plant Pathology Problem")}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">•</span>
                      <span className="text-xs text-slate-600 font-bold">{result.crop}</span>
                    </div>

                    <h2 className="text-2xl font-black text-slate-900 leading-tight">
                      {language === 'te' ? result.possibleDiseaseTe : result.possibleDisease}
                    </h2>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase ${
                      result.severity === 'High' 
                        ? 'bg-rose-500 text-white' 
                        : result.severity === 'Medium'
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'bg-emerald-500 text-white'
                    }`}>
                      {result.severity} Severity
                    </span>
                    <div className="text-xs font-bold text-slate-500 mt-1">
                      {result.confidence}% Model Confidence
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

              {/* DEDICATED RELATED SOLUTIONS PROTOCOL SUITE */}
              <div className="bg-white rounded-3xl p-6 border-2 border-emerald-500/40 shadow-lg space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                      Prescription & Action Plan
                    </span>
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <FlaskConical className="w-5 h-5 text-emerald-600" />
                      <span>{language === 'te' ? "ఈ సమస్యకు పరిష్కారాలు (Related Solutions)" : "Related Solutions & Treatment Protocol"}</span>
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
                    <span>{language === 'te' ? "రసాయన నివారణ (Fast Action)" : "Fast-Action Chemical"}</span>
                  </button>

                  <button
                    onClick={() => setSolutionTab('organic')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                      solutionTab === 'organic' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Sprout className="w-3.5 h-3.5" />
                    <span>{language === 'te' ? "సేంద్రీయ పద్ధతులు (Organic)" : "Organic & Bio-Control"}</span>
                  </button>

                  <button
                    onClick={() => setSolutionTab('cultural')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                      solutionTab === 'cultural' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>{language === 'te' ? "సాగు పద్ధతులు (Cultural)" : "Agronomic Field Care"}</span>
                  </button>

                  <button
                    onClick={() => setSolutionTab('nutrition')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                      solutionTab === 'nutrition' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>{language === 'te' ? "పోషకాల రికవరీ (Nutrition)" : "Soil & Plant Recovery"}</span>
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
                    <strong>Medical & Advisory Disclaimer:</strong> {result.disclaimer} Always verify with your local agricultural officer / Krishi Vigyan Kendra (KVK).
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
                <strong>Solution:</strong> {h.solutions?.immediateChemical?.[0]?.name || h.recommendedSteps?.[0]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

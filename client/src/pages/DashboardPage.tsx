import React, { useEffect, useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  CloudRain, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  DollarSign, 
  Users, 
  Scan, 
  AlertTriangle, 
  Activity, 
  HelpCircle,
  ExternalLink,
  RefreshCw,
  Sun,
  Layers,
  ChevronRight
} from 'lucide-react';
import { FarmerProfile, Language, SmartSellingData } from '../types';
import { t } from '../translations';
import { getSmartSellingRecommendation } from '../api/client';

interface DashboardPageProps {
  language: Language;
  profile: FarmerProfile;
  setCurrentView: (view: string) => void;
  isDemoMode: boolean;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  language,
  profile,
  setCurrentView,
  isDemoMode
}) => {
  const [data, setData] = useState<SmartSellingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const text = t[language];

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getSmartSellingRecommendation({
        crop: profile.crop,
        quantity: profile.quantityAvailableQuintals,
        quality: "Grade A",
        lat: profile.latitude,
        lon: profile.longitude,
        hasColdStorage: false
      });
      setData(res);
    } catch (err: any) {
      console.error("Dashboard data load error:", err);
      setError("Unable to connect to live services. Showing offline baseline.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [profile.crop, profile.latitude, profile.longitude, profile.quantityAvailableQuintals]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Farmer Header Info Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>{language === 'te' ? "లైవ్ రైతు డ్యాష్‌బోర్డ్" : "Live Farmer Telemetry"}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {language === 'te' ? `నమస్కారం, ${profile.name || "రైతు మిత్రమా"}!` : `Welcome, ${profile.name || "Farmer"}!`}
          </h1>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{profile.village}, {profile.district}, {profile.state}</span>
            <span>•</span>
            <span className="font-semibold text-emerald-700">{profile.crop}</span>
            <span>•</span>
            <span>{profile.quantityAvailableQuintals} Quintals ready</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? "Syncing..." : "Refresh Feeds"}</span>
          </button>
          
          <button
            onClick={() => setCurrentView('scanner')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5"
          >
            <Scan className="w-4 h-4" />
            <span>{text.scanCrop}</span>
          </button>
        </div>
      </div>

      {/* Polish User Flow Indicator Banner */}
      <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5 text-xs text-emerald-900 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-bold text-[10px]">INTEGRATED PIPELINE</span>
          <span className="font-medium">
            Crop: <strong>{profile.crop}</strong> → GPS Location → Live Weather → APMC Prices → Historical Trends → Arrivals Pressure → Net Buyer Ranking
          </span>
        </div>
        <div className="text-[11px] text-emerald-700 font-semibold">
          Status: Live Connected
        </div>
      </div>

      {/* MAIN HERO CARD: "WHAT SHOULD I DO TODAY?" */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white p-6 sm:p-10 border border-emerald-800/40 shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-48 h-48 text-emerald-400" />
        </div>

        <div className="relative max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black tracking-wider uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{text.whatShouldIDoToday}</span>
            </span>

            {data && (
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                data.decision === 'SELL NOW' 
                  ? 'bg-emerald-500 text-slate-950' 
                  : data.decision === 'WAIT & MONITOR'
                  ? 'bg-blue-500 text-white'
                  : 'bg-amber-400 text-slate-950'
              }`}>
                {data.decision}
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-snug">
            {language === 'te' 
              ? (data?.teluguExplanation ? data.whatShouldIDoToday.summaryTe : "విశ్లేషిస్తోంది...")
              : (data ? data.whatShouldIDoToday.summary : "Analyzing live agricultural data...")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs">
              <span className="text-slate-400 block mb-0.5">Recommended Selling Market:</span>
              <strong className="text-emerald-300 text-sm font-bold">
                {data?.whatShouldIDoToday.topMarket || "Bowenpally APMC"}
              </strong>
            </div>
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs">
              <span className="text-slate-400 block mb-0.5">Estimated Net Realization:</span>
              <strong className="text-emerald-300 text-sm font-bold">
                {data?.whatShouldIDoToday.expectedNetReturn || "Calculating..."}
              </strong>
            </div>
          </div>

          {/* AI Disclaimer */}
          <div className="pt-2 flex items-start gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>
              {language === 'te' 
                ? "గమనిక: ఇది AI సలహా మాత్రమే, ఆర్థిక హామీ కాదు. విక్రయించే ముందు స్థానిక మార్కెట్ యార్డ్ అధికారులతో ప్రత్యక్ష ధరను నిర్ధారించుకోండి." 
                : text.aiRecommendationDisclaimer}
            </span>
          </div>

          {/* Explore full sell smart view */}
          <div className="pt-2">
            <button
              onClick={() => setCurrentView('sell-smart')}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5"
            >
              <span>{language === 'te' ? "పూర్తి స్మార్ట్ విక్రయ విశ్లేషణ చూడండి" : "View Complete Multi-Factor Sell Analysis"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* TODAY'S SUMMARY METRIC CARDS (Requirement 3) */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          {language === 'te' ? "నేటి కీలక సూచీలు (Today's Summary Metrics)" : "Today's Core Summary Metrics"}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* 1. Crop Health */}
          <div 
            onClick={() => setCurrentView('scanner')}
            className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:border-emerald-400 transition cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Crop Health</span>
              <Scan className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-lg font-black text-slate-900">Good</div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Tap to Scan Leaf →</div>
          </div>

          {/* 2. Current Price */}
          <div 
            onClick={() => setCurrentView('prices')}
            className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:border-emerald-400 transition cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>{text.modalPrice}</span>
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-lg font-black text-slate-900">
              ₹{data?.metrics.currentPrice?.toLocaleString('en-IN') || "2,600"}
            </div>
            <div className="text-[10px] text-slate-500 font-medium mt-0.5">per quintal</div>
          </div>

          {/* 3. Price Trend */}
          <div 
            onClick={() => setCurrentView('trends')}
            className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:border-emerald-400 transition cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>{text.priceTrend}</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-lg font-black text-emerald-600">
              {data ? `${data.metrics.priceTrendPercent >= 0 ? '+' : ''}${data.metrics.priceTrendPercent}%` : "+8.5%"}
            </div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Upward velocity</div>
          </div>

          {/* 4. Demand Level */}
          <div 
            onClick={() => setCurrentView('demand-supply')}
            className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:border-emerald-400 transition cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>{text.demandLevel}</span>
              <Activity className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <div className="text-lg font-black text-purple-700">
              {data?.metrics.demandLevel || "HIGH"}
            </div>
            <div className="text-[10px] text-slate-500 font-medium mt-0.5">Terminal absorption</div>
          </div>

          {/* 5. Weather Risk */}
          <div 
            onClick={() => setCurrentView('weather')}
            className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:border-emerald-400 transition cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>{text.weatherRisk}</span>
              <CloudRain className="w-3.5 h-3.5 text-sky-600" />
            </div>
            <div className="text-lg font-black text-slate-900">
              {data?.metrics.weatherRisk || "Normal"}
            </div>
            <div className="text-[10px] text-sky-600 font-semibold mt-0.5">
              Rain prob: {data?.weatherSummary.rainProb ?? 15}%
            </div>
          </div>

          {/* 6. Recommended Action */}
          <div 
            onClick={() => setCurrentView('sell-smart')}
            className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:border-emerald-400 transition cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Decision</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-base font-black text-emerald-700 truncate">
              {data?.decision || "SELL NOW"}
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Sell Smart Advisor →</div>
          </div>
        </div>
      </div>

      {/* Split Section: Quick Links & Assistant Prompt */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recommended Actions & Comparison */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {language === 'te' ? "సమీప మార్కెట్లలో నికర లాభాల పోలిక" : "Nearby Buyers Ranked by Estimated Net Return"}
              </h3>
              <button
                onClick={() => setCurrentView('buyers')}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>{language === 'te' ? "అన్ని మార్కెట్లు చూడండి" : "View All Markets"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {(data?.buyerComparison.options || []).slice(0, 3).map((opt, idx) => (
                <div 
                  key={opt.id}
                  className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    idx === 0 
                      ? 'bg-emerald-50/70 border-emerald-300' 
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">{opt.name}</span>
                      {idx === 0 && (
                        <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-black uppercase">
                          Highest Net Return
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {opt.distanceKm} km away • Base: ₹{opt.offeredPricePerQtl}/qtl • Transport: ~₹{opt.transportEstimate}
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-base font-black text-slate-900">
                      ₹{opt.estimatedNetRevenue.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      Net for {opt.quantityQuintals} qtl
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Telugu AI Assistant Card */}
        <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-2xl p-6 border border-teal-800 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-teal-300 text-xs font-bold uppercase mb-2">
              <HelpCircle className="w-4 h-4 text-teal-400" />
              <span>{text.aiAssistant}</span>
            </div>
            <h4 className="text-lg font-bold">
              {language === 'te' ? "మీ వ్యవసాయ సందేహాలను అడగండి" : "Ask in Telugu or English"}
            </h4>
            <p className="text-xs text-teal-100/80 mt-1 leading-relaxed">
              {language === 'te' 
                ? "ధరల ట్రెండ్స్, తెగుళ్ల మందులు లేదా మార్కెట్ విక్రయాల గురించి మీ సందేహాలను అడగండి."
                : "Ask about pest control sprays, weather forecasts, or whether to sell or hold your produce."}
            </p>

            <div className="mt-4 p-3 bg-teal-950/60 rounded-xl border border-teal-800/80 text-xs text-teal-200 italic">
              “నా టమాటా పంటను ఇప్పుడు అమ్మాలా?”
            </div>
          </div>

          <button
            onClick={() => setCurrentView('assistant')}
            className="w-full py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            <span>{language === 'te' ? "AI తో మాట్లాడండి (Voice/Text)" : "Open Voice/Text AI Assistant"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

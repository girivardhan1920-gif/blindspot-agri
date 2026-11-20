import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  CloudRain, 
  Clock, 
  Warehouse, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw,
  Scale,
  Sparkles
} from 'lucide-react';
import { Language, SmartSellingData } from '../types';
import { t } from '../translations';
import { getSmartSellingRecommendation } from '../api/client';

interface SellSmartPageProps {
  language: Language;
  crop: string;
  quantity: number;
  latitude: number;
  longitude: number;
  setCurrentView: (view: string) => void;
}

export const SellSmartPage: React.FC<SellSmartPageProps> = ({
  language,
  crop,
  quantity,
  latitude,
  longitude,
  setCurrentView
}) => {
  const [data, setData] = useState<SmartSellingData | null>(null);
  const [hasColdStorage, setHasColdStorage] = useState(false);
  const [loading, setLoading] = useState(true);
  const text = t[language];

  const fetchDecision = async () => {
    setLoading(true);
    try {
      const res = await getSmartSellingRecommendation({
        crop,
        quantity,
        quality: "Grade A",
        lat: latitude,
        lon: longitude,
        hasColdStorage
      });
      setData(res);
    } catch (err) {
      console.warn("Sell smart error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecision();
  }, [crop, quantity, latitude, longitude, hasColdStorage]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Multi-Factor Synthesis Engine</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {language === 'te' ? "స్మార్ట్ విక్రయ సలహా (SELL SMART)" : "Sell Smart Decision Intelligence"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Synthesizing weather risk, price momentum, arrival pressure, haulage distance, and crop perishability.
          </p>
        </div>

        {/* Cold Storage Toggle */}
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
          <Warehouse className="w-4 h-4 text-slate-600" />
          <span className="text-xs font-semibold text-slate-700">Cold Storage / Hermetic Bags:</span>
          <button
            onClick={() => setHasColdStorage(!hasColdStorage)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              hasColdStorage 
                ? 'bg-emerald-600 text-white' 
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            {hasColdStorage ? "Yes (Available)" : "No (Raw Vine)"}
          </button>
        </div>
      </div>

      {data && (
        <div className="space-y-6">
          {/* Main Decision Board */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 border border-emerald-800/40 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Action Verdict for {crop} Produce
              </span>

              {/* Three Verdict Badges */}
              <div className="flex items-center gap-2">
                {['SELL NOW', 'WAIT & MONITOR', 'COMPARE MARKETS'].map((v) => {
                  const active = data.decision === v;
                  return (
                    <span
                      key={v}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition ${
                        active 
                          ? 'bg-emerald-400 text-slate-950 shadow-md ring-2 ring-emerald-300/40 scale-105' 
                          : 'bg-slate-800/80 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {v}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Verdict Headline */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                {data.summaryHeadline}
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                {language === 'te' ? data.teluguExplanation : data.explanation}
              </p>
            </div>

            {/* Decision Factors Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase block">1. Modal Price</span>
                <span className="text-base font-bold text-white">₹{data.metrics.currentPrice}/qtl</span>
                <span className="text-[10px] text-emerald-400 block">{data.metrics.priceTrendPercent}% 30d</span>
              </div>

              <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase block">2. Weather Alert</span>
                <span className="text-base font-bold text-amber-300">{data.metrics.weatherRisk}</span>
                <span className="text-[10px] text-slate-400 block">{data.weatherSummary.rainProb}% rain prob</span>
              </div>

              <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase block">3. Inflow Pressure</span>
                <span className="text-base font-bold text-purple-300">{data.metrics.marketPressure}</span>
                <span className="text-[10px] text-slate-400 block">Supply: {data.metrics.supplyLevel}</span>
              </div>

              <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase block">4. Top APMC Hub</span>
                <span className="text-base font-bold text-emerald-300 truncate block">{data.metrics.bestNearbyMarket}</span>
                <span className="text-[10px] text-slate-400 block">Highest Net Return</span>
              </div>
            </div>

            {/* Mandatory Requirement 13 Disclaimer */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Ethical AI Guardrail:</strong> Never promise guaranteed profits. Realized price depends on transparent auction bidding at the APMC yard gates and physical produce grading.
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setCurrentView('buyers')}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 shadow-sm text-left transition flex items-center justify-between group"
            >
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase">View Distance & Mandi Contacts</span>
                <div className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700">
                  Inspect Verified Buyers in {latitude.toFixed(2)}°N Radius →
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition" />
            </button>

            <button
              onClick={() => setCurrentView('comparison')}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 shadow-sm text-left transition flex items-center justify-between group"
            >
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase">Net Realization Table</span>
                <div className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700">
                  Deduct Haulage Freight & Mandi Fee →
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

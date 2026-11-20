import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Language } from '../types';
import { t } from '../translations';
import { getPriceForecast } from '../api/client';

interface PriceForecastPageProps {
  language: Language;
  crop: string;
}

export const PriceForecastPage: React.FC<PriceForecastPageProps> = ({ language, crop }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const text = t[language];

  useEffect(() => {
    const fetchForecast = async () => {
      setLoading(true);
      try {
        const res = await getPriceForecast(crop);
        setData(res);
      } catch (err) {
        console.warn("Forecast error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchForecast();
  }, [crop]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>AI Statistical Forecasting Model</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {language === 'te' ? `${crop} భవిష్యత్ ధరల ముందస్తు అంచనా` : `${crop} Price Projection Model`}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Synthesizing historical momentum, arrival velocities, seasonal factors, and weather signals.
          </p>
        </div>
      </div>

      {data && (
        <div className="space-y-6">
          {/* Main Forecast Board */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 border border-emerald-800/40 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider">
                Horizon: {data.forecastHorizon}
              </span>
              <span className="text-xs text-slate-400">
                Current Modal: ₹{data.currentModalPrice}/qtl
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60">
                <span className="text-xs text-slate-400 block mb-1">Expected Direction:</span>
                <div className="text-3xl font-black text-emerald-400 flex items-center gap-2">
                  {data.expectedDirection === 'UP' ? <TrendingUp className="w-8 h-8" /> : <TrendingDown className="w-8 h-8" />}
                  <span>{data.expectedDirection}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60">
                <span className="text-xs text-slate-400 block mb-1">Estimated Price Range:</span>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {data.expectedRange}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">per quintal</div>
              </div>

              <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60">
                <span className="text-xs text-slate-400 block mb-1">Confidence Score:</span>
                <div className="text-3xl font-black text-teal-300">
                  {data.confidenceLevel}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Stochastic uncertainty band: ±5%</div>
              </div>
            </div>

            {/* Key Model Drivers */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Model Telemetry Drivers:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {data.drivers.map((drv: string, i: number) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>{drv}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mandatory Requirement 10 Disclaimer */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Important Notice:</strong> {data.disclaimer}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

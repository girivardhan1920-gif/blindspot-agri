import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  ShieldCheck, 
  Info,
  Truck,
  ArrowRight
} from 'lucide-react';
import { Language } from '../types';
import { t } from '../translations';
import { getDemandSupplyAnalysis } from '../api/client';

interface DemandSupplyPageProps {
  language: Language;
  crop: string;
}

export const DemandSupplyPage: React.FC<DemandSupplyPageProps> = ({ language, crop }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const text = t[language];

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getDemandSupplyAnalysis(crop);
      setData(res);
    } catch (err) {
      console.warn("Demand/Supply error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [crop]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Market Arrival & Inflow Pressure</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {language === 'te' ? `${crop} డిమాండ్ & సరఫరా సమగ్ర విశ్లేషణ` : `${crop} Demand & Supply Intelligence`}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Correlating daily mandi arrival volume against historical consumption baselines to derive net market pressure.
          </p>
        </div>
      </div>

      {data && (
        <>
          {/* Triad Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Demand Signal */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Demand Level</span>
              <div className="text-3xl font-black text-emerald-700">
                {data.demand}
              </div>
              <p className="text-xs text-slate-500">
                Baseline retail consumption and terminal dispatch velocity
              </p>
            </div>

            {/* 2. Supply Level */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mandi Supply / Inflow</span>
              <div className={`text-3xl font-black ${
                data.supply === 'LOW' ? 'text-amber-600' : data.supply === 'HIGH' ? 'text-blue-600' : 'text-slate-800'
              }`}>
                {data.supply}
              </div>
              <p className="text-xs text-slate-500">
                Current Arrivals: <strong>{data.arrivalVolumeMt} MT</strong> ({data.arrivalDeltaPct >= 0 ? '+' : ''}{data.arrivalDeltaPct}% vs baseline)
              </p>
            </div>

            {/* 3. Market Pressure */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Market Pressure</span>
              <div className={`text-3xl font-black flex items-center gap-2 ${
                data.marketPressure === 'UPWARD' 
                  ? 'text-emerald-600' 
                  : data.marketPressure === 'DOWNWARD'
                  ? 'text-rose-600'
                  : 'text-slate-800'
              }`}>
                {data.marketPressure === 'UPWARD' ? <TrendingUp className="w-8 h-8" /> : <TrendingDown className="w-8 h-8" />}
                <span>{data.marketPressure}</span>
              </div>
              <p className="text-xs text-slate-500">
                Net price bias derived from inventory absorption
              </p>
            </div>
          </div>

          {/* RATIONALE EXPLANATION CARD (Requirement 8) */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <Info className="w-4 h-4" />
              <span>Economic Analysis & Rationale</span>
            </div>

            <h3 className="text-xl font-black tracking-tight text-white leading-snug">
              “{data.rationale}”
            </h3>

            {/* Mandatory Requirement 8 Label */}
            <div className="p-3.5 bg-slate-800/70 rounded-xl border border-slate-700 text-xs text-slate-300 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Data Transparency Notice:</strong> {data.notice}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

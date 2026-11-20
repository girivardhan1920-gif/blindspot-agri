import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ArrowUpDown, 
  CheckCircle2, 
  Truck, 
  DollarSign, 
  ShieldCheck, 
  Info,
  Building,
  RefreshCw
} from 'lucide-react';
import { Language, BuyerOption } from '../types';
import { t } from '../translations';
import { compareBuyersApi } from '../api/client';

interface BuyerComparisonPageProps {
  language: Language;
  crop: string;
  quantity: number;
  latitude: number;
  longitude: number;
}

export const BuyerComparisonPage: React.FC<BuyerComparisonPageProps> = ({
  language,
  crop,
  quantity,
  latitude,
  longitude
}) => {
  const [selectedCrop, setSelectedCrop] = useState(crop || 'Tomato');
  const [qty, setQty] = useState(quantity || 25);
  const [qualityGrade, setQualityGrade] = useState("Grade A");
  const [comparison, setComparison] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const text = t[language];

  const runComparison = async () => {
    setLoading(true);
    try {
      const res = await compareBuyersApi({
        crop: selectedCrop,
        quantityQuintals: qty,
        quality: qualityGrade,
        lat: latitude,
        lon: longitude
      });
      setComparison(res);
    } catch (err) {
      console.warn("Comparison error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runComparison();
  }, [selectedCrop, qty, qualityGrade, latitude, longitude]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
            <DollarSign className="w-4 h-4" />
            <span>Net Financial Realization Calculator</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {language === 'te' ? "మార్కెట్ల నికర లాభాల పోలిక (Buyer Comparison)" : "Mandi & Buyer Net Return Comparison"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Accounting for hauling distances, rural freight rates (₹4.2/km/qtl), and statutory APMC market cess.
          </p>
        </div>
      </div>

      {/* Calculator Inputs Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Enter Your Produce Parameters:
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Crop:</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-sm text-emerald-800 bg-white"
            >
              {["Tomato", "Onion", "Chilli", "Cotton", "Rice", "Wheat", "Potato", "Turmeric", "Maize", "Groundnut"].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Quantity (Quintals):</label>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(Math.max(1, parseFloat(e.target.value) || 1))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Quality Grade:</label>
            <select
              value={qualityGrade}
              onChange={(e) => setQualityGrade(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-sm text-slate-800 bg-white"
            >
              <option value="Grade A">Grade A (Sorted, Prime, 5% Premium)</option>
              <option value="Grade B">Grade B (Standard Market Grade)</option>
              <option value="Grade C">Grade C (Mixed / Minor Blemishes, -10%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recommendation Banner */}
      {comparison?.recommendation && (
        <div className="bg-emerald-900 text-white rounded-2xl p-6 border border-emerald-700 shadow-md flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-xs font-black uppercase text-emerald-300 tracking-wider">
              AI Optimized Selling Recommendation
            </span>
            <p className="text-base sm:text-lg font-bold leading-snug">
              {comparison.recommendation}
            </p>
          </div>
        </div>
      )}

      {/* Comparison Options Ranked */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Ranked Options (Highest Estimated Net Return First)
        </h3>

        <div className="space-y-3">
          {comparison?.options?.map((opt: BuyerOption, idx: number) => (
            <div 
              key={opt.id}
              className={`p-6 rounded-2xl border transition-all ${
                idx === 0
                  ? 'bg-emerald-50/90 border-emerald-400 shadow-md'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                {/* Mandi Details */}
                <div className="lg:col-span-5 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                      idx === 0 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      #{idx + 1}
                    </span>
                    <h4 className="text-base font-black text-slate-900">
                      {opt.name}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 pl-8">
                    {opt.location} • {opt.distanceKm} km from farm
                  </p>
                  <p className="text-[11px] text-slate-400 pl-8">
                    {opt.type} • Contact: {opt.contact}
                  </p>
                </div>

                {/* Calculation Breakdown */}
                <div className="lg:col-span-4 grid grid-cols-3 gap-2 text-center text-xs border-y lg:border-y-0 lg:border-x border-slate-200 py-2 lg:py-0 px-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Gross Rev</span>
                    <span className="font-bold text-slate-800">₹{opt.grossRevenue.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-slate-400 block">@ ₹{opt.offeredPricePerQtl}/qtl</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Transport</span>
                    <span className="font-bold text-rose-600">-₹{opt.transportEstimate.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-slate-400 block">₹4.2/km/qtl</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Mandi Fee</span>
                    <span className="font-bold text-slate-600">-₹{opt.marketCharges.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-slate-400 block">{opt.marketChargesPct}% cess</span>
                  </div>
                </div>

                {/* Net Return Highlight */}
                <div className="lg:col-span-3 text-right space-y-0.5">
                  <span className="text-[10px] font-black uppercase text-slate-500 block">
                    Estimated Net Return
                  </span>
                  <div className="text-2xl font-black text-emerald-700">
                    ₹{opt.estimatedNetRevenue.toLocaleString('en-IN')}
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    ₹{opt.netReturnPerQuintal}/quintal net
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
        <Info className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
        <span>
          <strong>Calculation Transparency:</strong> {comparison?.disclaimer}
        </span>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity, 
  Calendar, 
  ShieldCheck, 
  RefreshCw,
  BarChart2
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Area, AreaChart } from 'recharts';
import { Language } from '../types';
import { t } from '../translations';
import { getPriceTrends } from '../api/client';

interface PriceTrendsPageProps {
  language: Language;
  crop: string;
}

export const PriceTrendsPage: React.FC<PriceTrendsPageProps> = ({ language, crop }) => {
  const [trends, setTrends] = useState<any>(null);
  const [selectedDays, setSelectedDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const text = t[language];

  const fetchTrends = async () => {
    setLoading(true);
    try {
      const data = await getPriceTrends(crop, selectedDays);
      setTrends(data);
    } catch (err) {
      console.warn("Trend load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, [crop, selectedDays]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Empirical Time-Series Analytics</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {language === 'te' ? `${crop} ధరల ట్రెండ్స్ & హెచ్చుతగ్గుల విశ్లేషణ` : `${crop} Price Trends & Volatility Analysis`}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Multi-day historical modal price movements and volatility indices across verified APMC mandis.
          </p>
        </div>

        {/* Days Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDays(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                selectedDays === d
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {d} Days
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Row */}
      {trends && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase">Current Modal Price</span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              ₹{trends.currentPrice.toLocaleString('en-IN')}/qtl
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Base point: ₹{trends.startPrice}</div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase">{trends.period} Price Change</span>
            <div className={`text-2xl font-black mt-1 flex items-center gap-1 ${
              trends.changePercent >= 0 ? 'text-emerald-600' : 'text-rose-600'
            }`}>
              {trends.changePercent >= 0 ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
              <span>{trends.changePercent >= 0 ? '+' : ''}{trends.changePercent}%</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Net delta: ₹{trends.changeAbsolute}
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase">Historical Volatility Index</span>
            <div className="text-2xl font-black text-purple-700 mt-1">
              {trends.volatilityIndex}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Rating: {trends.volatilityRating}</div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase">Price Range ({trends.period})</span>
            <div className="text-xl font-bold text-slate-900 mt-1">
              ₹{trends.lowestPeriodPrice} – ₹{trends.highestPeriodPrice}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Min / Max observed</div>
          </div>
        </div>
      )}

      {/* Interactive Recharts Graph */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Modal Price Trajectory (₹ / Quintal)
            </h3>
            <p className="text-xs text-slate-500">
              Interactive timeline from official daily mandi trades
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            {trends?.summary}
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          {trends?.dataPoints && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends.dataPoints}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={['auto', 'auto']} />
                <Tooltip 
                  formatter={(val: any) => [`₹${val}/quintal`, 'Modal Price']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="price" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Source: {trends?.dataSource}</span>
          <span>Verified Daily Dispatches</span>
        </div>
      </div>
    </div>
  );
};

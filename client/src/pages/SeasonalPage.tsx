import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  ShieldCheck, 
  AlertCircle,
  BarChart2
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Language } from '../types';
import { t } from '../translations';
import { getSeasonalAnalysis } from '../api/client';

interface SeasonalPageProps {
  language: Language;
  crop: string;
}

export const SeasonalPage: React.FC<SeasonalPageProps> = ({ language, crop }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const text = t[language];

  useEffect(() => {
    const fetchSeasonal = async () => {
      setLoading(true);
      try {
        const res = await getSeasonalAnalysis(crop);
        setData(res);
      } catch (err) {
        console.warn("Seasonal error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeasonal();
  }, [crop]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            <span>Multi-Year Historical Pattern Engine</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {language === 'te' ? `${crop} కాలానుగుణ నమూనా & వార్షిక ధోరణి` : `${crop} 12-Month Seasonal Pattern Engine`}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Long-term empirical monthly price realizations from 5-year horticultural and agricultural trade archives.
          </p>
        </div>
      </div>

      {data && (
        <>
          {/* Key Seasonal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase">
                <TrendingUp className="w-4 h-4" />
                <span>Seasonal High Months</span>
              </div>
              <div className="text-xl font-black text-slate-900">
                {data.seasonalHighMonths.join(', ')}
              </div>
              <p className="text-xs text-slate-500">
                Peak festive demand and post-monsoon inventory lean windows
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase">
                <TrendingDown className="w-4 h-4" />
                <span>Seasonal Low Months</span>
              </div>
              <div className="text-xl font-black text-slate-900">
                {data.seasonalLowMonths.join(', ')}
              </div>
              <p className="text-xs text-slate-500">
                Heavy arrival gluts during peak harvesting weeks
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-600 uppercase">
                <Activity className="w-4 h-4" />
                <span>Historical Volatility</span>
              </div>
              <div className="text-xl font-black text-slate-900">
                {data.volatility}
              </div>
              <p className="text-xs text-slate-500">
                Perishability and storage dependency rating
              </p>
            </div>
          </div>

          {/* 12-Month Bar Chart */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Typical 12-Month Average Price Curve (₹ / Quintal)
            </h3>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlyAverages}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip 
                    formatter={(val: any) => [`₹${val}/qtl`, 'Historical Average']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="avgPrice" fill="#059669" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
              <strong>Seasonal Insight:</strong> {data.description}
            </p>
          </div>

          {/* Requirement 9 Distinction Notice */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Crucial Distinction:</strong> {data.notice}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  Database, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  RefreshCw, 
  Server, 
  Lock
} from 'lucide-react';
import { Language } from '../types';
import { t } from '../translations';
import { getDataSources } from '../api/client';

interface DataSourcesPageProps {
  language: Language;
}

export const DataSourcesPage: React.FC<DataSourcesPageProps> = ({ language }) => {
  const [sourcesData, setSourcesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const text = t[language];

  useEffect(() => {
    const fetchSources = async () => {
      setLoading(true);
      try {
        const res = await getDataSources();
        setSourcesData(res);
      } catch (err) {
        console.warn("Sources error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSources();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Ethical Agriculture AI Standards</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {language === 'te' ? "డేటా వనరులు & పారదర్శకత (Data Sources)" : "Data Transparency & Verified API Registry"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Strict policy against fabricated prices, fake buyer numbers, or pseudo-scientific health diagnosis.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 font-bold flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Verified Government & Meteorological Pipeline</span>
        </div>
      </div>

      {/* Policy Pledge Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-3">
        <h3 className="text-lg font-black text-white">
          BlindSpot Agri Data Integrity Charter
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
          {sourcesData?.complianceNotice || "Zero invented prices policy. Verified government and meteorological data feeds with explicit timestamps and citations."}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Backend Secure Env Keys</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Server className="w-4 h-4 text-sky-400" />
            <span>Live ECMWF Weather Data</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Database className="w-4 h-4 text-amber-400" />
            <span>Agmarknet Mandi Feeds</span>
          </div>
        </div>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sourcesData?.sources?.map((s: any) => (
          <div 
            key={s.id}
            className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 block mb-1">
                    {s.ministry || s.name}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {s.name}
                  </h3>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Data Telemetry</span>
                  <p className="text-slate-700 leading-relaxed font-medium">{s.dataType}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div className="p-2.5 bg-slate-50 rounded-lg">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Frequency</span>
                    <span>{s.frequency}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Geographic Scope</span>
                    <span>{s.coverage}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <a
                href={s.portalUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <span>Visit Official Source Portal</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

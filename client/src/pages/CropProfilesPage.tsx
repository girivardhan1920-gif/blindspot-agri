import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  Droplets, 
  Bug, 
  ShieldAlert, 
  Warehouse, 
  Calendar, 
  BookOpen,
  DollarSign
} from 'lucide-react';
import { Language } from '../types';
import { t } from '../translations';
import { getCropProfiles } from '../api/client';

interface CropProfilesPageProps {
  language: Language;
  initialCrop: string;
}

export const CropProfilesPage: React.FC<CropProfilesPageProps> = ({ language, initialCrop }) => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedCropId, setSelectedCropId] = useState(initialCrop.toLowerCase() || 'tomato');
  const [loading, setLoading] = useState(true);
  const text = t[language];

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        const res = await getCropProfiles();
        setProfiles(res || []);
      } catch (err) {
        console.warn("Profiles error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  const activeCrop = profiles.find(p => p.id === selectedCropId) || profiles[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Agronomic Knowledge Base (ICAR / State Agricultural Universities)</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {language === 'te' ? "పంటల సమగ్ర సమాచారం & సాగు పద్ధతులు" : "Comprehensive Crop Agronomy Profiles"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Curated scientific practices, growth stages, pest thresholds, and safe storage requirements.
          </p>
        </div>
      </div>

      {/* Crop Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {profiles.map((p) => {
          const active = p.id === (activeCrop?.id);
          return (
            <button
              key={p.id}
              onClick={() => setSelectedCropId(p.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
                active 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>{p.name.split('(')[0].trim()}</span>
            </button>
          );
        })}
      </div>

      {/* Active Crop Detail Dossier */}
      {activeCrop && (
        <div className="space-y-6">
          {/* Top Banner Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {activeCrop.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                  {activeCrop.name}
                </h2>
                <p className="text-xs text-slate-500 italic mt-0.5">
                  Scientific Name: {activeCrop.scientificName} • Duration: {activeCrop.durationDays}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Scientific Authority:</span>
                <span className="text-xs font-bold text-slate-800">{activeCrop.source}</span>
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Growing Season</span>
                <span className="text-xs font-bold text-slate-800 leading-snug block">{activeCrop.growingSeason}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Soil Considerations</span>
                <span className="text-xs font-medium text-slate-700 leading-snug block">{activeCrop.soilConsiderations}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Water Requirements</span>
                <span className="text-xs font-medium text-slate-700 leading-snug block">{activeCrop.waterRequirements}</span>
              </div>
            </div>
          </div>

          {/* Growth Stages Timeline */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Phenological Growth Stages</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {activeCrop.growthStages?.map((st: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-800">{st.stage}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-black">{st.days}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed pt-1">{st.care}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pests & Diseases */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Common Pests */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Bug className="w-4 h-4 text-rose-600" />
                <span>Common Insect Pests & IPM Thresholds</span>
              </h3>
              <div className="space-y-3">
                {activeCrop.commonPests?.map((p: any, i: number) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                    <strong className="text-slate-900 block">{p.name}</strong>
                    <p className="text-slate-600"><strong>Symptoms:</strong> {p.symptom}</p>
                    <p className="text-emerald-700 font-medium"><strong>Management:</strong> {p.control}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Diseases */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Common Plant Diseases & Symptoms</span>
              </h3>
              <div className="space-y-3">
                {activeCrop.commonDiseases?.map((d: any, i: number) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                    <strong className="text-slate-900 block">{d.name}</strong>
                    <p className="text-slate-600"><strong>Symptoms:</strong> {d.symptom}</p>
                    <p className="text-emerald-700 font-medium"><strong>Remedy:</strong> {d.control}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Harvest & Storage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 uppercase flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Harvest Window</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">{activeCrop.harvestPeriod}</p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 uppercase flex items-center gap-2">
                <Warehouse className="w-4 h-4 text-teal-600" />
                <span>Storage Protocols</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">{activeCrop.storageConsiderations}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

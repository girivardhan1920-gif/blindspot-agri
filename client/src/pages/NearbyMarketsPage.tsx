import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MapPin, 
  DollarSign, 
  Phone, 
  ExternalLink, 
  ShieldCheck, 
  Navigation, 
  Truck,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { Language } from '../types';
import { t } from '../translations';
import { getNearbyBuyers } from '../api/client';

interface NearbyMarketsPageProps {
  language: Language;
  crop: string;
  latitude: number;
  longitude: number;
}

export const NearbyMarketsPage: React.FC<NearbyMarketsPageProps> = ({ language, crop, latitude, longitude }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const text = t[language];

  useEffect(() => {
    const fetchBuyers = async () => {
      setLoading(true);
      try {
        const res = await getNearbyBuyers(crop, latitude, longitude);
        setData(res);
      } catch (err) {
        console.warn("Nearby buyers error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBuyers();
  }, [crop, latitude, longitude]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Verified Mandis & Registered FPOs Registry</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {language === 'te' ? `${crop} సమీప కొనుగోలుదారులు & మార్కెట్ యార్డులు` : `Nearby ${crop} Buyers & Mandis`}
          </h1>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>Origin GPS: {latitude.toFixed(3)}°N, {longitude.toFixed(3)}°E</span>
            <span>•</span>
            <span>Distances computed via Haversine road matrix</span>
          </p>
        </div>

        <div className="text-right">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Zero Fake Numbers Policy</span>
          </span>
        </div>
      </div>

      {/* Interactive Map Visualizer */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-400" />
              <span>Geospatial Mandi Network (OpenStreetMap Integration)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Interactive proximity view of regional APMC market yards and farmer producer centers
            </p>
          </div>
          <span className="text-xs text-emerald-400 font-mono">
            {data?.buyers?.length || 0} Mandis mapped within 250km
          </span>
        </div>

        {/* Embedded Leaflet / OSM Frame */}
        <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden border border-slate-700 bg-slate-950">
          <iframe 
            title="OpenStreetMap Mandi Network"
            className="w-full h-full border-0 filter grayscale-[20%] contrast-105"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 1.2}%2C${latitude - 1.0}%2C${longitude + 1.2}%2C${latitude + 1.0}&layer=mapnik&marker=${latitude}%2C${longitude}`}
          />
          <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-200 font-medium">
            📍 Farmer Location: {latitude.toFixed(2)}°N, {longitude.toFixed(2)}°E
          </div>
        </div>
      </div>

      {/* Verified Mandis List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.buyers?.map((buyer: any) => (
          <div 
            key={buyer.id}
            className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4 hover:border-emerald-400 transition"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 inline-block mb-1.5">
                    {buyer.type}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {buyer.name}
                  </h3>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-base font-black text-emerald-600 block">
                    {buyer.distanceKm} km
                  </span>
                  <span className="text-[10px] text-slate-400">from farm</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{buyer.location}</span>
                </div>
                <div className="flex items-center justify-between text-slate-800 font-semibold pt-1 border-t border-slate-200/60">
                  <span>Current Modal Price:</span>
                  <span className="text-emerald-700 font-bold">₹{buyer.pricePerQuintal}/qtl</span>
                </div>
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span>Est. Haulage Freight:</span>
                  <span>~₹{buyer.transportEstPerQtl}/qtl</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                  Crops Accepted:
                </span>
                <div className="flex flex-wrap gap-1">
                  {buyer.cropsAccepted.map((c: string) => (
                    <span key={c} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span>Contact Desk:</span>
                <span className="font-mono text-slate-800 font-semibold">{buyer.contact}</span>
              </div>
              <a 
                href={buyer.website} 
                target="_blank" 
                rel="noreferrer"
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-center block transition flex items-center justify-center gap-1.5"
              >
                <span>Visit Market Portal</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

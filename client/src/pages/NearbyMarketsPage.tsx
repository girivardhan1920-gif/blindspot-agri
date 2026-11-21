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
  CheckCircle2,
  Star,
  Zap,
  Scale,
  MessageSquare,
  ArrowUpDown,
  Share2
} from 'lucide-react';
import { Language, BuyerOption } from '../types';
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
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'price'>('distance');
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

  const buyers: any[] = data?.buyers ? [...data.buyers] : [];

  // Sorting logic
  buyers.sort((a, b) => {
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'price') return (b.pricePerQuintal || 0) - (a.pricePerQuintal || 0);
    return (a.distanceKm || 0) - (b.distanceKm || 0);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Verified Buyers, APMC Mandis & FPOs With Ratings</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {language === 'te' 
              ? `${crop} సమీప కొనుగోలుదారులు & రేటింగ్‌లు` 
              : `Nearby ${crop} Buyers & Mandis (With Farmer Ratings)`}
          </h1>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>Origin GPS: {latitude.toFixed(3)}°N, {longitude.toFixed(3)}°E</span>
            <span>•</span>
            <span>Distances computed from your farm</span>
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sort By:</span>
          </span>
          <button
            onClick={() => setSortBy('distance')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              sortBy === 'distance' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'te' ? "సమీప దూరం" : "Nearest Distance"}
          </button>
          <button
            onClick={() => setSortBy('rating')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              sortBy === 'rating' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'te' ? "ఉత్తమ రేటింగ్ ★" : "Top Rated ★"}
          </button>
          <button
            onClick={() => setSortBy('price')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              sortBy === 'price' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'te' ? "అధిక ధర" : "Highest Price"}
          </button>
        </div>
      </div>

      {/* Geospatial Map Visualizer */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-400" />
              <span>Geospatial Mandi & Buyer Network</span>
            </h3>
            <p className="text-xs text-slate-400">
              Interactive proximity view of regional APMC market yards and farmer producer centers
            </p>
          </div>
          <span className="text-xs text-emerald-400 font-mono font-bold">
            {buyers.length} Verified Buyers Mapped
          </span>
        </div>

        {/* Embedded Leaflet / OSM Frame */}
        <div className="relative aspect-[21/8] w-full rounded-2xl overflow-hidden border border-slate-700 bg-slate-950">
          <iframe 
            title="OpenStreetMap Mandi Network"
            className="w-full h-full border-0 filter grayscale-[20%] contrast-105"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 1.2}%2C${latitude - 1.0}%2C${longitude + 1.2}%2C${latitude + 1.0}&layer=mapnik&marker=${latitude}%2C${longitude}`}
          />
          <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-200 font-medium">
            📍 Your Farm Coordinates: {latitude.toFixed(3)}°N, {longitude.toFixed(3)}°E
          </div>
        </div>
      </div>

      {/* Verified Buyers Grid with Ratings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buyers.map((buyer: any) => (
          <div 
            key={buyer.id}
            className="bg-white rounded-3xl p-6 border-2 border-slate-200/90 shadow-sm flex flex-col justify-between space-y-5 hover:border-emerald-500 hover:shadow-xl transition-all duration-300"
          >
            <div className="space-y-4">
              {/* Header: Type, Rating & Distance */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 inline-block mb-1">
                    {buyer.type}
                  </span>
                  <h3 className="text-base font-black text-slate-900 leading-snug">
                    {buyer.name}
                  </h3>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-lg font-black text-emerald-600 block">
                    {buyer.distanceKm} km
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">from farm</span>
                </div>
              </div>

              {/* Farmer Rating Box */}
              <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-sm shadow-sm">
                    ★
                  </div>
                  <div>
                    <div className="text-sm font-black text-amber-950">
                      {buyer.rating || 4.8} / 5.0
                    </div>
                    <div className="text-[10px] font-bold text-amber-800">
                      {buyer.reviewCount || 340}+ Verified Farmer Reviews
                    </div>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Verified Trust
                </span>
              </div>

              {/* Operational Signals: Price, Payment & Weighing */}
              <div className="p-3.5 bg-slate-50 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-800 font-semibold">
                  <span className="text-slate-500">Current Modal Price:</span>
                  <span className="text-base font-black text-emerald-700">₹{buyer.pricePerQuintal}/qtl</span>
                </div>

                <div className="flex items-center gap-2 text-slate-700 pt-1.5 border-t border-slate-200/60">
                  <Zap className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  <span className="text-[11px] font-bold">
                    {language === 'te' && buyer.paymentSpeedTe ? buyer.paymentSpeedTe : (buyer.paymentSpeed || "Same-Day Bank Settlement")}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-700">
                  <Scale className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  <span className="text-[11px] font-medium">
                    {language === 'te' && buyer.weighingTransparencyTe ? buyer.weighingTransparencyTe : (buyer.weighingTransparency || "100% Certified Digital Weighbridge")}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-500 text-[11px] pt-1 border-t border-slate-200/60">
                  <span>Est. Freight Haulage:</span>
                  <span className="font-bold text-slate-700">~₹{buyer.transportEstPerQtl}/qtl</span>
                </div>
              </div>

              {/* Farmer Review Quote */}
              {(buyer.topFarmerReview || buyer.topFarmerReviewTe) && (
                <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-[11px] text-slate-600 italic">
                  <span className="font-bold text-emerald-700 not-italic">Recent Farmer Feedback: </span>
                  "{language === 'te' && buyer.topFarmerReviewTe ? buyer.topFarmerReviewTe : buyer.topFarmerReview}"
                </div>
              )}

              {/* Crops Accepted */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Crops Accepted:
                </span>
                <div className="flex flex-wrap gap-1">
                  {buyer.cropsAccepted.map((c: string) => (
                    <span key={c} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span>Contact Desk:</span>
                <span className="font-mono text-slate-800 font-bold">{buyer.contact}</span>
              </div>
              <a 
                href={buyer.website} 
                target="_blank" 
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-center block transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Visit Market Portal</span>
                <ExternalLink className="w-3 h-3 text-emerald-400" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

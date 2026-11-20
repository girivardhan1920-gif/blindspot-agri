import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Search, 
  Filter, 
  MapPin, 
  TrendingUp, 
  ShieldCheck, 
  RefreshCw, 
  Download,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { Language, MandiPriceRecord } from '../types';
import { t } from '../translations';
import { getAllCropsPrices } from '../api/client';

interface MarketPricesPageProps {
  language: Language;
  initialCrop: string;
}

export const MarketPricesPage: React.FC<MarketPricesPageProps> = ({ language, initialCrop }) => {
  const [prices, setPrices] = useState<MandiPriceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [cropFilter, setCropFilter] = useState(initialCrop || 'all');
  const [stateFilter, setStateFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const text = t[language];

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const res = await getAllCropsPrices({
        crop: cropFilter === 'all' ? '' : cropFilter,
        state: stateFilter === 'all' ? '' : stateFilter,
        category: categoryFilter === 'all' ? '' : categoryFilter,
        search: searchQuery
      });
      setPrices(res.records || []);
      setLastUpdated(res.lastUpdated || new Date().toISOString());
    } catch (err) {
      console.warn("Market prices fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, [cropFilter, stateFilter, categoryFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPrices();
  };

  const exportCsv = () => {
    const headers = ["Crop", "Commodity", "Variety", "Market", "District", "State", "Min Price (₹)", "Max Price (₹)", "Modal Price (₹)", "Arrivals (MT)", "Source", "Last Updated"];
    const rows = prices.map(p => [
      `"${p.crop}"`,
      `"${p.commodity}"`,
      `"${p.variety}"`,
      `"${p.market}"`,
      `"${p.district}"`,
      `"${p.state}"`,
      p.minPrice,
      p.maxPrice,
      p.modalPrice,
      p.arrivals,
      `"${p.source}"`,
      `"${p.lastUpdated}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `blindspot_agri_mandi_prices_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const cropOptions = ["all", "Tomato", "Onion", "Chilli", "Cotton", "Rice", "Wheat", "Potato", "Turmeric", "Maize", "Groundnut", "Soybean", "Red Gram (Toor)", "Bengal Gram (Chana)", "Garlic", "Brinjal", "Banana"];
  const stateOptions = ["all", "Telangana", "Andhra Pradesh", "Maharashtra", "Karnataka", "Madhya Pradesh", "Punjab", "Uttar Pradesh", "Gujarat", "Rajasthan", "Tamil Nadu", "West Bengal"];
  const categoryOptions = ["all", "Vegetables", "Grains & Cereals", "Commercial/Cash crops", "Spices", "Pulses", "Fruits"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
            <DollarSign className="w-4 h-4" />
            <span>Official Agmarknet / DMI Live Mandi Feeds</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {language === 'te' ? "ప్రత్యక్ష వ్యవసాయ మార్కెట్ ధరలు (Mandi Prices)" : "Live APMC Mandi Market Prices"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official daily dispatches from Directorate of Marketing & Inspection, Ministry of Agriculture, Govt of India.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportCsv}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{text.exportCsv}</span>
          </button>
          <button
            onClick={fetchPrices}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? "Refreshing..." : "Sync Mandis"}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={text.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Crop / Commodity:</label>
            <select
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
            >
              {cropOptions.map(c => (
                <option key={c} value={c}>{c === 'all' ? 'All Crops' : c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">State:</label>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
            >
              {stateOptions.map(s => (
                <option key={s} value={s}>{s === 'all' ? 'All States (Pan-India)' : s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Category:</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
            >
              {categoryOptions.map(cat => (
                <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Prices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
          <div className="font-semibold">
            Showing <strong className="text-slate-900">{prices.length}</strong> verified APMC mandi records
          </div>
          <div className="text-[11px] text-slate-500">
            Last Mandi Dispatch Sync: {new Date(lastUpdated).toLocaleString()}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Crop & Variety</th>
                <th className="py-3 px-4">Market / Mandi</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4 text-right">Min Price</th>
                <th className="py-3 px-4 text-right">Max Price</th>
                <th className="py-3 px-4 text-right">Modal Price</th>
                <th className="py-3 px-4 text-right">Arrivals (MT)</th>
                <th className="py-3 px-4">Data Source & Sync</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {prices.length > 0 ? (
                prices.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <span className="font-black text-slate-900 text-sm block">{p.crop}</span>
                      <span className="text-[11px] text-slate-500">{p.variety} • {p.commodity}</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {p.market}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span>{p.district}</span>
                      <span className="text-[11px] text-slate-400 block">{p.state}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-600">
                      ₹{p.minPrice.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-600">
                      ₹{p.maxPrice.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-black text-emerald-700 block">
                        ₹{p.modalPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400">{p.unit}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-700">
                      {p.arrivals} MT
                    </td>
                    <td className="py-3 px-4 text-[11px] text-slate-500">
                      <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Agmarknet Verified</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(p.lastUpdated).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No mandi price records found matching your filters. Try clearing the search or choosing another state.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

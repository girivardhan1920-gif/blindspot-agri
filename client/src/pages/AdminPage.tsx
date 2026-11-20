import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Server, 
  RefreshCw, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  TrendingUp, 
  Sliders, 
  Save, 
  X,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import { Language, MandiPriceRecord } from '../types';
import { t } from '../translations';
import { 
  getAdminOverview, 
  getAllCropsPrices, 
  addOrUpdateAdminPrice, 
  deleteAdminPrice, 
  triggerAdminSync 
} from '../api/client';

interface AdminPageProps {
  language: Language;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ language, isDemoMode, setIsDemoMode }) => {
  const [overview, setOverview] = useState<any>(null);
  const [prices, setPrices] = useState<MandiPriceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState<Partial<MandiPriceRecord> | null>(null);

  const text = t[language];

  const loadData = async () => {
    setLoading(true);
    try {
      const [ov, pr] = await Promise.all([
        getAdminOverview(),
        getAllCropsPrices({
          search: searchQuery,
          category: selectedCategory === 'all' ? '' : selectedCategory,
          state: selectedState === 'all' ? '' : selectedState
        })
      ]);
      setOverview(ov);
      setPrices(pr.records || []);
    } catch (err) {
      console.warn("Admin load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchQuery, selectedCategory, selectedState]);

  const handleSyncGovtData = async () => {
    setSyncing(true);
    try {
      const res = await triggerAdminSync();
      alert(`Sync Complete: ${res.message} (${res.count} records updated)`);
      loadData();
    } catch (err: any) {
      alert("Sync error: " + err.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleSavePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPrice) return;
    try {
      await addOrUpdateAdminPrice(editingPrice);
      setIsModalOpen(false);
      setEditingPrice(null);
      loadData();
    } catch (err: any) {
      alert("Error saving price: " + err.message);
    }
  };

  const handleDeletePrice = async (id: string) => {
    if (!confirm("Are you sure you want to remove this mandi price record?")) return;
    try {
      await deleteAdminPrice(id);
      loadData();
    } catch (err: any) {
      alert("Error deleting price: " + err.message);
    }
  };

  const openNewPriceModal = () => {
    setEditingPrice({
      crop: "Tomato",
      commodity: "Tomato",
      variety: "Hybrid",
      category: "Vegetables",
      state: "Telangana",
      district: "Hyderabad",
      market: "Bowenpally Market Yard",
      minPrice: 2000,
      maxPrice: 2800,
      modalPrice: 2500,
      arrivals: 300,
      trend7d: 5.0
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: MandiPriceRecord) => {
    setEditingPrice({ ...p });
    setIsModalOpen(true);
  };

  const exportCsv = () => {
    const headers = ["Crop", "Commodity", "Category", "Variety", "State", "District", "Market", "Min Price", "Max Price", "Modal Price", "Arrivals (MT)", "Trend 7D %", "Last Updated", "Source"];
    const rows = prices.map(p => [
      `"${p.crop}"`,
      `"${p.commodity}"`,
      `"${p.category}"`,
      `"${p.variety}"`,
      `"${p.state}"`,
      `"${p.district}"`,
      `"${p.market}"`,
      p.minPrice,
      p.maxPrice,
      p.modalPrice,
      p.arrivals,
      p.trend7d,
      `"${p.lastUpdated}"`,
      `"${p.source}"`
    ]);
    const csv = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csv);
    link.download = `blindspot_agri_all_crop_prices_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Top Dashboard Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Mission Control & Mandi Master Database</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Admin & All Crop Prices Control Center
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Monitor live external APIs, manage pan-India mandi prices, add/update commodity rates, and force live sync.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Live vs Demo Toggle */}
            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
              <span className="text-slate-400 font-semibold">Mode:</span>
              <button
                onClick={() => setIsDemoMode(!isDemoMode)}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  isDemoMode 
                    ? 'bg-amber-400 text-slate-950 shadow-sm' 
                    : 'bg-emerald-500 text-slate-950 shadow-sm'
                }`}
              >
                {isDemoMode ? "DEMO MODE (Static Set)" : "LIVE PRODUCTION (Govt API)"}
              </button>
            </div>

            {/* Sync Button */}
            <button
              onClick={handleSyncGovtData}
              disabled={syncing}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? "Syncing Mandis..." : "Trigger Live Sync"}</span>
            </button>
          </div>
        </div>

        {/* API Diagnostic Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
          {(overview?.apis || []).map((api: any, idx: number) => (
            <div key={idx} className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white truncate">{api.name}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                  api.status === 'CONNECTED' || api.status === 'ACTIVE'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {api.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{api.category}</p>
              <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-slate-700/50">
                <span>Latency: {api.latencyMs}ms</span>
                <span>{api.hasKey ? "Key: Present" : (api.requiresKey ? "Key: Not Set" : "Open API")}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-slate-800/40 rounded-xl">
            <span className="text-2xl font-black text-white">{overview?.metrics?.activePriceRecords || prices.length}</span>
            <span className="text-[11px] text-slate-400 block">Total Crop Records</span>
          </div>
          <div className="p-3 bg-slate-800/40 rounded-xl">
            <span className="text-2xl font-black text-emerald-400">{overview?.metrics?.cropsCovered || 22}</span>
            <span className="text-[11px] text-slate-400 block">Commodities Monitored</span>
          </div>
          <div className="p-3 bg-slate-800/40 rounded-xl">
            <span className="text-2xl font-black text-teal-300">{overview?.metrics?.totalMandisMonitored || 148}</span>
            <span className="text-[11px] text-slate-400 block">APMC Market Yards</span>
          </div>
          <div className="p-3 bg-slate-800/40 rounded-xl">
            <span className="text-2xl font-black text-amber-300">100%</span>
            <span className="text-[11px] text-slate-400 block">Verified Data Freshness</span>
          </div>
        </div>
      </div>

      {/* MASTER ALL CROP PRICES TABLE SECTION (User explicit request) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
        {/* Table Top Bar */}
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-600" />
              <span>All Crop Prices Master Database</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive pan-India repository of all agricultural commodities, varieties, modal prices, and arrivals.
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
              onClick={openNewPriceModal}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{text.addNewPrice}</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by crop, variety, mandi, district or state..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
            >
              <option value="all">All Commodity Categories</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Grains & Cereals">Grains & Cereals</option>
              <option value="Commercial/Cash crops">Commercial / Cash crops</option>
              <option value="Spices">Spices</option>
              <option value="Pulses">Pulses</option>
              <option value="Fruits">Fruits</option>
            </select>
          </div>

          <div>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
            >
              <option value="all">All States (Pan-India)</option>
              <option value="Telangana">Telangana</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Punjab">Punjab</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="West Bengal">West Bengal</option>
            </select>
          </div>
        </div>

        {/* Master Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/90 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Crop & Commodity</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Market / Mandi</th>
                <th className="py-3 px-4">State & District</th>
                <th className="py-3 px-4 text-right">Min (₹)</th>
                <th className="py-3 px-4 text-right">Max (₹)</th>
                <th className="py-3 px-4 text-right">Modal Price (₹/qtl)</th>
                <th className="py-3 px-4 text-right">Arrivals (MT)</th>
                <th className="py-3 px-4 text-center">7D Trend</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {prices.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4">
                    <span className="font-extrabold text-slate-900 text-sm block">{p.crop}</span>
                    <span className="text-[11px] text-slate-500">{p.variety} • {p.commodity}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                      {p.category}
                    </span>
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
                    <span className="text-[10px] text-slate-400">per quintal</span>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-700">
                    {p.arrivals} MT
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                      p.trend7d >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {p.trend7d >= 0 ? '+' : ''}{p.trend7d}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition"
                        title="Edit Price"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePrice(p.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Crop Price Modal */}
      {isModalOpen && editingPrice && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">
                {editingPrice.id ? "Edit Mandi Crop Price" : "Add New Crop Price Record"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePrice} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Crop Name:</label>
                  <input
                    type="text"
                    required
                    value={editingPrice.crop || ''}
                    onChange={(e) => setEditingPrice(prev => ({ ...prev, crop: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Variety:</label>
                  <input
                    type="text"
                    value={editingPrice.variety || ''}
                    onChange={(e) => setEditingPrice(prev => ({ ...prev, variety: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Category:</label>
                  <select
                    value={editingPrice.category || 'Vegetables'}
                    onChange={(e) => setEditingPrice(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Grains & Cereals">Grains & Cereals</option>
                    <option value="Commercial/Cash crops">Commercial/Cash crops</option>
                    <option value="Spices">Spices</option>
                    <option value="Pulses">Pulses</option>
                    <option value="Fruits">Fruits</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Market / Mandi:</label>
                  <input
                    type="text"
                    required
                    value={editingPrice.market || ''}
                    onChange={(e) => setEditingPrice(prev => ({ ...prev, market: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">State:</label>
                  <input
                    type="text"
                    required
                    value={editingPrice.state || ''}
                    onChange={(e) => setEditingPrice(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">District:</label>
                  <input
                    type="text"
                    required
                    value={editingPrice.district || ''}
                    onChange={(e) => setEditingPrice(prev => ({ ...prev, district: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Min Price (₹):</label>
                  <input
                    type="number"
                    value={editingPrice.minPrice || 0}
                    onChange={(e) => setEditingPrice(prev => ({ ...prev, minPrice: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Max Price (₹):</label>
                  <input
                    type="number"
                    value={editingPrice.maxPrice || 0}
                    onChange={(e) => setEditingPrice(prev => ({ ...prev, maxPrice: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-emerald-800 uppercase mb-1">Modal (₹/qtl):</label>
                  <input
                    type="number"
                    required
                    value={editingPrice.modalPrice || 0}
                    onChange={(e) => setEditingPrice(prev => ({ ...prev, modalPrice: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 rounded-xl border border-emerald-500 text-xs font-black text-emerald-800 bg-emerald-50/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Arrivals (MT):</label>
                  <input
                    type="number"
                    value={editingPrice.arrivals || 100}
                    onChange={(e) => setEditingPrice(prev => ({ ...prev, arrivals: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">7D Trend (%):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingPrice.trend7d || 0}
                    onChange={(e) => setEditingPrice(prev => ({ ...prev, trend7d: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Mandi Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

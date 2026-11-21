import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Phone, 
  Sprout, 
  Layers, 
  Warehouse, 
  CheckCircle2, 
  Save, 
  Globe2, 
  DollarSign, 
  Navigation,
  ShieldCheck,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { Language, FarmerProfile } from '../types';
import { t } from '../translations';

interface FarmerProfilePageProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  profile: FarmerProfile;
  setProfile: React.Dispatch<React.SetStateAction<FarmerProfile>>;
  onSave?: () => void;
}

export const FarmerProfilePage: React.FC<FarmerProfilePageProps> = ({
  language,
  setLanguage,
  profile,
  setProfile,
  onSave
}) => {
  const [formData, setFormData] = useState<FarmerProfile>({ ...profile });
  const [gpsLoading, setGpsLoading] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const text = t[language];

  const states = [
    "Telangana", 
    "Andhra Pradesh", 
    "Karnataka", 
    "Maharashtra", 
    "Tamil Nadu", 
    "Madhya Pradesh", 
    "Punjab", 
    "Haryana", 
    "Uttar Pradesh", 
    "Gujarat"
  ];

  const crops = [
    "Tomato", 
    "Onion", 
    "Chilli", 
    "Cotton", 
    "Rice", 
    "Wheat", 
    "Potato", 
    "Turmeric", 
    "Maize", 
    "Groundnut", 
    "Soybean"
  ];

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Math.round(pos.coords.latitude * 1000) / 1000;
        const lon = Math.round(pos.coords.longitude * 1000) / 1000;
        setFormData(prev => ({
          ...prev,
          latitude: lat,
          longitude: lon,
          hasLocationPermission: true
        }));
        setGpsLoading(false);
      },
      (err) => {
        console.warn("GPS error:", err.message);
        setGpsLoading(false);
        alert("GPS detection timed out. Using current regional coordinates.");
      },
      { timeout: 8000 }
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(formData);
    try {
      localStorage.setItem('blindspot_farmer_profile', JSON.stringify(formData));
    } catch {}
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
    if (onSave) onSave();
  };

  // Typical modal price estimate per quintal for calculation
  const benchmarkPrices: Record<string, number> = {
    Tomato: 2450,
    Chilli: 19800,
    Cotton: 7200,
    Rice: 2380,
    Onion: 1850,
    Wheat: 2275,
    Potato: 1450,
    Turmeric: 12500,
    Maize: 2150,
    Groundnut: 6300,
    Soybean: 4600
  };

  const estPricePerQtl = benchmarkPrices[formData.crop] || 2500;
  const grossEst = estPricePerQtl * formData.quantityAvailableQuintals;
  const haulageEst = Math.round(25 * formData.quantityAvailableQuintals + 35 * 4.2 * formData.quantityAvailableQuintals);
  const netEst = grossEst - haulageEst;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
            <User className="w-4 h-4" />
            <span>Farmer Identity & Farm Profile Setup</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {language === 'te' ? "రైతు ప్రొఫైల్ & వ్యవసాయ వివరాలు" : "Farmer Profile & Agricultural Holdings"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'te'
              ? "మీ పంట, పొలం విస్తీర్ణం మరియు జీపీఎస్ లొకేషన్ వివరాలను నమోదు చేయండి. అన్ని ధరలు మరియు మార్కెట్ సిఫార్సులు మీ వివరాల ప్రకారమే లెక్కించబడతాయి."
              : "Manage your farm holdings, crops, harvest stock, and GPS coordinates to calibrate all real-time market and selling decisions."}
          </p>
        </div>

        {savedToast && (
          <div className="px-4 py-2 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>{language === 'te' ? "ప్రొఫైల్ విజయవంతంగా భద్రపరచబడింది!" : "Profile Saved Successfully!"}</span>
          </div>
        )}
      </div>

      {/* Main Profile Form Grid */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Personal, Location & Language Settings */}
        <div className="lg:col-span-7 space-y-6">
          {/* Personal Identity */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="w-4 h-4 text-emerald-600" />
              <span>{language === 'te' ? "వ్యక్తిగత వివరాలు (Farmer Details)" : "Farmer Personal Details"}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Farmer Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Ramesh Reddy"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Preferred App Language
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage('en');
                      setFormData(prev => ({ ...prev, language: 'en' }));
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition ${
                      language === 'en' 
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    English
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLanguage('te');
                      setFormData(prev => ({ ...prev, language: 'te' }));
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition ${
                      language === 'te' 
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    తెలుగు (Telugu)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Location & GPS Setup */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>{language === 'te' ? "పొలం స్థలం & జీపీఎస్ (Location)" : "Farm Location & GPS Coordinates"}</span>
              </h3>

              <button
                type="button"
                onClick={handleDetectGPS}
                disabled={gpsLoading}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5 border border-emerald-200 transition"
              >
                <Navigation className={`w-3.5 h-3.5 ${gpsLoading ? 'animate-spin' : ''}`} />
                <span>{gpsLoading ? "Detecting..." : (language === 'te' ? "లైవ్ GPS గుర్తించండి" : "Auto-Detect GPS")}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  State
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:border-emerald-600"
                >
                  {states.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  District
                </label>
                <input
                  type="text"
                  required
                  value={formData.district}
                  onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                  placeholder="e.g. Hyderabad / Medchal"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Village / Mandal
                </label>
                <input
                  type="text"
                  required
                  value={formData.village}
                  onChange={(e) => setFormData(prev => ({ ...prev, village: e.target.value }))}
                  placeholder="e.g. Shamirpet Rural"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            {/* GPS Telemetry Pill */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active GPS: <strong>{formData.latitude.toFixed(3)}°N, {formData.longitude.toFixed(3)}°E</strong></span>
              </div>
              <span className="text-[10px] text-slate-500 font-sans">Used for nearest mandi haulage calculation</span>
            </div>
          </div>
        </div>

        {/* Right Column: Crop, Land Size & Financial Projections */}
        <div className="lg:col-span-5 space-y-6">
          {/* Crop & Land Details */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span>{language === 'te' ? "పంట & దిగుబడి పరిమాణం" : "Crop & Farm Size"}</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Primary Crop
                </label>
                <select
                  value={formData.crop}
                  onChange={(e) => setFormData(prev => ({ ...prev, crop: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-emerald-700 bg-white focus:outline-none focus:border-emerald-600"
                >
                  {crops.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Land Size (Acres)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={formData.farmSizeAcres}
                    onChange={(e) => setFormData(prev => ({ ...prev, farmSizeAcres: parseFloat(e.target.value) || 1 }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Ready Stock (Quintals)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    value={formData.quantityAvailableQuintals}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantityAvailableQuintals: parseFloat(e.target.value) || 1 }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Farm Financial Projection Card */}
          <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Live Farm Value
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {formData.crop} Benchmark
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] text-slate-400">Projected Net Crop Value</div>
              <div className="text-3xl font-black text-emerald-400">
                ₹{netEst.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-slate-400">
                Calculated on {formData.quantityAvailableQuintals} Quintals @ ₹{estPricePerQtl}/qtl
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800 text-xs">
              <div className="p-2.5 bg-slate-800/60 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Est. Gross Payout</span>
                <span className="font-bold text-slate-200">₹{grossEst.toLocaleString('en-IN')}</span>
              </div>

              <div className="p-2.5 bg-slate-800/60 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Est. Logistics Cost</span>
                <span className="font-bold text-amber-300">-₹{haulageEst.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{language === 'te' ? "ప్రొఫైల్ వివరాలు భద్రపరచండి" : "Save Farmer Profile & Calibrate App"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

import React, { useState } from 'react';
import { Sprout, MapPin, CheckCircle, ArrowRight, Shield } from 'lucide-react';
import { FarmerProfile, Language } from '../types';
import { t } from '../translations';

interface OnboardingPageProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  profile: FarmerProfile;
  setProfile: React.Dispatch<React.SetStateAction<FarmerProfile>>;
  onComplete: () => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({
  language,
  setLanguage,
  profile,
  setProfile,
  onComplete
}) => {
  const [gpsDetecting, setGpsDetecting] = useState(false);
  const text = t[language];

  const crops = ["Tomato", "Onion", "Chilli", "Cotton", "Rice", "Wheat", "Potato", "Turmeric", "Maize", "Groundnut"];
  const states = [
    { name: "Telangana", districts: ["Hyderabad", "Warangal", "Nalgonda", "Khammam", "Nizamabad", "Karimnagar", "Mahabubnagar", "Adilabad"] },
    { name: "Andhra Pradesh", districts: ["Guntur", "Annamayya (Chittoor)", "Krishna", "Kurnool", "Anantapur", "Prakasam", "Visakhapatnam"] },
    { name: "Maharashtra", districts: ["Nashik", "Pune", "Jalgaon", "Latur", "Nagpur", "Ahmednagar", "Solapur"] },
    { name: "Karnataka", districts: ["Kolar", "Hubballi", "Davanagere", "Kalaburagi", "Belagavi", "Mysuru"] },
    { name: "Madhya Pradesh", districts: ["Indore", "Sehore", "Vidisha", "Mandsaur", "Ujjain"] },
    { name: "Punjab", districts: ["Ludhiana", "Amritsar", "Bathinda", "Patiala", "Jalandhar"] }
  ];

  const handleStateChange = (selectedState: string) => {
    const s = states.find(st => st.name === selectedState);
    setProfile(prev => ({
      ...prev,
      state: selectedState,
      district: s?.districts[0] || prev.district
    }));
  };

  const requestGps = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setGpsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setProfile(prev => ({
          ...prev,
          latitude: Math.round(pos.coords.latitude * 1000) / 1000,
          longitude: Math.round(pos.coords.longitude * 1000) / 1000,
          hasLocationPermission: true
        }));
        setGpsDetecting(false);
      },
      (err) => {
        console.warn("GPS error:", err.message);
        setGpsDetecting(false);
        // Fallback default
        setProfile(prev => ({
          ...prev,
          latitude: 17.385,
          longitude: 78.486,
          state: "Telangana",
          district: "Hyderabad",
          hasLocationPermission: true
        }));
      },
      { timeout: 7000 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  const currentDistricts = states.find(st => st.name === profile.state)?.districts || [profile.district];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 p-6 sm:p-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/30 flex items-center justify-center border border-emerald-400/40">
              <Sprout className="w-6 h-6 text-emerald-300" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black">
              {language === 'te' ? "రైతు ప్రొఫైల్ నమోదు (Farmer Onboarding)" : "Farmer Profile & Farm Registration"}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            {language === 'te' 
              ? "మీ పంట, భూమి పరిమాణం మరియు స్థానాన్ని నమోదు చేయండి. తద్వారా సమీప మార్కెట్లలో ఖచ్చితమైన లైవ్ ధరలు మరియు వాతావరణ హెచ్చరికలు అందించబడతాయి."
              : "Tell us about your crop and farm location to receive verified APMC mandi prices, weather risk alerts, and net-profit buyer recommendations."}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Preferred Language */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Preferred Language / ప్రాధాన్య భాష:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => { setLanguage('en'); setProfile(p => ({ ...p, language: 'en' })); }}
                className={`py-3 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition ${
                  language === 'en'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>English</span>
                {language === 'en' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
              </button>
              <button
                type="button"
                onClick={() => { setLanguage('te'); setProfile(p => ({ ...p, language: 'te' })); }}
                className={`py-3 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition ${
                  language === 'te'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>తెలుగు (Telugu)</span>
                {language === 'te' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
              </button>
            </div>
          </div>

          {/* Farmer Name & Village */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {language === 'te' ? "రైతు పేరు" : "Farmer Full Name"}
              </label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Ramesh Reddy"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {language === 'te' ? "గ్రామం / పట్టణం" : "Village / Town"}
              </label>
              <input
                type="text"
                required
                value={profile.village}
                onChange={(e) => setProfile(p => ({ ...p, village: e.target.value }))}
                placeholder="e.g. Shamirpet"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium"
              />
            </div>
          </div>

          {/* State & District */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {language === 'te' ? "రాష్ట్రం" : "State"}
              </label>
              <select
                value={profile.state}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-semibold bg-white"
              >
                {states.map(s => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {language === 'te' ? "జిల్లా" : "District"}
              </label>
              <select
                value={profile.district}
                onChange={(e) => setProfile(p => ({ ...p, district: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-semibold bg-white"
              >
                {currentDistricts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* GPS Permission Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">
                  {language === 'te' ? "GPS లొకేషన్ అనుమతి (సమీప మార్కెట్లకు)" : "GPS Geolocation for Nearest Mandis"}
                </div>
                <div className="text-[11px] text-slate-500">
                  {profile.hasLocationPermission 
                    ? `Coordinates: ${profile.latitude.toFixed(3)}°N, ${profile.longitude.toFixed(3)}°E` 
                    : "Allows accurate freight distance calculation to APMC market yards."}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={requestGps}
              disabled={gpsDetecting}
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-emerald-500 text-xs font-bold text-slate-800 shadow-sm transition flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{gpsDetecting ? "Detecting..." : (profile.hasLocationPermission ? "GPS Enabled ✓" : "Enable GPS")}</span>
            </button>
          </div>

          {/* Crop, Farm Size & Quantity Available */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {language === 'te' ? "పంట" : "Primary Crop"}
              </label>
              <select
                value={profile.crop}
                onChange={(e) => setProfile(p => ({ ...p, crop: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-bold text-emerald-800 bg-white"
              >
                {crops.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {language === 'te' ? "భూమి (ఎకరాలు)" : "Farm Size (Acres)"}
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={profile.farmSizeAcres}
                onChange={(e) => setProfile(p => ({ ...p, farmSizeAcres: parseFloat(e.target.value) || 1 }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {language === 'te' ? "అందుబాటులో ఉన్న నిల్వ (క్వింటాళ్ళు)" : "Ready Harvest (Quintals)"}
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={profile.quantityAvailableQuintals}
                onChange={(e) => setProfile(p => ({ ...p, quantityAvailableQuintals: parseFloat(e.target.value) || 1 }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-semibold"
              />
            </div>
          </div>

          {/* Privacy Note */}
          <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
            <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              {language === 'te'
                ? "మీ సమాచారం భద్రంగా ఉంటుంది. వ్యక్తిగత డేటా ఏ ఇతర సంస్థలకు విక్రయించబడదు."
                : "Your farmer details are stored securely. We do not expose private farmer data publicly."}
            </span>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2"
          >
            <span>{language === 'te' ? "డ్యాష్‌బోర్డ్ తెరవండి" : "Save Profile & Enter Intelligence Dashboard"}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

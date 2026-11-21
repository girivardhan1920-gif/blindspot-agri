import React, { useState } from 'react';
import { 
  Sprout, 
  MapPin, 
  Globe2, 
  Menu, 
  X, 
  ShieldCheck, 
  Compass, 
  TrendingUp, 
  Scan, 
  CloudSun, 
  DollarSign, 
  Users, 
  HelpCircle,
  Database,
  Calendar,
  Lock,
  User,
  Scale
} from 'lucide-react';
import { Language, FarmerProfile } from '../types';
import { t } from '../translations';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  profile: FarmerProfile;
  setProfile: React.Dispatch<React.SetStateAction<FarmerProfile>>;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  language,
  setLanguage,
  profile,
  setProfile,
  isDemoMode,
  setIsDemoMode
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const text = t[language];

  const crops = ["Tomato", "Onion", "Chilli", "Cotton", "Rice", "Wheat", "Potato", "Turmeric", "Maize", "Groundnut"];

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setProfile(prev => ({
          ...prev,
          latitude: Math.round(pos.coords.latitude * 1000) / 1000,
          longitude: Math.round(pos.coords.longitude * 1000) / 1000,
          hasLocationPermission: true
        }));
        setGpsLoading(false);
      },
      (err) => {
        console.warn("GPS error:", err.message);
        setGpsLoading(false);
        // Default to Hyderabad
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

  // Strictly the core streamlined features requested by the user
  const coreNavItems = [
    { id: 'dashboard', label: language === 'te' ? 'డ్యాష్‌బోర్డ్' : 'Dashboard', icon: Compass },
    { id: 'profile', label: language === 'te' ? 'రైతు ప్రొఫైల్' : 'Farmer Profile', icon: User },
    { id: 'scanner', label: language === 'te' ? 'పంట స్కానర్' : 'Crop Scanner', icon: Scan },
    { id: 'prices', label: language === 'te' ? 'మార్కెట్ ధరలు' : 'Market Prices', icon: DollarSign },
    { id: 'seasonal', label: language === 'te' ? 'కాలానుగుణ విశ్లేషణ' : 'Seasonal Analysis', icon: Calendar },
    { id: 'buyers', label: language === 'te' ? 'సమీప కొనుగోలుదారులు' : 'Nearby Buyers (Ratings)', icon: Users },
    { id: 'comparison', label: language === 'te' ? 'మార్కెట్ల పోలిక' : 'Buyer Comparison', icon: Scale },
    { id: 'weather', label: language === 'te' ? 'వాతావరణం' : 'Weather Intelligence', icon: CloudSun },
    { id: 'assistant', label: language === 'te' ? 'తెలుగు AI మిత్రుడు' : 'Telugu AI Assistant', icon: HelpCircle },
    { id: 'crops', label: language === 'te' ? 'పంటల సమాచారం' : 'Crop Profiles', icon: Sprout }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Utility Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium text-slate-200">
            {isDemoMode ? text.demoModeNotice : text.liveDataNotice}
          </span>
          <span className="text-slate-500">|</span>
          <button 
            onClick={() => setIsDemoMode(!isDemoMode)}
            className="text-xs text-amber-300 hover:text-amber-200 underline font-mono"
          >
            {isDemoMode ? "[Switch to Live Verified]" : "[Toggle Demo Mode]"}
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Location Badge */}
          <button 
            onClick={detectLocation}
            disabled={gpsLoading}
            className="flex items-center gap-1.5 text-xs text-slate-200 hover:text-emerald-400 transition"
            title="Click to detect GPS location"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {gpsLoading ? "Detecting GPS..." : `${profile.district || "Hyderabad"}, ${profile.state || "TS"} (${profile.latitude.toFixed(2)}°N, ${profile.longitude.toFixed(2)}°E)`}
            </span>
          </button>

          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-slate-800 rounded-md p-0.5 border border-slate-700">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded text-xs font-medium transition ${language === 'en' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('te')}
              className={`px-2 py-0.5 rounded text-xs font-medium transition ${language === 'te' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              తెలుగు
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Brand */}
        <div 
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-3 cursor-pointer select-none group flex-shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-700 transition">
              BlindSpot <span className="text-emerald-600 font-black">Agri</span>
            </div>
            <div className="text-[10px] text-slate-500 tracking-wide font-medium hidden sm:block">
              {text.tagline}
            </div>
          </div>
        </div>

        {/* Crop Selector Bar */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-100/90 border border-slate-200/80 rounded-lg px-2.5 py-1 flex-shrink-0">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Crop:</span>
          <select
            value={profile.crop}
            onChange={(e) => setProfile(prev => ({ ...prev, crop: e.target.value }))}
            className="bg-transparent text-sm font-semibold text-emerald-800 focus:outline-none cursor-pointer"
          >
            {crops.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Desktop Quick Nav Links - Core Clean Items */}
        <nav className="hidden 2xl:flex items-center gap-1 overflow-x-auto no-scrollbar">
          {coreNavItems.map((item) => {
            const Icon = item.icon;
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  active 
                    ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Buttons: Sell Smart & Private Admin (Only Me) */}
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setCurrentView('sell-smart')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm transition ${
              currentView === 'sell-smart'
                ? 'bg-emerald-700 text-white shadow-emerald-700/20'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{text.sellSmart}</span>
          </button>

          {/* Secure Admin Page - Access Only Me */}
          <button
            onClick={() => setCurrentView('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              currentView === 'admin'
                ? 'bg-rose-950 text-rose-300 border-rose-800 shadow-sm'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-100 border-slate-800'
            }`}
            title="Separate Admin Page - Access Only For Owner"
          >
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <span>Admin (Only Me)</span>
          </button>
        </div>

        {/* Mobile menu hamburger */}
        <div className="flex 2xl:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile / Compact Screen Drawer */}
      {mobileMenuOpen && (
        <div className="2xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-8 space-y-4 max-h-[85vh] overflow-y-auto">
          <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200">
            <span className="text-xs font-semibold text-slate-600">Selected Crop:</span>
            <select
              value={profile.crop}
              onChange={(e) => setProfile(prev => ({ ...prev, crop: e.target.value }))}
              className="bg-white border border-slate-200 text-sm font-bold text-emerald-700 rounded-lg px-2.5 py-1"
            >
              {crops.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {coreNavItems.map((item) => {
              const Icon = item.icon;
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition ${
                    active 
                      ? 'bg-emerald-600 text-white font-bold' 
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setCurrentView('sell-smart');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{text.sellSmart}</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 border border-slate-800 shadow-sm"
            >
              <Lock className="w-4 h-4 text-rose-400" />
              <span>Admin Console (Access Only Me)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

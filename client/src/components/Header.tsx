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
  BarChart3,
  Calendar,
  AlertTriangle,
  Lightbulb
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

  const navItems = [
    { id: 'dashboard', label: text.dashboard, icon: Compass },
    { id: 'scanner', label: text.cropScanner, icon: Scan },
    { id: 'prices', label: text.marketPrices, icon: DollarSign },
    { id: 'trends', label: text.priceTrends, icon: TrendingUp },
    { id: 'demand-supply', label: text.demandSupply, icon: BarChart3 },
    { id: 'seasonal', label: text.seasonalPattern, icon: Calendar },
    { id: 'forecast', label: text.priceForecast, icon: Lightbulb },
    { id: 'buyers', label: text.nearbyBuyers, icon: Users },
    { id: 'sell-smart', label: text.sellSmart, icon: ShieldCheck, highlight: true },
    { id: 'weather', label: text.weather, icon: CloudSun },
    { id: 'assistant', label: text.aiAssistant, icon: HelpCircle },
    { id: 'admin', label: text.adminCenter, icon: Database, admin: true }
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
          className="flex items-center gap-3 cursor-pointer select-none group"
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
        <div className="hidden md:flex items-center gap-2 bg-slate-100/90 border border-slate-200/80 rounded-lg px-2.5 py-1">
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

        {/* Desktop Quick Nav Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navItems.slice(0, 8).map((item) => {
            const Icon = item.icon;
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  active 
                    ? 'bg-emerald-50 text-emerald-700 font-bold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => setCurrentView('sell-smart')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition ${
              currentView === 'sell-smart'
                ? 'bg-emerald-700 text-white shadow-emerald-700/20'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{text.sellSmart}</span>
          </button>

          <button
            onClick={() => setCurrentView('admin')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
              currentView === 'admin'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
            }`}
            title="Open Admin & All Crop Prices Control Center"
          >
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>{text.adminCenter}</span>
          </button>
        </div>

        {/* Mobile menu hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 max-h-[80vh] overflow-y-auto">
          <div className="mb-3 p-2 bg-slate-50 rounded-lg flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Selected Crop:</span>
            <select
              value={profile.crop}
              onChange={(e) => setProfile(prev => ({ ...prev, crop: e.target.value }))}
              className="bg-white border border-slate-200 text-sm font-bold text-emerald-700 rounded px-2 py-1"
            >
              {crops.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition ${
                    active 
                      ? 'bg-emerald-600 text-white' 
                      : item.admin
                      ? 'bg-slate-900 text-white font-bold'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

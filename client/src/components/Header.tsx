import React, { useState, useRef, useEffect } from 'react';
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
  Lightbulb,
  LayoutGrid,
  ChevronDown,
  UserCheck,
  FileText,
  ExternalLink,
  Sparkles
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
  const [featuresDropdownOpen, setFeaturesDropdownOpen] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const text = t[language];

  const crops = ["Tomato", "Onion", "Chilli", "Cotton", "Rice", "Wheat", "Potato", "Turmeric", "Maize", "Groundnut"];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setFeaturesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const featureGroups = [
    {
      groupName: "AI & Diagnostics",
      groupNameTe: "AI & పంట రక్షణ",
      items: [
        { id: 'scanner', path: '/scanner', label: 'AI Crop Health Scanner', labelTe: 'AI పంట స్కానర్', icon: Scan },
        { id: 'assistant', path: '/assistant', label: 'Telugu AI Assistant', labelTe: 'తెలుగు AI మిత్రుడు', icon: HelpCircle },
        { id: 'sell-smart', path: '/sell-smart', label: 'Sell Smart Recommendation', labelTe: 'స్మార్ట్ విక్రయ సలహా', icon: ShieldCheck, highlight: true }
      ]
    },
    {
      groupName: "Market Intelligence",
      groupNameTe: "మార్కెట్ విశ్లేషణ",
      items: [
        { id: 'prices', path: '/prices', label: 'Live Mandi Prices', labelTe: 'ప్రత్యక్ష మార్కెట్ ధరలు', icon: DollarSign },
        { id: 'trends', path: '/trends', label: 'Price Trends & Volatility', labelTe: 'ధరల ట్రెండ్స్', icon: TrendingUp },
        { id: 'demand-supply', path: '/demand-supply', label: 'Demand & Supply', labelTe: 'డిమాండ్ & సరఫరా', icon: BarChart3 },
        { id: 'seasonal', path: '/seasonal', label: 'Seasonal Patterns', labelTe: 'కాలానుగుణ నమూనాలు', icon: Calendar },
        { id: 'forecast', path: '/forecast', label: 'AI Price Forecast', labelTe: 'ధరల ముందస్తు అంచనా', icon: Lightbulb }
      ]
    },
    {
      groupName: "Trade & Buyers",
      groupNameTe: "అమ్మకాలు & కొనుగోలుదారులు",
      items: [
        { id: 'buyers', path: '/buyers', label: 'Nearby Buyers & Mandis', labelTe: 'సమీప కొనుగోలుదారులు', icon: Users },
        { id: 'comparison', path: '/comparison', label: 'Buyer Net Revenue Comparison', labelTe: 'మార్కెట్ల పోలిక', icon: ShieldCheck }
      ]
    },
    {
      groupName: "Weather & Agronomy",
      groupNameTe: "వాతావరణం & సాగు",
      items: [
        { id: 'weather', path: '/weather', label: 'Hyperlocal Weather', labelTe: 'వాతావరణ సమాచారం', icon: CloudSun },
        { id: 'crops', path: '/crops', label: 'Crop Agronomic Profiles', labelTe: 'పంటల సమగ్ర సమాచారం', icon: Sprout },
        { id: 'alerts', path: '/alerts', label: 'Crop Risk Alerts', labelTe: 'రిస్క్ హెచ్చరికలు', icon: AlertTriangle }
      ]
    },
    {
      groupName: "Platform & Tools",
      groupNameTe: "సిస్టమ్ & అడ్మిన్",
      items: [
        { id: 'dashboard', path: '/dashboard', label: 'Farmer Dashboard', labelTe: 'రైతు డ్యాష్‌బోర్డ్', icon: Compass },
        { id: 'onboarding', path: '/onboarding', label: 'Farmer Onboarding & GPS', labelTe: 'ప్రొఫైల్ నమోదు', icon: UserCheck },
        { id: 'sources', path: '/sources', label: 'Verified Data Sources', labelTe: 'అధికారిక వనరులు', icon: FileText },
        { id: 'admin', path: '/admin', label: 'Admin & System Control', labelTe: 'అడ్మిన్ సెంటర్', icon: Database, admin: true }
      ]
    }
  ];

  const primaryNavItems = [
    { id: 'dashboard', label: text.dashboard, icon: Compass },
    { id: 'scanner', label: text.cropScanner, icon: Scan },
    { id: 'prices', label: text.marketPrices, icon: DollarSign },
    { id: 'trends', label: text.priceTrends, icon: TrendingUp },
    { id: 'buyers', label: text.nearbyBuyers, icon: Users },
    { id: 'weather', label: text.weather, icon: CloudSun },
    { id: 'assistant', label: text.aiAssistant, icon: HelpCircle }
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
        <div className="hidden lg:flex items-center gap-2 bg-slate-100/90 border border-slate-200/80 rounded-lg px-2.5 py-1">
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
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
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

          {/* ALL 18 PAGES MEGA-DROPDOWN */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setFeaturesDropdownOpen(!featuresDropdownOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                currentView === 'features' || featuresDropdownOpen
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{language === 'te' ? "అన్ని పేజీలు (18)" : "All Pages (18)"}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${featuresDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {featuresDropdownOpen && (
              <div className="absolute right-0 mt-2 w-[720px] bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4 text-emerald-600" />
                    <span className="font-black text-slate-900 text-sm">
                      {language === 'te' ? "అన్ని ఫీచర్ పేజీల డైరెక్టరీ" : "All 18 Dedicated Feature Pages"}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentView('features');
                      setFeaturesDropdownOpen(false);
                    }}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <span>{language === 'te' ? "డైరెక్టరీ చూడండి" : "View Full Catalog"}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-6 text-xs">
                  {featureGroups.map((group, gIdx) => (
                    <div key={gIdx} className="space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block border-b border-slate-100 pb-1">
                        {language === 'te' ? group.groupNameTe : group.groupName}
                      </span>
                      <div className="space-y-1">
                        {group.items.map((feat) => {
                          const FeatIcon = feat.icon;
                          const isActive = currentView === feat.id;
                          return (
                            <button
                              key={feat.id}
                              onClick={() => {
                                setCurrentView(feat.id);
                                setFeaturesDropdownOpen(false);
                              }}
                              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-left transition font-medium ${
                                isActive 
                                  ? 'bg-emerald-600 text-white font-bold' 
                                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
                              }`}
                            >
                              <FeatIcon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                              <span className="truncate">{language === 'te' ? feat.labelTe : feat.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
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
            title="Open Admin & API System Status"
          >
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>{text.adminCenter}</span>
          </button>
        </div>

        {/* Mobile menu hamburger */}
        <div className="flex xl:hidden items-center gap-2">
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
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-8 space-y-4 max-h-[85vh] overflow-y-auto">
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

          <button
            onClick={() => {
              setCurrentView('features');
              setMobileMenuOpen(false);
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>{language === 'te' ? "అన్ని 18 ప్రత్యేక పేజీల డైరెక్టరీ" : "All 18 Dedicated Pages Directory"}</span>
          </button>

          <div className="space-y-4">
            {featureGroups.map((group, idx) => (
              <div key={idx} className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-1">
                  {language === 'te' ? group.groupNameTe : group.groupName}
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = currentView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setCurrentView(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-left transition ${
                          active 
                            ? 'bg-emerald-600 text-white font-bold' 
                            : item.admin
                            ? 'bg-slate-900 text-white font-bold'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{language === 'te' ? item.labelTe : item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

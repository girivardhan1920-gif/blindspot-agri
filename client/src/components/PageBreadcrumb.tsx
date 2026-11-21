import React from 'react';
import { ChevronRight, Home, LayoutGrid, ArrowLeft, ExternalLink } from 'lucide-react';
import { Language } from '../types';

interface PageBreadcrumbProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  language: Language;
}

export const allFeaturePages = [
  { id: 'dashboard', path: '/dashboard', label: 'Farmer Dashboard', labelTe: 'రైతు డ్యాష్‌బోర్డ్', category: 'Overview' },
  { id: 'scanner', path: '/scanner', label: 'AI Crop Health Scanner', labelTe: 'AI పంట ఆరోగ్య స్కానర్', category: 'AI & Diagnostics' },
  { id: 'prices', path: '/prices', label: 'Live Market Prices', labelTe: 'ప్రత్యక్ష మార్కెట్ ధరలు', category: 'Market Intelligence' },
  { id: 'trends', path: '/trends', label: 'Price Trends & Volatility', labelTe: 'ధరల ట్రెండ్స్ & హెచ్చుతగ్గులు', category: 'Market Intelligence' },
  { id: 'demand-supply', path: '/demand-supply', label: 'Demand & Supply Analytics', labelTe: 'డిమాండ్ & సరఫరా విశ్లేషణ', category: 'Market Intelligence' },
  { id: 'seasonal', path: '/seasonal', label: 'Seasonal Price Patterns', labelTe: 'కాలానుగుణ ధరల నమూనాలు', category: 'Market Intelligence' },
  { id: 'forecast', path: '/forecast', label: 'AI Price Forecast', labelTe: 'ధరల ముందస్తు అంచనా', category: 'Market Intelligence' },
  { id: 'buyers', path: '/buyers', label: 'Nearby Buyers & Mandis', labelTe: 'సమీప కొనుగోలుదారులు', category: 'Sales & Trade' },
  { id: 'comparison', path: '/comparison', label: 'Buyer Net Revenue Comparison', labelTe: 'మార్కెట్ల నికర లాభం పోలిక', category: 'Sales & Trade' },
  { id: 'sell-smart', path: '/sell-smart', label: 'Smart Selling Recommendation', labelTe: 'స్మార్ట్ విక్రయ సిఫార్సు (SELL SMART)', category: 'Sales & Trade' },
  { id: 'weather', path: '/weather', label: 'Hyperlocal Weather Intelligence', labelTe: 'వాతావరణ సమాచారం', category: 'Field & Agronomy' },
  { id: 'assistant', path: '/assistant', label: 'Telugu AI Farmer Assistant', labelTe: 'తెలుగు AI రైతు మిత్రుడు', category: 'AI & Diagnostics' },
  { id: 'crops', path: '/crops', label: 'Crop Information Profiles', labelTe: 'పంటల సమగ్ర సమాచారం', category: 'Field & Agronomy' },
  { id: 'alerts', path: '/alerts', label: 'Real-Time Crop Risk Alerts', labelTe: 'వాతావరణ & మార్కెట్ హెచ్చరికలు', category: 'Field & Agronomy' },
  { id: 'sources', path: '/sources', label: 'Data Sources & Transparency', labelTe: 'అధికారిక డేటా వనరులు', category: 'System & Admin' },
  { id: 'admin', path: '/admin', label: 'Admin & API Control Center', labelTe: 'అడ్మిన్ & ఏపీఐ స్థితి', category: 'System & Admin' },
  { id: 'onboarding', path: '/onboarding', label: 'Farmer Onboarding & GPS', labelTe: 'రైతు ప్రొఫైల్ నమోదు', category: 'Overview' },
  { id: 'features', path: '/features', label: 'All Features Directory', labelTe: 'అన్ని ఫీచర్ల జాబితా', category: 'Overview' }
];

export const PageBreadcrumb: React.FC<PageBreadcrumbProps> = ({ currentView, setCurrentView, language }) => {
  if (currentView === 'landing') return null;

  const currentFeature = allFeaturePages.find(f => f.id === currentView);
  const currentTitle = language === 'te' ? (currentFeature?.labelTe || currentFeature?.label) : currentFeature?.label;

  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Breadcrumb Path */}
        <div className="flex items-center gap-1.5 text-slate-500 font-medium overflow-x-auto no-scrollbar">
          <button
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-1 text-slate-600 hover:text-emerald-700 font-semibold transition"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />

          <button
            onClick={() => setCurrentView('features')}
            className="flex items-center gap-1 text-slate-600 hover:text-emerald-700 font-semibold transition"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>{language === 'te' ? "అన్ని ఫీచర్లు (Features)" : "Features"}</span>
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />

          <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 truncate">
            {currentTitle || currentView}
          </span>

          {currentFeature?.path && (
            <span className="hidden md:inline-block font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
              {currentFeature.path}
            </span>
          )}
        </div>

        {/* Quick-Jump to Another Feature Page */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('features')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center gap-1 transition"
            title="View all 18 dedicated feature pages"
          >
            <LayoutGrid className="w-3 h-3 text-emerald-600" />
            <span>{language === 'te' ? "అన్ని పేజీలు చూడండి" : "All 18 Pages"}</span>
          </button>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
            <span className="text-[10px] font-semibold text-slate-500 uppercase">Go To:</span>
            <select
              value={currentView}
              onChange={(e) => setCurrentView(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              {allFeaturePages.filter(f => f.id !== 'features').map((feat) => (
                <option key={feat.id} value={feat.id}>
                  {language === 'te' ? feat.labelTe : feat.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

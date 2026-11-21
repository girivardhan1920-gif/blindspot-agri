import React from 'react';
import { ChevronRight, Home, LayoutGrid, ArrowLeft, ExternalLink, Lock } from 'lucide-react';
import { Language } from '../types';

interface PageBreadcrumbProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  language: Language;
}

export const coreFeaturePages = [
  { id: 'dashboard', path: '/dashboard', label: 'Farmer Dashboard', labelTe: 'రైతు డ్యాష్‌బోర్డ్' },
  { id: 'profile', path: '/profile', label: 'Farmer Profile & Holdings', labelTe: 'రైతు ప్రొఫైల్' },
  { id: 'scanner', path: '/scanner', label: 'Crop Health Scanner', labelTe: 'పంట ఆరోగ్య స్కానర్' },
  { id: 'prices', path: '/prices', label: 'Live Market Prices', labelTe: 'ప్రత్యక్ష మార్కెట్ ధరలు' },
  { id: 'seasonal', path: '/seasonal', label: 'Seasonal Analysis', labelTe: 'కాలానుగుణ విశ్లేషణ' },
  { id: 'buyers', path: '/buyers', label: 'Nearby Buyers (With Ratings)', labelTe: 'సమీప కొనుగోలుదారులు' },
  { id: 'comparison', path: '/comparison', label: 'Buyer Net Revenue Comparison', labelTe: 'మార్కెట్ల నికర లాభం పోలిక' },
  { id: 'sell-smart', path: '/sell-smart', label: 'Smart Selling Recommendation', labelTe: 'స్మార్ట్ విక్రయ సిఫార్సు (SELL SMART)' },
  { id: 'weather', path: '/weather', label: 'Weather Intelligence', labelTe: 'వాతావరణ సమాచారం' },
  { id: 'assistant', path: '/assistant', label: 'Telugu AI Farmer Assistant', labelTe: 'తెలుగు AI రైతు మిత్రుడు' },
  { id: 'crops', path: '/crops', label: 'Crop Information Profiles', labelTe: 'పంటల సమగ్ర సమాచారం' },
  { id: 'admin', path: '/admin', label: 'Owner Admin Console (Only Me)', labelTe: 'అడ్మిన్ సెంటర్ (Only Me)' }
];

export const PageBreadcrumb: React.FC<PageBreadcrumbProps> = ({ currentView, setCurrentView, language }) => {
  if (currentView === 'landing') return null;

  const currentFeature = coreFeaturePages.find(f => f.id === currentView);
  const currentTitle = language === 'te' ? (currentFeature?.labelTe || currentFeature?.label) : currentFeature?.label;

  return (
    <div className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Breadcrumb Trail */}
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
            onClick={() => setCurrentView('dashboard')}
            className="text-slate-600 hover:text-emerald-700 font-semibold transition"
          >
            {language === 'te' ? "డ్యాష్‌బోర్డ్" : "Dashboard"}
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />

          <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 truncate flex items-center gap-1">
            {currentView === 'admin' && <Lock className="w-3 h-3 text-rose-500" />}
            <span>{currentTitle || currentView}</span>
          </span>

          {currentFeature?.path && (
            <span className="hidden md:inline-block font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
              {currentFeature.path}
            </span>
          )}
        </div>

        {/* Quick-Jump to Any Core Feature */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Go To:</span>
            <select
              value={currentView}
              onChange={(e) => setCurrentView(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              {coreFeaturePages.map((feat) => (
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

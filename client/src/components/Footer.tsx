import React from 'react';
import { Sprout, Shield, PhoneCall, ExternalLink, Heart } from 'lucide-react';
import { Language } from '../types';
import { t } from '../translations';

interface FooterProps {
  language: Language;
  setCurrentView: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ language, setCurrentView }) => {
  const text = t[language];

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                BlindSpot <span className="text-emerald-400">Agri</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {text.tagline} {text.heroSubtitle}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs text-emerald-400">
              <Shield className="w-3.5 h-3.5" />
              <span>Zero Hardcoded Data Guarantee</span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Intelligence Modules</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setCurrentView('dashboard')} className="hover:text-white transition">Farmer Dashboard</button></li>
              <li><button onClick={() => setCurrentView('scanner')} className="hover:text-white transition">AI Crop Health Scanner</button></li>
              <li><button onClick={() => setCurrentView('prices')} className="hover:text-white transition">Live Mandi Prices</button></li>
              <li><button onClick={() => setCurrentView('trends')} className="hover:text-white transition">Price Trends & Volatility</button></li>
              <li><button onClick={() => setCurrentView('demand-supply')} className="hover:text-white transition">Arrivals & Demand Pressure</button></li>
              <li><button onClick={() => setCurrentView('sell-smart')} className="hover:text-white transition font-semibold text-emerald-400">Smart Selling Advisor</button></li>
            </ul>
          </div>

          {/* Transparency & Verified Sources */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Data Transparency</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="https://agmarknet.gov.in" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white transition">
                  <span>Agmarknet (Ministry of Agriculture)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://data.gov.in" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white transition">
                  <span>data.gov.in Open Data</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://open-meteo.com" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white transition">
                  <span>Open-Meteo High-Res Weather</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <button onClick={() => setCurrentView('sources')} className="text-emerald-400 hover:underline">
                  Full API Transparency Log →
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('admin')} className="text-amber-400 hover:underline font-mono">
                  Admin & All Crop Prices Portal →
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency & Support */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Farmer Helpline</h4>
            <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <PhoneCall className="w-4 h-4" />
                <span>Kisan Call Center (Toll Free)</span>
              </div>
              <div className="text-lg font-black text-white tracking-wide">
                1800-180-1551
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Government of India agricultural extension advice available 6:00 AM to 10:00 PM in all Indian languages.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} BlindSpot Agri Intelligence. All rights reserved.</p>
          <p className="text-center sm:text-right text-[11px]">
            Notice: Market forecasts and AI health advisories are decision-support estimates. Actual APMC mandi auctions may vary based on local spot transactions.
          </p>
        </div>
      </div>
    </footer>
  );
};

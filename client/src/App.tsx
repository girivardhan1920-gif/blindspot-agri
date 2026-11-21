import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PageBreadcrumb } from './components/PageBreadcrumb';
import { LandingPage } from './pages/LandingPage';
import { FarmerProfilePage } from './pages/FarmerProfilePage';
import { DashboardPage } from './pages/DashboardPage';
import { CropScannerPage } from './pages/CropScannerPage';
import { WeatherPage } from './pages/WeatherPage';
import { MarketPricesPage } from './pages/MarketPricesPage';
import { SeasonalPage } from './pages/SeasonalPage';
import { NearbyMarketsPage } from './pages/NearbyMarketsPage';
import { BuyerComparisonPage } from './pages/BuyerComparisonPage';
import { SellSmartPage } from './pages/SellSmartPage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { CropProfilesPage } from './pages/CropProfilesPage';
import { AdminPage } from './pages/AdminPage';
import { FarmerProfile, Language } from './types';

// Clean route mapping matching the user's explicit features
const pathToViewMap: Record<string, string> = {
  '/': 'landing',
  '/landing': 'landing',
  '/dashboard': 'dashboard',
  '/profile': 'profile',
  '/farmer-profile': 'profile',
  '/onboarding': 'profile',
  '/scanner': 'scanner',
  '/crop-scanner': 'scanner',
  '/prices': 'prices',
  '/market-prices': 'prices',
  '/seasonal': 'seasonal',
  '/seasonal-analysis': 'seasonal',
  '/buyers': 'buyers',
  '/nearby-buyers': 'buyers',
  '/comparison': 'comparison',
  '/buyer-comparison': 'comparison',
  '/sell-smart': 'sell-smart',
  '/weather': 'weather',
  '/weather-intelligence': 'weather',
  '/assistant': 'assistant',
  '/ai-assistant': 'assistant',
  '/crops': 'crops',
  '/crop-profiles': 'crops',
  '/admin': 'admin'
};

const viewToPathMap: Record<string, string> = {
  landing: '/',
  dashboard: '/dashboard',
  profile: '/profile',
  scanner: '/scanner',
  prices: '/prices',
  seasonal: '/seasonal',
  buyers: '/buyers',
  comparison: '/comparison',
  'sell-smart': '/sell-smart',
  weather: '/weather',
  assistant: '/assistant',
  crops: '/crops',
  admin: '/admin'
};

export const App: React.FC = () => {
  // Determine initial view from browser URL or hash
  const getInitialView = (): string => {
    try {
      const hash = window.location.hash.replace(/^#\/?/, '/');
      const pathname = window.location.pathname;
      const target = (hash && hash !== '/') ? hash : pathname;
      const cleaned = target.toLowerCase().replace(/\/$/, '') || '/';
      return pathToViewMap[cleaned] || 'landing';
    } catch {
      return 'landing';
    }
  };

  const [currentView, setCurrentViewState] = useState<string>(getInitialView);
  const [language, setLanguage] = useState<Language>('en');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Load initial profile from localStorage if exists
  const [profile, setProfile] = useState<FarmerProfile>(() => {
    try {
      const saved = localStorage.getItem('blindspot_farmer_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      name: "Ramesh Reddy",
      state: "Telangana",
      district: "Hyderabad",
      village: "Shamirpet Rural",
      crop: "Tomato",
      farmSizeAcres: 3.5,
      quantityAvailableQuintals: 25,
      language: "en",
      latitude: 17.385,
      longitude: 78.486,
      hasLocationPermission: true
    };
  });

  // Navigate function that updates state and synchronizes browser URL
  const setCurrentView = (view: string, pushHistory: boolean = true) => {
    setCurrentViewState(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (pushHistory) {
      const path = viewToPathMap[view] || `/${view}`;
      if (window.location.pathname !== path) {
        window.history.pushState({ view }, '', path);
      }
    }
  };

  // Listen to browser Back / Forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const path = (window.location.pathname.toLowerCase().replace(/\/$/, '') || '/');
      const view = pathToViewMap[path] || 'landing';
      setCurrentViewState(view);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update document title for each dedicated page
  useEffect(() => {
    const pageTitles: Record<string, string> = {
      landing: "BlindSpot Agri — AI-Powered Agriculture Intelligence Platform",
      dashboard: "Farmer Daily Cockpit — BlindSpot Agri",
      profile: "Farmer Profile & Holdings — BlindSpot Agri",
      scanner: "AI Crop Health Scanner & Spray Guide — BlindSpot Agri",
      prices: "Live APMC Mandi Market Prices — BlindSpot Agri",
      seasonal: "Seasonal Analysis & Monthly Patterns — BlindSpot Agri",
      buyers: "Nearby Buyers & Mandis (With Ratings) — BlindSpot Agri",
      comparison: "Buyer Net Revenue & Logistics Comparison — BlindSpot Agri",
      'sell-smart': "Smart Selling Recommendation Verdict — BlindSpot Agri",
      weather: "Weather Intelligence & Crop Risks — BlindSpot Agri",
      assistant: "Telugu AI Farmer Assistant (రైతు మిత్రుడు) — BlindSpot Agri",
      crops: "Agronomic Crop Cultivation Profiles — BlindSpot Agri",
      admin: "Owner Admin Console (Only Me) — BlindSpot Agri"
    };

    document.title = pageTitles[currentView] || "BlindSpot Agri";
  }, [currentView]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage language={language} setCurrentView={setCurrentView} />;
      case 'dashboard':
        return (
          <DashboardPage 
            language={language} 
            profile={profile} 
            setCurrentView={setCurrentView} 
            isDemoMode={isDemoMode}
          />
        );
      case 'profile':
        return (
          <FarmerProfilePage 
            language={language}
            setLanguage={setLanguage}
            profile={profile}
            setProfile={setProfile}
          />
        );
      case 'scanner':
        return <CropScannerPage language={language} cropHint={profile.crop} />;
      case 'prices':
        return <MarketPricesPage language={language} initialCrop={profile.crop} />;
      case 'seasonal':
        return <SeasonalPage language={language} crop={profile.crop} />;
      case 'buyers':
        return (
          <NearbyMarketsPage 
            language={language} 
            crop={profile.crop} 
            latitude={profile.latitude} 
            longitude={profile.longitude} 
          />
        );
      case 'comparison':
        return (
          <BuyerComparisonPage 
            language={language} 
            crop={profile.crop} 
            quantity={profile.quantityAvailableQuintals} 
            latitude={profile.latitude} 
            longitude={profile.longitude} 
          />
        );
      case 'sell-smart':
        return (
          <SellSmartPage 
            language={language} 
            crop={profile.crop} 
            quantity={profile.quantityAvailableQuintals} 
            latitude={profile.latitude} 
            longitude={profile.longitude} 
            setCurrentView={setCurrentView}
          />
        );
      case 'weather':
        return (
          <WeatherPage 
            language={language} 
            latitude={profile.latitude} 
            longitude={profile.longitude} 
            crop={profile.crop} 
          />
        );
      case 'assistant':
        return (
          <AiAssistantPage 
            language={language} 
            crop={profile.crop} 
            latitude={profile.latitude} 
            longitude={profile.longitude} 
          />
        );
      case 'crops':
        return <CropProfilesPage language={language} initialCrop={profile.crop} />;
      case 'admin':
        return (
          <AdminPage 
            language={language} 
            isDemoMode={isDemoMode} 
            setIsDemoMode={setIsDemoMode} 
          />
        );
      default:
        return <LandingPage language={language} setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        language={language}
        setLanguage={setLanguage}
        profile={profile}
        setProfile={setProfile}
        isDemoMode={isDemoMode}
        setIsDemoMode={setIsDemoMode}
      />

      {/* Breadcrumb Navigation on all dedicated feature pages */}
      <PageBreadcrumb
        currentView={currentView}
        setCurrentView={setCurrentView}
        language={language}
      />

      <main className="flex-1">
        {renderCurrentView()}
      </main>

      <Footer language={language} setCurrentView={setCurrentView} />
    </div>
  );
};

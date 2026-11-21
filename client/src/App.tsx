import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PageBreadcrumb } from './components/PageBreadcrumb';
import { LandingPage } from './pages/LandingPage';
import { FeaturesDirectoryPage } from './pages/FeaturesDirectoryPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { CropScannerPage } from './pages/CropScannerPage';
import { WeatherPage } from './pages/WeatherPage';
import { MarketPricesPage } from './pages/MarketPricesPage';
import { PriceTrendsPage } from './pages/PriceTrendsPage';
import { DemandSupplyPage } from './pages/DemandSupplyPage';
import { SeasonalPage } from './pages/SeasonalPage';
import { PriceForecastPage } from './pages/PriceForecastPage';
import { NearbyMarketsPage } from './pages/NearbyMarketsPage';
import { BuyerComparisonPage } from './pages/BuyerComparisonPage';
import { SellSmartPage } from './pages/SellSmartPage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { CropProfilesPage } from './pages/CropProfilesPage';
import { AlertsPage } from './pages/AlertsPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { AdminPage } from './pages/AdminPage';
import { FarmerProfile, Language } from './types';

const pathToViewMap: Record<string, string> = {
  '/': 'landing',
  '/landing': 'landing',
  '/features': 'features',
  '/all-features': 'features',
  '/onboarding': 'onboarding',
  '/dashboard': 'dashboard',
  '/scanner': 'scanner',
  '/crop-scanner': 'scanner',
  '/prices': 'prices',
  '/market-prices': 'prices',
  '/trends': 'trends',
  '/price-trends': 'trends',
  '/demand-supply': 'demand-supply',
  '/seasonal': 'seasonal',
  '/seasonal-patterns': 'seasonal',
  '/forecast': 'forecast',
  '/price-forecast': 'forecast',
  '/buyers': 'buyers',
  '/nearby-buyers': 'buyers',
  '/nearby-markets': 'buyers',
  '/comparison': 'comparison',
  '/buyer-comparison': 'comparison',
  '/sell-smart': 'sell-smart',
  '/weather': 'weather',
  '/weather-intelligence': 'weather',
  '/assistant': 'assistant',
  '/ai-assistant': 'assistant',
  '/crops': 'crops',
  '/crop-profiles': 'crops',
  '/alerts': 'alerts',
  '/crop-alerts': 'alerts',
  '/sources': 'sources',
  '/data-sources': 'sources',
  '/admin': 'admin'
};

const viewToPathMap: Record<string, string> = {
  landing: '/',
  features: '/features',
  onboarding: '/onboarding',
  dashboard: '/dashboard',
  scanner: '/scanner',
  prices: '/prices',
  trends: '/trends',
  'demand-supply': '/demand-supply',
  seasonal: '/seasonal',
  forecast: '/forecast',
  buyers: '/buyers',
  comparison: '/comparison',
  'sell-smart': '/sell-smart',
  weather: '/weather',
  assistant: '/assistant',
  crops: '/crops',
  alerts: '/alerts',
  sources: '/sources',
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

  // Default farmer profile (Tomato in Telangana / AP belt)
  const [profile, setProfile] = useState<FarmerProfile>({
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
      features: "All 18 Dedicated Pages Directory — BlindSpot Agri",
      onboarding: "Farmer Onboarding & GPS Setup — BlindSpot Agri",
      dashboard: "Farmer Daily Cockpit & Summary — BlindSpot Agri",
      scanner: "AI Crop Health Scanner & Spray Guide — BlindSpot Agri",
      prices: "Live APMC Mandi Market Prices — BlindSpot Agri",
      trends: "Historical Price Trends & Volatility — BlindSpot Agri",
      'demand-supply': "Demand & Supply Arrival Analytics — BlindSpot Agri",
      seasonal: "Seasonal Monthly Price Patterns — BlindSpot Agri",
      forecast: "AI Market Price Forecasting — BlindSpot Agri",
      buyers: "Nearby Buyers & Mandis Discovery — BlindSpot Agri",
      comparison: "Buyer Net Revenue & Transport Comparison — BlindSpot Agri",
      'sell-smart': "Smart Selling Recommendation Verdict — BlindSpot Agri",
      weather: "Hyperlocal Weather Intelligence & Alerts — BlindSpot Agri",
      assistant: "Telugu AI Farmer Assistant (రైతు మిత్రుడు) — BlindSpot Agri",
      crops: "Agronomic Crop Cultivation Profiles — BlindSpot Agri",
      alerts: "Real-Time Crop Risk Notifications — BlindSpot Agri",
      sources: "Verified Government Data Sources & Audit — BlindSpot Agri",
      admin: "Admin & API Status Control Center — BlindSpot Agri"
    };

    document.title = pageTitles[currentView] || "BlindSpot Agri";
  }, [currentView]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage language={language} setCurrentView={setCurrentView} />;
      case 'features':
        return <FeaturesDirectoryPage language={language} setCurrentView={setCurrentView} />;
      case 'onboarding':
        return (
          <OnboardingPage 
            language={language} 
            setLanguage={setLanguage} 
            profile={profile} 
            setProfile={setProfile} 
            onComplete={() => setCurrentView('dashboard')} 
          />
        );
      case 'dashboard':
        return (
          <DashboardPage 
            language={language} 
            profile={profile} 
            setCurrentView={setCurrentView} 
            isDemoMode={isDemoMode}
          />
        );
      case 'scanner':
        return <CropScannerPage language={language} cropHint={profile.crop} />;
      case 'prices':
        return <MarketPricesPage language={language} initialCrop={profile.crop} />;
      case 'trends':
        return <PriceTrendsPage language={language} crop={profile.crop} />;
      case 'demand-supply':
        return <DemandSupplyPage language={language} crop={profile.crop} />;
      case 'seasonal':
        return <SeasonalPage language={language} crop={profile.crop} />;
      case 'forecast':
        return <PriceForecastPage language={language} crop={profile.crop} />;
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
      case 'alerts':
        return (
          <AlertsPage 
            language={language} 
            crop={profile.crop} 
            latitude={profile.latitude} 
            longitude={profile.longitude} 
          />
        );
      case 'sources':
        return <DataSourcesPage language={language} />;
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

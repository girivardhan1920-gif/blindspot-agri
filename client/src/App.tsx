import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
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

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('landing');
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

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage language={language} setCurrentView={setCurrentView} />;
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

      <main className="flex-1">
        {renderCurrentView()}
      </main>

      <Footer language={language} setCurrentView={setCurrentView} />
    </div>
  );
};

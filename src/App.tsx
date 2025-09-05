import React, { useState } from 'react';
import { CharacterStudio } from './components/CharacterStudio';
import { PricingPage } from './components/PricingPage';
import { AboutPage } from './components/AboutPage';
import { usageTracker } from './utils/usageTracker';
import './App.css';

type AppView = 'studio' | 'pricing' | 'about';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('studio');
  const [showPricing, setShowPricing] = useState(false);

  const handleUpgradeClick = () => {
    setCurrentView('pricing');
  };

  const handleBackToStudio = () => {
    setCurrentView('studio');
  };

  const handleAboutClick = () => {
    setCurrentView('about');
  };

  const handleSubscriptionUpgrade = (tier: 'starter' | 'pro') => {
    usageTracker.upgradeSubscription(tier);
    setCurrentView('studio');
  };

  return (
    <div className="App min-h-screen bg-gray-950" style={{
      backgroundImage: 'url(/bg.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>
      {currentView === 'studio' ? (
        <CharacterStudio onUpgradeClick={handleUpgradeClick} onAboutClick={handleAboutClick} />
      ) : currentView === 'pricing' ? (
        <PricingPage onBackToStudio={handleBackToStudio} onSubscriptionUpgrade={handleSubscriptionUpgrade} />
      ) : (
        <AboutPage onBackToStudio={handleBackToStudio} />
      )}
    </div>
  );
};

export default App;
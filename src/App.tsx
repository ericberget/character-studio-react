import React, { useState } from 'react';
import { CharacterStudio } from './components/CharacterStudio';
import { PricingPage } from './components/PricingPage';
import { usageTracker } from './utils/usageTracker';
import './App.css';

type AppView = 'studio' | 'pricing';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('studio');
  const [showPricing, setShowPricing] = useState(false);

  const handleUpgradeClick = () => {
    setCurrentView('pricing');
  };

  const handleBackToStudio = () => {
    setCurrentView('studio');
  };

  const handleSubscriptionUpgrade = (tier: 'starter' | 'pro') => {
    usageTracker.upgradeSubscription(tier);
    setCurrentView('studio');
  };

  return (
    <div className="App">
      {currentView === 'studio' ? (
        <CharacterStudio onUpgradeClick={handleUpgradeClick} />
      ) : (
        <PricingPage onBackToStudio={handleBackToStudio} onSubscriptionUpgrade={handleSubscriptionUpgrade} />
      )}
    </div>
  );
};

export default App;
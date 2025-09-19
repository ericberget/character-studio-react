import React, { useState, useEffect } from 'react';
import { CharacterStudio } from './components/CharacterStudio';
import { PricingPage } from './components/PricingPage';
import { AboutPage } from './components/AboutPage';
import { LoginPage } from './components/LoginPage';
import { UserProfile } from './components/UserProfile';
import { BackgroundSwapPage } from './components/BackgroundSwapPage';
import { TokenUsagePage } from './components/TokenUsagePage';
import { TipsAndTricksPage } from './components/TipsAndTricksPage';
import { PaymentSuccess } from './components/PaymentSuccess';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { usageTracker } from './utils/usageTracker';
import './App.css';

type AppView = 'studio' | 'pricing' | 'about' | 'login' | 'profile' | 'background-swap' | 'token-usage' | 'tips-tricks' | 'payment-success';

const AppContent: React.FC = () => {
  const { profile } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>('studio');

  // Check if we're coming from a successful payment
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    if (sessionId) {
      setCurrentView('payment-success');
    }
    
    // Also check for Stripe success parameters
    if (window.location.href.includes('session_id=')) {
      setCurrentView('payment-success');
    }
  }, []);

  // Update usage tracker when profile changes
  useEffect(() => {
    usageTracker.setCurrentProfile(profile);
  }, [profile]);

  const handleUpgradeClick = () => {
    setCurrentView('pricing');
  };

  const handleBackToStudio = () => {
    setCurrentView('studio');
  };

  const handleAboutClick = () => {
    setCurrentView('about');
  };

  const handleLoginClick = () => {
    setCurrentView('login');
  };

  const handleProfileClick = () => {
    setCurrentView('profile');
  };

  const handleBackgroundSwapClick = () => {
    setCurrentView('background-swap');
  };

  const handleTokenUsageClick = () => {
    setCurrentView('token-usage');
  };

  const handleTipsAndTricksClick = () => {
    setCurrentView('tips-tricks');
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
        <CharacterStudio 
          onUpgradeClick={handleUpgradeClick} 
          onAboutClick={handleAboutClick}
          onLoginClick={handleLoginClick}
          onProfileClick={handleProfileClick}
          onBackgroundSwapClick={handleBackgroundSwapClick}
          onTokenUsageClick={handleTokenUsageClick}
          onTipsAndTricksClick={handleTipsAndTricksClick}
        />
      ) : currentView === 'pricing' ? (
        <PricingPage onBackToStudio={handleBackToStudio} onSubscriptionUpgrade={handleSubscriptionUpgrade} />
      ) : currentView === 'about' ? (
        <AboutPage onBackToStudio={handleBackToStudio} />
      ) : currentView === 'login' ? (
        <LoginPage onBackToStudio={handleBackToStudio} />
      ) : currentView === 'profile' ? (
        <UserProfile onClose={() => setCurrentView('studio')} />
      ) : currentView === 'background-swap' ? (
        <BackgroundSwapPage onBackToStudio={handleBackToStudio} />
      ) : currentView === 'token-usage' ? (
        <TokenUsagePage onBackToStudio={handleBackToStudio} />
      ) : currentView === 'tips-tricks' ? (
        <TipsAndTricksPage onBackToStudio={handleBackToStudio} />
      ) : currentView === 'payment-success' ? (
        <PaymentSuccess onBackToStudio={handleBackToStudio} />
      ) : null}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { CharacterStudio } from './components/CharacterStudio';
import { PricingPage } from './components/PricingPage';
import { AboutPage } from './components/AboutPage';
import { LoginPage } from './components/LoginPage';
import { UserProfile } from './components/UserProfile';
import { BackgroundSwapPage } from './components/BackgroundSwapPage';
import { InfographicMaker } from './components/InfographicMaker';
import { ThumbnailGenerator } from './components/ThumbnailGenerator';
import { TokenUsagePage } from './components/TokenUsagePage';
import { TipsAndTricksPage } from './components/TipsAndTricksPage';
import { PaymentSuccess } from './components/PaymentSuccess';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { usageTracker } from './utils/usageTracker';
import './App.css';

type AppView = 'landing' | 'studio' | 'pricing' | 'about' | 'login' | 'profile' | 'background-swap' | 'infographic-maker' | 'thumbnail-generator' | 'token-usage' | 'tips-tricks' | 'payment-success';

// Map URL hashes to views
const hashToView: Record<string, AppView> = {
  '#thumbinator': 'thumbnail-generator',
  '#thumbnail-generator': 'thumbnail-generator',
  '#thumbgen': 'thumbnail-generator',
  '#studio': 'studio',
  '#character-studio': 'studio',
  '#pricing': 'pricing',
  '#about': 'about',
  '#login': 'login',
  '#profile': 'profile',
  '#background-swap': 'background-swap',
  '#infographic': 'infographic-maker',
  '#tips': 'tips-tricks',
};

// Map views back to hashes (for updating URL)
const viewToHash: Partial<Record<AppView, string>> = {
  'thumbnail-generator': '#thumbinator',
  'studio': '#studio',
  'pricing': '#pricing',
  'about': '#about',
  'login': '#login',
  'profile': '#profile',
  'background-swap': '#background-swap',
  'infographic-maker': '#infographic',
  'tips-tricks': '#tips',
};

const AppContent: React.FC = () => {
  const { profile } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>('landing');

  // Handle URL hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash && hashToView[hash]) {
        setCurrentView(hashToView[hash]);
      }
    };

    // Check hash on initial load
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update URL hash when view changes
  useEffect(() => {
    const newHash = viewToHash[currentView];
    if (newHash) {
      // Update hash without triggering scroll
      window.history.replaceState(null, '', newHash);
    } else if (currentView === 'landing') {
      // Clear hash when going back to landing
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [currentView]);

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
    setCurrentView('landing');
  };

  const handleCharacterStudioClick = () => {
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

  const handleInfographicClick = () => {
    setCurrentView('infographic-maker');
  };

  const handleThumbnailGeneratorClick = () => {
    setCurrentView('thumbnail-generator');
  };

  const handleTokenUsageClick = () => {
    setCurrentView('token-usage');
  };

  const handleTipsAndTricksClick = () => {
    setCurrentView('tips-tricks');
  };

  const handleSubscriptionUpgrade = (tier: 'starter' | 'pro') => {
    usageTracker.upgradeSubscription(tier);
    setCurrentView('landing');
  };

  return (
    <div className="App min-h-screen bg-gray-950" style={{
      backgroundImage: 'url(/bg.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>
      {currentView === 'landing' ? (
        <LandingPage 
          onCharacterStudioClick={handleCharacterStudioClick}
          onThumbnailGeneratorClick={handleThumbnailGeneratorClick}
        />
      ) : currentView === 'studio' ? (
        <CharacterStudio 
          onUpgradeClick={handleUpgradeClick} 
          onAboutClick={handleAboutClick}
          onLoginClick={handleLoginClick}
          onProfileClick={handleProfileClick}
          onBackgroundSwapClick={handleBackgroundSwapClick}
          onInfographicClick={handleInfographicClick}
          onThumbnailGeneratorClick={handleThumbnailGeneratorClick}
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
        <UserProfile onClose={() => setCurrentView('landing')} />
      ) : currentView === 'background-swap' ? (
        <BackgroundSwapPage onBackToStudio={handleBackToStudio} />
      ) : currentView === 'infographic-maker' ? (
        <InfographicMaker onBackToStudio={handleBackToStudio} />
      ) : currentView === 'thumbnail-generator' ? (
        <ThumbnailGenerator onBackToStudio={handleBackToStudio} />
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

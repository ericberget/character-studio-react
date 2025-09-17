import React, { useState, useEffect } from 'react';
import { CharacterStudio } from './components/CharacterStudio';
import { PricingPage } from './components/PricingPage';
import { AboutPage } from './components/AboutPage';
import { LoginPage } from './components/LoginPage';
import { UserProfile } from './components/UserProfile';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { usageTracker } from './utils/usageTracker';
import './App.css';

type AppView = 'studio' | 'pricing' | 'about' | 'login' | 'profile';

const AppContent: React.FC = () => {
  const { profile } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>('studio');

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
        />
      ) : currentView === 'pricing' ? (
        <PricingPage onBackToStudio={handleBackToStudio} onSubscriptionUpgrade={handleSubscriptionUpgrade} />
      ) : currentView === 'about' ? (
        <AboutPage onBackToStudio={handleBackToStudio} />
      ) : currentView === 'login' ? (
        <LoginPage onBackToStudio={handleBackToStudio} />
      ) : currentView === 'profile' ? (
        <UserProfile onClose={() => setCurrentView('studio')} />
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
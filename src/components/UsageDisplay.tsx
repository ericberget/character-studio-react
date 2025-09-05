import React, { useState, useEffect } from 'react';
import { Zap, Crown, AlertCircle } from 'lucide-react';
import { usageTracker } from '../utils/usageTracker';
import { cn } from '../utils/cn';

interface UsageDisplayProps {
  onUpgradeClick: () => void;
  className?: string;
}

export const UsageDisplay: React.FC<UsageDisplayProps> = ({ onUpgradeClick, className }) => {
  const [usage, setUsage] = useState(usageTracker.getUsageStats());
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  useEffect(() => {
    const updateUsage = () => {
      setUsage(usageTracker.getUsageStats());
    };

    // Update usage display when component mounts
    updateUsage();

    // Listen for storage changes (if user generates from another tab)
    const handleStorageChange = () => {
      updateUsage();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const remainingFree = usageTracker.getRemainingFreeGenerations();
  const isSubscriptionActive = usageTracker.isSubscriptionActive();
  const canGenerate = usageTracker.canGenerate();

  // Show upgrade prompt when user has 2 or fewer generations left
  useEffect(() => {
    if (!isSubscriptionActive && remainingFree <= 2 && remainingFree > 0) {
      setShowUpgradePrompt(true);
    }
  }, [remainingFree, isSubscriptionActive]);

  if (isSubscriptionActive) {
    return (
      <div className={cn("bg-green-500/20 border border-green-500/40 rounded-lg p-4", className)}>
        <div className="flex items-center gap-3">
          <Crown className="w-5 h-5 text-green-400" />
          <div>
            <div className="text-green-300 font-medium">
              {usage.subscriptionTier?.charAt(0).toUpperCase() + usage.subscriptionTier?.slice(1)} Plan Active
            </div>
            <div className="text-green-400 text-sm">
              Unlimited generations until {usage.subscriptionExpiry ? new Date(usage.subscriptionExpiry).toLocaleDateString() : 'expiry'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Free Trial Usage */}
      <div className="bg-blue-500/20 border border-blue-500/40 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-blue-300 font-medium">
                Free Trial: {remainingFree} generations left
              </div>
              <div className="text-blue-400 text-sm">
                {usage.freeGenerationsUsed} of {usage.freeGenerationsLimit} used
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-24 h-2 bg-blue-500/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-400 transition-all duration-300"
              style={{ width: `${(usage.freeGenerationsUsed / usage.freeGenerationsLimit) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Upgrade Prompt */}
      {showUpgradePrompt && (
        <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-lg p-4 animate-pulse">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            <div className="flex-1">
              <div className="text-yellow-300 font-medium">
                Almost out of free generations!
              </div>
              <div className="text-yellow-400 text-sm">
                Upgrade to continue creating amazing characters
              </div>
            </div>
            <button
              onClick={onUpgradeClick}
              className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      )}

      {/* No Generations Left */}
      {!canGenerate && !isSubscriptionActive && (
        <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <div className="flex-1">
              <div className="text-red-300 font-medium">
                Free trial limit reached!
              </div>
              <div className="text-red-400 text-sm">
                Upgrade to continue generating characters
              </div>
            </div>
            <button
              onClick={onUpgradeClick}
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-400 transition-colors"
            >
              View Plans
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

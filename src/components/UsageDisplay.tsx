import React from 'react';
import { getTodayUsage, getRemainingImages, getUsagePercentage, getNextResetTime } from '../utils/usageTracker';

export const UsageDisplay: React.FC = () => {
  const todayUsage = getTodayUsage();
  const remainingImages = getRemainingImages();
  const usagePercentage = getUsagePercentage();
  const nextReset = getNextResetTime();

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-medium">Daily Usage</h3>
        <span className="text-yellow-400 font-bold">
          {remainingImages} images remaining
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
        <div 
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(usagePercentage, 100)}%` }}
        ></div>
      </div>
      
      {/* Usage Stats */}
      <div className="flex justify-between text-sm text-gray-300">
        <span>{todayUsage}/25 images used today</span>
        <span className="text-xs">Resets: {nextReset}</span>
      </div>
      
      {/* Warning if limit reached */}
      {remainingImages === 0 && (
        <div className="mt-3 p-3 bg-yellow-500/20 border border-yellow-500/40 rounded-lg">
          <p className="text-yellow-400 text-sm">
            Daily limit reached! Come back tomorrow for more generations.
          </p>
        </div>
      )}
    </div>
  );
};

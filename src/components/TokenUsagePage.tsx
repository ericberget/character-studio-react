import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Trophy, Star, Crown, Gem, Zap, BarChart3, Calendar, TrendingUp, Clock, Download, ExternalLink } from 'lucide-react';
import { usageTracker } from '../utils/usageTracker';
import { useAuth } from '../contexts/AuthContext';
import { recentGenerationsManager, type RecentGeneration } from '../utils/recentGenerations';
import { cn } from '../utils/cn';

interface TokenUsagePageProps {
  onBackToStudio: () => void;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  glowColor: string;
  requirement: number;
  earned: boolean;
}

// RecentGenerationsList component
const RecentGenerationsList: React.FC = () => {
  const [recentGenerations, setRecentGenerations] = useState<RecentGeneration[]>([]);

  useEffect(() => {
    setRecentGenerations(recentGenerationsManager.getRecentList());
  }, []);

  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (recentGenerations.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400">No recent generations yet</p>
        <p className="text-gray-500 text-sm mt-1">
          Your most recent character generations will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {recentGenerations.slice(0, 10).map((recent) => (
        <div
          key={recent.id}
          className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors"
        >
          <img
            src={recent.imageUrl}
            alt={recent.pose.name}
            className="w-12 h-12 object-cover rounded-lg"
          />
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {recent.pose.name}
            </p>
            <p className="text-gray-400 text-xs">
              {new Date(recent.generatedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => downloadImage(
                recent.imageUrl,
                `recent-${recent.pose.name.toLowerCase().replace(/\s+/g, '-')}.jpg`
              )}
              className="p-1.5 text-gray-400 hover:text-yellow-400 transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => window.open(recent.imageUrl, '_blank')}
              className="p-1.5 text-gray-400 hover:text-blue-400 transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
      {recentGenerations.length > 10 && (
        <p className="text-gray-500 text-xs text-center pt-2">
          Showing 10 of {recentGenerations.length} recent generations
        </p>
      )}
    </div>
  );
};

export const TokenUsagePage: React.FC<TokenUsagePageProps> = ({ onBackToStudio }) => {
  const { user, profile } = useAuth();
  const usageStats = usageTracker.getUsageStats();
  
  const totalGenerations = profile?.totalGenerations || usageStats.totalGenerations || 0;
  const freeGenerationsUsed = profile?.freeGenerationsUsed || usageStats.freeGenerationsUsed || 0;
  
  // Token system - assuming 100 tokens for free accounts
  const totalTokens = 100;
  const tokensUsed = freeGenerationsUsed;
  const tokensRemaining = Math.max(0, totalTokens - tokensUsed);
  const tokenProgress = (tokensUsed / totalTokens) * 100;

  // Badge system based on total generations
  const badges: Badge[] = [
    {
      id: 'novice',
      name: 'Character Novice',
      description: 'Generated your first character',
      icon: Sparkles,
      color: 'text-gray-300',
      glowColor: 'shadow-gray-500/25',
      requirement: 1,
      earned: totalGenerations >= 1
    },
    {
      id: 'creator',
      name: 'Character Creator',
      description: 'Generated 10+ characters',
      icon: Star,
      color: 'text-blue-400',
      glowColor: 'shadow-blue-500/25',
      requirement: 10,
      earned: totalGenerations >= 10
    },
    {
      id: 'artist',
      name: 'Character Artist',
      description: 'Generated 40+ characters',
      icon: Trophy,
      color: 'text-purple-400',
      glowColor: 'shadow-purple-500/25',
      requirement: 40,
      earned: totalGenerations >= 40
    },
    {
      id: 'master',
      name: 'Character Master',
      description: 'Generated 100+ characters',
      icon: Crown,
      color: 'text-yellow-400',
      glowColor: 'shadow-yellow-500/25',
      requirement: 100,
      earned: totalGenerations >= 100
    },
    {
      id: 'legend',
      name: 'Character Legend',
      description: 'Generated 250+ characters',
      icon: Gem,
      color: 'text-emerald-400',
      glowColor: 'shadow-emerald-500/25',
      requirement: 250,
      earned: totalGenerations >= 250
    },
    {
      id: 'mythic',
      name: 'Character Mythic',
      description: 'Generated 500+ characters',
      icon: Zap,
      color: 'text-pink-400',
      glowColor: 'shadow-pink-500/25',
      requirement: 500,
      earned: totalGenerations >= 500
    }
  ];

  const earnedBadges = badges.filter(badge => badge.earned);
  const nextBadge = badges.find(badge => !badge.earned);
  const progressToNext = nextBadge ? (totalGenerations / nextBadge.requirement) * 100 : 100;

  // Calculate usage statistics
  const thisWeekGenerations = Math.floor(totalGenerations * 0.3); // Simulated weekly data
  const thisMonthGenerations = Math.floor(totalGenerations * 0.7); // Simulated monthly data
  
  return (
    <div className="min-h-screen bg-gray-950" style={{
      backgroundImage: 'url(/bg.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBackToStudio}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Character Studio
          </button>
          <div className="h-6 w-px bg-gray-600" />
          <h1 className="text-3xl font-bold text-white header-font">
            Token Usage & Achievements
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Usage Statistics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Token Balance - Most Prominent */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-8 mb-6 shadow-lg shadow-yellow-500/10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white header-font">Token Balance</h3>
                  <p className="text-gray-400">Your remaining generation credits</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-yellow-400 header-font">{tokensRemaining}</div>
                  <div className="text-gray-400 text-sm">of {totalTokens} tokens</div>
                </div>
              </div>
              
              <div className="w-full bg-gray-800 rounded-full h-4 mb-2">
                <div 
                  className="bg-yellow-400 h-4 rounded-full"
                  style={{ width: `${Math.max(2, tokenProgress)}%` }}
                />
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Used: {tokensUsed} tokens</span>
                <span className="text-yellow-400 font-medium">
                  {tokensRemaining > 0 ? `${tokensRemaining} tokens remaining` : 'No tokens remaining'}
                </span>
              </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Generations</p>
                    <p className="text-2xl font-bold text-white header-font">{totalGenerations}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Calendar className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">This Month</p>
                    <p className="text-2xl font-bold text-white header-font">{thisMonthGenerations}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">This Week</p>
                    <p className="text-2xl font-bold text-white header-font">{thisWeekGenerations}</p>
                  </div>
                </div>
              </div>
            </div>


            {/* Recent Generations */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white header-font mb-4">Recent Generations</h3>
              
              <RecentGenerationsList />
            </div>
          </div>

          {/* Badge Collection */}
          <div className="space-y-6">
            {/* Current Tier */}
            {earnedBadges.length > 0 && (
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white header-font mb-4">Current Tier</h3>
                {(() => {
                  const currentBadge = earnedBadges[earnedBadges.length - 1];
                  return (
                    <div className={cn(
                      "relative p-4 rounded-xl border-2 bg-gradient-to-br from-gray-800/50 to-gray-900/50",
                      "border-yellow-400/50 shadow-lg",
                      currentBadge.glowColor
                    )}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={cn("p-2 rounded-lg", currentBadge.color.replace('text-', 'bg-').replace('400', '500/20'))}>
                          <currentBadge.icon className={cn("w-6 h-6", currentBadge.color)} />
                        </div>
                        <div>
                          <h4 className={cn("font-bold header-font", currentBadge.color)}>{currentBadge.name}</h4>
                          <p className="text-gray-400 text-xs">{currentBadge.description}</p>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Progress to Next Badge - Smaller Version */}
            {nextBadge && (
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <nextBadge.icon className={cn("w-4 h-4", nextBadge.color)} />
                  <div>
                    <h4 className="text-sm font-medium text-white">Next: {nextBadge.name}</h4>
                    <p className="text-xs text-gray-500">{totalGenerations}/{nextBadge.requirement}</p>
                  </div>
                </div>
                
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(progressToNext, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* All Badges */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white header-font mb-4">
                Achievement Badges ({earnedBadges.length}/{badges.length})
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={cn(
                      "relative p-3 rounded-lg border transition-all duration-200",
                      badge.earned
                        ? "border-gray-600 bg-gray-800/50 shadow-lg " + badge.glowColor
                        : "border-gray-700 bg-gray-800/20 opacity-50"
                    )}
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className={cn(
                        "p-2 rounded-lg",
                        badge.earned 
                          ? badge.color.replace('text-', 'bg-').replace('400', '500/20')
                          : 'bg-gray-700/50'
                      )}>
                        <badge.icon className={cn(
                          "w-5 h-5",
                          badge.earned ? badge.color : 'text-gray-600'
                        )} />
                      </div>
                      <div>
                        <h4 className={cn(
                          "text-xs font-medium header-font",
                          badge.earned ? badge.color : 'text-gray-600'
                        )}>
                          {badge.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {badge.requirement}+ gens
                        </p>
                      </div>
                    </div>
                    
                    {badge.earned && (
                      <div className="absolute -top-1 -right-1">
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white header-font mb-4">Account Status</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Account Type</span>
                  <span className="text-white font-medium">
                    {user ? 'Registered' : 'Guest'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Member Since</span>
                  <span className="text-white font-medium">
                    {profile?.createdAt 
                      ? new Date(profile.createdAt).toLocaleDateString()
                      : 'Today'
                    }
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Subscription</span>
                  <span className="text-green-400 font-medium">Unlimited</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

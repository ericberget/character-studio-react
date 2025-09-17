import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { User, LogOut, Settings, Crown, Zap } from 'lucide-react'

interface UserProfileProps {
  onClose: () => void
}

export const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const { user, profile, signOut } = useAuth()
  const [showSettings, setShowSettings] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    onClose()
  }

  const getSubscriptionBadge = () => {
    if (!profile?.subscriptionTier || profile.subscriptionTier === 'free') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
          Free Plan
        </span>
      )
    }

    const tierColors = {
      starter: 'bg-blue-900 text-blue-300',
      pro: 'bg-purple-900 text-purple-300'
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tierColors[profile.subscriptionTier]}`}>
        <Crown className="w-3 h-3 mr-1" />
        {profile.subscriptionTier.charAt(0).toUpperCase() + profile.subscriptionTier.slice(1)} Plan
      </span>
    )
  }

  const getUsageStats = () => {
    if (!profile) return null

    const remaining = profile.freeGenerationsLimit - profile.freeGenerationsUsed
    const isUnlimited = profile.subscriptionTier && profile.subscriptionTier !== 'free'

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Generations Used</span>
          <span className="text-sm text-white">
            {profile.totalGenerations} total
          </span>
        </div>
        
        {!isUnlimited && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Free Generations</span>
              <span className="text-sm text-white">
                {remaining} remaining
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(profile.freeGenerationsUsed / profile.freeGenerationsLimit) * 100}%` 
                }}
              />
            </div>
          </div>
        )}

        {isUnlimited && (
          <div className="flex items-center text-green-400 text-sm">
            <Zap className="w-4 h-4 mr-2" />
            Unlimited generations
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Profile Content */}
        <div className="p-6 space-y-6">
          {/* User Info */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-white">
                {profile?.displayName || user?.displayName || 'User'}
              </h3>
              <p className="text-gray-400 text-sm">
                {profile?.email || user?.email}
              </p>
              <div className="mt-2">
                {getSubscriptionBadge()}
              </div>
            </div>
          </div>

          {/* Usage Stats */}
          <div className="bg-gray-800/50 rounded-xl p-4">
            <h4 className="text-white font-medium mb-3">Usage Statistics</h4>
            {getUsageStats()}
          </div>

          {/* Account Actions */}
          <div className="space-y-3">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-full flex items-center justify-between p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl transition-colors"
            >
              <div className="flex items-center">
                <Settings className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-white">Account Settings</span>
              </div>
              <span className="text-gray-400">{showSettings ? '−' : '+'}</span>
            </button>

            {showSettings && (
              <div className="bg-gray-800/30 rounded-xl p-4 space-y-3">
                <p className="text-sm text-gray-400">
                  Account settings and preferences will be available soon.
                </p>
              </div>
            )}

            <button
              onClick={handleSignOut}
              className="w-full flex items-center p-3 bg-red-900/20 hover:bg-red-900/30 border border-red-800 rounded-xl transition-colors text-red-400"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

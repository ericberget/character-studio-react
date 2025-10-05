import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { User, LogOut, Settings, Crown, Zap, Award, Calendar, CreditCard } from 'lucide-react'

interface UserProfileProps {
  onClose: () => void
}

export const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const { user, profile, signOut, updateProfile } = useAuth()
  const [showSettings, setShowSettings] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    onClose()
  }

  // Temporary function to update free generation limit
  const handleUpdateLimit = async () => {
    if (profile) {
      await updateProfile({ freeGenerationsLimit: 50 })
      alert('Free generation limit updated to 50!')
      window.location.reload()
    }
  }

  const getSubscriptionBadge = () => {
    if (!profile?.subscriptionTier || profile.subscriptionTier === 'free') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-gray-300 border border-gray-600">
          Free Plan
        </span>
      )
    }

    const tierColors = {
      starter: 'bg-blue-900/50 text-blue-300 border-blue-700',
      pro: 'bg-purple-900/50 text-purple-300 border-purple-700'
    }

    const tierPrices = {
      starter: '$5/month',
      pro: '$12/month'
    }

    return (
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${tierColors[profile.subscriptionTier]}`}>
          <Award className="w-4 h-4 mr-1" />
          {profile.subscriptionTier.charAt(0).toUpperCase() + profile.subscriptionTier.slice(1)} Plan
        </span>
        <span className="text-xs text-gray-400">
          {tierPrices[profile.subscriptionTier]}
        </span>
      </div>
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

          {/* Subscription Details */}
          {(profile?.subscriptionTier === 'starter' || profile?.subscriptionTier === 'pro') && (
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4">
              <h4 className="text-white font-medium mb-3 flex items-center">
                <CreditCard className="w-4 h-4 mr-2 text-yellow-400" />
                Subscription Details
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Plan</span>
                  <span className="text-white font-medium">
                    {profile.subscriptionTier.charAt(0).toUpperCase() + profile.subscriptionTier.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className="text-green-400 font-medium">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Billing</span>
                  <span className="text-white font-medium">
                    {profile.subscriptionTier === 'starter' ? '$5/month' : '$12/month'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Next Billing</span>
                  <span className="text-gray-300">
                    {profile.subscriptionExpiry ? 
                      new Date(profile.subscriptionExpiry).toLocaleDateString() : 
                      'Monthly'
                    }
                  </span>
                </div>
              </div>
            </div>
          )}

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
                <button
                  onClick={handleUpdateLimit}
                  className="w-full flex items-center justify-center p-2 bg-green-900/20 hover:bg-green-900/30 border border-green-800 rounded-lg transition-colors text-green-400 text-sm"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Update to 50 Free Generations
                </button>
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

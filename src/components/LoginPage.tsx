import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { LogIn, Loader2 } from 'lucide-react'

interface LoginPageProps {
  onBackToStudio: () => void
}

export const LoginPage: React.FC<LoginPageProps> = ({ onBackToStudio }) => {
  const { signInWithGoogle } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await signInWithGoogle()
      if (error) {
        setError(error)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <button
            onClick={onBackToStudio}
            className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-8"
          >
            ← Back to Character Studio
          </button>
          
          <div className="mx-auto h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
            <LogIn className="h-6 w-6 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome to Character Studio
          </h2>
          <p className="text-gray-400 text-lg">
            Sign in to save your characters and track your usage
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-700 rounded-xl text-white bg-gray-800/50 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-950 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin mr-3" />
              ) : (
                <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              {loading ? 'Signing in...' : 'Continue with Google'}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 gap-4 mt-8">
          <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
            <h3 className="text-white font-medium mb-2">✨ What you get:</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Save your generated characters</li>
              <li>• Track your usage across devices</li>
              <li>• Access to premium features</li>
              <li>• Priority support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

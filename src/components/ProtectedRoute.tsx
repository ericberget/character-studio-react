import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { LoginPage } from './LoginPage'

interface ProtectedRouteProps {
  children: React.ReactNode
  onBackToStudio: () => void
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  onBackToStudio 
}) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage onBackToStudio={onBackToStudio} />
  }

  return <>{children}</>
}

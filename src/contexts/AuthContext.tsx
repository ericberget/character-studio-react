import React, { createContext, useContext, useEffect, useState } from 'react'
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db, googleProvider } from '../lib/firebase'
import type { UserProfile } from '../lib/firebase'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signInWithGoogle: () => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: string | null }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if Firebase is configured
    if (!auth) {
      console.warn('Firebase auth not configured, disabling authentication')
      setLoading(false)
      return
    }

    // Listen for auth changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      
      if (user) {
        await fetchUserProfile(user.uid)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    if (!db) {
      setLoading(false)
      return
    }

    try {
      const userDoc = await getDoc(doc(db, 'user_profiles', userId))
      
      if (userDoc.exists()) {
        setProfile(userDoc.data() as UserProfile)
      } else {
        // Create profile if it doesn't exist
        await createUserProfile(userId)
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error)
    } finally {
      setLoading(false)
    }
  }

  const createUserProfile = async (userId: string) => {
    if (!auth || !db) return

    try {
      const currentUser = auth.currentUser
      if (!currentUser) return

      const newProfile: Omit<UserProfile, 'createdAt' | 'updatedAt'> = {
        id: userId,
        email: currentUser.email || '',
        displayName: currentUser.displayName || '',
        photoURL: currentUser.photoURL || '',
        subscriptionTier: null,
        freeGenerationsUsed: 0,
        freeGenerationsLimit: 50,
        totalGenerations: 0,
      }

      await setDoc(doc(db, 'user_profiles', userId), {
        ...newProfile,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      setProfile({
        ...newProfile,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error in createUserProfile:', error)
    }
  }

  const signInWithGoogle = async () => {
    if (!auth || !googleProvider) {
      return { error: 'Authentication not configured' }
    }

    try {
      await signInWithPopup(auth, googleProvider)
      return { error: null }
    } catch (error: any) {
      console.error('Error signing in with Google:', error)
      return { error: error.message || 'Failed to sign in with Google' }
    }
  }

  const signOut = async () => {
    if (!auth) return

    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: 'No user logged in' }
    if (!db) return { error: 'Database not configured' }

    try {
      await updateDoc(doc(db, 'user_profiles', user.uid), {
        ...updates,
        updatedAt: new Date().toISOString(),
      })

      setProfile(prev => prev ? { 
        ...prev, 
        ...updates, 
        updatedAt: new Date().toISOString() 
      } : null)

      return { error: null }
    } catch (error: any) {
      console.error('Error updating profile:', error)
      return { error: error.message || 'Failed to update profile' }
    }
  }

  const refreshProfile = async () => {
    if (user && db) {
      await fetchUserProfile(user.uid)
    }
  }

  const value = {
    user,
    profile,
    loading,
    signInWithGoogle,
    signOut,
    updateProfile,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

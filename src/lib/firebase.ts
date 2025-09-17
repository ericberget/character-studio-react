import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Validate Firebase configuration
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  console.error('Firebase configuration is missing required fields:', firebaseConfig)
  throw new Error('Firebase configuration is incomplete. Please check your .env file.')
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()

// Database types
export interface UserProfile {
  id: string
  email: string
  displayName?: string
  photoURL?: string
  subscriptionTier: 'free' | 'starter' | 'pro' | null
  subscriptionExpiry?: string
  freeGenerationsUsed: number
  freeGenerationsLimit: number
  totalGenerations: number
  createdAt: string
  updatedAt: string
}

export interface GenerationRecord {
  id: string
  userId: string
  referenceImageUrl?: string
  posesGenerated: string[]
  artStyle: string
  generatedImages: string[]
  createdAt: string
}

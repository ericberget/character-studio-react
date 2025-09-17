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

// Check if Firebase is configured
const isFirebaseConfigured = firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId

// Initialize Firebase only if configured
let app: any = null
let auth: any = null
let db: any = null
let googleProvider: any = null

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    googleProvider = new GoogleAuthProvider()
    console.log('Firebase initialized successfully')
  } catch (error) {
    console.error('Firebase initialization failed:', error)
  }
} else {
  console.warn('Firebase configuration is incomplete. Authentication features will be disabled.')
}

export { auth, db, googleProvider }

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

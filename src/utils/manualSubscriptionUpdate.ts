import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const manuallyUpdateSubscription = async (
  userId: string, 
  tier: 'starter' | 'pro',
  sessionId?: string
) => {
  try {
    console.log(`Manually updating user ${userId} to ${tier} tier`);
    
    const userRef = doc(db, 'user_profiles', userId);
    const updateData = {
      subscriptionTier: tier,
      subscriptionStatus: 'active',
      subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      updatedAt: new Date().toISOString(),
      ...(sessionId && { stripeSessionId: sessionId }),
    };
    
    await updateDoc(userRef, updateData);
    console.log(`Successfully updated user ${userId} subscription manually`);
    return true;
  } catch (error) {
    console.error('Error manually updating subscription:', error);
    return false;
  }
};

// Function to call from browser console for testing
(window as any).updateMySubscription = (tier: 'starter' | 'pro') => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.uid) {
    manuallyUpdateSubscription(user.uid, tier);
  } else {
    console.error('No user found in localStorage');
  }
};

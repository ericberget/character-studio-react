import { loadStripe } from '@stripe/stripe-js';
import type { Stripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise: Promise<Stripe | null> = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
);

export const getStripe = () => stripePromise;

// Stripe configuration
export const STRIPE_CONFIG = {
  // Product IDs from Stripe Dashboard
  PRODUCTS: {
    STARTER: 'price_1S98r92MkhjAbzuieeev40F5', // $5/month
    PRO: 'price_1S99192MkhjAbzuiK9OlmQe6',     // $12/month (Premium)
  },
  
  // Success and cancel URLs
  SUCCESS_URL: `${window.location.origin}/success`,
  CANCEL_URL: `${window.location.origin}/pricing`,
};

// Stripe checkout session creation
export interface CreateCheckoutSessionParams {
  priceId: string;
  customerEmail?: string;
  userId?: string;
  metadata?: Record<string, string>;
}

export const createCheckoutSession = async (params: CreateCheckoutSessionParams) => {
  try {
    // Use server-side checkout session creation for proper metadata handling
    const response = await fetch('/.netlify/functions/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: params.priceId,
        customerEmail: params.customerEmail,
        userId: params.userId,
        metadata: params.metadata,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { sessionId } = await response.json();
    
    // Redirect to Stripe Checkout
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe not initialized');
    }

    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Redirect to Stripe Checkout
export const redirectToCheckout = async (sessionId: string) => {
  const stripe = await getStripe();
  if (!stripe) {
    throw new Error('Stripe not initialized');
  }

  const { error } = await stripe.redirectToCheckout({
    sessionId,
  });

  if (error) {
    throw error;
  }
};

// Handle subscription creation
export const createSubscription = async (tier: 'starter' | 'pro', userEmail?: string, userId?: string) => {
  const priceId = tier === 'starter' ? STRIPE_CONFIG.PRODUCTS.STARTER : STRIPE_CONFIG.PRODUCTS.PRO;
  
  await createCheckoutSession({
    priceId,
    customerEmail: userEmail,
    userId,
    metadata: {
      tier,
      userId: userId || '',
    },
  });
};

// Check subscription status (for future use)
export const checkSubscriptionStatus = async (userId: string) => {
  try {
    const response = await fetch(`/api/subscription-status?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to check subscription status');
    }
    return await response.json();
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return null;
  }
};

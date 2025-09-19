import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Webhook endpoint secret
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const sig = event.headers['stripe-signature'] || '';
    const payload = event.body || '';

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);

    console.log('Received webhook event:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Webhook error' }),
    };
  }
};

// Handle successful checkout
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout session completed:', session.id);
  
  const userId = session.metadata?.userId;
  const tier = session.metadata?.tier;
  
  if (userId && tier) {
    // Update user subscription in your database
    await updateUserSubscription(userId, {
      tier,
      status: 'active',
      customerId: session.customer as string,
      subscriptionId: session.subscription as string,
    });
  }
}

// Handle subscription creation
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Subscription created:', subscription.id);
  
  const userId = subscription.metadata?.userId;
  const tier = subscription.metadata?.tier;
  
  if (userId && tier) {
    await updateUserSubscription(userId, {
      tier,
      status: subscription.status,
      customerId: subscription.customer as string,
      subscriptionId: subscription.id,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
    });
  }
}

// Handle subscription updates
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id);
  
  const userId = subscription.metadata?.userId;
  
  if (userId) {
    await updateUserSubscription(userId, {
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
    });
  }
}

// Handle subscription deletion (cancellation)
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);
  
  const userId = subscription.metadata?.userId;
  
  if (userId) {
    await updateUserSubscription(userId, {
      status: 'canceled',
      tier: 'free',
    });
  }
}

// Handle successful payment
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Payment succeeded:', invoice.id);
  
  const subscriptionId = invoice.subscription as string;
  if (subscriptionId) {
    // Update subscription status in database
    // This ensures the user maintains access even if webhook order varies
  }
}

// Handle failed payment
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Payment failed:', invoice.id);
  
  const subscriptionId = invoice.subscription as string;
  if (subscriptionId) {
    // Handle failed payment - maybe send email, update status, etc.
  }
}

// Helper function to update user subscription in database
async function updateUserSubscription(
  userId: string, 
  subscriptionData: {
    tier?: string;
    status?: string;
    customerId?: string;
    subscriptionId?: string;
    currentPeriodEnd?: string;
  }
) {
  try {
    console.log(`Updating user ${userId} subscription:`, subscriptionData);
    
    // Update Firebase user profile
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };
    
    if (subscriptionData.tier) {
      updateData.subscriptionTier = subscriptionData.tier;
    }
    if (subscriptionData.status) {
      updateData.subscriptionStatus = subscriptionData.status;
    }
    if (subscriptionData.customerId) {
      updateData.stripeCustomerId = subscriptionData.customerId;
    }
    if (subscriptionData.subscriptionId) {
      updateData.stripeSubscriptionId = subscriptionData.subscriptionId;
    }
    if (subscriptionData.currentPeriodEnd) {
      updateData.subscriptionExpiry = subscriptionData.currentPeriodEnd;
    }
    
    await updateDoc(doc(db, 'user_profiles', userId), updateData);
    console.log(`Successfully updated user ${userId} subscription in Firebase`);
    
  } catch (error) {
    console.error('Error updating user subscription:', error);
    throw error;
  }
}

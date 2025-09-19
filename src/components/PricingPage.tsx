import React, { useState } from 'react';
import { Check, Sparkles, Zap, Star, ArrowRight } from 'lucide-react';
import { cn } from '../utils/cn';
import { createSubscription } from '../lib/stripe';
import { useAuth } from '../contexts/AuthContext';

interface PricingTier {
  id: string;
  name: string;
  price: number;
  tokens: number;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  color: string;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    tokens: 100,
    features: [
      '100 Tokens (one-time)',
      '10 Character Generations',
      '50 Custom Style Uploads',
      'Community Support',
      'Standard Generation Speed'
    ],
    icon: <Zap className="w-6 h-6" />,
    color: 'from-gray-500 to-gray-600'
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 5,
    tokens: 200,
    features: [
      '200 Tokens per month',
      '20 Character Generations',
      '100 Custom Style Uploads',
      'Basic Support',
      'Standard Generation Speed'
    ],
    icon: <Zap className="w-6 h-6" />,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'pro',
    name: 'Premium',
    price: 12,
    tokens: 800,
    features: [
      '800 Tokens per month',
      '80 Character Generations',
      '400 Custom Style Uploads',
      'Priority Support',
      'Faster Generation Speed',
      'Advanced Art Styles',
      'Bulk Download'
    ],
    popular: true,
    icon: <Star className="w-6 h-6" />,
    color: 'from-purple-500 to-purple-600'
  }
];

const tokenCosts = [
  { action: 'Character Generation', cost: 10, description: 'Generate character in selected pose and style' },
  { action: 'Custom Style Upload', cost: 2, description: 'Upload custom art style reference' },
  { action: 'Custom Pose Upload', cost: 2, description: 'Upload custom pose reference' }
];

interface PricingPageProps {
  onBackToStudio: () => void;
  onSubscriptionUpgrade: (tier: 'starter' | 'pro') => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onBackToStudio, onSubscriptionUpgrade }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { user, profile } = useAuth();

  const getDiscount = (tier: PricingTier) => {
    return billingCycle === 'yearly' ? Math.round(tier.price * 0.2) : 0;
  };

  const getFinalPrice = (tier: PricingTier) => {
    const discount = getDiscount(tier);
    return tier.price - discount;
  };

  const handleSubscribe = async (tier: 'starter' | 'pro') => {
    if (!user) {
      alert('Please sign in to subscribe');
      return;
    }

    setIsLoading(tier);
    try {
      await createSubscription(tier, user.email || undefined, user.uid);
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to start subscription. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  const isCurrentPlan = (tierId: string) => {
    if (!profile) return false;
    return profile.subscriptionTier === tierId;
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBackToStudio}
          className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Back to Studio
        </button>
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-yellow-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">Character Studio Pro</h1>
          </div>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Transform your photos into stunning character art with AI-powered generation. 
            Choose the perfect plan for your creative needs.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={cn(
              "text-sm font-medium transition-colors",
              billingCycle === 'monthly' ? "text-white" : "text-gray-400"
            )}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                billingCycle === 'yearly' ? "bg-yellow-500" : "bg-gray-600"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  billingCycle === 'yearly' ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
            <span className={cn(
              "text-sm font-medium transition-colors",
              billingCycle === 'yearly' ? "text-white" : "text-gray-400"
            )}>
              Yearly
              {billingCycle === 'yearly' && (
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                  Save 20%
                </span>
              )}
            </span>
          </div>
        </div>

        {/* All Pricing Tiers - 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                "relative rounded-2xl border-2 p-8 transition-all duration-300 hover:scale-105",
                isCurrentPlan(tier.id)
                  ? "border-green-400 bg-gray-900/50 shadow-2xl shadow-green-500/20" 
                  : "border-gray-700 bg-gray-900/30 hover:border-gray-600"
              )}
            >
              {isCurrentPlan(tier.id) && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-500 text-white">
                    <Star className="w-4 h-4 mr-1" />
                    CURRENT PLAN
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <div className={cn(
                  "inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 bg-gradient-to-r",
                  tier.color
                )}>
                  <div className="text-white">
                    {tier.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="mb-4">
                  {tier.price === 0 ? (
                    <span className="text-4xl font-bold text-white">Free</span>
                  ) : (
                    <>
                      <div className="flex flex-col items-center">
                        {tier.id === 'pro' && (
                          <div className="text-lg text-gray-500 line-through">$20</div>
                        )}
                        <div className="flex items-baseline">
                          <span className="text-4xl font-bold text-white">${getFinalPrice(tier)}</span>
                          <span className="text-gray-400">/{billingCycle === 'monthly' ? 'month' : 'month'}</span>
                        </div>
                        {billingCycle === 'yearly' && tier.id !== 'pro' && (
                          <div className="text-sm text-gray-500 line-through">${tier.price}/month</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
                <div className="text-lg text-yellow-400 font-semibold mb-2">
                  {tier.tokens} Tokens
                </div>
                <p className="text-gray-400 text-sm">
                  {tier.price === 0 ? 'One-time welcome bonus' : billingCycle === 'yearly' ? `${tier.tokens * 12} Tokens per year` : `${tier.tokens} Tokens per month`}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => {
                  if (tier.price === 0) {
                    // Handle free tier - just go back to studio
                    onBackToStudio();
                  } else {
                    // Handle paid tiers with Stripe
                    handleSubscribe(tier.id as 'starter' | 'pro');
                  }
                }}
                disabled={isLoading === tier.id}
                className={cn(
                  "w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2",
                  tier.price === 0
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-400 hover:to-green-500 shadow-lg shadow-green-500/25"
                    : isCurrentPlan(tier.id)
                    ? "bg-green-500 text-white hover:bg-green-400 shadow-lg shadow-green-500/25"
                    : "bg-gray-700 text-white hover:bg-gray-600 border border-gray-600 hover:border-gray-500"
                )}
              >
                {isLoading === tier.id ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    {tier.price === 0 ? 'Continue Free' : isCurrentPlan(tier.id) ? 'Current Plan' : 'Get Started'}
                    {!isCurrentPlan(tier.id) && <ArrowRight className="w-4 h-4" />}
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Token System Explanation */}
        <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-700 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">How Tokens Work</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Tokens power all your creative activities in Character Studio. 
              Each action consumes a specific amount of tokens based on complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tokenCosts.map((item, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">{item.action}</h3>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                    {item.cost} Tokens
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-700">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">What happens when I run out of tokens?</h3>
              <p className="text-gray-400 text-sm">
                You can upgrade your plan or wait until your next billing cycle. Unused tokens don't roll over to the next month.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Can I cancel anytime?</h3>
              <p className="text-gray-400 text-sm">
                Yes! You can cancel your subscription at any time. You'll keep access until the end of your current billing period.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Do I own the generated images?</h3>
              <p className="text-gray-400 text-sm">
                Absolutely! All images you generate are yours to use for personal or commercial purposes.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">What payment methods do you accept?</h3>
              <p className="text-gray-400 text-sm">
                We accept all major credit cards, PayPal, and Apple Pay for secure, convenient payments.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Create Amazing Characters?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already using Character Studio Pro to bring their ideas to life.
          </p>
          <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 shadow-lg shadow-yellow-500/25 flex items-center gap-2 mx-auto">
            <Sparkles className="w-6 h-6" />
            Start Creating Now
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { manuallyUpdateSubscription } from '../utils/manualSubscriptionUpdate';

interface PaymentSuccessProps {
  onBackToStudio: () => void;
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ onBackToStudio }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Get session_id from URL parameters without using React Router
    const urlParams = new URLSearchParams(window.location.search);
    const session = urlParams.get('session_id');
    setSessionId(session);
    
    // Automatically update subscription status
    if (session && user) {
      console.log('Payment successful for session:', session);
      
      const updateSubscription = async () => {
        setIsUpdating(true);
        try {
          // Determine tier based on session ID or default to 'starter'
          const tier = 'starter'; // Default to starter for now
          await manuallyUpdateSubscription(user.uid, tier, session);
          console.log('Subscription updated successfully');
        } catch (error) {
          console.error('Failed to update subscription:', error);
        } finally {
          setIsUpdating(false);
        }
      };
      
      updateSubscription();
    }
  }, [user]);

  return (
    <div className="App min-h-screen bg-gray-950" style={{
      backgroundImage: 'url(/bg.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>
      <div className="flex items-center justify-center p-4 min-h-screen">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500/20 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-yellow-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">Welcome to Character Studio Pro!</h1>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">
            🎉 Payment Successful!
          </h2>
          <p className="text-gray-300 mb-6">
            Your subscription has been activated and you now have full access to all Character Studio Pro features.
          </p>
          
          {isUpdating && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                <span className="text-blue-400 text-sm">Updating your subscription status...</span>
              </div>
            </div>
          )}
          
          {sessionId && (
            <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-400">
                Session ID: <span className="font-mono text-gray-300">{sessionId}</span>
              </p>
            </div>
          )}

          {/* What's Next */}
          <div className="text-left">
            <h3 className="text-lg font-medium text-white mb-4">What happens next?</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                <span>Your subscription is now active and billing automatically</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                <span>You can start generating unlimited character sets</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                <span>Access to all premium art styles and features</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                <span>Priority support for any questions</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={onBackToStudio}
            className="w-full bg-yellow-500 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-400 transition-all duration-200 shadow-lg shadow-yellow-500/25 flex items-center justify-center gap-3"
          >
            <Sparkles className="w-6 h-6" />
            Start Creating Characters
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <p className="text-gray-400 text-sm">
            You'll receive a confirmation email shortly with your subscription details.
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};

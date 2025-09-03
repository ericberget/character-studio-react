import React from 'react';
import { Loader2 } from 'lucide-react';
import type { GenerationProgress as ProgressType } from '../types';

interface GenerationProgressProps {
  progress: ProgressType;
  isVisible: boolean;
}

export const GenerationProgress: React.FC<GenerationProgressProps> = ({
  progress,
  isVisible
}) => {
  if (!isVisible) return null;

  const percentage = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-card p-8 max-w-md w-full mx-4">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          </div>
          
          <div>
            <h3 className="text-xl font-medium text-white mb-2">
              Creating your characters
            </h3>
            <p className="text-gray-400">{progress.status}</p>
          </div>
          
          <div className="space-y-2">
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="text-sm text-gray-500">
              {progress.current} / {progress.total} complete
            </div>
          </div>
          
          {progress.current > 0 && (
            <div className="text-xs text-gray-600">
              This may take a few moments...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { cn } from '../utils/cn';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
import type { CharacterPose } from '../types';

interface PoseSelectorProps {
  poses: CharacterPose[];
  selectedPoses: string[];
  onPoseToggle: (poseId: string) => void;
  onCustomPoseUpload?: () => void;
  customPoses?: Array<{name: string, image: string}>;
  maxPoses?: number;
  className?: string;
}

export const PoseSelector: React.FC<PoseSelectorProps> = ({
  poses,
  selectedPoses,
  onPoseToggle,
  onCustomPoseUpload,
  customPoses = [],
  maxPoses = 6,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Show first 12 poses (2 rows) by default, or all if expanded
  const posesToShow = isExpanded ? poses : poses.slice(0, 12);
  const hasMorePoses = poses.length > 12;
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-medium text-gray-300 tracking-wider">
          Select Poses to Generate
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => {
                const allPoseIds = posesToShow.map(p => p.id);
                allPoseIds.forEach(id => {
                  if (!selectedPoses.includes(id)) {
                    onPoseToggle(id);
                  }
                });
              }}
              className="btn-secondary text-xs"
              disabled={selectedPoses.length >= maxPoses}
            >
              Select All
            </button>
            <button
              onClick={() => {
                selectedPoses.forEach(id => onPoseToggle(id));
              }}
              className="btn-secondary text-xs"
              disabled={selectedPoses.length === 0}
            >
              Clear All
            </button>
          </div>
          <span className="text-sm text-gray-500">
            {selectedPoses.length}/{maxPoses} selected
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {posesToShow.map((pose) => {
          const isSelected = selectedPoses.includes(pose.id);
          const isDisabled = !isSelected && selectedPoses.length >= maxPoses;
          
          return (
            <button
              key={pose.id}
              onClick={() => onPoseToggle(pose.id)}
              disabled={isDisabled}
              className={cn(
                "group relative rounded-lg border-2 transition-all duration-200 overflow-hidden",
                "hover:scale-[1.02] active:scale-[0.98] animate-fade-in",
                pose.image ? "aspect-square" : "aspect-square p-2",
                isSelected && "border-yellow-400 shadow-lg shadow-yellow-500/25",
                !isSelected && !isDisabled && "border-gray-700 hover:border-gray-500",
                isDisabled && "border-gray-800 opacity-50 cursor-not-allowed"
              )}
            >
              {pose.image ? (
                <>
                  <img 
                    src={pose.image} 
                    alt={pose.name}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                  {/* Optional overlay with pose name on hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end">
                    <div className="p-1.5 text-white text-xs font-medium">
                      {pose.name}
                    </div>
                  </div>
                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#efd841' }}>
                      ✓
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-1">
                  <div className="text-2xl">{pose.emoji}</div>
                  <div className="text-xs font-medium text-gray-300">
                    {pose.name}
                  </div>
                </div>
              )}
            </button>
          );
        })}
        
        {/* Custom Pose References */}
        {customPoses.map((customPose, index) => {
          const poseId = `custom-${customPose.name}`;
          const isSelected = selectedPoses.includes(poseId);
          const isDisabled = !isSelected && selectedPoses.length >= maxPoses;
          
          return (
            <button
              key={`custom-${index}`}
              onClick={() => onPoseToggle(poseId)}
              disabled={isDisabled}
              className={cn(
                "group relative rounded-lg border-2 transition-all duration-200 overflow-hidden",
                "hover:scale-[1.02] active:scale-[0.98] animate-fade-in",
                "aspect-square",
                isSelected && "border-yellow-400 shadow-lg shadow-yellow-500/25",
                !isSelected && !isDisabled && "border-gray-700 hover:border-gray-500",
                isDisabled && "border-gray-800 opacity-50 cursor-not-allowed"
              )}
            >
              <img 
                src={customPose.image} 
                alt={customPose.name}
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
              {/* Pose Reference Label */}
              <div className="absolute top-0 left-0 right-0 bg-black/70 text-white text-xs font-medium px-2 py-1">
                Pose Reference
              </div>
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#efd841' }}>
                  ✓
                </div>
              )}
            </button>
          );
        })}
        
        {/* Custom Pose Upload Slot */}
        {onCustomPoseUpload && selectedPoses.length < maxPoses && (
          <button
            onClick={onCustomPoseUpload}
            className="aspect-square rounded-lg border-2 border-dashed border-yellow-400 hover:border-yellow-300 transition-colors duration-200 flex flex-col items-center justify-center group"
          >
            <Plus className="w-8 h-8 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-200" />
            <span className="text-xs text-gray-400 mt-2">Custom Pose Reference</span>
          </button>
        )}
      </div>
      
      {/* View More Poses Button */}
      {hasMorePoses && (
        <div className="flex justify-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-6 py-3 text-gray-300 hover:text-white transition-all duration-200 text-sm font-medium border border-gray-600 hover:border-gray-500 rounded-lg hover:bg-gray-800/50 hover:scale-105 active:scale-95"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-5 h-5" />
                Show Less Poses
              </>
            ) : (
              <>
                <ChevronDown className="w-5 h-5" />
                View More Poses ({poses.length - 12} more)
              </>
            )}
          </button>
        </div>
      )}
      

    </div>
  );
};

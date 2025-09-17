import React from 'react';
import { cn } from '../utils/cn';
import { Plus } from 'lucide-react';
import type { CharacterPose } from '../types';

interface PoseSelectorProps {
  poses: CharacterPose[];
  selectedPoses: string[];
  onPoseSelect: (poseId: string) => void;
  onCustomPoseUpload?: () => void;
  onUseReferencePose?: () => void;
  hasReferenceImage?: boolean;
  customPoses?: Array<{name: string, image: string}>;
  className?: string;
}

export const PoseSelector: React.FC<PoseSelectorProps> = ({
  poses,
  selectedPoses,
  onPoseSelect,
  onCustomPoseUpload,
  onUseReferencePose,
  hasReferenceImage = false,
  customPoses = [],
  className
}) => {
  // const [isExpanded, setIsExpanded] = useState(false);
  
  // Show all poses by default (commenting out expand functionality for now)
  const posesToShow = poses; // isExpanded ? poses : poses.slice(0, 12);
  // const hasMorePoses = poses.length > 12;
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-yellow-400 tracking-wider">
          Select Pose to Emulate
        </h3>
        <div className="flex items-center gap-3">
          {onUseReferencePose && hasReferenceImage && (
            <button
              onClick={onUseReferencePose}
              className="btn-secondary text-xs bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
              title="Generate character in the same pose as your reference photo"
            >
              Use Pose from Reference
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {posesToShow.map((pose) => {
          const isSelected = selectedPoses.includes(pose.id);
          
          return (
            <button
              key={pose.id}
              onClick={() => onPoseSelect(pose.id)}
              className={cn(
                "group relative rounded-lg border-2 transition-all duration-200 overflow-hidden",
                "hover:scale-[1.02] active:scale-[0.98] animate-fade-in",
                pose.image ? "aspect-square" : "aspect-square p-2",
                isSelected && "border-yellow-400 shadow-lg shadow-yellow-500/25",
                !isSelected && "border-gray-700 hover:border-gray-500"
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
          
          return (
            <button
              key={`custom-${index}`}
              onClick={() => onPoseSelect(poseId)}
              className={cn(
                "group relative rounded-lg border-2 transition-all duration-200 overflow-hidden",
                "hover:scale-[1.02] active:scale-[0.98] animate-fade-in",
                "aspect-square",
                isSelected && "border-yellow-400 shadow-lg shadow-yellow-500/25",
                !isSelected && "border-gray-700 hover:border-gray-500"
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
        {onCustomPoseUpload && (
          <button
            onClick={onCustomPoseUpload}
            className="aspect-square rounded-lg border-2 border-dashed border-yellow-400 hover:border-yellow-300 transition-colors duration-200 flex flex-col items-center justify-center group"
          >
            <Plus className="w-8 h-8 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-200" />
            <span className="text-xs text-gray-400 mt-2">Custom Pose Reference</span>
          </button>
        )}
      </div>
      
      {/* View More Poses Button - Commented out for now */}
      {/* {hasMorePoses && (
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
      )} */}
      

    </div>
  );
};

import React, { useState } from 'react';
import { cn } from '../utils/cn';
import { Plus, X } from 'lucide-react';

interface ArtStyle {
  value: string;
  label: string;
  image?: string;
  stylePrompt: string;
}

interface StyleSelectorProps {
  styles: readonly ArtStyle[];
  selectedStyle: string;
  onStyleSelect: (styleValue: string) => void;
  onCustomStyleUpload?: () => void;
  customStyles?: Array<{name: string, image: string}>;
  className?: string;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  styles,
  selectedStyle,
  onStyleSelect,
  onCustomStyleUpload,
  customStyles = [],
  className
}) => {
  const [enlargedStyle, setEnlargedStyle] = useState<ArtStyle | null>(null);
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-yellow-400">
          Select Art Style
        </h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {styles.map((style) => {
          const isSelected = selectedStyle === style.value;
          
          return (
            <button
              key={style.value}
              onClick={() => onStyleSelect(style.value)}
              className={cn(
                "group relative rounded-lg border-2 transition-all duration-200 overflow-hidden",
                "hover:scale-[1.02] active:scale-[0.98] animate-fade-in",
                style.image ? "aspect-[4/3]" : "aspect-[4/3] p-2",
                isSelected && "border-yellow-400 shadow-lg shadow-yellow-500/25",
                !isSelected && "border-gray-700 hover:border-gray-500"
              )}
            >
              {style.image ? (
                <>
                  <img 
                    src={style.image} 
                    alt={style.label}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                  {/* Optional overlay with style name on hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end">
                    <div className="p-1.5 text-white text-xs font-medium">
                      {style.label}
                    </div>
                  </div>
                  {/* Plus button for enlargement */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEnlargedStyle(style);
                    }}
                    className="absolute top-2 left-2 bg-black/60 hover:bg-black/80 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-colors duration-200"
                    title="View larger"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#efd841' }}>
                      ✓
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-1">
                  <div className="text-xs font-medium text-gray-300">
                    {style.label}
                  </div>
                </div>
              )}
            </button>
          );
        })}
        
        {/* Custom Style References */}
        {customStyles.map((customStyle, index) => {
          const isSelected = selectedStyle === customStyle.name;
          return (
            <button
              key={`custom-${index}`}
              onClick={() => onStyleSelect(customStyle.name)}
              className={cn(
                "group relative rounded-lg border-2 transition-all duration-200 overflow-hidden",
                "hover:scale-[1.02] active:scale-[0.98] animate-fade-in",
                "aspect-[4/3]",
                isSelected && "border-yellow-400 shadow-lg shadow-yellow-500/25",
                !isSelected && "border-gray-700 hover:border-gray-500"
              )}
            >
              <img 
                src={customStyle.image} 
                alt={customStyle.name}
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
              {/* Style Reference Label */}
              <div className="absolute top-0 left-0 right-0 bg-black/70 text-white text-xs font-medium px-2 py-1">
                Style Reference
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
        
        {/* Custom Style Upload Slot */}
        {onCustomStyleUpload && (
          <button
            onClick={onCustomStyleUpload}
            className="aspect-[4/3] rounded-lg border-2 border-dashed border-yellow-400 hover:border-yellow-300 transition-colors duration-200 flex flex-col items-center justify-center group"
          >
            <Plus className="w-8 h-8 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-200" />
            <span className="text-xs text-gray-400 mt-2">Custom Style Reference</span>
          </button>
        )}
      </div>

      {/* Enlarged Style Modal */}
      {enlargedStyle && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setEnlargedStyle(null)}
        >
          <div 
            className="relative max-w-2xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setEnlargedStyle(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
              title="Close"
            >
              <X className="w-8 h-8" />
            </button>
            
            <div className="bg-gray-900 rounded-xl overflow-hidden">
              <img
                src={enlargedStyle.image}
                alt={enlargedStyle.label}
                className="max-w-full max-h-[70vh] object-contain"
              />
              
              <div className="p-6">
                <h3 className="text-xl font-medium text-white mb-2">
                  {enlargedStyle.label}
                </h3>
                <p className="text-gray-400 text-sm">
                  {enlargedStyle.stylePrompt}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

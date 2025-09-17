import React, { useState } from 'react';
import { Download, RotateCcw, ExternalLink, X, ZoomIn, Loader2, Palette } from 'lucide-react';
import { cn } from '../utils/cn';
import type { GeneratedCharacter } from '../types';
import { removeBackgroundWithGemini, isBackgroundRemovalAvailable } from '../services/backgroundRemoval';
import { BackgroundSwapModal } from './BackgroundSwapModal';

interface CharacterGridProps {
  characters: GeneratedCharacter[];
  onDownloadAll?: () => void;
  onGenerateNew?: () => void;
  className?: string;
}

export const CharacterGrid: React.FC<CharacterGridProps> = ({
  characters,
  onDownloadAll,
  onGenerateNew,
  className
}) => {
  const [selectedImage, setSelectedImage] = useState<GeneratedCharacter | null>(null);
  const [removingBackground, setRemovingBackground] = useState<string | null>(null);
  const [backgroundRemovedImages, setBackgroundRemovedImages] = useState<Record<string, string>>({});
  const [showBackgroundSwap, setShowBackgroundSwap] = useState(false);
  const [characterForSwap, setCharacterForSwap] = useState<GeneratedCharacter | null>(null);
  
  if (characters.length === 0) return null;

  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleRemoveBackground = async (character: GeneratedCharacter) => {
    const imageKey = `${character.pose.id}-${character.timestamp}`;
    
    // Check if we already have a background-removed version
    if (backgroundRemovedImages[imageKey]) {
      // Download the background-removed version
      downloadImage(
        backgroundRemovedImages[imageKey],
        `character-${character.pose.name.toLowerCase().replace(/\s+/g, '-')}-no-bg.png`
      );
      return;
    }

    // Check if background removal is available
    if (!isBackgroundRemovalAvailable()) {
      alert('Background removal requires API setup. Please check your environment variables.');
      return;
    }

    setRemovingBackground(imageKey);
    
    try {
      const result = await removeBackgroundWithGemini(character.imageUrl);
      
      if (result.success && result.imageUrl) {
        setBackgroundRemovedImages(prev => ({
          ...prev,
          [imageKey]: result.imageUrl!
        }));
        
        // Download the background-removed image
        downloadImage(
          result.imageUrl,
          `character-${character.pose.name.toLowerCase().replace(/\s+/g, '-')}-no-bg.png`
        );
        
        // Show success message
        alert('Background removed successfully! The PNG file should have a transparent background.');
      } else {
        alert(`Background removal failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Background removal error:', error);
      alert('Background removal failed. Please try again.');
    } finally {
      setRemovingBackground(null);
    }
  };





  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium text-white header-font">
          Generated Character Set
        </h2>
        <div className="flex gap-3">
          {onDownloadAll && (
            <button 
              onClick={onDownloadAll} 
              className="btn-action"
            >
              <Download className="w-5 h-5" />
              Download All
            </button>
          )}
          {onGenerateNew && (
            <button 
              onClick={onGenerateNew} 
              className="btn-action"
            >
              <RotateCcw className="w-5 h-5" />
              Generate New
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {characters.map((character, index) => (
          <div
            key={`${character.pose.id}-${character.timestamp}`}
            className="glass-card overflow-hidden group hover:scale-105 transition-transform duration-200"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative cursor-pointer" onClick={() => setSelectedImage(character)}>
              <img
                src={character.imageUrl}
                alt={character.pose.name}
                className="w-full h-auto object-contain"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(character);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors duration-200"
                    title="View full size"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                                      <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadImage(
                          character.imageUrl,
                          `character-${character.pose.name.toLowerCase().replace(/\s+/g, '-')}.jpg`
                        );
                      }}
                      className="text-gray-900 p-2 rounded-lg transition-colors duration-200 font-medium"
                      style={{ backgroundColor: '#efd841' }}
                      title="Download JPG"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(character.imageUrl, '_blank');
                    }}
                    className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors duration-200"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    downloadImage(
                      character.imageUrl,
                      `character-${character.pose.name.toLowerCase().replace(/\s+/g, '-')}.jpg`
                    )
                  }
                  className="flex-1 text-gray-900 px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium hover:scale-105 active:scale-95"
                  style={{ backgroundColor: '#efd841' }}
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={() => handleRemoveBackground(character)}
                  disabled={removingBackground === `${character.pose.id}-${character.timestamp}`}
                  className="px-3 py-2 border border-gray-600 text-gray-300 rounded-lg hover:border-gray-500 hover:bg-gray-800 transition-all duration-200 text-xs hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  title="Remove background to create transparent PNG"
                >
                  {removingBackground === `${character.pose.id}-${character.timestamp}` ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Processing...
                    </>
                  ) : backgroundRemovedImages[`${character.pose.id}-${character.timestamp}`] ? (
                    'Download Transparent'
                  ) : (
                    'Remove BG'
                  )}
                </button>
                <button
                  onClick={() => {
                    setCharacterForSwap(character);
                    setShowBackgroundSwap(true);
                  }}
                  className="px-3 py-2 border border-gray-600 text-gray-300 rounded-lg hover:border-gray-500 hover:bg-gray-800 transition-all duration-200 text-xs hover:scale-105 active:scale-95 flex items-center gap-1"
                  title="Swap background with custom or suggested backgrounds"
                >
                  <Palette className="w-3 h-3" />
                  Swap BG
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-gray-500 text-sm mt-8">
        Generated {characters.length} character{characters.length !== 1 ? 's' : ''} • 
        {new Date(characters[0]?.timestamp).toLocaleString()}
      </div>

      {/* Image Overlay Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
              title="Close"
            >
              <X className="w-8 h-8" />
            </button>
            
            <div 
              className="bg-gray-900 rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.pose.name}
                className="max-w-full max-h-[80vh] object-contain"
              />
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-medium text-white header-font">
                      {selectedImage.pose.name}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        downloadImage(
                          selectedImage.imageUrl,
                          `character-${selectedImage.pose.name.toLowerCase().replace(/\s+/g, '-')}.jpg`
                        )
                      }
                      className="text-gray-900 px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium hover:scale-105 active:scale-95"
                      style={{ backgroundColor: '#efd841' }}
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={() => handleRemoveBackground(selectedImage)}
                      disabled={removingBackground === `${selectedImage.pose.id}-${selectedImage.timestamp}`}
                      className="px-3 py-2 border border-gray-600 text-gray-300 rounded-lg hover:border-gray-500 hover:bg-gray-800 transition-all duration-200 text-xs hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      title="Remove background to create transparent PNG"
                    >
                      {removingBackground === `${selectedImage.pose.id}-${selectedImage.timestamp}` ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Processing...
                        </>
                      ) : backgroundRemovedImages[`${selectedImage.pose.id}-${selectedImage.timestamp}`] ? (
                        'Download Transparent'
                      ) : (
                        'Remove BG'
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setCharacterForSwap(selectedImage);
                        setShowBackgroundSwap(true);
                      }}
                      className="px-3 py-2 border border-gray-600 text-gray-300 rounded-lg hover:border-gray-500 hover:bg-gray-800 transition-all duration-200 text-xs hover:scale-105 active:scale-95 flex items-center gap-1"
                      title="Swap background with custom or suggested backgrounds"
                    >
                      <Palette className="w-3 h-3" />
                      Swap BG
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Background Swap Modal */}
      {characterForSwap && (
        <BackgroundSwapModal
          character={characterForSwap}
          isOpen={showBackgroundSwap}
          onClose={() => {
            setShowBackgroundSwap(false);
            setCharacterForSwap(null);
          }}
          onBackgroundSwapped={(newImageUrl) => {
            // Update the character with the new background
            // You might want to update the parent component's state here
            console.log('Background swapped successfully!', newImageUrl);
          }}
        />
      )}
    </div>
  );
};

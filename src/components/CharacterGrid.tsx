import React, { useState } from 'react';
import { Download, RotateCcw, ExternalLink, X, ZoomIn } from 'lucide-react';
import { cn } from '../utils/cn';
import type { GeneratedCharacter } from '../types';

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
              className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Download className="w-5 h-5" />
              Download All
            </button>
          )}
          {onGenerateNew && (
            <button 
              onClick={onGenerateNew} 
              className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
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
                  className="flex-1 text-gray-900 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
                  style={{ backgroundColor: '#efd841' }}
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={() => {
                    // Remove Background functionality - coming soon
                    alert('Remove Background feature coming soon!');
                  }}
                  className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:border-gray-500 transition-colors duration-200 text-sm"
                >
                  Remove Background
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
                      className="text-gray-900 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 font-medium"
                      style={{ backgroundColor: '#efd841' }}
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={() => {
                        // Remove Background functionality - coming soon
                        alert('Remove Background feature coming soon!');
                      }}
                      className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:border-gray-500 transition-colors duration-200"
                    >
                      Remove Background
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

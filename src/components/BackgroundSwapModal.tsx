import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Sparkles } from 'lucide-react';
import { cn } from '../utils/cn';
import { addBackgroundContext } from '../services/backgroundRemoval';
import type { GeneratedCharacter } from '../types';

interface BackgroundSwapModalProps {
  character: GeneratedCharacter;
  isOpen: boolean;
  onClose: () => void;
  onBackgroundSwapped: (newImageUrl: string) => void;
}

// Default background options
const defaultBackgrounds = [
  {
    id: 'bg-1',
    name: 'Office Background',
    image: '/backgrounds/bg-1.jpg',
    description: 'Professional office environment'
  },
  {
    id: 'bg-2',
    name: 'Meeting Room',
    image: '/backgrounds/bg-2.jpg',
    description: 'Conference room setting'
  },
  {
    id: 'bg-3',
    name: 'Coffee Shop',
    image: '/backgrounds/bg-3.jpg',
    description: 'Casual coffee shop environment'
  },
  {
    id: 'bg-4',
    name: 'Outdoor Urban',
    image: '/backgrounds/bg-4.jpg',
    description: 'Outdoor urban setting'
  }
];

export const BackgroundSwapModal: React.FC<BackgroundSwapModalProps> = ({
  character,
  isOpen,
  onClose,
  onBackgroundSwapped
}) => {
  const [selectedBackground, setSelectedBackground] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedBackgrounds, setUploadedBackgrounds] = useState<string[]>([]);

  const handleFileUpload = useCallback((file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedBackgrounds(prev => [...prev, result]);
        setSelectedBackground(result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleSwapBackground = async () => {
    if (!selectedBackground) return;

    setIsProcessing(true);
    
    try {
      const result = await addBackgroundContext(character.imageUrl, selectedBackground);
      
      if (result.success && result.imageUrl) {
        onBackgroundSwapped(result.imageUrl);
        onClose();
      } else {
        alert(`Background swap failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Background swap error:', error);
      alert('Background swap failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold text-xl">Swap Background</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original Character */}
          <div>
            <h4 className="text-gray-300 font-medium mb-3">Original Character</h4>
            <div className="relative rounded-lg overflow-hidden border border-gray-600">
              <img
                src={character.imageUrl}
                alt={character.pose.name}
                className="w-full h-auto object-contain"
              />
              <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                {character.pose.name}
              </div>
            </div>
          </div>

          {/* Background Selection */}
          <div>
            <h4 className="text-gray-300 font-medium mb-3">Choose New Background</h4>
            
            {/* Upload Custom Background */}
            <div className="mb-4">
              <h5 className="text-gray-400 text-sm mb-2">Upload Custom Background</h5>
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center hover:border-yellow-400 transition-colors duration-200"
              >
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400 text-sm mb-2">Drag and drop an image here, or click to browse</p>
                <label className="btn-secondary cursor-pointer text-sm">
                  Choose File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Default Backgrounds */}
            <div>
              <h5 className="text-gray-400 text-sm mb-2">Suggested Backgrounds</h5>
              <div className="grid grid-cols-2 gap-2">
                {defaultBackgrounds.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => setSelectedBackground(bg.image)}
                    className={cn(
                      "group relative rounded-lg border-2 transition-all duration-200 overflow-hidden",
                      selectedBackground === bg.image 
                        ? "border-yellow-400 shadow-lg shadow-yellow-500/25" 
                        : "border-gray-700 hover:border-gray-500"
                    )}
                  >
                    <div className="aspect-video bg-gray-800 flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="p-2">
                      <div className="text-xs font-medium text-gray-300">{bg.name}</div>
                      <div className="text-xs text-gray-500">{bg.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Uploaded Backgrounds */}
            {uploadedBackgrounds.length > 0 && (
              <div className="mt-4">
                <h5 className="text-gray-400 text-sm mb-2">Uploaded Backgrounds</h5>
                <div className="grid grid-cols-2 gap-2">
                  {uploadedBackgrounds.map((bg, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedBackground(bg)}
                      className={cn(
                        "group relative rounded-lg border-2 transition-all duration-200 overflow-hidden",
                        selectedBackground === bg 
                          ? "border-yellow-400 shadow-lg shadow-yellow-500/25" 
                          : "border-gray-700 hover:border-gray-500"
                      )}
                    >
                      <img
                        src={bg}
                        alt={`Uploaded background ${index + 1}`}
                        className="w-full aspect-video object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <span className="text-white text-xs">Select</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:border-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSwapBackground}
            disabled={!selectedBackground || isProcessing}
            className="flex-1 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-medium hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                Gemini Working Magic...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Swap Background
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

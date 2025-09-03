import React, { useState, useCallback, useRef } from 'react';
import { AlertCircle, CheckCircle, Sparkles, X } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { PoseSelector } from './PoseSelector';
import { StyleSelector } from './StyleSelector';
import { GenerationProgress } from './GenerationProgress';
import { CharacterGrid } from './CharacterGrid';
import { UsageDisplay } from './UsageDisplay';
import { generateCharacterImage, fileToBase64 } from '../services/gemini';
import { defaultPoses, artStyles } from '../data/poses';
import type { GeneratedCharacter, GenerationProgress as ProgressType, ArtStyle } from '../types';
import { cn } from '../utils/cn';
import { canGenerateImage, incrementUsage } from '../utils/usageTracker';

export const CharacterStudio: React.FC = () => {
  const resultsRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [selectedPoses, setSelectedPoses] = useState<string[]>(['neutral', 'arms-crossed', 'friendly-wave']);
  const [artStyle, setArtStyle] = useState<ArtStyle>('realistic');
  const [additionalDescription, setAdditionalDescription] = useState('');

  const [generatedCharacters, setGeneratedCharacters] = useState<GeneratedCharacter[]>([]);
  const [progress, setProgress] = useState<ProgressType>({
    current: 0,
    total: 0,
    status: '',
    isLoading: false
  });
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' | null }>({
    text: '',
    type: null
  });

  const showMessage = useCallback((text: string, type: 'error' | 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: null }), 5000);
  }, []);

  const handleImageSelect = useCallback((file: File, preview: string) => {
    setReferenceImage(file);
    setImagePreview(preview);
    setMessage({ text: '', type: null });
  }, []);

  const handleImageRemove = useCallback(() => {
    setReferenceImage(null);
    setImagePreview('');
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
  }, [imagePreview]);

  const handlePoseToggle = useCallback((poseId: string) => {
    setSelectedPoses(prev => {
      if (prev.includes(poseId)) {
        return prev.filter(id => id !== poseId);
      } else {
        return [...prev, poseId];
      }
    });
  }, []);

  const generateCharacterSet = async () => {
    if (!referenceImage) {
      showMessage('Please upload a reference image of your character', 'error');
      return;
    }

    if (selectedPoses.length === 0) {
      showMessage('Please select at least one pose to generate', 'error');
      return;
    }

    // Check daily usage limit
    if (!canGenerateImage()) {
      showMessage('Daily limit reached! Come back tomorrow for more generations.', 'error');
      return;
    }

    const posesToGenerate = defaultPoses.filter(pose => selectedPoses.includes(pose.id));
    
    setProgress({
      current: 0,
      total: posesToGenerate.length,
      status: 'Preparing...',
      isLoading: true
    });

    setGeneratedCharacters([]);

    try {
      // Convert reference image to base64
      const referenceBase64 = await fileToBase64(referenceImage);
      const newCharacters: GeneratedCharacter[] = [];

      for (let i = 0; i < posesToGenerate.length; i++) {
        const pose = posesToGenerate[i];
        
        setProgress(prev => ({
          ...prev,
          current: i,
          status: `Generating ${pose.name.toLowerCase()}...`
        }));

        // Create detailed prompt for character generation
        const selectedStyle = artStyles.find(s => s.value === artStyle);
        const stylePrompt = selectedStyle?.stylePrompt || `${artStyle} style`;
        const posePrompt = pose.prompt;
        const additionalPrompt = additionalDescription ? `, ${additionalDescription}` : '';
        
        const fullPrompt = `${stylePrompt}, ${posePrompt}${additionalPrompt}. Maintain exact same character appearance, clothing, and facial features as reference image. Focus on artistic style and rendering technique only, not pose or character identity. High quality, detailed.`;

        try {
          const result = await generateCharacterImage(fullPrompt, referenceBase64, referenceImage.type);

          if (result.success && result.imageUrl) {
            // Increment usage for successful generation
            incrementUsage();
            newCharacters.push({
              pose,
              imageUrl: result.imageUrl,
              prompt: fullPrompt,
              timestamp: Date.now()
            });
          } else {
            console.error(`Failed to generate ${pose.name}:`, result.error);
          }
        } catch (error) {
          console.error(`Error generating ${pose.name}:`, error);
        }

        // Update progress
        setProgress(prev => ({
          ...prev,
          current: i + 1
        }));

        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setGeneratedCharacters(newCharacters);
      
      if (newCharacters.length > 0) {
        showMessage(`Successfully generated ${newCharacters.length} character${newCharacters.length !== 1 ? 's' : ''}!`, 'success');
        // Auto-scroll to results after a short delay
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }, 500);
      } else {
        showMessage('Failed to generate any characters. Please check your API key and try again.', 'error');
      }

    } catch (error) {
      console.error('Error generating character set:', error);
      showMessage('Error generating character set. Please try again.', 'error');
    } finally {
      setProgress(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleDownloadAll = () => {
    showMessage('Download all feature would create a ZIP file with all images in production.', 'success');
  };

  const handleGenerateNew = () => {
    setGeneratedCharacters([]);
    setMessage({ text: '', type: null });
  };

  return (
    <div className="min-h-screen bg-gray-950" style={{
      backgroundImage: 'url(/bg.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>
      {/* Hamburger Menu */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-3 hover:bg-white/10 transition-all duration-200 rounded-lg"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 text-yellow-400" />
          ) : (
            <div className="space-y-1">
              <div className="w-6 h-0.5 bg-yellow-400 rounded-full"></div>
              <div className="w-6 h-0.5 bg-yellow-400 rounded-full"></div>
              <div className="w-6 h-0.5 bg-yellow-400 rounded-full"></div>
            </div>
          )}
        </button>
      </div>

      {/* Menu Dropdown */}
      {isMenuOpen && (
        <div className="fixed top-16 right-4 z-50 bg-transparent backdrop-blur-sm border border-white/20 rounded-lg p-2 min-w-48">
          <div className="space-y-1">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                // Background Remove Tool (coming soon)
                alert('Background Remove Tool - Coming Soon!');
              }}
              className="w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors duration-200 flex items-center gap-3"
            >
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              Background Remove Tool
              <span className="text-xs text-gray-400 ml-auto">Coming Soon</span>
            </button>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                // Tips and Tricks
                alert('Tips and Tricks:\n\n• Upload high-quality reference images for best results\n• Use the Additional Description field to specify clothing details\n• Try different art styles to match your project needs\n• Select multiple poses to create a complete character set\n• Download images individually or use "Download All"');
              }}
              className="w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors duration-200 flex items-center gap-3"
            >
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Tips and Tricks
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <img 
            src="/logo.png" 
            alt="Character Studio" 
            className="mx-auto mb-6 max-w-md md:max-w-lg"
          />
        </div>

        {/* Main Form */}
        <div className="bg-transparent backdrop-blur-sm border border-gray-800/50 rounded-xl p-8 mb-8">
          {/* API Key Warning */}
          {!import.meta.env.VITE_GEMINI_API_KEY && (
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/40 rounded-lg p-4 mb-8">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <h3 className="text-yellow-500 font-medium">API Configuration Required</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Add your Google Gemini API key to the .env file to enable character generation.
                Copy env.example to .env and add your API key.
              </p>
            </div>
                    )}

          {/* Daily Usage Display */}
          <UsageDisplay />

          <div className="space-y-8">
            {/* Reference Image Upload and Additional Description - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Reference Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3 uppercase tracking-wide">
                  Character Reference Image
                </label>
                <ImageUpload
                  onImageSelect={handleImageSelect}
                  preview={imagePreview}
                  onRemove={handleImageRemove}
                  className="aspect-square"
                />
              </div>

              {/* Additional Description and Art Style */}
              <div className="space-y-6">
                {/* Additional Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-3 uppercase tracking-wide">
                    Additional Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    value={additionalDescription}
                    onChange={(e) => setAdditionalDescription(e.target.value)}
                    placeholder="Add any specific details about clothing, setting, or style..."
                    className="input-field resize-none h-[150px]"
                  />
                </div>

                {/* Art Style Selection */}
                <div>
                  <StyleSelector
                    styles={artStyles}
                    selectedStyle={artStyle}
                    onStyleSelect={(styleValue) => setArtStyle(styleValue as ArtStyle)}
                  />
                </div>
              </div>
            </div>

            {/* Pose Selection */}
            <PoseSelector
              poses={defaultPoses}
              selectedPoses={selectedPoses}
              onPoseToggle={handlePoseToggle}
              maxPoses={6}
              className="mt-8"
            />

            {/* Generate Button */}
                          <button
                onClick={generateCharacterSet}
                disabled={progress.isLoading || !referenceImage || selectedPoses.length === 0}
                className={cn(
                  "w-full relative overflow-hidden rounded-xl text-lg py-5 px-8 font-semibold transition-all duration-300",
                  "bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 hover:from-yellow-400 hover:via-yellow-300 hover:to-yellow-400",
                  "shadow-lg hover:shadow-xl hover:shadow-yellow-500/25",
                  "transform hover:scale-[1.02] active:scale-[0.98]",
                  "border border-yellow-400/30",
                  "text-gray-900",
                  progress.isLoading && "animate-pulse",
                  (!referenceImage || selectedPoses.length === 0) && "opacity-50 cursor-not-allowed"
                )}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
                
                <div className="relative flex items-center justify-center">
                  <Sparkles className="w-6 h-6 mr-3" />
                  <span className="text-lg font-bold">
                    {progress.isLoading ? 'Generating...' : 'Generate Character Set'}
                  </span>
                </div>
              </button>

            {/* Message Display */}
            {message.text && (
              <div className={cn(
                "p-4 rounded-lg border flex items-center gap-2",
                message.type === 'error' && "bg-red-500/20 border-red-500/40 text-red-300",
                message.type === 'success' && "bg-green-500/20 border-green-500/40 text-green-300"
              )}>
                {message.type === 'error' ? (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <span>{message.text}</span>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {generatedCharacters.length > 0 && (
          <div ref={resultsRef}>
            <CharacterGrid
              characters={generatedCharacters}
              onDownloadAll={handleDownloadAll}
              onGenerateNew={handleGenerateNew}
            />
          </div>
        )}

        {/* Progress Overlay */}
        <GenerationProgress
          progress={progress}
          isVisible={progress.isLoading}
        />
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Info, CheckCircle } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { UsageDisplay } from './UsageDisplay';
import { GenerationProgress } from './GenerationProgress';
import { CharacterGrid } from './CharacterGrid';
import { swapBackgroundWithNanoBanana, fileToBase64 } from '../services/gemini';
import type { GeneratedCharacter, GenerationProgress as ProgressType } from '../types';
import { cn } from '../utils/cn';
import { usageTracker } from '../utils/usageTracker';
import { useAuth } from '../contexts/AuthContext';

interface BackgroundSwapPageProps {
  onBackToStudio: () => void;
}

export const BackgroundSwapPage: React.FC<BackgroundSwapPageProps> = ({ onBackToStudio }) => {
  const { user, profile } = useAuth();
  
  // State management
  const [characterImage, setCharacterImage] = useState<File | null>(null);
  const [characterPreview, setCharacterPreview] = useState<string>('');
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string>('');
  const [selectedPresetBackground, setSelectedPresetBackground] = useState<string>('');
  const [artDirection, setArtDirection] = useState('');
  const [showArtDirectionTips, setShowArtDirectionTips] = useState(false);
  
  // Results and progress
  const [swappedCharacters, setSwappedCharacters] = useState<GeneratedCharacter[]>([]);
  const [progress, setProgress] = useState<ProgressType>({
    isLoading: false,
    currentStep: 0,
    totalSteps: 0,
    currentPose: '',
    message: ''
  });
  
  // Message state
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | null }>({
    text: '',
    type: null
  });

  // Preset background options
  const presetBackgrounds = [
    { id: 'bg-2', name: 'Modern Office', image: '/backgrounds/Bg-2.jpg', description: 'Clean modern office space' },
    { id: 'office1', name: 'Executive Office', image: '/backgrounds/office1.jpg', description: 'Professional executive office' },
    { id: 'comicoffice', name: 'Comic Office', image: '/backgrounds/comicoffice.jpg', description: 'Stylized comic-style office' },
    { id: 'newyork-shop', name: '1905 New York Shop', image: '/backgrounds/1905NewYork-shop.jpg', description: 'Vintage New York storefront' },
    { id: 'victorian', name: 'Victorian Interior', image: '/backgrounds/victorian.jpg', description: 'Elegant Victorian room' }
  ];

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: null }), 5000);
  };

  // Handle character image upload
  const handleCharacterImageSelect = (file: File) => {
    setCharacterImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setCharacterPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCharacterImageRemove = () => {
    setCharacterImage(null);
    setCharacterPreview('');
  };

  // Handle background image upload
  const handleBackgroundImageSelect = (file: File) => {
    setBackgroundImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setBackgroundPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleBackgroundImageRemove = () => {
    setBackgroundImage(null);
    setBackgroundPreview('');
    setSelectedPresetBackground('');
  };

  // Handle preset background selection
  const handlePresetBackgroundSelect = (backgroundPath: string) => {
    setSelectedPresetBackground(backgroundPath);
    setBackgroundImage(null);
    setBackgroundPreview('');
  };

  // Handle background swap
  const handleSwapBackground = async () => {
    if (!characterImage || (!backgroundImage && !selectedPresetBackground)) {
      showMessage('Please upload a character image and select or upload a background image.', 'error');
      return;
    }

    // Check if user can generate
    if (!usageTracker.canGenerate()) {
      showMessage('Free trial limit reached! Please upgrade to continue generating.', 'error');
      return;
    }

    setProgress({
      isLoading: true,
      currentStep: 1,
      totalSteps: 1,
      currentPose: 'Background Swap',
      message: 'Swapping background with Nano Banana...'
    });

    setSwappedCharacters([]);

    try {
      // Convert character image to base64
      const characterBase64 = await fileToBase64(characterImage);
      const characterUrl = `data:${characterImage.type};base64,${characterBase64}`;

      // Handle background URL (either uploaded file or preset)
      let backgroundUrl: string;
      if (backgroundImage) {
        // User uploaded a custom background
        const backgroundBase64 = await fileToBase64(backgroundImage);
        backgroundUrl = `data:${backgroundImage.type};base64,${backgroundBase64}`;
      } else {
        // User selected a preset background
        backgroundUrl = selectedPresetBackground;
      }

      // Enhanced prompt with art direction
      let enhancedPrompt = `Take the character from the first image and place them in the background/setting from the second image. Keep the character exactly the same - same pose, same clothing, same appearance, same lighting on the character. Only change the background to match the second image. The character should look natural in the new environment while maintaining their original appearance and pose.`;
      
      if (artDirection.trim()) {
        enhancedPrompt += ` IMPORTANT: Apply the following style/effect to the background only: "${artDirection.trim()}". The background should be modified according to this instruction while keeping the character unchanged.`;
      }

      console.log('🍌 Starting background swap with enhanced prompt:', enhancedPrompt);

      // Use the existing swap function with enhanced prompting
      const result = await swapBackgroundWithNanoBanana(characterUrl, backgroundUrl, enhancedPrompt);

      if (result.success && result.imageUrl) {
        const swappedCharacter: GeneratedCharacter = {
          imageUrl: result.imageUrl,
          pose: {
            id: 'background-swap',
            name: 'Background Swapped',
            description: 'Character with swapped background',
            prompt: enhancedPrompt,
            emoji: '🖼️'
          },
          timestamp: Date.now(),
          artStyle: 'custom'
        };

        setSwappedCharacters([swappedCharacter]);
        
        // Track usage
        usageTracker.recordGeneration(1);
        
        showMessage('Background swap completed successfully!', 'success');
        
        // Scroll to results
        setTimeout(() => {
          const resultsElement = document.getElementById('swap-results');
          if (resultsElement) {
            resultsElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        throw new Error(result.error || 'Background swap failed');
      }
    } catch (error) {
      console.error('Background swap error:', error);
      showMessage(error instanceof Error ? error.message : 'Background swap failed. Please try again.', 'error');
    } finally {
      setProgress({
        isLoading: false,
        currentStep: 0,
        totalSteps: 0,
        currentPose: '',
        message: ''
      });
    }
  };

  const handleDownloadAll = async () => {
    for (const character of swappedCharacters) {
      try {
        const response = await fetch(character.imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `background-swapped-${character.timestamp}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Download failed:', error);
      }
    }
  };

  const handleGenerateNew = () => {
    setSwappedCharacters([]);
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
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToStudio}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Character Studio
            </button>
            <div className="h-6 w-px bg-gray-600" />
            <h1 className="text-3xl font-bold text-white header-font">
              Background Swap Studio
            </h1>
          </div>
          
          {user && profile && (
            <UsageDisplay 
              className="mx-auto mb-6 max-w-[493px] md:max-w-[563px]"
            />
          )}
        </div>

        {/* Main Form */}
        <div className="bg-transparent backdrop-blur-sm border border-gray-800/50 rounded-xl p-8 mb-8">
          <div className="space-y-8">
            {/* Image Uploads - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Character Image Upload */}
              <div>
                <h3 className="text-lg font-medium text-yellow-400 tracking-wider mb-3 text-left">
                  Upload Character Image
                </h3>
                <ImageUpload
                  onImageSelect={handleCharacterImageSelect}
                  preview={characterPreview}
                  onRemove={handleCharacterImageRemove}
                  className="aspect-square"
                  placeholder="Upload your character image"
                />
              </div>

              {/* Background Image Upload */}
              <div>
                <h3 className="text-lg font-medium text-yellow-400 tracking-wider mb-3 text-left">
                  Upload Background Image
                </h3>
                <ImageUpload
                  onImageSelect={handleBackgroundImageSelect}
                  preview={backgroundPreview}
                  onRemove={handleBackgroundImageRemove}
                  className="aspect-square"
                  placeholder="Upload your background image"
                />
              </div>
            </div>

            {/* OR Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-700"></div>
              <span className="text-gray-400 text-sm uppercase tracking-wider">Or Choose a Preset</span>
              <div className="flex-1 h-px bg-gray-700"></div>
            </div>

            {/* Preset Backgrounds */}
            <div>
              <h3 className="text-lg font-medium text-yellow-400 tracking-wider mb-3 text-left">
                Suggested Backgrounds
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {presetBackgrounds.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => handlePresetBackgroundSelect(bg.image)}
                    className={cn(
                      "group relative rounded-lg border-2 transition-all duration-200 overflow-hidden",
                      selectedPresetBackground === bg.image 
                        ? "border-yellow-400 shadow-lg shadow-yellow-500/25" 
                        : "border-gray-700 hover:border-gray-500"
                    )}
                  >
                    <img
                      src={bg.image}
                      alt={bg.name}
                      className="w-full aspect-video object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <span className="text-white text-xs text-center px-2">{bg.name}</span>
                    </div>
                    {selectedPresetBackground === bg.image && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-gray-900" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Art Direction */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label htmlFor="artDirection" className="text-sm font-medium text-gray-300 uppercase tracking-wide">
                  Art Direction (Optional)
                </label>
                <button
                  onClick={() => setShowArtDirectionTips(true)}
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-200"
                  title="Art Direction Tips"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
              <textarea
                id="artDirection"
                value={artDirection}
                onChange={(e) => setArtDirection(e.target.value)}
                placeholder="Add specific instructions for the background swap... (e.g., 'Make background slightly blurred', 'Adjust lighting to match character', 'Add soft shadows')"
                className="input-field resize-none h-[120px]"
              />
            </div>

            {/* Swap Button */}
            <button
              onClick={handleSwapBackground}
              disabled={progress.isLoading || !characterImage || (!backgroundImage && !selectedPresetBackground)}
              className={cn(
                "w-full rounded-xl text-lg py-5 px-8 font-semibold",
                "bg-yellow-400 hover:bg-yellow-300",
                "text-gray-900",
                progress.isLoading && "opacity-75",
                (!characterImage || (!backgroundImage && !selectedPresetBackground)) && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex items-center justify-center">
                <Sparkles className="w-6 h-6 mr-3" />
                <span className="text-lg font-bold">
                  {progress.isLoading ? 'Swapping Background...' : 'Swap Background'}
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
                <span>{message.text}</span>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {swappedCharacters.length > 0 && (
          <div id="swap-results">
            <CharacterGrid
              characters={swappedCharacters}
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

        {/* Art Direction Tips Modal */}
        {showArtDirectionTips && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-lg">Art Direction Tips</h3>
                <button
                  onClick={() => setShowArtDirectionTips(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="space-y-3 text-gray-300 text-sm">
                <p><strong>Background Effects:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>"Make background slightly blurred"</li>
                  <li>"Add depth of field effect"</li>
                  <li>"Soften background details"</li>
                </ul>
                
                <p><strong>Lighting Adjustments:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>"Adjust lighting to match character"</li>
                  <li>"Add warm/cool lighting"</li>
                  <li>"Create dramatic shadows"</li>
                </ul>
                
                <p><strong>Style Matching:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>"Match art style of character"</li>
                  <li>"Make background more painterly"</li>
                  <li>"Enhance colors to complement character"</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

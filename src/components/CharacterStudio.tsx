import React, { useState, useCallback, useRef } from 'react';
import { AlertCircle, CheckCircle, Sparkles, X, Info, User, LogIn, Award } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { PoseSelector } from './PoseSelector';
import { StyleSelector } from './StyleSelector';
import { GenerationProgress } from './GenerationProgress';
import { CharacterGrid } from './CharacterGrid';
import { CustomReferenceUpload } from './CustomReferenceUpload';
import { UsageDisplay } from './UsageDisplay';
import { generateCharacterImage, fileToBase64 } from '../services/gemini';
import { defaultPoses, artStyles } from '../data/poses';
import type { GeneratedCharacter, GenerationProgress as ProgressType, ArtStyle } from '../types';
import { cn } from '../utils/cn';
import { usageTracker } from '../utils/usageTracker';
import { recentGenerationsManager } from '../utils/recentGenerations';
import { useAuth } from '../contexts/AuthContext';


interface CharacterStudioProps {
  onUpgradeClick: () => void;
  onAboutClick: () => void;
  onLoginClick: () => void;
  onProfileClick: () => void;
  onBackgroundSwapClick: () => void;
  onTokenUsageClick: () => void;
  onTipsAndTricksClick: () => void;
}

export const CharacterStudio: React.FC<CharacterStudioProps> = ({ onUpgradeClick, onAboutClick, onLoginClick, onProfileClick, onBackgroundSwapClick, onTokenUsageClick, onTipsAndTricksClick }) => {
  const { user, profile } = useAuth();
  const resultsRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [selectedPoses, setSelectedPoses] = useState<string[]>(['neutral']);
  const [artStyle, setArtStyle] = useState<ArtStyle>('realistic');
  const [additionalDescription, setAdditionalDescription] = useState('');

  const [generatedCharacters, setGeneratedCharacters] = useState<GeneratedCharacter[]>([]);
  const [customStyles, setCustomStyles] = useState<Array<{name: string, image: string}>>([]);
  const [customPoses, setCustomPoses] = useState<Array<{name: string, image: string}>>([]);
  const [showCustomUpload, setShowCustomUpload] = useState(false);
  const [customUploadType, setCustomUploadType] = useState<'style' | 'pose' | null>(null);
  const [showArtDirectionTips, setShowArtDirectionTips] = useState(false);
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

  const handlePoseSelect = useCallback((poseId: string) => {
    setSelectedPoses([poseId]);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCustomStyleSelect = useCallback((imageUrl: string, _styleName: string) => {
    setCustomStyles(prev => [...prev, { name: 'Custom Style Reference', image: imageUrl }]);
    setArtStyle('custom'); // Set to custom style
  }, []);

  const handleCustomPoseSelect = useCallback((imageUrl: string, poseName: string) => {
    setCustomPoses(prev => [...prev, { name: poseName, image: imageUrl }]);
    // Select the custom pose
    setSelectedPoses([`custom-${poseName}`]);
  }, []);

  const handleCustomStyleUpload = useCallback(() => {
    setCustomUploadType('style');
    setShowCustomUpload(true);
  }, []);

  const handleCustomPoseUpload = useCallback(() => {
    setCustomUploadType('pose');
    setShowCustomUpload(true);
  }, []);

  const handleUseReferencePose = useCallback(() => {
    // Select the reference pose
    setSelectedPoses(['reference']);
    showMessage('Reference pose selected - character will be generated in the same pose as your photo', 'success');
  }, [showMessage]);

  const generateCharacterSet = async () => {
    if (!referenceImage) {
      showMessage('Please upload a reference image of your character', 'error');
      return;
    }

    if (selectedPoses.length === 0) {
      showMessage('Please select at least one pose to generate', 'error');
      return;
    }

    // Check if user can generate
    if (!usageTracker.canGenerate()) {
      showMessage('Free trial limit reached! Please upgrade to continue generating.', 'error');
      onUpgradeClick();
      return;
    }

    // Daily limit disabled for admin
    // if (!canGenerateImage()) {
    //   showMessage('Daily limit reached! Come back tomorrow for more generations.', 'error');
    //   return;
    // }

    const posesToGenerate = defaultPoses.filter(pose => selectedPoses.includes(pose.id));
    const customPosesToGenerate = customPoses.filter(pose => selectedPoses.includes(`custom-${pose.name}`));
    const useReferencePose = selectedPoses.includes('reference');
    
    const totalPoses = useReferencePose ? 1 : posesToGenerate.length + customPosesToGenerate.length;
    
    setProgress({
      current: 0,
      total: totalPoses,
      status: 'Preparing...',
      isLoading: true
    });

    setGeneratedCharacters([]);

    try {
      // Convert reference image to base64
      const referenceBase64 = await fileToBase64(referenceImage);
      const newCharacters: GeneratedCharacter[] = [];

      let allPoses;
      if (useReferencePose) {
        // For reference pose, create a single pose object
        allPoses = [{
          id: 'reference',
          name: 'Reference Pose',
          description: 'Same pose as reference photo',
          prompt: 'same pose as reference image',
          emoji: '📸'
        }];
      } else {
        allPoses = [...posesToGenerate, ...customPosesToGenerate.map(cp => ({ id: `custom-${cp.name}`, name: cp.name, description: `Custom pose: ${cp.name}`, prompt: `custom pose: ${cp.name}`, emoji: '🎨' }))];
      }
      
      for (let i = 0; i < allPoses.length; i++) {
        const pose = allPoses[i];
        
        setProgress(prev => ({
          ...prev,
          current: i,
          status: useReferencePose ? 'Stylizing reference pose...' : `Generating ${pose.name.toLowerCase()}...`
        }));

        // Create detailed prompt for character generation
        const selectedStyle = artStyles.find(s => s.value === artStyle);
        const customStyle = customStyles.find(s => s.name === artStyle);
        const stylePrompt = customStyle ? `custom style based on reference image` : (selectedStyle?.stylePrompt || `${artStyle} style`);
        const posePrompt = useReferencePose ? 'maintain exact same pose as reference image' : pose.prompt;
        const additionalPrompt = additionalDescription ? `, ${additionalDescription}` : '';
        
        const fullPrompt = useReferencePose 
          ? `${stylePrompt}${additionalPrompt}. Maintain exact same pose, character appearance, clothing, and facial features as reference image. Keep the character identical, only change the artistic style and rendering technique. Preserve all body positioning, hand gestures, facial expressions, and clothing details exactly as shown in the reference. Focus purely on style transformation while maintaining perfect pose fidelity. High quality, detailed.`
          : `${stylePrompt}, ${posePrompt}${additionalPrompt}. Maintain exact same character appearance, clothing, and facial features as reference image. Focus on artistic style and rendering technique only, not pose or character identity. High quality, detailed.`;

        try {
          const result = await generateCharacterImage(fullPrompt, referenceBase64, referenceImage.type);

          if (result.success && result.imageUrl) {
            // Record usage for each successful generation
            usageTracker.recordGeneration();
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
      
      // Track recent generations
      if (newCharacters.length > 0) {
        recentGenerationsManager.addRecentGenerations(newCharacters);
      }
      
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
    // Clear custom references (they are temporary)
    setCustomStyles([]);
    setCustomPoses([]);
  };

  return (
    <div>
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
                onBackgroundSwapClick();
              }}
              className="w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors duration-200 flex items-center gap-3 header-font font-bold"
            >
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              Background Swap Studio
            </button>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onTokenUsageClick();
              }}
              className="w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors duration-200 flex items-center gap-3 header-font font-bold"
            >
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              Token Usage & Badges
            </button>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onTipsAndTricksClick();
              }}
              className="w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors duration-200 flex items-center gap-3 header-font font-bold"
            >
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Tips and Tricks
            </button>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onAboutClick();
              }}
              className="w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors duration-200 flex items-center gap-3 header-font font-bold"
            >
              <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
              About
            </button>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onUpgradeClick();
              }}
              className="w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors duration-200 flex items-center gap-3 header-font font-bold"
            >
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              Pricing & Plans
            </button>

            {/* Authentication Section */}
            <div className="border-t border-white/10 my-2"></div>
            
            {user ? (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onProfileClick();
                }}
                className="w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors duration-200 flex items-center gap-3 header-font font-bold"
              >
                <User className="w-4 h-4 text-blue-400" />
                Profile
                <span className="text-xs text-gray-400 ml-auto flex items-center gap-1">
                  {profile?.displayName || user.displayName || 'User'}
                  {(profile?.subscriptionTier === 'starter' || profile?.subscriptionTier === 'pro') && (
                    <Award className="w-3 h-3 text-yellow-400" />
                  )}
                </span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onLoginClick();
                }}
                className="w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors duration-200 flex items-center gap-3 header-font font-bold"
              >
                <LogIn className="w-4 h-4 text-green-400" />
                Sign In
                <span className="text-xs text-gray-400 ml-auto">Google</span>
              </button>
            )}

          </div>
        </div>
      )}

      <div className="mx-auto px-4 py-8" style={{ maxWidth: '2000px' }}>
        {/* Header */}
        <div className="text-center mb-12">
          <img 
            src="/logo.png" 
            alt="Character Studio" 
            className="mx-auto mb-6 max-w-[493px] md:max-w-[563px]"
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

          <div className="space-y-8">
            {/* Reference Image Upload and Additional Description - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Reference Image Upload */}
              <div>
                <h3 className="text-lg font-medium text-yellow-400 tracking-wider mb-3 text-left">
                  Upload Character Reference Image
                </h3>
                <ImageUpload
                  onImageSelect={handleImageSelect}
                  preview={imagePreview}
                  onRemove={handleImageRemove}
                  className="aspect-square"
                />
              </div>

              {/* Additional Description, Art Style, and Background */}
              <div className="space-y-6">
                {/* Art Direction */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label htmlFor="description" className="text-sm font-medium text-gray-300 uppercase tracking-wide">
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
                    onCustomStyleUpload={handleCustomStyleUpload}
                    customStyles={customStyles}
                  />
                </div>


              </div>
            </div>

            {/* Pose Selection */}
            <PoseSelector
              poses={defaultPoses}
              selectedPoses={selectedPoses}
              onPoseSelect={handlePoseSelect}
              onCustomPoseUpload={handleCustomPoseUpload}
              onUseReferencePose={handleUseReferencePose}
              hasReferenceImage={!!referenceImage}
              customPoses={customPoses}
              className="mt-8"
            />



            {/* Generate Button */}
                          <button
                onClick={generateCharacterSet}
                disabled={progress.isLoading || !referenceImage || selectedPoses.length === 0}
                className={cn(
                  "w-full rounded-xl text-lg py-5 px-8 font-semibold",
                  "bg-yellow-400 hover:bg-yellow-300",
                  "text-gray-900",
                  progress.isLoading && "opacity-75",
                  (!referenceImage || selectedPoses.length === 0) && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="flex items-center justify-center">
                  <Sparkles className="w-6 h-6 mr-3" />
                  <span className="text-lg font-bold">
                    {progress.isLoading ? 'Generating...' : 'Generate Character'}
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

            {/* Usage Display */}
            <UsageDisplay onUpgradeClick={onUpgradeClick} className="mt-4" />
          </div>
        </div>

        {/* Results */}
        {generatedCharacters.length > 0 && (
          <div ref={resultsRef}>
            <CharacterGrid
              characters={generatedCharacters}
              onDownloadAll={handleDownloadAll}
              onGenerateNew={handleGenerateNew}
              onBackgroundSwapped={(originalCharacter, swappedImageUrl) => {
                // Create a new character entry for the swapped version
                const swappedCharacter: GeneratedCharacter = {
                  ...originalCharacter,
                  imageUrl: swappedImageUrl,
                  timestamp: Date.now(), // New timestamp to make it unique
                  pose: {
                    ...originalCharacter.pose,
                    name: `${originalCharacter.pose.name} (Background Swapped)`
                  }
                };
                setGeneratedCharacters(prev => [...prev, swappedCharacter]);
                // Track the swapped character as a recent generation
                recentGenerationsManager.addRecentGeneration(swappedCharacter);
              }}
            />
          </div>
        )}

        {/* Progress Overlay */}
        <GenerationProgress
          progress={progress}
          isVisible={progress.isLoading}
        />
      </div>

      {/* Custom Reference Upload Modal */}
      {showCustomUpload && (
        <CustomReferenceUpload
          isOpen={showCustomUpload}
          onClose={() => {
            setShowCustomUpload(false);
            setCustomUploadType(null);
          }}
          onCustomStyleSelect={(imageUrl, styleName) => {
            handleCustomStyleSelect(imageUrl, styleName);
            setShowCustomUpload(false);
            setCustomUploadType(null);
          }}
          onCustomPoseSelect={(imageUrl, poseName) => {
            handleCustomPoseSelect(imageUrl, poseName);
            setShowCustomUpload(false);
            setCustomUploadType(null);
          }}
          uploadType={customUploadType || undefined}
        />
      )}

      {/* Art Direction Tips Modal */}
      {showArtDirectionTips && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Art Direction Guide</h3>
              <button
                onClick={() => setShowArtDirectionTips(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-300 text-sm leading-relaxed">
                Add nuance to camera angles, lighting, and composition to enhance your character's visual impact.
              </p>
              
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-yellow-400 font-medium mb-3">Examples:</h4>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="text-gray-300">• "View from below, hero shot"</div>
                  <div className="text-gray-300">• "Skyscrapers in the background"</div>
                  <div className="text-gray-300">• "Golden hour lighting"</div>
                  <div className="text-gray-300">• "Urban street scene"</div>
                  <div className="text-gray-300">• "Studio lighting, clean background"</div>
                  <div className="text-gray-300">• "Dramatic shadows"</div>
                  <div className="text-gray-300">• "Close-up portrait"</div>
                  <div className="text-gray-300">• "Full body shot"</div>
                  <div className="text-gray-300">• "Action pose, dynamic angle"</div>
                  <div className="text-gray-300">• "Cinematic composition"</div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowArtDirectionTips(false)}
                className="px-6 py-2 bg-yellow-500 text-gray-900 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

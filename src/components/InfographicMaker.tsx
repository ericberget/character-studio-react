import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Info, Type, Image as ImageIcon } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { UsageDisplay } from './UsageDisplay';
import { GenerationProgress } from './GenerationProgress';
import { CharacterGrid } from './CharacterGrid';
import { generateInfographic, fileToBase64 } from '../services/gemini';
import type { GeneratedCharacter, GenerationProgress as ProgressType } from '../types';
import { cn } from '../utils/cn';
import { usageTracker } from '../utils/usageTracker';
import { useAuth } from '../contexts/AuthContext';

interface InfographicMakerProps {
  onBackToStudio: () => void;
}

export const InfographicMaker: React.FC<InfographicMakerProps> = ({ onBackToStudio }) => {
  const { user, profile } = useAuth();
  
  // State management
  const [contentImage, setContentImage] = useState<File | null>(null);
  const [contentPreview, setContentPreview] = useState<string>('');
  const [styleImage, setStyleImage] = useState<File | null>(null);
  const [stylePreview, setStylePreview] = useState<string>('');
  const [additionalPrompt, setAdditionalPrompt] = useState('');
  const [showPromptTips, setShowPromptTips] = useState(false);
  
  // Font selection state
  const [fontMode, setFontMode] = useState<'text' | 'image'>('text');
  const [fontDescription, setFontDescription] = useState('');
  const [fontImage, setFontImage] = useState<File | null>(null);
  const [fontPreview, setFontPreview] = useState<string>('');
  
  // Brand color state
  const [brandColor, setBrandColor] = useState('');
  
  // Results and progress
  const [generatedInfographics, setGeneratedInfographics] = useState<GeneratedCharacter[]>([]);
  const [progress, setProgress] = useState<ProgressType>({
    isLoading: false,
    current: 0,
    total: 0,
    status: ''
  });
  
  // Message state
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | null }>({
    text: '',
    type: null
  });

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: null }), 5000);
  };

  // Handle content image upload
  const handleContentImageRemove = () => {
    setContentImage(null);
    setContentPreview('');
  };

  // Handle style image upload
  const handleStyleImageRemove = () => {
    setStyleImage(null);
    setStylePreview('');
  };

  // Handle font image upload
  const handleFontImageRemove = () => {
    setFontImage(null);
    setFontPreview('');
  };

  // Validate hex color
  const isValidHexColor = (hex: string): boolean => {
    if (!hex) return true; // Empty is valid (optional)
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexRegex.test(hex);
  };

  // Normalize hex color (add # if missing)
  const normalizeHexColor = (hex: string): string => {
    if (!hex) return '';
    if (hex.startsWith('#')) return hex;
    return `#${hex}`;
  };

  // Handle brand color change
  const handleBrandColorChange = (value: string) => {
    // Remove # if user types it, we'll add it back
    const normalized = value.startsWith('#') ? value : normalizeHexColor(value);
    setBrandColor(normalized);
  };

  // Handle generation
  const handleGenerate = async () => {
    if (!contentImage || !styleImage) {
      showMessage('Please upload both a content reference image and a style reference image.', 'error');
      return;
    }

    // Check if user can generate
    if (!usageTracker.canGenerate()) {
      showMessage('Free trial limit reached! Please upgrade to continue generating.', 'error');
      return;
    }

    setProgress({
      isLoading: true,
      current: 1,
      total: 1,
      status: 'Generating Infographic with Nano Banana...'
    });

    setGeneratedInfographics([]);

    // Validate brand color if provided
    if (brandColor && !isValidHexColor(brandColor)) {
      showMessage('Please enter a valid hex color code (e.g., #FF5733 or #F53)', 'error');
      return;
    }

    try {
      // Convert images to base64
      const contentBase64 = await fileToBase64(contentImage);
      const styleBase64 = await fileToBase64(styleImage);
      
      // Convert font image if provided
      let fontImageBase64: string | null = null;
      if (fontMode === 'image' && fontImage) {
        fontImageBase64 = await fileToBase64(fontImage);
      }

      const result = await generateInfographic(
        contentBase64, 
        styleBase64, 
        additionalPrompt,
        fontMode === 'text' ? fontDescription : null,
        fontImageBase64,
        brandColor || undefined
      );

      if (result.success && result.imageUrl) {
        const infographic: GeneratedCharacter = {
          imageUrl: result.imageUrl,
          pose: {
            id: 'infographic',
            name: 'Infographic',
            description: 'Generated Infographic',
            prompt: additionalPrompt,
            emoji: '📊'
          },
          timestamp: Date.now(),
          prompt: additionalPrompt
        };

        setGeneratedInfographics([infographic]);
        
        // Track usage
        usageTracker.recordGeneration();
        
        showMessage('Infographic generated successfully!', 'success');
        
        // Scroll to results
        setTimeout(() => {
          const resultsElement = document.getElementById('infographic-results');
          if (resultsElement) {
            resultsElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        throw new Error(result.error || 'Infographic generation failed');
      }
    } catch (error) {
      console.error('Infographic generation error:', error);
      showMessage(error instanceof Error ? error.message : 'Infographic generation failed. Please try again.', 'error');
    } finally {
      setProgress({
        isLoading: false,
        current: 0,
        total: 0,
        status: ''
      });
    }
  };

  const handleDownloadAll = async () => {
    for (const item of generatedInfographics) {
      try {
        const response = await fetch(item.imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `infographic-${item.timestamp}.jpg`;
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
    setGeneratedInfographics([]);
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
              Infographic Maker
            </h1>
          </div>
          
          {user && profile && (
            <UsageDisplay 
              onUpgradeClick={() => {}}
              className="mx-auto mb-6 max-w-[493px] md:max-w-[563px]"
            />
          )}
        </div>

        {/* Main Form */}
        <div className="bg-transparent backdrop-blur-sm border border-gray-800/50 rounded-xl p-8 mb-8">
          <div className="space-y-8">
            {/* Image Uploads - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Content Image Upload */}
              <div>
                <h3 className="text-lg font-medium text-yellow-400 tracking-wider mb-3 text-left">
                  Upload Content Reference
                </h3>
                <p className="text-gray-400 text-sm mb-2">Upload an image containing the data/content you want to visualize.</p>
                <ImageUpload
                  onImageSelect={(file, preview) => {
                    setContentImage(file);
                    setContentPreview(preview);
                  }}
                  preview={contentPreview}
                  onRemove={handleContentImageRemove}
                  className="aspect-square"
                />
              </div>

              {/* Style Image Upload */}
              <div>
                <h3 className="text-lg font-medium text-yellow-400 tracking-wider mb-3 text-left">
                  Upload Style Reference
                </h3>
                <p className="text-gray-400 text-sm mb-2">Upload an image with the visual style/aesthetic you want to use.</p>
                <ImageUpload
                  onImageSelect={(file, preview) => {
                    setStyleImage(file);
                    setStylePreview(preview);
                  }}
                  preview={stylePreview}
                  onRemove={handleStyleImageRemove}
                  className="aspect-square"
                />
              </div>
            </div>

            {/* Font Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-300 uppercase tracking-wide">
                  Font Selection (Optional)
                </label>
              </div>
              
              {/* Font Mode Toggle */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setFontMode('text')}
                  className={cn(
                    "flex-1 px-4 py-2 rounded-lg border transition-colors duration-200 flex items-center justify-center gap-2",
                    fontMode === 'text' 
                      ? "bg-yellow-400/20 border-yellow-400 text-yellow-400" 
                      : "bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600"
                  )}
                >
                  <Type className="w-4 h-4" />
                  Text Description
                </button>
                <button
                  onClick={() => setFontMode('image')}
                  className={cn(
                    "flex-1 px-4 py-2 rounded-lg border transition-colors duration-200 flex items-center justify-center gap-2",
                    fontMode === 'image' 
                      ? "bg-yellow-400/20 border-yellow-400 text-yellow-400" 
                      : "bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600"
                  )}
                >
                  <ImageIcon className="w-4 h-4" />
                  Image Reference
                </button>
              </div>

              {/* Font Input based on mode */}
              {fontMode === 'text' ? (
                <input
                  type="text"
                  value={fontDescription}
                  onChange={(e) => setFontDescription(e.target.value)}
                  placeholder="e.g., Modern sans-serif, Bold serif, Handwritten script, Futuristic tech font..."
                  className="input-field w-full"
                />
              ) : (
                <div>
                  <ImageUpload
                    onImageSelect={(file, preview) => {
                      setFontImage(file);
                      setFontPreview(preview);
                    }}
                    preview={fontPreview}
                    onRemove={handleFontImageRemove}
                    className="aspect-video"
                  />
                </div>
              )}
            </div>

            {/* Brand Color */}
            <div>
              <label htmlFor="brandColor" className="text-sm font-medium text-gray-300 uppercase tracking-wide mb-3 block">
                Brand Color (Optional)
              </label>
              <div className="flex gap-3 items-center">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    id="brandColor"
                    value={brandColor}
                    onChange={(e) => handleBrandColorChange(e.target.value)}
                    placeholder="#FF5733"
                    className={cn(
                      "input-field w-full pl-10",
                      brandColor && !isValidHexColor(brandColor) && "border-red-500"
                    )}
                  />
                  {brandColor && isValidHexColor(brandColor) && (
                    <div 
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded border border-gray-600"
                      style={{ backgroundColor: normalizeHexColor(brandColor) }}
                    />
                  )}
                </div>
                {brandColor && (
                  <input
                    type="color"
                    value={normalizeHexColor(brandColor)}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="w-12 h-12 rounded border border-gray-700 cursor-pointer"
                  />
                )}
              </div>
              {brandColor && !isValidHexColor(brandColor) && (
                <p className="text-red-400 text-xs mt-1">Please enter a valid hex color (e.g., #FF5733)</p>
              )}
            </div>

            {/* Additional Prompt */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label htmlFor="additionalPrompt" className="text-sm font-medium text-gray-300 uppercase tracking-wide">
                  Additional Description (Optional)
                </label>
                <button
                  onClick={() => setShowPromptTips(true)}
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-200"
                  title="Prompting Tips"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
              <textarea
                id="additionalPrompt"
                value={additionalPrompt}
                onChange={(e) => setAdditionalPrompt(e.target.value)}
                placeholder="Add specific instructions for the infographic layout, focus, or specific details..."
                className="input-field resize-none h-[120px]"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={progress.isLoading || !contentImage || !styleImage}
              className={cn(
                "w-full rounded-xl text-lg py-5 px-8 font-semibold",
                "bg-yellow-400 hover:bg-yellow-300",
                "text-gray-900",
                progress.isLoading && "opacity-75",
                (!contentImage || !styleImage) && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex items-center justify-center">
                <Sparkles className="w-6 h-6 mr-3" />
                <span className="text-lg font-bold">
                  {progress.isLoading ? 'Generating Infographic...' : 'Generate Infographic'}
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
        {generatedInfographics.length > 0 && (
          <div id="infographic-results">
            <CharacterGrid
              characters={generatedInfographics}
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

        {/* Prompt Tips Modal */}
        {showPromptTips && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-lg">Infographic Prompting Tips</h3>
                <button
                  onClick={() => setShowPromptTips(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="space-y-3 text-gray-300 text-sm">
                <p><strong>Layout & Structure:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>"Focus on the flowchart structure"</li>
                  <li>"Create a timeline layout"</li>
                  <li>"Use a comparison side-by-side layout"</li>
                </ul>
                
                <p><strong>Data Emphasis:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>"Highlight the statistics in red"</li>
                  <li>"Emphasize the first three steps"</li>
                  <li>"Make the key takeaways prominent"</li>
                </ul>
                
                <p><strong>Style Adjustments:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>"Use minimal clean lines"</li>
                  <li>"Make it look hand-drawn"</li>
                  <li>"Use corporate color scheme"</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


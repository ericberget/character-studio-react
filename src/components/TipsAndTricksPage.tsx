import React from 'react';
import { ArrowLeft, Lightbulb, Camera, Palette, Sparkles, Users, Download, Heart, Zap, Target, Wand2, Image } from 'lucide-react';
import { cn } from '../utils/cn';

interface TipsAndTricksPageProps {
  onBackToStudio: () => void;
}

interface TipCard {
  id: string;
  category: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  tips: string[];
}

export const TipsAndTricksPage: React.FC<TipsAndTricksPageProps> = ({ onBackToStudio }) => {
  const tipCategories: TipCard[] = [
    {
      id: 'generation',
      category: 'Character Generation',
      title: 'Getting the Best Results',
      description: 'Master the art of character creation with these essential tips',
      icon: Sparkles,
      color: 'text-blue-400',
      tips: [
        'Upload high-quality reference images (at least 512x512 pixels) for best results',
        'Use clear, well-lit photos with the character facing forward',
        'Avoid blurry, dark, or heavily filtered reference images',
        'Make sure the character is the main focus of the image',
        'Try different art styles to match your project needs',
        'Use the "Additional Description" field to specify clothing details or special features'
      ]
    },
    {
      id: 'poses',
      category: 'Pose Selection',
      title: 'Choosing the Right Poses',
      description: 'Select poses that tell your story effectively',
      icon: Users,
      color: 'text-purple-400',
      tips: [
        'Select multiple poses to create a complete character set',
        'Mix different pose types: standing, sitting, and action poses',
        'Consider your use case - presentations need professional poses',
        'Use "neutral" poses as a safe starting point',
        'Combine different poses to create dynamic storytelling sequences'
      ]
    },
    {
      id: 'styles',
      category: 'Art Styles',
      title: 'Picking the Perfect Style',
      description: 'Match your art style to your project requirements',
      icon: Palette,
      color: 'text-emerald-400',
      tips: [
        'Use "Realistic" for professional presentations and corporate training',
        'Try "Comic Style" for engaging educational content',
        'Choose "Vector Clean" for modern, minimalist designs',
        'Use "Pixel Art" for retro gaming or tech projects',
        'Experiment with "Watercolor" for creative, artistic projects',
        'Upload custom style references for unique brand-specific looks'
      ]
    },
    {
      id: 'background-swap',
      category: 'Background Swapping',
      title: 'Creating Perfect Environments',
      description: 'Master the background swap studio for compelling scenes',
      icon: Image,
      color: 'text-yellow-400',
      tips: [
        'Use high-resolution background images for best quality',
        'Choose backgrounds that match the lighting of your character',
        'Try art direction prompts like "make background slightly blurred"',
        'Use "illustrated style" to convert photo backgrounds to match character style',
        'Select preset backgrounds for quick professional results',
        'Experiment with different environments to tell your story'
      ]
    },
    {
      id: 'workflow',
      category: 'Workflow Optimization',
      title: 'Streamline Your Process',
      description: 'Work faster and more efficiently with these workflow tips',
      icon: Zap,
      color: 'text-pink-400',
      tips: [
        'Generate multiple characters at once by selecting several poses',
        'Use the "Download All" button to get all characters in one click',
        'Favorite your best characters for easy access later',
        'Start with basic generations, then use background swap for variations',
        'Keep reference images organized on your computer for quick access',
        'Use descriptive filenames when downloading for better organization'
      ]
    },
    {
      id: 'quality',
      category: 'Quality & Troubleshooting',
      title: 'Ensuring Consistent Quality',
      description: 'Fix common issues and improve your results',
      icon: Target,
      color: 'text-orange-400',
      tips: [
        'If results look off, try a different art style or pose combination',
        'For better facial consistency, use clear, front-facing reference photos',
        'If clothing details are lost, add specific descriptions in the Art Direction field',
        'Regenerate if you\'re not happy - each generation can be different',
        'Use the zoom feature to check fine details before downloading',
        'Try background removal for characters you want to use on different backgrounds'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950" style={{
      backgroundImage: 'url(/bg.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBackToStudio}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Character Studio
          </button>
          <div className="h-6 w-px bg-gray-600" />
          <h1 className="text-3xl font-bold text-white header-font">
            Tips & Tricks
          </h1>
        </div>

        {/* Hero Section */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-yellow-500/20 rounded-xl">
              <Lightbulb className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white header-font">Master Character Studio</h2>
              <p className="text-gray-400">
                Learn professional techniques to create amazing characters and get the most out of every feature
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <Camera className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <h3 className="text-white font-medium text-sm">Better Reference Images</h3>
              <p className="text-gray-400 text-xs mt-1">High-quality inputs = amazing outputs</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <Wand2 className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <h3 className="text-white font-medium text-sm">Smart Pose Selection</h3>
              <p className="text-gray-400 text-xs mt-1">Choose poses that tell your story</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
              <h3 className="text-white font-medium text-sm">Organize Favorites</h3>
              <p className="text-gray-400 text-xs mt-1">Save and reuse your best work</p>
            </div>
          </div>
        </div>

        {/* Tips Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tipCategories.map((category, index) => (
            <div
              key={category.id}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors duration-200"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={cn(
                  "p-2 rounded-lg",
                  category.color.replace('text-', 'bg-').replace('400', '500/20')
                )}>
                  <category.icon className={cn("w-5 h-5", category.color)} />
                </div>
                <div>
                  <h3 className={cn("font-bold header-font", category.color)}>
                    {category.title}
                  </h3>
                  <p className="text-gray-500 text-xs uppercase tracking-wide">
                    {category.category}
                  </p>
                </div>
              </div>

              <p className="text-gray-400 text-sm mb-4">
                {category.description}
              </p>

              {/* Tips List */}
              <ul className="space-y-3">
                {category.tips.map((tip, tipIndex) => (
                  <li key={tipIndex} className="flex items-start gap-3">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0",
                      category.color.replace('text-', 'bg-')
                    )} />
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {tip}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white header-font mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={onBackToStudio}
              className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors group"
            >
              <Sparkles className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
              <div className="text-left">
                <p className="text-white font-medium text-sm">Start Creating</p>
                <p className="text-gray-400 text-xs">Go to Character Studio</p>
              </div>
            </button>
            
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors group"
            >
              <Lightbulb className="w-5 h-5 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
              <div className="text-left">
                <p className="text-white font-medium text-sm">Review Tips</p>
                <p className="text-gray-400 text-xs">Back to top</p>
              </div>
            </button>

            <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg">
              <Download className="w-5 h-5 text-green-400" />
              <div className="text-left">
                <p className="text-white font-medium text-sm">Pro Tip</p>
                <p className="text-gray-400 text-xs">Always download your favorites</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            💡 Have a tip to share? These techniques are based on community feedback and testing
          </p>
        </div>
      </div>
    </div>
  );
};

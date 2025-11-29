import React from 'react';
import { Sparkles, Wand2, Zap, Image, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onCharacterStudioClick: () => void;
  onThumbnailGeneratorClick: () => void;
}

// Character Studio "after" samples - different art styles from the same reference
const CHARACTER_AFTER_SAMPLES = [
  '/artstyles/realistic.jpeg',
  '/artstyles/comic-style-1.jpg',
  '/artstyles/claymation-style.jpg',
  '/artstyles/pencil-sketch.jpg',
  '/artstyles/vintage-comic.jpg',
  '/artstyles/pixel-art-2.jpg',
];

// Sketchy Arrow SVG Component
const SketchyArrow: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    viewBox="0 0 120 40" 
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Main arrow line - sketchy/hand-drawn style */}
    <path 
      d="M8 20 Q 20 18, 35 21 Q 50 24, 65 19 Q 80 14, 95 20" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Arrow head */}
    <path 
      d="M88 12 Q 95 18, 95 20 Q 95 22, 88 28" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path 
      d="M95 20 L 110 20" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round"
    />
    <path 
      d="M102 12 L 110 20 L 102 28" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onCharacterStudioClick, 
  onThumbnailGeneratorClick 
}) => {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-yellow-500/8 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-yellow-600/6 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/3 rounded-full blur-[200px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center px-4 py-12 md:py-16">
        
        {/* ==================== HERO SECTION ==================== */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 backdrop-blur-sm mb-8">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-semibold text-yellow-300/90 uppercase tracking-wider">AI-Powered Creative Suite</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Choose Your Creative Tool
          </h1>
          
          <p className="text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
            Transform ordinary photos into extraordinary art with the power of AI.
          </p>
        </div>

        {/* ==================== APP SELECTION CARDS ==================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full mb-24 px-4">
          
          {/* Character Studio Card */}
          <button
            onClick={onCharacterStudioClick}
            className="group relative bg-gradient-to-br from-gray-900/80 to-gray-950/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-left transition-all duration-500 hover:border-yellow-500/50 hover:shadow-[0_0_60px_-15px_rgba(234,179,8,0.3)] hover:-translate-y-2 overflow-hidden"
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-yellow-500/10 to-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Logo */}
            <div className="relative mb-6">
              <img 
                src="/logo.png" 
                alt="Character Studio" 
                className="h-16 md:h-20 object-contain"
              />
            </div>
            
            {/* Content */}
            <div className="relative">
              <p className="text-gray-400 mb-6 leading-relaxed">
                Create consistent character illustrations in multiple poses and art styles from a single reference photo.
              </p>
              
              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-medium">
                  Multiple Poses
                </span>
                <span className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-medium">
                  Art Styles
                </span>
                <span className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-medium">
                  Custom References
                </span>
              </div>

              <div className="flex items-center gap-2 text-yellow-400 font-semibold group-hover:gap-3 transition-all">
                Launch Studio <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </button>

          {/* ThumbGen Card */}
          <button
            onClick={onThumbnailGeneratorClick}
            className="group relative bg-gradient-to-br from-gray-900/80 to-gray-950/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-left transition-all duration-500 hover:border-yellow-500/50 hover:shadow-[0_0_60px_-15px_rgba(234,179,8,0.3)] hover:-translate-y-2 overflow-hidden"
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-yellow-500/10 to-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Icon + Title */}
            <div className="relative mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-500/20 to-amber-600/20 rounded-2xl flex items-center justify-center ring-1 ring-yellow-500/30">
                  <Image className="w-7 h-7 text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    ThumbGen <span className="text-yellow-400">AI</span>
                  </h2>
                  <p className="text-sm text-gray-500">Thumbnail Generator</p>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="relative">
              <p className="text-gray-400 mb-6 leading-relaxed">
                Generate click-worthy YouTube thumbnails in seconds. Multiple viral styles with instant AI refinement.
              </p>
              
              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-medium">
                  Viral Styles
                </span>
                <span className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-medium">
                  AI Refinement
                </span>
                <span className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-medium">
                  16:9 Export
                </span>
              </div>

              <div className="flex items-center gap-2 text-yellow-400 font-semibold group-hover:gap-3 transition-all">
                Launch ThumbGen <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </button>
        </div>

        {/* ==================== DIVIDER ==================== */}
        <div className="w-full max-w-4xl mb-20 px-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="text-gray-600 text-sm font-medium uppercase tracking-widest">See it in action</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        </div>

        {/* ==================== CHARACTER STUDIO BEFORE/AFTER ==================== */}
        <div className="w-full max-w-6xl mb-20 px-4">
          <div className="text-center mb-10">
            <img 
              src="/logo.png" 
              alt="Character Studio" 
              className="h-12 md:h-14 object-contain mx-auto mb-4"
            />
            <p className="text-gray-500">Upload one photo, generate unlimited art styles</p>
          </div>

          {/* Before/After Showcase */}
          <div className="relative bg-gradient-to-br from-gray-900/60 to-gray-950/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 overflow-hidden">
            {/* Decorative grain texture overlay */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }} />
            
            <div className="relative flex flex-col lg:flex-row items-center gap-6 lg:gap-4">
              {/* Before */}
              <div className="flex-shrink-0 text-center">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Upload Photo</div>
                <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden border-2 border-gray-700/50 shadow-2xl">
                  <img 
                    src="/samples/before.jpg" 
                    alt="Before" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </div>

              {/* Sketchy Arrow */}
              <div className="flex-shrink-0 px-2 lg:px-4 rotate-90 lg:rotate-0">
                <SketchyArrow className="w-24 h-10 text-yellow-500/70" />
              </div>

              {/* After - Scrolling Gallery */}
              <div className="flex-1 w-full lg:w-auto overflow-hidden">
                <div className="text-xs font-bold text-yellow-500 uppercase tracking-widest mb-3 text-center lg:text-left">Get Any Style</div>
                <div className="relative overflow-hidden rounded-2xl">
                  {/* Fade edges */}
                  <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-gray-900/90 to-transparent z-10 pointer-events-none" />
                  <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-gray-900/90 to-transparent z-10 pointer-events-none" />
                  
                  {/* Scrolling container */}
                  <div className="flex gap-4 animate-marquee hover:[animation-play-state:paused]">
                    {[...CHARACTER_AFTER_SAMPLES, ...CHARACTER_AFTER_SAMPLES, ...CHARACTER_AFTER_SAMPLES].map((src, idx) => (
                      <div
                        key={idx}
                        className="flex-shrink-0 w-40 h-40 md:w-48 md:h-48 rounded-xl overflow-hidden border border-yellow-500/20 shadow-xl hover:border-yellow-500/50 transition-all duration-300 cursor-pointer hover:scale-105"
                        onClick={onCharacterStudioClick}
                      >
                        <img 
                          src={src} 
                          alt="Character style sample" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 text-center">
              <button
                onClick={onCharacterStudioClick}
                className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-gray-900 rounded-xl font-bold transition-all hover:shadow-[0_0_30px_-5px_rgba(234,179,8,0.5)]"
              >
                <Wand2 className="w-5 h-5" />
                Try Character Studio
              </button>
            </div>
          </div>
        </div>

        {/* ==================== THUMBGEN BEFORE/AFTER ==================== */}
        <div className="w-full max-w-6xl mb-20 px-4">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500/20 to-amber-600/20 rounded-xl flex items-center justify-center ring-1 ring-yellow-500/30">
                <Image className="w-5 h-5 text-yellow-400" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                ThumbGen <span className="text-yellow-400">AI</span>
              </h2>
            </div>
            <p className="text-gray-500">Describe your video, get click-worthy thumbnails</p>
          </div>

          {/* Before/After Showcase */}
          <div className="relative bg-gradient-to-br from-gray-900/60 to-gray-950/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 overflow-hidden">
            {/* Decorative grain texture overlay */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }} />
            
            <div className="relative flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
              {/* Before - Video Title */}
              <div className="flex-shrink-0 text-center lg:text-left">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Your Idea</div>
                <div className="relative w-64 md:w-72 bg-gray-800/80 rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
                  <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Video Title</div>
                  <div className="text-white font-bold text-lg leading-tight mb-4">"I Survived 24 Hours in a Haunted Prison"</div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-400 text-xs font-medium">Hype Style</span>
                    <span className="px-2 py-1 bg-gray-700/50 border border-gray-600/50 rounded text-gray-400 text-xs">+ Face</span>
                  </div>
                </div>
              </div>

              {/* Sketchy Arrow */}
              <div className="flex-shrink-0 px-2 rotate-90 lg:rotate-0">
                <SketchyArrow className="w-24 h-10 text-yellow-500/70" />
              </div>

              {/* After - Thumbnail Results */}
              <div className="flex-1 w-full lg:w-auto overflow-hidden">
                <div className="text-xs font-bold text-yellow-500 uppercase tracking-widest mb-3 text-center lg:text-left">Generated Thumbnails</div>
                <div className="relative overflow-hidden rounded-2xl">
                  {/* Fade edges */}
                  <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-gray-900/90 to-transparent z-10 pointer-events-none" />
                  <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-gray-900/90 to-transparent z-10 pointer-events-none" />
                  
                  {/* Scrolling container - reverse direction */}
                  <div className="flex gap-4 animate-marquee-reverse hover:[animation-play-state:paused]">
                    {['/thumbnails/thumbExample.jpg', '/thumbnails/thumbExample2.jpg', '/thumbnails/thumbExample.jpg', '/thumbnails/thumbExample2.jpg', '/thumbnails/thumbExample.jpg', '/thumbnails/thumbExample2.jpg'].map((src, idx) => (
                      <div
                        key={idx}
                        className="flex-shrink-0 w-72 md:w-80 aspect-video rounded-xl overflow-hidden border border-yellow-500/20 shadow-xl hover:border-yellow-500/50 transition-all duration-300 cursor-pointer hover:scale-105"
                        onClick={onThumbnailGeneratorClick}
                      >
                        <img 
                          src={src} 
                          alt="Thumbnail sample" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 text-center">
              <button
                onClick={onThumbnailGeneratorClick}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-yellow-400 border border-yellow-500/30 hover:border-yellow-500/60 rounded-xl font-bold transition-all hover:shadow-[0_0_30px_-5px_rgba(234,179,8,0.3)]"
              >
                <Sparkles className="w-5 h-5" />
                Try ThumbGen AI
              </button>
            </div>
          </div>
        </div>

        {/* ==================== FEATURES ==================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full px-4">
          <div className="text-center p-6 bg-gray-900/40 rounded-2xl border border-white/5">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 ring-1 ring-yellow-500/20">
              <Zap className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Lightning Fast</h3>
            <p className="text-gray-500 text-sm">Generate stunning visuals in seconds with optimized AI.</p>
          </div>
          
          <div className="text-center p-6 bg-gray-900/40 rounded-2xl border border-white/5">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 ring-1 ring-yellow-500/20">
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Pro Quality</h3>
            <p className="text-gray-500 text-sm">Powered by Gemini's latest image generation models.</p>
          </div>
          
          <div className="text-center p-6 bg-gray-900/40 rounded-2xl border border-white/5">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 ring-1 ring-yellow-500/20">
              <Wand2 className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Easy Refinement</h3>
            <p className="text-gray-500 text-sm">Natural language editing to perfect your creations.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-6">
        <div className="text-center text-gray-600 text-sm">
          Powered by Google Gemini AI
        </div>
      </footer>

      {/* CSS for marquee animations */}
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        @keyframes marquee-reverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        
        .animate-marquee-reverse {
          animation: marquee-reverse 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Sparkles, Wand2, Zap, ArrowRight, Image as ImageIcon, User, Star, Palette, Video, Camera } from 'lucide-react';

interface LandingPageProps {
  onCharacterStudioClick: () => void;
  onThumbnailGeneratorClick: () => void;
}

// Character Studio "after" samples
const CHARACTER_AFTER_SAMPLES = [
  '/samples/sample-watercolor.jpg',
  '/samples/sample-painted.jpg',
  '/samples/sample-comic.jpg',
];

const SpotlightCard: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}> = ({ children, onClick, className = '' }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <button
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-gray-900/50 p-8 text-left transition-all duration-300 hover:border-yellow-500/50 hover:shadow-2xl hover:shadow-yellow-500/10 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(234, 179, 8, 0.1), transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </button>
  );
};

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onCharacterStudioClick, 
  onThumbnailGeneratorClick 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A] text-white overflow-x-hidden selection:bg-yellow-500/30">
      
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-yellow-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px]" />
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className={`relative z-10 flex-1 flex flex-col items-center px-4 pt-20 pb-32 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* ==================== HERO ==================== */}
        <div className="text-center max-w-4xl mx-auto mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 hover:bg-white/10 transition-colors cursor-default animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-gray-300">AI-Powered Creative Suite</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50 mb-8 tracking-tight leading-tight">
            Unleash Your <br className="hidden md:block" />
            <span className="text-yellow-400 inline-block relative">
              Creative Potential
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-yellow-500/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Transform ordinary assets into extraordinary art. Create consistent characters and viral thumbnails in seconds with our suite of AI tools.
          </p>
        </div>

        {/* ==================== TOOLS GRID ==================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full mb-32">
          
          {/* Character Studio Card */}
          <SpotlightCard onClick={onCharacterStudioClick} className="group h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                <User className="w-8 h-8 text-purple-400" />
              </div>
              <div className="px-3 py-1 rounded-full bg-white/5 text-xs font-medium text-gray-400 border border-white/5 group-hover:border-purple-500/30 transition-colors">
                Version 2.0
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">Character Studio</h2>
            <p className="text-gray-400 mb-8 leading-relaxed flex-1">
              Create consistent character illustrations in multiple poses and art styles. Perfect for storyboards, comics, and game assets.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Palette className="w-4 h-4 text-purple-400" /> 15+ Art Styles
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Camera className="w-4 h-4 text-purple-400" /> Face Reference
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <User className="w-4 h-4 text-purple-400" /> Consistent Poses
              </div>
            </div>

            <div className="flex items-center gap-2 text-white font-semibold group-hover:translate-x-2 transition-transform">
              Open Studio <ArrowRight className="w-4 h-4" />
            </div>

            {/* Visual Preview Hover */}
            <div className="absolute -right-20 -bottom-20 opacity-10 group-hover:opacity-20 transition-opacity rotate-[-10deg] pointer-events-none">
              <img src="/logo.png" className="w-64 grayscale" alt="" />
            </div>
          </SpotlightCard>

          {/* Thumbinator Card */}
          <SpotlightCard onClick={onThumbnailGeneratorClick} className="group h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 group-hover:scale-110 transition-transform duration-300">
                <ImageIcon className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="px-3 py-1 rounded-full bg-white/5 text-xs font-medium text-gray-400 border border-white/5 group-hover:border-yellow-500/30 transition-colors">
                New Tool
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors">THUMBINATOR</h2>
            <p className="text-gray-400 mb-8 leading-relaxed flex-1">
              Generate click-worthy YouTube thumbnails instantly. Viral styles, AI refinement, and professional composition in one click.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Zap className="w-4 h-4 text-yellow-400" /> Viral Styles
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Wand2 className="w-4 h-4 text-yellow-400" /> AI Refinement
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Video className="w-4 h-4 text-yellow-400" /> 16:9 Ready
              </div>
            </div>

            <div className="flex items-center gap-2 text-white font-semibold group-hover:translate-x-2 transition-transform">
              Launch Thumbinator <ArrowRight className="w-4 h-4" />
            </div>

            {/* Visual Preview Hover */}
            <div className="absolute -right-20 -bottom-20 opacity-10 group-hover:opacity-20 transition-opacity rotate-[-10deg] pointer-events-none">
              <ImageIcon className="w-64 text-white" />
            </div>
          </SpotlightCard>

        </div>

        {/* ==================== SHOWCASE SECTION ==================== */}
        <div className="w-full max-w-7xl">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">See it in Action</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Character Studio Showcase */}
            <div 
              onClick={onCharacterStudioClick}
              className="group relative rounded-3xl overflow-hidden cursor-pointer border border-white/10 bg-gray-900/50 hover:border-purple-500/50 transition-all duration-500 hover:shadow-[0_0_50px_-12px_rgba(168,85,247,0.4)]"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10" />
              
              <div className="p-8 relative z-20 h-full flex flex-col justify-end">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-500/20 rounded-lg backdrop-blur-md border border-purple-500/30">
                    <User className="w-5 h-5 text-purple-300" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Character Transformations</h3>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg">
                    <img src="/samples/characterBefore.jpg" className="w-full h-full object-cover" alt="Before" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-gray-500" />
                  <div className="flex -space-x-4 hover:space-x-2 transition-all duration-300">
                    {CHARACTER_AFTER_SAMPLES.map((src, i) => (
                      <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border-2 border-purple-500/50 shadow-xl relative z-0 hover:z-10 hover:scale-110 transition-all">
                        <img src={src} className="w-full h-full object-cover" alt="After" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Background Grid of Styles */}
              <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500 group-hover:scale-105 transform">
                <div className="grid grid-cols-2 gap-2">
                  <img src="/samples/sample-watercolor.jpg" className="w-full h-full object-cover" alt="" />
                  <img src="/samples/sample-comic.jpg" className="w-full h-full object-cover" alt="" />
                </div>
              </div>
            </div>

            {/* Thumbinator Showcase */}
            <div 
              onClick={onThumbnailGeneratorClick}
              className="group relative rounded-3xl overflow-hidden cursor-pointer border border-white/10 bg-gray-900/50 hover:border-yellow-500/50 transition-all duration-500 hover:shadow-[0_0_50px_-12px_rgba(234,179,8,0.4)]"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10" />
              
              <div className="p-8 relative z-20 h-full flex flex-col justify-end">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-yellow-500/20 rounded-lg backdrop-blur-md border border-yellow-500/30">
                    <ImageIcon className="w-5 h-5 text-yellow-300" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Viral Thumbnails</h3>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg relative">
                    <img src="/samples/before-thumbgen.jpg" className="w-full h-full object-cover" alt="Before" />
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 p-1 text-[8px] text-white truncate">Reference</div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-gray-500" />
                  <div className="flex-1 overflow-hidden">
                    <div className="flex gap-2 animate-marquee hover:[animation-play-state:paused]">
                      {['/thumbnails/thumbExample.jpg', '/thumbnails/thumbExample2.jpg', '/thumbnails/thumbExample.jpg'].map((src, i) => (
                        <div key={i} className="w-32 aspect-video rounded-lg overflow-hidden border border-yellow-500/30 flex-shrink-0">
                          <img src={src} className="w-full h-full object-cover" alt="Thumbnail" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

               {/* Background Grid of Styles */}
               <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500 group-hover:scale-105 transform">
                <div className="grid grid-cols-2 gap-2">
                  <img src="/thumbnails/thumbExample.jpg" className="w-full h-full object-cover" alt="" />
                  <img src="/thumbnails/thumbExample2.jpg" className="w-full h-full object-cover" alt="" />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ==================== TRUST/FOOTER ==================== */}
        <div className="mt-32 text-center border-t border-white/5 pt-16 w-full max-w-4xl">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="flex items-center gap-2">
               <Star className="w-5 h-5 text-yellow-500" />
               <span className="font-semibold">High Resolution</span>
             </div>
             <div className="flex items-center gap-2">
               <Zap className="w-5 h-5 text-yellow-500" />
               <span className="font-semibold">Fast Generation</span>
             </div>
             <div className="flex items-center gap-2">
               <Sparkles className="w-5 h-5 text-yellow-500" />
               <span className="font-semibold">Gemini Powered</span>
             </div>
          </div>
          
          <div className="mt-12 text-sm text-gray-600">
            © {new Date().getFullYear()} Character Studio. All rights reserved.
          </div>
        </div>

      </div>

      {/* Styles */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

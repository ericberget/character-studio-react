import React, { useState, useRef, useCallback } from 'react';
import { X, Wand2, Type, Image as ImageIcon, Download, RefreshCw, Edit2, ArrowLeft, ArrowRight, Loader2, MessageSquarePlus, User, Sparkles, Camera, Upload } from 'lucide-react';
import { generateThumbnail, refineThumbnail } from '../services/gemini';
import type { GeneratedThumbnail } from '../types';

// Quick Style Option
interface QuickStyleOption {
  id: string;
  name: string;
  emoji: string;
  promptModifier: string;
}

// Quick Select Styles - text-based, no images
const QUICK_STYLES: QuickStyleOption[] = [
  {
    id: 'hype',
    name: 'Hype',
    emoji: '🔥',
    promptModifier: 'Viral MrBeast-style thumbnail with explosive energy. Hyper-saturated colors, dramatic explosions and sparks radiating from subject. Bold yellow/white text with black stroke. Flying objects, motion blur, extreme drama. High contrast, cinematic lighting with glow effects.',
  },
  {
    id: 'tech-gaming',
    name: 'Tech / Gaming',
    emoji: '🎮',
    promptModifier: 'Futuristic tech-gaming thumbnail style. Cool blue and purple neon lighting. Holographic UI elements, floating screens, and digital effects. Sleek cyan/blue gradient text with 3D depth. Lightning effects, motion lines, professional esports aesthetic.',
  },
  {
    id: 'business-1',
    name: 'Business Professional',
    emoji: '💼',
    promptModifier: 'Clean professional business thumbnail. Corporate aesthetic with modern design. Subject in professional attire. Clean background with subtle gradient or office environment. Bold, clean sans-serif typography. Trust-building blue and gray color palette. High-quality professional headshot style.',
  },
  {
    id: 'business-2',
    name: 'Business Casual',
    emoji: '👔',
    promptModifier: 'Modern business casual thumbnail style. Approachable yet professional. Warm, inviting lighting. Clean minimalist background. Friendly expression on subject. Modern typography with clean lines. Warm neutrals with accent colors. LinkedIn-style professional but personable.',
  },
  {
    id: 'educational',
    name: 'Educational',
    emoji: '📚',
    promptModifier: 'Educational content thumbnail. Clean, professional look with clear visual hierarchy. Diagrams, icons, or visual explanations in background. Bold, readable typography. Trust-building color palette (blues, greens). Informative and authoritative aesthetic.',
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle / Vlog',
    emoji: '✨',
    promptModifier: 'Lifestyle vlog aesthetic. Warm, golden hour lighting. Natural and candid composition. Inviting and cozy atmosphere. Handwritten or casual font styles. Soft blur background. Authentic, relatable feel.',
  },
  {
    id: 'dramatic',
    name: 'Cinematic Drama',
    emoji: '🎬',
    promptModifier: 'Cinematic movie poster style thumbnail. Dramatic chiaroscuro lighting with deep shadows. Epic composition, intense atmosphere. Bold title text like a film poster. High contrast, moody color grading. Professional photography look.',
  },
  {
    id: 'comic',
    name: 'Comic / Pop Art',
    emoji: '💥',
    promptModifier: 'Bold comic book style thumbnail. Bright saturated colors, thick black outlines, halftone dots pattern. Dynamic action poses with speed lines. Comic-style speech bubbles or impact text. Pop art inspired, eye-catching and fun.',
  },
];

interface FaceUpload {
  previewUrl: string;
  base64: string;
  mimeType: string;
}

interface StyleReference {
  previewUrl: string;
  base64: string;
  mimeType: string;
}

type InspirationWeight = 'low' | 'medium' | 'high';

interface SavedPersona {
  name: string;
  previewUrl: string;
  base64: string;
  mimeType: string;
}

interface ThumbnailGeneratorProps {
  onBackToStudio: () => void;
}

export const ThumbnailGenerator: React.FC<ThumbnailGeneratorProps> = ({ onBackToStudio }) => {
  // App State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [faceUpload, setFaceUpload] = useState<FaceUpload | null>(null);
  
  const [generatedImages, setGeneratedImages] = useState<GeneratedThumbnail[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Refine state
  const [refineModalOpen, setRefineModalOpen] = useState(false);
  const [imageToRefine, setImageToRefine] = useState<GeneratedThumbnail | null>(null);
  const [refineInstruction, setRefineInstruction] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  
  // Style reference state
  const [styleReference, setStyleReference] = useState<StyleReference | null>(null);
  const [inspirationWeight, setInspirationWeight] = useState<InspirationWeight>('medium');
  
  // Persona state - saved faces for reuse
  const [savedPersonas, setSavedPersonas] = useState<SavedPersona[]>([]);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  
  // Camera state
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const faceInputRef = useRef<HTMLInputElement>(null);
  const styleInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load saved personas from localStorage on mount
  React.useEffect(() => {
    const stored = localStorage.getItem('thumbinator-personas');
    if (stored) {
      try {
        setSavedPersonas(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load personas:', e);
      }
    }
  }, []);

  // Save persona to localStorage
  const saveCurrentFaceAsPersona = () => {
    if (!faceUpload) return;
    const name = prompt('Name this persona (e.g., "My Headshot"):');
    if (!name) return;
    
    const newPersona: SavedPersona = {
      name,
      previewUrl: faceUpload.previewUrl,
      base64: faceUpload.base64,
      mimeType: faceUpload.mimeType
    };
    
    const updated = [...savedPersonas, newPersona];
    setSavedPersonas(updated);
    localStorage.setItem('thumbinator-personas', JSON.stringify(updated));
  };

  // Load a saved persona
  const loadPersona = (persona: SavedPersona) => {
    setFaceUpload({
      previewUrl: persona.previewUrl,
      base64: persona.base64,
      mimeType: persona.mimeType
    });
    setShowPersonaMenu(false);
  };

  // Delete a persona
  const deletePersona = (index: number) => {
    const updated = savedPersonas.filter((_, i) => i !== index);
    setSavedPersonas(updated);
    localStorage.setItem('thumbinator-personas', JSON.stringify(updated));
  };

  // Camera functions
  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setCameraStream(stream);
      setShowCamera(true);
      
      // Wait for video element to be available
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error('Camera error:', err);
      setCameraError('Unable to access camera. Please check permissions.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
    setCameraError(null);
  }, [cameraStream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the video frame to canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Mirror the image (since front camera is mirrored)
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    
    // Convert to base64
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    const base64 = dataUrl.split(',')[1];
    
    setFaceUpload({
      previewUrl: dataUrl,
      base64: base64,
      mimeType: 'image/jpeg'
    });
    
    // Stop the camera
    stopCamera();
  }, [stopCamera]);

  // Handle face upload
  const handleFaceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Full = reader.result as string;
        setFaceUpload({
          previewUrl: URL.createObjectURL(file),
          base64: base64Full.split(',')[1],
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle style reference upload
  const handleStyleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Full = reader.result as string;
        setStyleReference({
          previewUrl: URL.createObjectURL(file),
          base64: base64Full.split(',')[1],
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!title.trim()) {
      setError("Please enter a video title.");
      return;
    }
    setError(null);
    setIsGenerating(true);

    try {
      const style = QUICK_STYLES.find(s => s.id === selectedStyleId);
      const refs: Array<{ base64: string; mimeType: string }> = [];
      
      // Add face reference if uploaded
      if (faceUpload) {
        refs.push({ base64: faceUpload.base64, mimeType: faceUpload.mimeType });
      }

      // Prepare style reference if uploaded
      const styleRef = styleReference 
        ? { base64: styleReference.base64, mimeType: styleReference.mimeType }
        : undefined;

      const result = await generateThumbnail(
        title, 
        description,
        style?.promptModifier || '',
        refs,
        styleRef,
        styleReference ? inspirationWeight : undefined
      );
      
      if (result.success && result.imageUrl) {
        const newImage: GeneratedThumbnail = {
          id: Date.now().toString() + Math.random(),
          url: result.imageUrl,
          prompt: title,
          timestamp: Date.now()
        };
        setGeneratedImages(prev => [newImage, ...prev]);
      } else {
        setError(result.error || "Failed to generate thumbnail.");
      }
    } catch (err: any) {
      setError("Failed to generate thumbnail. " + (err.message || "Unknown error"));
    } finally {
      setIsGenerating(false);
    }
  };

  const openRefineModal = (image: GeneratedThumbnail) => {
    setImageToRefine(image);
    setRefineInstruction('');
    setRefineModalOpen(true);
  };

  const handleRefineSubmit = async () => {
    if (!imageToRefine || !refineInstruction.trim()) return;
    
    setIsRefining(true);
    setError(null);

    try {
      const result = await refineThumbnail(imageToRefine.url, refineInstruction);
      
      if (result.success && result.imageUrl) {
        const newImage: GeneratedThumbnail = {
          id: Date.now().toString() + Math.random(),
          url: result.imageUrl,
          prompt: `Refined: ${refineInstruction}`,
          timestamp: Date.now()
        };
        setGeneratedImages(prev => [newImage, ...prev]);
        setRefineModalOpen(false);
        setImageToRefine(null);
      } else {
        setError(result.error || "Failed to refine thumbnail.");
      }
    } catch (err: any) {
      setError("Failed to refine thumbnail. " + (err.message || "Unknown error"));
      setRefineModalOpen(false);
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Refine Modal */}
      {refineModalOpen && imageToRefine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-yellow-400" />
                Refine Thumbnail
              </h3>
              <button 
                onClick={() => setRefineModalOpen(false)}
                className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="mb-6 rounded-lg overflow-hidden border border-gray-700 bg-gray-950 aspect-video relative">
                <img 
                  src={imageToRefine.url} 
                  alt="To Refine" 
                  className="w-full h-full object-cover opacity-80"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">
                  What should be changed?
                </label>
                <textarea
                  value={refineInstruction}
                  onChange={(e) => setRefineInstruction(e.target.value)}
                  placeholder="e.g. Make the background blue, add fire effects, change text to 'OMG'..."
                  className="w-full h-32 bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none resize-none"
                  autoFocus
                />
              </div>
            </div>

            <div className="p-4 border-t border-gray-700 bg-gray-900 flex justify-end gap-3">
              <button
                onClick={() => setRefineModalOpen(false)}
                className="px-4 py-2 text-gray-300 hover:text-white font-medium hover:bg-gray-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRefineSubmit}
                disabled={!refineInstruction.trim() || isRefining}
                className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-800 disabled:text-gray-500 text-gray-900 font-semibold rounded-lg shadow-lg flex items-center gap-2 transition-all"
              >
                {isRefining ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Refining...
                  </>
                ) : (
                  <>
                    <MessageSquarePlus className="w-4 h-4" />
                    Generate Variation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-yellow-400" />
                Take a Photo
              </h3>
              <button 
                onClick={stopCamera}
                className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              {/* Video Preview */}
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video mb-4">
                <video 
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                {/* Overlay guide */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-32 h-32 border-2 border-white/30 rounded-full" />
                </div>
              </div>
              
              {/* Hidden canvas for capture */}
              <canvas ref={canvasRef} className="hidden" />
              
              <p className="text-center text-gray-400 text-sm mb-4">
                Position your face in the center and click capture
              </p>
              
              <button
                onClick={capturePhoto}
                className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
              >
                <Camera className="w-6 h-6" />
                Capture Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 w-full border-b border-white/10 bg-gray-950/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToStudio}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center border border-yellow-500/30">
                  <ImageIcon className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                THUMBINATOR
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Panel: Controls */}
          <div className="lg:col-span-5 flex flex-col gap-6 h-fit">
            <div className="bg-transparent backdrop-blur-sm border border-gray-800/50 rounded-3xl p-6 lg:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -z-10" />
              
              {/* 1. Video Title */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-yellow-400 font-bold uppercase tracking-wider text-xs">
                  <Type className="w-4 h-4" /> Video Title
                </div>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. I Spent 50 Hours in VR"
                  className="w-full bg-gray-950/50 border border-white/10 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 outline-none transition-all placeholder:text-gray-600 text-white font-medium hover:border-white/20"
                />
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Additional context (optional): 'Me looking shocked at computer', 'Money flying everywhere'..."
                  rows={2}
                  className="w-full bg-gray-950/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 outline-none transition-all placeholder:text-gray-600 text-white resize-none text-sm leading-relaxed hover:border-white/20"
                />
              </div>

              <div className="h-px bg-white/5 my-6" />

              {/* 2. Face Upload / Persona */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-yellow-400 font-bold uppercase tracking-wider text-xs">
                    <User className="w-4 h-4" /> Face / Persona
                  </div>
                  {savedPersonas.length > 0 && (
                    <div className="relative">
                      <button
                        onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                        className="text-xs text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-1"
                      >
                        <User className="w-3 h-3" />
                        Saved ({savedPersonas.length})
                      </button>
                      {showPersonaMenu && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-20 overflow-hidden">
                          <div className="p-2 border-b border-gray-700 text-xs text-gray-400 font-medium">
                            Saved Personas
                          </div>
                          {savedPersonas.map((persona, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-2 hover:bg-gray-800 transition-colors">
                              <img src={persona.previewUrl} alt={persona.name} className="w-8 h-8 rounded-lg object-cover" />
                              <button
                                onClick={() => loadPersona(persona)}
                                className="flex-1 text-left text-sm text-white truncate"
                              >
                                {persona.name}
                              </button>
                              <button
                                onClick={() => deletePersona(idx)}
                                className="p-1 hover:bg-red-500/20 rounded text-gray-500 hover:text-red-400"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 -mt-2">Take a photo or upload from device</p>
                
                {/* Camera Error */}
                {cameraError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
                    {cameraError}
                  </div>
                )}
                
                <div className="flex items-start gap-3">
                {faceUpload ? (
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-yellow-500/50 shadow-lg">
                    <img 
                      src={faceUpload.previewUrl} 
                      alt="Face reference" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-0 left-0 right-0 bg-black/70 text-white text-xs font-medium px-2 py-1">
                      Face Ref
                    </div>
                    <button 
                      onClick={() => setFaceUpload(null)}
                      className="absolute bottom-2 right-2 p-1.5 bg-black/60 hover:bg-red-500 rounded-full transition-colors"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    {/* Camera Button - Primary */}
                    <button
                      onClick={startCamera}
                      className="w-28 h-28 rounded-xl border-2 border-yellow-500/30 bg-yellow-500/5 hover:border-yellow-500/60 hover:bg-yellow-500/10 transition-all flex flex-col items-center justify-center group"
                    >
                      <Camera className="w-8 h-8 text-yellow-400 group-hover:scale-110 transition-transform mb-2" />
                      <span className="text-xs text-yellow-400 font-medium">Take Photo</span>
                    </button>
                    
                    {/* Upload Button - Secondary */}
                  <button
                    onClick={() => faceInputRef.current?.click()}
                      className="w-28 h-28 rounded-xl border-2 border-dashed border-white/20 hover:border-gray-500 hover:bg-white/5 transition-all flex flex-col items-center justify-center group"
                    >
                      <Upload className="w-6 h-6 text-gray-500 group-hover:text-gray-400 transition-colors mb-2" />
                      <span className="text-xs text-gray-500 group-hover:text-gray-400">Upload</span>
                    </button>
                  </div>
                )}
                
                {/* Hidden file input */}
                <input 
                  type="file" 
                  ref={faceInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFaceUpload}
                />
                  
                {/* Save as Persona button */}
                {faceUpload && (
                  <button
                    onClick={saveCurrentFaceAsPersona}
                    className="px-3 py-2 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-colors border border-gray-700"
                  >
                    Save as Persona
                  </button>
                )}
                </div>
              </div>

              <div className="h-px bg-white/5 my-6" />

              {/* 3. Style Reference (Optional) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-yellow-400 font-bold uppercase tracking-wider text-xs">
                  <ImageIcon className="w-4 h-4" /> Style Reference (Optional)
                </div>
                <p className="text-xs text-gray-500 -mt-2">Upload a thumbnail you like to match its style</p>
                
                {styleReference ? (
                  <div className="space-y-4">
                    <div className="relative w-48 aspect-video rounded-xl overflow-hidden border-2 border-yellow-500/50 shadow-lg">
                      <img 
                        src={styleReference.previewUrl} 
                        alt="Style reference" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-0 left-0 right-0 bg-black/70 text-white text-xs font-medium px-2 py-1">
                        Style Ref
                      </div>
                      <button 
                        onClick={() => setStyleReference(null)}
                        className="absolute bottom-2 right-2 p-1.5 bg-black/60 hover:bg-red-500 rounded-full transition-colors"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                    
                    {/* Inspiration Weight */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Sparkles className="w-3 h-3" /> Inspiration Weight
                      </div>
                      <div className="flex gap-2">
                        {(['low', 'medium', 'high'] as InspirationWeight[]).map((weight) => (
                          <button
                            key={weight}
                            onClick={() => setInspirationWeight(weight)}
                            className={`
                              flex-1 py-2 px-3 rounded-lg text-xs font-medium capitalize transition-all
                              ${inspirationWeight === weight
                                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                                : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600'
                              }
                            `}
                          >
                            {weight}
                          </button>
                        ))}
                      </div>
                      <p className="text-[10px] text-gray-600">
                        {inspirationWeight === 'low' && 'Loosely inspired - more creative freedom'}
                        {inspirationWeight === 'medium' && 'Balanced - captures key style elements'}
                        {inspirationWeight === 'high' && 'Closely matched - recreates the look'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => styleInputRef.current?.click()}
                    className="w-48 aspect-video rounded-xl border-2 border-dashed border-white/20 hover:border-yellow-500/50 hover:bg-yellow-500/5 transition-all flex flex-col items-center justify-center group"
                  >
                    <input 
                      type="file" 
                      ref={styleInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleStyleUpload}
                    />
                    <ImageIcon className="w-8 h-8 text-gray-500 group-hover:text-yellow-400 transition-colors mb-2" />
                    <span className="text-xs text-gray-500 group-hover:text-gray-400">Add Style Reference</span>
                  </button>
                )}
              </div>

              <div className="h-px bg-white/5 my-6" />

              {/* 4. Quick Style Selection (Optional) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-yellow-400 font-bold uppercase tracking-wider text-xs">
                    <Wand2 className="w-4 h-4" /> Quick Style (Optional)
                  </div>
                  {selectedStyleId && (
                    <button
                      onClick={() => setSelectedStyleId(null)}
                      className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 -mt-2">
                  {styleReference ? 'Style reference will be used instead if selected' : 'Select a preset style or leave empty for default'}
                </p>
                
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_STYLES.map((style) => {
                    const isSelected = selectedStyleId === style.id;
                    return (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyleId(isSelected ? null : style.id)}
                        className={`
                          px-3 py-2.5 rounded-xl border-2 transition-all duration-200 text-left
                          hover:scale-[1.01] active:scale-[0.99]
                          ${isSelected 
                            ? 'border-yellow-400 bg-yellow-500/10 shadow-lg shadow-yellow-500/20' 
                            : 'border-gray-700/50 bg-gray-900/50 hover:border-gray-600 hover:bg-gray-800/50'}
                        `}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{style.emoji}</span>
                          <span className={`text-sm font-semibold ${isSelected ? 'text-yellow-400' : 'text-gray-300'}`}>
                            {style.name}
                          </span>
                          {isSelected && (
                            <div className="ml-auto w-2 h-2 rounded-full bg-yellow-400" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-6 overflow-hidden">
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                    {error}
                  </div>
                </div>
              )}

              {/* Generate Action */}
              <div className="pt-6">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !title.trim()}
                  className="w-full py-4 bg-yellow-500 text-gray-900 hover:bg-yellow-400 disabled:bg-gray-800 disabled:text-gray-500 rounded-2xl font-bold text-lg shadow-[0_0_40px_-10px_rgba(234,179,8,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-900 rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      Generate Thumbnail
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel: Results */}
          <div className="lg:col-span-7">
            <div className="sticky top-28">
              {/* Gallery */}
              {generatedImages.length === 0 && !isGenerating ? (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-12 border border-dashed border-white/10 rounded-3xl bg-white/[0.02] text-gray-500 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  
                  <div className="relative z-10 w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 shadow-2xl ring-1 ring-white/5">
                    <Wand2 className="w-10 h-10 text-gray-400 group-hover:text-yellow-400 transition-colors" />
                  </div>
                  <h3 className="relative z-10 text-xl font-bold text-gray-200 mb-2">Ready to Create</h3>
                  <p className="relative z-10 text-sm text-gray-400 max-w-xs text-center leading-relaxed">
                    Enter your video title, select a style, and generate your thumbnail!
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-white">Gallery</h2>
                      <span className="px-2 py-0.5 rounded-full bg-gray-800 text-xs font-medium text-gray-400 border border-gray-700">
                        {generatedImages.length}
                      </span>
                    </div>
                    <button 
                      onClick={handleGenerate} 
                      disabled={isGenerating || !title.trim()}
                      className="text-xs font-medium text-yellow-400 hover:text-yellow-300 flex items-center gap-2 disabled:opacity-50 transition-colors py-2 px-3 rounded-lg hover:bg-yellow-500/10"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                      {isGenerating ? 'Generating...' : 'Regenerate'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-8">
                    {isGenerating && (
                      <div className="aspect-video w-full rounded-2xl bg-gray-900/50 border border-white/10 relative overflow-hidden flex flex-col items-center justify-center shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-pulse" />
                        <div className="relative flex flex-col items-center gap-4 z-10">
                          <div className="w-12 h-12 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin"></div>
                          <span className="text-gray-300 text-sm font-medium animate-pulse">Designing your thumbnail...</span>
                        </div>
                      </div>
                    )}
                    
                    {generatedImages.map((img) => (
                      <div 
                        key={img.id} 
                        className="group relative bg-gray-900 rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl hover:-translate-y-1 transition-transform duration-200"
                      >
                        <div className="aspect-video w-full relative overflow-hidden bg-gray-950">
                          <img 
                            src={img.url} 
                            alt="Generated Thumbnail" 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                          />
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 backdrop-blur-[2px]">
                            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                              <p className="text-white font-medium truncate mb-4 drop-shadow-lg">{img.prompt}</p>
                              <div className="flex gap-3">
                                <button
                                  onClick={() => openRefineModal(img)}
                                  className="flex-1 py-2.5 px-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-xl transition-all border border-white/10 flex items-center justify-center gap-2 font-semibold text-sm"
                                >
                                  <Edit2 className="w-4 h-4" />
                                  Refine
                                </button>
                                <a 
                                  href={img.url} 
                                  download={`thumbnail-${img.id}.png`}
                                  className="flex-1 py-2.5 px-4 bg-yellow-500 text-gray-900 rounded-xl hover:bg-yellow-400 transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] flex items-center justify-center gap-2 font-bold text-sm"
                                >
                                  <Download className="w-4 h-4" />
                                  Download
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            
            {/* Left: Branding */}
            <div className="flex flex-col items-center md:items-start gap-3">
              <div className="flex items-center gap-2 opacity-60">
                <div className="w-7 h-7 bg-gray-800 rounded-lg flex items-center justify-center border border-yellow-500/20">
                  <ImageIcon className="w-4 h-4 text-yellow-400" />
                </div>
                <span className="text-base font-bold text-white tracking-tight">THUMBINATOR</span>
              </div>
              <p className="text-gray-500 text-sm text-center md:text-left">
                AI-powered thumbnail generation for content creators
              </p>
            </div>

            {/* Right: Character Studio CTA */}
            <div className="flex items-center gap-4 bg-gradient-to-r from-gray-900/80 to-gray-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-4 pr-5 hover:border-yellow-500/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center ring-1 ring-yellow-500/20 group-hover:ring-yellow-500/40 transition-all">
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-0.5">Also try</p>
                <p className="text-white font-semibold">Character Studio</p>
              </div>
              <button
                onClick={onBackToStudio}
                className="flex items-center gap-1.5 text-yellow-400 hover:text-yellow-300 text-sm font-medium group-hover:gap-2.5 transition-all"
              >
                Try it <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-xs">
              Powered by Google Gemini AI
            </p>
            <p className="text-gray-600 text-xs">
              © {new Date().getFullYear()} Character Studio. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

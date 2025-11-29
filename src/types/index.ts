export interface CharacterPose {
  id: string;
  name: string;
  description: string;
  prompt: string;
  emoji: string;
  image?: string;
}

export interface GeneratedCharacter {
  pose: CharacterPose;
  imageUrl: string;
  prompt: string;
  timestamp: number;
}

export interface GenerationConfig {
  referenceImage: string;
  additionalDescription: string;
  artStyle: string;
  poses: CharacterPose[];
}

export type ArtStyle =
  | 'realistic'
  | 'realistic-painting-3'
  | 'sketch'
  | 'colored-pencil'
  | 'claymation'
  | 'realistic-painting'
  | 'pixel-art'
  | 'comic-style'
  | 'vintage-comic'
  | 'crafty-textured'
  | 'minimal-flat'
  | 'cartoon-2'
  | 'watercolor-gestural'
  | 'custom';

export interface ApiResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  message?: string;
}

export interface GenerationProgress {
  current: number;
  total: number;
  status: string;
  isLoading: boolean;
}

// Thumbnail Generator Types
export interface ThumbnailStyle {
  id: string;
  name: string;
  description: string;
  promptModifier: string;
  icon: string;
  color: string;
}

export interface GeneratedThumbnail {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
}

export interface UploadedImage {
  id: string;
  file: File;
  previewUrl: string;
  base64: string;
  mimeType: string;
}

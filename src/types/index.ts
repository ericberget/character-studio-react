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
  | 'crafty-textured';

export interface ApiResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export interface GenerationProgress {
  current: number;
  total: number;
  status: string;
  isLoading: boolean;
}

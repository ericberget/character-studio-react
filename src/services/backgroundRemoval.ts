import type { ApiResponse } from '../types';

// Initialize Google Cloud Vertex AI for Imagen
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// @ts-ignore
const getVertexAI = (): { projectId: string; location: string } => {
  const projectId = import.meta.env.VITE_GOOGLE_CLOUD_PROJECT_ID;
  const location = import.meta.env.VITE_GOOGLE_CLOUD_LOCATION || 'us-central1';
  
  if (!projectId) {
    throw new Error('Google Cloud Project ID not found. Please add VITE_GOOGLE_CLOUD_PROJECT_ID to your .env file');
  }
  
  // Note: This requires proper Google Cloud authentication
  // For now, we'll use a fallback approach
  return { projectId, location };
};

// Convert image URL to base64
export const imageUrlToBase64 = async (imageUrl: string): Promise<string> => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Image conversion error:', error);
    throw new Error('Failed to convert image to base64');
  }
};

// Remove background using Google Imagen API
export const removeBackground = async (imageUrl: string): Promise<ApiResponse> => {
  try {
    // For now, we'll use a fallback approach since Imagen requires proper Google Cloud setup
    // This is a placeholder that will be replaced with actual Imagen API call
    
    console.log('🖼️ Attempting background removal for:', imageUrl);
    
    // Convert image to base64 (commented out for now since we're using Gemini)
    // const base64Image = await imageUrlToBase64(imageUrl);
    
    // TODO: Replace with actual Google Imagen API call
    // const vertexAI = getVertexAI();
    // const response = await vertexAI.imagen.removeBackground({
    //   image: { base64: base64Image },
    //   outputFormat: 'PNG'
    // });
    
    // For now, return the original image with a note
    return {
      success: true,
      imageUrl: imageUrl,
      message: 'Background removal feature requires Google Cloud Imagen API setup'
    };
    
  } catch (error) {
    console.error('Background removal error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Background removal failed'
    };
  }
};

// Alternative: Use Gemini Flash 2.5 for background removal
export const removeBackgroundWithGemini = async (imageUrl: string): Promise<ApiResponse> => {
  try {
    const { generateCharacterImage } = await import('./gemini');
    
    // Convert image to base64
    const base64Image = await imageUrlToBase64(imageUrl);
    
    // Use Gemini to remove background by asking it to isolate the character
    const prompt = "Extract the character from the background. Output a PNG with transparent background. Only the character should be visible - no background colors, patterns, or textures.";
    
    console.log('🖼️ Starting background removal with Gemini...');
    
    const result = await generateCharacterImage(prompt, base64Image, 'image/png');
    
    if (result.success && result.imageUrl) {
      console.log('✅ Background removal successful!');
      return {
        success: true,
        imageUrl: result.imageUrl
      };
    } else {
      console.error('❌ Background removal failed:', result.error);
      return {
        success: false,
        error: result.error || 'Failed to remove background with Gemini'
      };
    }
    
  } catch (error) {
    console.error('Gemini background removal error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gemini background removal failed'
    };
  }
};

// Validate if background removal is available
export const isBackgroundRemovalAvailable = (): boolean => {
  const projectId = import.meta.env.VITE_GOOGLE_CLOUD_PROJECT_ID;
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  // Return true if we have either Google Cloud setup or Gemini API key
  return !!(projectId || geminiKey);
};

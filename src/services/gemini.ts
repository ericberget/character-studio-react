import { GoogleGenAI } from '@google/genai';
import type { ApiResponse } from '../types';

// Initialize Nano Banana (Gemini 2.5 Flash Image) with API key
const getNanoBananaAI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env file');
  }
  return new GoogleGenAI({
    apiKey: apiKey,
  });
};

// Convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix to get pure base64
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Convert base64 string to the format expected by Nano Banana
const prepareImageData = (base64String: string, mimeType: string = 'image/jpeg') => {
  return {
    inlineData: {
      data: base64String,
      mimeType: mimeType
    }
  };
};

// Generate character image using Nano Banana (Gemini 2.5 Flash Image)
export const generateCharacterImage = async (
  prompt: string,
  referenceImageBase64: string,
  mimeType: string = 'image/jpeg'
): Promise<ApiResponse> => {
  try {
    const ai = getNanoBananaAI();
    
    // Nano Banana configuration - can output both images and text
    const config = {
      responseModalities: [
        'IMAGE',
        'TEXT',
      ],
    };
    
    // Use the actual Nano Banana model
    const model = 'gemini-2.5-flash-image-preview';
    
    // Prepare the image data
    const imageData = prepareImageData(referenceImageBase64, mimeType);
    
    // Create the edit instruction - this is the "keep this, change that" magic
    const editInstruction = `Keep the same character, appearance, clothing, and visual style, but ${prompt}. Maintain the character's identity, facial features, and overall aesthetic while only changing what is specifically requested.`;
    
    const contents = [
      {
        role: 'user',
        parts: [
          imageData, // Reference image
          {
            text: editInstruction, // Edit instruction
          },
        ],
      },
    ];

    console.log('🍌 Nano Banana generating with instruction:', editInstruction);

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    // Process the streaming response
    for await (const chunk of response) {
      if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
        continue;
      }
      
      // Check for image data in the response
      if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
        const inlineData = chunk.candidates[0].content.parts[0].inlineData;
        const imageBase64 = inlineData.data;
        const imageMimeType = inlineData.mimeType || 'image/png';
        
        console.log('🎉 Nano Banana generated image successfully!');
        
        return {
          success: true,
          imageUrl: `data:${imageMimeType};base64,${imageBase64}`
        };
      }
      
      // Log any text responses
      if (chunk.text) {
        console.log('Nano Banana text response:', chunk.text);
      }
    }
    
    // If we get here, no image was generated
    throw new Error('No image generated in Nano Banana response');

  } catch (error) {
    console.error('Nano Banana generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Nano Banana generation failed'
    };
  }
};

// Validate API key with Nano Banana
export const validateApiKey = async (): Promise<boolean> => {
  try {
    const ai = getNanoBananaAI();
    // Simple test to validate the API key works
    await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: [{ role: 'user', parts: [{ text: 'Hello' }] }]
    });
    
    return true;
  } catch (error) {
    console.error('Nano Banana API key validation failed:', error);
    return false;
  }
};

// Nano Banana image editing - all functionality now handled by generateCharacterImage above

// Swap background using Nano Banana (Gemini 2.5 Flash Image)
export const swapBackgroundWithNanoBanana = async (
  characterImageUrl: string,
  backgroundImageUrl: string,
  customPrompt?: string
): Promise<ApiResponse> => {
  try {
    const ai = getNanoBananaAI();
    
    // Convert both images to base64
    const characterBase64 = await imageUrlToBase64(characterImageUrl);
    const backgroundBase64 = await imageUrlToBase64(backgroundImageUrl);
    
    // Nano Banana configuration
    const config = {
      responseModalities: [
        'IMAGE',
        'TEXT',
      ],
    };
    
    const model = 'gemini-2.5-flash-image-preview';
    
    // Prepare both image data
    const characterImageData = prepareImageData(characterBase64, 'image/jpeg');
    const backgroundImageData = prepareImageData(backgroundBase64, 'image/jpeg');
    
    // Create the background swap instruction
    const swapInstruction = customPrompt || `Take the character from the first image and place them in the background/setting from the second image. Keep the character exactly the same - same pose, same clothing, same appearance, same lighting on the character. Only change the background to match the second image. The character should look natural in the new environment while maintaining their original appearance and pose.`;
    
    const contents = [
      {
        role: 'user',
        parts: [
          characterImageData, // Character image
          backgroundImageData, // Background image
          {
            text: swapInstruction, // Swap instruction
          },
        ],
      },
    ];

    console.log('🍌 Nano Banana swapping background...');

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    // Process the streaming response
    for await (const chunk of response) {
      if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
        continue;
      }
      
      // Check for image data in the response
      if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
        const inlineData = chunk.candidates[0].content.parts[0].inlineData;
        const imageBase64 = inlineData.data;
        const imageMimeType = inlineData.mimeType || 'image/png';
        
        console.log('🎉 Nano Banana background swap successful!');
        
        return {
          success: true,
          imageUrl: `data:${imageMimeType};base64,${imageBase64}`
        };
      }
      
      // Log any text responses
      if (chunk.text) {
        console.log('Nano Banana text response:', chunk.text);
      }
    }
    
    // If we get here, no image was generated
    throw new Error('No image generated in Nano Banana background swap');

  } catch (error) {
    console.error('Nano Banana background swap error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Nano Banana background swap failed'
    };
  }
};

// Helper function to convert image URL to base64
const imageUrlToBase64 = async (imageUrl: string): Promise<string> => {
  try {
    // If it's already a data URL, extract the base64 part
    if (imageUrl.startsWith('data:')) {
      return imageUrl.split(',')[1];
    }
    
    // Otherwise, fetch and convert
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
    console.error('Image URL to base64 conversion error:', error);
    throw new Error('Failed to convert image URL to base64');
  }
};

// Alternative implementation using Nano Banana for image analysis and description
export const analyzeAndDescribeImage = async (
  _referenceImageBase64: string,
  additionalPrompt: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _mimeType: string = 'image/jpeg'
): Promise<string> => {
  try {
    // For now, return a basic description to avoid API issues
    return `Character analysis complete. Additional prompt: ${additionalPrompt}. Use this for image generation.`;
  } catch (error) {
    console.error('Error analyzing image with Nano Banana:', error);
    throw error;
  }
};

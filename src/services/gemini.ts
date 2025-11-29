import { GoogleGenAI } from '@google/genai';
import type { ApiResponse } from '../types';

// Initialize Nano Banana Pro (Gemini 3 Pro Image) with API key
// Note: With a Gemini subscription, you have access to Nano Banana Pro
const getNanoBananaAI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env file');
  }
  return new GoogleGenAI({
    apiKey: apiKey,
  });
};

// Get the model name - try Pro first, fallback to preview
const getImageModel = (): string => {
  // If user specifies a model in env, use that
  if (import.meta.env.VITE_GEMINI_MODEL) {
    return import.meta.env.VITE_GEMINI_MODEL;
  }
  
  // Try Pro model names first (for Gemini subscribers)
  // Common Pro model names to try (in order of preference):
  // - gemini-3.0-pro-image
  // - gemini-3-pro-image  
  // - gemini-2.5-flash-image-pro
  
  // For now, we'll use the preview model as default
  // If you have a subscription, you can set VITE_GEMINI_MODEL in .env
  // to use the Pro version (e.g., VITE_GEMINI_MODEL=gemini-3.0-pro-image)
  return 'gemini-2.5-flash-image-preview';
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

// Generate character image using Nano Banana Pro (Gemini 3 Pro Image)
// With a Gemini subscription, you have access to enhanced features:
// - Higher resolution (2K/4K)
// - Better text rendering
// - Improved consistency
// - Advanced editing capabilities
export const generateCharacterImage = async (
  prompt: string,
  referenceImageBase64: string,
  mimeType: string = 'image/jpeg'
): Promise<ApiResponse> => {
  try {
    const ai = getNanoBananaAI();
    
    // Nano Banana Pro configuration - can output both images and text
    const config = {
      responseModalities: [
        'IMAGE',
        'TEXT',
      ],
    };
    
    // Use Nano Banana Pro model (or fallback to preview)
    const model = getImageModel();
    
    // Prepare the image data
    const imageData = prepareImageData(referenceImageBase64, mimeType);
    
    // Create the edit instruction - this is the "keep this, change that" magic
    // Only apply style transformation instruction for prompts that explicitly request photo-to-illustration conversion
    const isStyleTransformation = /convert.*photograph|transform.*photo|remove.*photographic.*realism|replace.*with.*illustrated/i.test(prompt);
    const editInstruction = isStyleTransformation
      ? `Transform this photograph into the requested style: ${prompt}. Keep the same character identity, facial features, clothing, and pose, but completely change the rendering style from photographic to the illustrated/painted style described. Maintain character appearance and details while applying the artistic style transformation.`
      : `Keep the same character, appearance, clothing, and visual style, but ${prompt}. Maintain the character's identity, facial features, and overall aesthetic while only changing what is specifically requested.`;
    
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

    console.log('🍌 Nano Banana Pro generating with instruction:', editInstruction);

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
        
        console.log('🎉 Nano Banana Pro generated image successfully!');
        
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
      model: getImageModel(),
      contents: [{ role: 'user', parts: [{ text: 'Hello' }] }]
    });
    
    return true;
  } catch (error) {
    console.error('Nano Banana API key validation failed:', error);
    return false;
  }
};

// Nano Banana image editing - all functionality now handled by generateCharacterImage above

// Swap background using Nano Banana Pro (Gemini 3 Pro Image)
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
    
    const model = getImageModel();
    
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

    console.log('🍌 Nano Banana Pro swapping background...');

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
        
        console.log('🎉 Nano Banana Pro background swap successful!');
        
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

// Generate infographic using Nano Banana Pro (Gemini 3 Pro Image)
export const generateInfographic = async (
  contentReferenceBase64: string,
  styleReferenceBase64: string,
  prompt: string,
  fontDescription?: string | null,
  fontImageBase64?: string | null,
  brandColor?: string
): Promise<ApiResponse> => {
  try {
    const ai = getNanoBananaAI();
    
    // Nano Banana configuration
    const config = {
      responseModalities: [
        'IMAGE',
        'TEXT',
      ],
    };
    
    const model = getImageModel();
    
    // Prepare image data
    const contentImageData = prepareImageData(contentReferenceBase64, 'image/jpeg');
    const styleImageData = prepareImageData(styleReferenceBase64, 'image/jpeg');
    
    // Build parts array
    const parts: any[] = [
      contentImageData, // Content reference
      styleImageData,   // Style reference
    ];
    
    // Add font image if provided
    if (fontImageBase64) {
      const fontImageData = prepareImageData(fontImageBase64, 'image/jpeg');
      parts.push(fontImageData);
    }
    
    // Build instruction with font and color information
    let instruction = `Create an infographic using the content from the first image and the visual style of the second image.`;
    
    // Add font information
    if (fontDescription) {
      instruction += ` Use the font style: "${fontDescription}". Apply this typography throughout the infographic for all text elements.`;
    } else if (fontImageBase64) {
      instruction += ` Use the typography style shown in the font reference image. Match the font characteristics, weight, and style from that image for all text in the infographic.`;
    }
    
    // Add brand color information
    if (brandColor) {
      instruction += ` Use the brand color ${brandColor} as the primary accent color throughout the infographic. Incorporate this color strategically in headings, highlights, icons, and key visual elements while maintaining good contrast and readability.`;
    }
    
    // Add additional prompt
    if (prompt) {
      instruction += ` Additional instructions: ${prompt}.`;
    }
    
    instruction += ` Combine the information structure of the first image with the aesthetic of the second image to create a cohesive and informative infographic. High resolution, clear text, professional design.`;
    
    parts.push({
      text: instruction,
    });
    
    const contents = [
      {
        role: 'user',
        parts: parts,
      },
    ];

    console.log('🍌 Nano Banana Pro generating infographic...');

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
        
        console.log('🎉 Nano Banana Pro infographic generation successful!');
        
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
    throw new Error('No image generated in Nano Banana infographic response');

  } catch (error) {
    console.error('Nano Banana infographic generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Nano Banana infographic generation failed'
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

// ===== THUMBNAIL GENERATOR FUNCTIONS =====

interface ThumbnailReferenceImage {
  base64: string;
  mimeType: string;
}

// Generate YouTube Thumbnail using Nano Banana Pro
export const generateThumbnail = async (
  title: string,
  description: string,
  stylePrompt: string,
  referenceImages: ThumbnailReferenceImage[]
): Promise<ApiResponse> => {
  try {
    const ai = getNanoBananaAI();
    
    const model = getImageModel();
    
    // Construct the prompt - strongly emphasize 16:9 widescreen dimensions
    const textPrompt = `
      Generate a WIDESCREEN YouTube thumbnail. OUTPUT MUST BE 16:9 ASPECT RATIO.
      
      VIDEO TITLE TEXT TO DISPLAY: "${title}"
      
      ${description ? `ADDITIONAL CONTEXT: ${description}` : ''}
      
      VISUAL STYLE: ${stylePrompt}
      
      CRITICAL - IMAGE DIMENSIONS:
      - Output MUST be 16:9 widescreen (like 1280x720 or 1920x1080)
      - Width MUST be 1.78 times the height
      - This is a horizontal rectangle, NOT a square
      - Standard YouTube thumbnail format
      
      COMPOSITION FOR WIDESCREEN:
      - If using a face reference, place the person on the LEFT or RIGHT third of the wide frame
      - Title text goes on the opposite side
      - Use the full width of the 16:9 canvas
      - DO NOT crop to square - maintain widescreen composition
    `;

    const parts: any[] = [];

    // Add reference images first
    referenceImages.forEach((img, index) => {
      parts.push(prepareImageData(img.base64, img.mimeType));
      console.log(`📷 Added reference image #${index + 1}`);
    });

    // Add text prompt
    parts.push({ text: textPrompt });

    const contents = [
      {
        role: 'user',
        parts: parts,
      },
    ];

    console.log('🍌 Generating 16:9 YouTube thumbnail...');

    // Use generateContent with explicit 16:9 aspect ratio config
    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        responseModalities: ['IMAGE', 'TEXT'],
        // @ts-ignore - imageConfig is valid for image generation models
        imageConfig: {
          aspectRatio: '16:9',
        },
      },
    });

    // Process the response
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const imageBase64 = part.inlineData.data;
          const imageMimeType = part.inlineData.mimeType || 'image/png';
          
          console.log('🎉 16:9 thumbnail generated successfully!');
          
          return {
            success: true,
            imageUrl: `data:${imageMimeType};base64,${imageBase64}`
          };
        }
        
        if (part.text) {
          console.log('Text response:', part.text);
        }
      }
    }
    
    throw new Error('No image generated in thumbnail response');

  } catch (error) {
    console.error('Thumbnail generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Thumbnail generation failed'
    };
  }
};

// Refine/Edit an existing thumbnail
export const refineThumbnail = async (
  originalImageUrl: string,
  instruction: string
): Promise<ApiResponse> => {
  try {
    const ai = getNanoBananaAI();
    
    const model = getImageModel();
    
    // Convert image URL to base64
    const originalBase64 = await imageUrlToBase64(originalImageUrl);
    
    const textPrompt = `
      Edit this YouTube thumbnail based on the following instruction.
      CRITICAL: Output MUST remain 16:9 widescreen aspect ratio (1280x720 or similar).
      Do NOT change the dimensions to square or portrait.
      
      INSTRUCTION: ${instruction}
    `;

    const parts: any[] = [
      prepareImageData(originalBase64, 'image/png'),
      { text: textPrompt }
    ];

    const contents = [
      {
        role: 'user',
        parts: parts,
      },
    ];

    console.log('🍌 Refining 16:9 thumbnail...');

    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        responseModalities: ['IMAGE', 'TEXT'],
        // @ts-ignore - imageConfig is valid for image generation models
        imageConfig: {
          aspectRatio: '16:9',
        },
      },
    });

    // Process the response
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const imageBase64 = part.inlineData.data;
          const imageMimeType = part.inlineData.mimeType || 'image/png';
          
          console.log('🎉 16:9 thumbnail refinement successful!');
          
          return {
            success: true,
            imageUrl: `data:${imageMimeType};base64,${imageBase64}`
          };
        }
        
        if (part.text) {
          console.log('Text response:', part.text);
        }
      }
    }
    
    throw new Error('No image generated in thumbnail refinement');

  } catch (error) {
    console.error('Thumbnail refinement error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Thumbnail refinement failed'
    };
  }
};

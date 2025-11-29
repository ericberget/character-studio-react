import type { CharacterPose } from '../types';

export const defaultPoses: CharacterPose[] = [
  {
    id: 'looking-talking',
    name: 'Looking Right & Talking',
    description: 'Looking to the right while speaking or presenting',
    prompt: 'looking to the right, talking pose, presenting gesture, engaging expression',
    emoji: '👉',
    image: '/poses/square-standing-looking-right-talking.jpg'
  },
  {
    id: 'arms-crossed',
    name: 'Arms Crossed',
    description: 'Standing with arms crossed, confident pose',
    prompt: 'arms crossed pose, confident stance, looking at camera',
    emoji: '🤗',
    image: '/poses/square-standing-arms-crossed.jpg'
  },
  {
    id: 'holding-clipboard',
    name: 'Holding Clipboard',
    description: 'Standing close-up holding clipboard professionally',
    prompt: 'holding clipboard pose, professional stance, close-up view, business attire',
    emoji: '📋',
    image: '/poses/square-standing-close-up-holding-clipboard.jpg'
  },
  {
    id: 'sitting-desk',
    name: 'Sitting at Desk',
    description: 'Sitting at desk looking at camera professionally',
    prompt: 'sitting at desk pose, professional posture, looking at camera, office setting',
    emoji: '💺',
    image: '/poses/square-sitting-atdesk-looking-at-camera.jpg'
  },
  {
    id: 'hands-together-presenting',
    name: 'Hands Together Presenting',
    description: 'Standing with hands together in presenting gesture',
    prompt: 'hands together presenting pose, professional presentation stance, engaging gesture',
    emoji: '🙏',
    image: '/poses/square-hands-together-presenting.jpg'
  },
  {
    id: 'coffee-standing',
    name: 'Coffee Standing',
    description: 'Standing while holding coffee cup casually',
    prompt: 'standing pose holding coffee cup, casual relaxed stance, coffee break moment',
    emoji: '☕',
    image: '/poses/square-coffeestanding.jpg'
  },
  {
    id: 'coffee-looking-left',
    name: 'Coffee Looking Left',
    description: 'Standing with coffee while looking to the left',
    prompt: 'standing pose holding coffee cup, looking to the left, casual office moment',
    emoji: '☕',
    image: '/poses/square-coffee-looking-left.jpg'
  },
  {
    id: 'neutral-standing',
    name: 'Neutral Standing',
    description: 'Standing naturally with a relaxed, neutral pose',
    prompt: 'neutral standing pose, facing forward, relaxed posture, arms at sides',
    emoji: '🧍',
    image: '/poses/square-neutral-standing.jpg'
  },
  {
    id: 'typing-computer',
    name: 'Typing on Computer',
    description: 'Sitting and typing on computer keyboard',
    prompt: 'sitting at computer typing pose, focused on screen, office work setting',
    emoji: '💻',
    image: '/poses/square-typing-on-computer.jpg'
  },
  {
    id: 'over-the-shoulder',
    name: 'Over the Shoulder',
    description: 'Looking over the shoulder with a casual, engaging pose',
    prompt: 'over the shoulder pose, looking back, casual engaging expression, relaxed stance',
    emoji: '👀',
    image: '/poses/square-over-the-shoulder.jpg'
  },
  {
    id: 'sitting-listening',
    name: 'Sitting Listening',
    description: 'Sitting and listening attentively',
    prompt: 'sitting pose listening attentively, engaged expression, focused attention',
    emoji: '👂',
    image: '/poses/square-sitting-listening.jpg'
  },
  {
    id: 'sitting-talking',
    name: 'Sitting Talking',
    description: 'Sitting and talking or presenting',
    prompt: 'sitting pose talking, presenting gesture, engaged conversation',
    emoji: '💬',
    image: '/poses/square-sitting-talking.jpg'
  },
  {
    id: 'desk-worried',
    name: 'Desk Worried',
    description: 'Sitting at desk with worried or concerned expression',
    prompt: 'sitting at desk pose, worried concerned expression, thoughtful troubled look',
    emoji: '😟',
    image: '/poses/desk-worried.jpg'
  },
  {
    id: 'empty-desk-talking',
    name: 'Empty Desk Talking',
    description: 'Standing at empty desk talking or presenting',
    prompt: 'standing at empty desk pose, talking presenting gesture, professional setting',
    emoji: '🗣️',
    image: '/poses/empty-desk-talking.jpg'
  },
  {
    id: 'desk-3',
    name: 'Desk Pose 3',
    description: 'Sitting at desk in professional pose',
    prompt: 'sitting at desk pose, professional posture, office setting, business environment',
    emoji: '💼',
    image: '/poses/desk-3.jpg'
  },
  {
    id: 'desk-4',
    name: 'Desk Pose 4',
    description: 'Sitting at desk in another professional pose',
    prompt: 'sitting at desk pose, professional posture, office setting, business environment',
    emoji: '💼',
    image: '/poses/desk-4.jpg'
  }
];

export const artStyles = [
  { 
    value: 'realistic', 
    label: 'Realistic', 
    image: '/artstyles/realistic.jpeg',
    stylePrompt: 'realistic photographic style, high detail, natural lighting, professional photography'
  },
  { 
    value: 'realistic-painting-3', 
    label: 'Realistic Painting 3', 
    image: '/artstyles/realistic-painting-3.jpg',
    stylePrompt: 'realistic painting style, oil painting technique, artistic brushwork, traditional art medium, no signatures or watermarks'
  },
  { 
    value: 'sketch', 
    label: 'Pencil Sketch', 
    image: '/artstyles/pencil-sketch.jpg',
    stylePrompt: 'detailed pencil sketch style, hand-drawn illustration, artistic shading'
  },
  { 
    value: 'colored-pencil', 
    label: 'Colored Pencil', 
    image: '/artstyles/colored-pencil-drawing.jpg',
    stylePrompt: 'colored pencil drawing style, vibrant hand-drawn illustration, artistic colored pencil technique'
  },
  { 
    value: 'claymation', 
    label: 'Claymation Style', 
    image: '/artstyles/claymation-style.jpg',
    stylePrompt: 'claymation style, 3D clay animation look, stop-motion character design. Keep the character the same, make claymation, minimal detail'
  },
  { 
    value: 'realistic-painting', 
    label: 'Realistic Painting', 
    image: '/artstyles/realistic-painting-2.jpg',
    stylePrompt: 'realistic painting style, oil painting technique, artistic brushwork, traditional art medium, no signatures or watermarks'
  },
  { 
    value: 'pixel-art', 
    label: '16-bit Pixel Art', 
    image: '/artstyles/16-bit-pixel-art.jpg',
    stylePrompt: '16-bit pixel art style, retro gaming aesthetic, blocky pixelated design, nostalgic art style'
  },
  { 
    value: 'comic-style', 
    label: 'Comic Style', 
    image: '/artstyles/comic-style-1.jpg',
    stylePrompt: 'comic book art style, bold lines, vibrant colors, graphic novel illustration'
  },
  { 
    value: 'vintage-comic', 
    label: 'Vintage Comic', 
    image: '/artstyles/vintage-comic.jpg',
    stylePrompt: 'vintage comic book style, retro comic art, classic comic book illustration, nostalgic comic aesthetic'
  },
  { 
    value: 'minimal-flat', 
    label: 'Minimal Flat', 
    image: '/artstyles/minimal-flat.jpg',
    stylePrompt: 'minimal flat design style, clean geometric shapes, simple color palette, modern flat illustration'
  },
  { 
    value: 'cartoon-2', 
    label: 'Modern Cartoon', 
    image: '/artstyles/cartoon-2.jpg',
    stylePrompt: 'modern cartoon style, clean lines, solid color blocks, simplified exaggerated aesthetic, contemporary animation look'
  },
  { 
    value: 'watercolor-gestural', 
    label: 'Gestural Watercolor', 
    image: '/artstyles/watercolor-woman.jpg',
    stylePrompt: 'gestural watercolor painting style, visible brushstrokes, soft blurred edges, translucent washes of color, half-finished artistic quality, expressive and ethereal, loose painterly technique, watercolor, very loose, light, watery paint work, gestural lines similar to reference image'
  },
  { 
    value: 'vector-profile', 
    label: 'Vector Profile Portrait', 
    image: '/artstyles/vectorillustration-realistic.jpg',
    stylePrompt: 'stylized vector illustration style, painted profile portrait, chest-up composition, sharp angular lines, distinct color blocks for shading, high contrast lighting, strong black outlines, geometric hard-shadow shading with solid color transitions, modern graphic illustration aesthetic, clean vector-like appearance with subtle brushstroke texture, professional profile picture style'
  },
  { 
    value: 'circle-profile', 
    label: 'Circle Profile', 
    image: '/artstyles/circle-profile.jpg',
    stylePrompt: 'convert this photograph into a stylized illustrated portrait, transform realistic photo into painted illustration style, artistic interpretation with visible brushstrokes, painterly technique, stylized rendering not photorealistic, illustrated character design aesthetic, hand-painted appearance, artistic portrait illustration, remove photographic realism and replace with illustrated art style, painted illustration with artistic brushwork, stylized features with artistic interpretation, circular background behind character, chest-up composition, professional illustrated profile picture, illustrated art style not photography'
  }
] as const;

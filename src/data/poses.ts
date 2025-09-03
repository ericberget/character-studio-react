import type { CharacterPose } from '../types';

export const defaultPoses: CharacterPose[] = [
  {
    id: 'looking-talking',
    name: 'Looking Right & Talking',
    description: 'Looking to the right while speaking or presenting',
    prompt: 'looking to the right, talking pose, presenting gesture, engaging expression',
    emoji: '👉',
    image: '/src/assets/poses/square-standing-looking-right-talking.jpg'
  },
  {
    id: 'holding-clipboard',
    name: 'Holding Clipboard',
    description: 'Standing close-up holding clipboard professionally',
    prompt: 'holding clipboard pose, professional stance, close-up view, business attire',
    emoji: '📋',
    image: '/src/assets/poses/square-standing-close-up-holding-clipboard.jpg'
  },
  {
    id: 'arms-crossed',
    name: 'Arms Crossed',
    description: 'Standing with arms crossed, confident pose',
    prompt: 'arms crossed pose, confident stance, looking at camera',
    emoji: '🤗',
    image: '/src/assets/poses/square-standing-arms-crossed.jpg'
  },
  {
    id: 'sitting-desk',
    name: 'Sitting at Desk',
    description: 'Sitting at desk looking at camera professionally',
    prompt: 'sitting at desk pose, professional posture, looking at camera, office setting',
    emoji: '💺',
    image: '/src/assets/poses/square-sitting-atdesk-looking-at-camera.jpg'
  },
  {
    id: 'hands-together-presenting',
    name: 'Hands Together Presenting',
    description: 'Standing with hands together in presenting gesture',
    prompt: 'hands together presenting pose, professional presentation stance, engaging gesture',
    emoji: '🙏',
    image: '/src/assets/poses/square-hands-together-presenting.jpg'
  },
  {
    id: 'downcast',
    name: 'Downcast Look',
    description: 'Looking down with thoughtful or contemplative expression',
    prompt: 'downcast pose, looking down, thoughtful contemplative expression, introspective',
    emoji: '😔',
    image: '/src/assets/poses/square-downcast.jpg'
  },
  {
    id: 'coffee-standing',
    name: 'Coffee Standing',
    description: 'Standing while holding coffee cup casually',
    prompt: 'standing pose holding coffee cup, casual relaxed stance, coffee break moment',
    emoji: '☕',
    image: '/src/assets/poses/square-coffeestanding.jpg'
  },
  {
    id: 'coffee-looking-left',
    name: 'Coffee Looking Left',
    description: 'Standing with coffee while looking to the left',
    prompt: 'standing pose holding coffee cup, looking to the left, casual office moment',
    emoji: '☕',
    image: '/src/assets/poses/square-coffee-looking-left.jpg'
  },
  {
    id: 'neutral-standing',
    name: 'Neutral Standing',
    description: 'Standing naturally with a relaxed, neutral pose',
    prompt: 'neutral standing pose, facing forward, relaxed posture, arms at sides',
    emoji: '🧍',
    image: '/src/assets/poses/square-neutral-standing.jpg'
  },
  {
    id: 'typing-computer',
    name: 'Typing on Computer',
    description: 'Sitting and typing on computer keyboard',
    prompt: 'sitting at computer typing pose, focused on screen, office work setting',
    emoji: '💻',
    image: '/src/assets/poses/square-typing-on-computer.jpg'
  }
];

export const artStyles = [
  { 
    value: 'realistic', 
    label: 'Realistic', 
    image: '/src/assets/artstyles/realistic.jpeg',
    stylePrompt: 'realistic photographic style, high detail, natural lighting, professional photography'
  },
  { 
    value: 'realistic-painting-3', 
    label: 'Realistic Painting 3', 
    image: '/src/assets/artstyles/realistic-painting-3.jpg',
    stylePrompt: 'realistic painting style, oil painting technique, artistic brushwork, traditional art medium'
  },
  { 
    value: 'sketch', 
    label: 'Pencil Sketch', 
    image: '/src/assets/artstyles/pencil-sketch.jpg',
    stylePrompt: 'detailed pencil sketch style, hand-drawn illustration, artistic shading'
  },
  { 
    value: 'colored-pencil', 
    label: 'Colored Pencil', 
    image: '/src/assets/artstyles/colored-pencil-drawing.jpg',
    stylePrompt: 'colored pencil drawing style, vibrant hand-drawn illustration, artistic colored pencil technique'
  },
  { 
    value: 'claymation', 
    label: 'Claymation Style', 
    image: '/src/assets/artstyles/claymation-style.jpg',
    stylePrompt: 'claymation style, 3D clay animation look, stop-motion character design'
  },
  { 
    value: 'realistic-painting', 
    label: 'Realistic Painting', 
    image: '/src/assets/artstyles/realistic-painting-2.jpg',
    stylePrompt: 'realistic painting style, oil painting technique, artistic brushwork, traditional art medium'
  },
  { 
    value: 'pixel-art', 
    label: '16-bit Pixel Art', 
    image: '/src/assets/artstyles/16-bit-pixel-art.jpg',
    stylePrompt: '16-bit pixel art style, retro gaming aesthetic, blocky pixelated design, nostalgic art style'
  },
  { 
    value: 'comic-style', 
    label: 'Comic Style', 
    image: '/src/assets/artstyles/comic-style-1.jpg',
    stylePrompt: 'comic book art style, bold lines, vibrant colors, graphic novel illustration'
  },
  { 
    value: 'vintage-comic', 
    label: 'Vintage Comic', 
    image: '/src/assets/artstyles/vintage-comic.jpg',
    stylePrompt: 'vintage comic book style, retro comic art, classic comic book illustration, nostalgic comic aesthetic'
  },
  { 
    value: 'crafty-textured', 
    label: 'Crafty Textured', 
    image: '/src/assets/artstyles/crafty-textured.jpg',
    stylePrompt: 'crafty textured style, handmade art aesthetic, textured surface, artistic craft design'
  }
] as const;

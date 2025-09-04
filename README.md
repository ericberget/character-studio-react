# Character Studio React

A modern React application that generates consistent character sets in multiple poses using Google's Gemini Flash 2.5 AI model.

## Features

- 🎨 Upload reference character images
- 🤖 Generate characters in multiple poses using Google Gemini Flash 2.5
- 🎭 Choose from various art styles (photorealistic, anime, cartoon, etc.)
- 🖼️ Interactive pose selection with visual previews
- 🧹 **Background removal** - Remove backgrounds from generated characters
- 📱 Responsive design with modern UI
- ⚡ Built with React, TypeScript, and Tailwind CSS
- 🔄 Real-time generation progress tracking

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

1. Copy the example environment file:
```bash
cp env.example .env
```

2. Get your Google Gemini API key:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key

3. Add your API key to `.env`:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**Optional**: For enhanced background removal with Google Imagen:
```env
VITE_GOOGLE_CLOUD_PROJECT_ID=your_google_cloud_project_id_here
VITE_GOOGLE_CLOUD_LOCATION=us-central1
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## How to Use

1. **Upload Reference Image**: Click or drag-and-drop a character image
2. **Select Art Style**: Choose from photorealistic, anime, cartoon, etc.
3. **Choose Poses**: Select which poses you want to generate
4. **Add Description**: Optionally add details about clothing, setting, etc.
5. **Generate**: Click "Generate Character Set" to create your characters
6. **Download**: Save individual images or download all as a set
7. **Remove Background**: Click "Remove Background" on any character to get a version without background

## Supported Image Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- Maximum file size: 5MB

## Art Styles Available

- Photorealistic
- Digital Art
- Illustration
- Anime
- Cartoon
- Oil Painting
- Watercolor
- Pencil Sketch

## Default Poses Included

- 🧍 Neutral Standing
- 🤗 Arms Crossed
- 👋 Friendly Wave
- 🤔 Thinking Pose
- 👉 Pointing
- 👍 Thumbs Up

## Technology Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Google Generative AI** - Gemini Flash 2.5 API integration
- **Lucide React** - Beautiful icons

## Project Structure

```
src/
├── components/          # React components
│   ├── CharacterStudio.tsx    # Main app component
│   ├── ImageUpload.tsx        # Image upload with drag-and-drop
│   ├── PoseSelector.tsx       # Interactive pose selection
│   ├── GenerationProgress.tsx # Progress overlay
│   └── CharacterGrid.tsx      # Results display
├── services/           # API and external services
│   ├── gemini.ts             # Google Gemini AI integration
│   └── backgroundRemoval.ts  # Background removal functionality
├── types/             # TypeScript type definitions
│   └── index.ts       # App-wide types
├── data/              # Static data and configurations
│   └── poses.ts       # Character poses and art styles
├── utils/             # Utility functions
│   └── cn.ts          # Tailwind class merging
└── main.tsx           # App entry point
```

## Background Removal

The app includes background removal functionality that works in two ways:

### Current Implementation (Gemini Flash 2.5)
- Uses Gemini Flash 2.5 to remove backgrounds from generated characters
- Processes images through AI to isolate the character
- Creates transparent PNG images with alpha channel
- Automatically downloads the transparent version
- Works with your existing Gemini API key

### Future Enhancement (Google Imagen)
- For even better background removal, you can set up Google Cloud Imagen
- Requires Google Cloud Project ID and proper authentication
- Provides professional-grade background removal
- Set `VITE_GOOGLE_CLOUD_PROJECT_ID` in your `.env` file

### How to Use Background Removal
1. Generate your character set as usual
2. Click "Remove Background" on any character
3. Wait for processing (shows loading spinner)
4. The transparent background image will automatically download as PNG
5. Subsequent clicks will download the cached version

**Note**: The background removal creates PNG files with transparent backgrounds. If you see any visible background patterns or colors in the downloaded file, that indicates the transparency isn't working correctly and needs to be improved.

## Important Notes

- **API Key Security**: Never commit your `.env` file. The API key should be kept secret.
- **Rate Limits**: Google Gemini API has usage limits. Monitor your usage in the Google Cloud Console.
- **Background Removal**: Uses AI processing, so results may vary. For best results, use characters with clear backgrounds.
- **Image Generation**: This app uses Gemini for image analysis and description. For actual image generation, you may need to integrate with additional services like DALL-E, Midjourney, or Stable Diffusion.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

---

Built with ❤️ using Google's Gemini Flash 2.5 (nano banana) 🍌
import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '../utils/cn';

interface BackgroundSelectorProps {
  onBackgroundSelect: (backgroundUrl: string) => void;
  selectedBackground?: string;
  onRemove?: () => void;
  className?: string;
}

// Default background options
const defaultBackgrounds = [
  {
    id: 'office',
    name: 'Office',
    image: '/backgrounds/office.jpg',
    description: 'Professional office environment'
  },
  {
    id: 'meeting-room',
    name: 'Meeting Room',
    image: '/backgrounds/meeting-room.jpg',
    description: 'Conference room setting'
  },
  {
    id: 'coffee-shop',
    name: 'Coffee Shop',
    image: '/backgrounds/coffee-shop.jpg',
    description: 'Casual coffee shop environment'
  },
  {
    id: 'outdoor',
    name: 'Outdoor',
    image: '/backgrounds/outdoor.jpg',
    description: 'Outdoor urban setting'
  }
];

export const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  onBackgroundSelect,
  selectedBackground,
  onRemove,
  className
}) => {
  const [showModal, setShowModal] = useState(false);
  const [uploadedBackgrounds, setUploadedBackgrounds] = useState<string[]>([]);

  const handleFileUpload = useCallback((file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedBackgrounds(prev => [...prev, result]);
        onBackgroundSelect(result);
        setShowModal(false);
      };
      reader.readAsDataURL(file);
    }
  }, [onBackgroundSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  if (selectedBackground) {
    return (
      <div className={cn("relative group rounded-xl overflow-hidden", className)}>
        <img
          src={selectedBackground}
          alt="Selected background"
          className="w-full h-32 object-cover"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="flex gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="btn-secondary cursor-pointer"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Change
            </button>
            {onRemove && (
              <button
                onClick={onRemove}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <X className="w-4 h-4 mr-2" />
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={cn(
          "w-full h-32 border-2 border-dashed border-gray-600 rounded-xl hover:border-gray-500 transition-colors duration-200 flex flex-col items-center justify-center group",
          className
        )}
      >
        <Upload className="w-8 h-8 text-gray-400 group-hover:text-gray-300 transition-colors duration-200 mb-2" />
        <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-200">
          Add Background Context
        </span>
      </button>

      {/* Background Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Select Background</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Upload Section */}
            <div className="mb-6">
              <h4 className="text-gray-300 font-medium mb-3">Upload Custom Background</h4>
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors duration-200"
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400 mb-2">Drag and drop an image here, or click to browse</p>
                <label className="btn-secondary cursor-pointer">
                  Choose File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Default Backgrounds */}
            <div>
              <h4 className="text-gray-300 font-medium mb-3">Default Backgrounds</h4>
              <div className="grid grid-cols-2 gap-3">
                {defaultBackgrounds.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => {
                      onBackgroundSelect(bg.image);
                      setShowModal(false);
                    }}
                    className="group relative rounded-lg border-2 border-gray-700 hover:border-gray-500 transition-all duration-200 overflow-hidden"
                  >
                    <div className="aspect-video bg-gray-800 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-600" />
                    </div>
                    <div className="p-2">
                      <div className="text-sm font-medium text-gray-300">{bg.name}</div>
                      <div className="text-xs text-gray-500">{bg.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Uploaded Backgrounds */}
            {uploadedBackgrounds.length > 0 && (
              <div className="mt-6">
                <h4 className="text-gray-300 font-medium mb-3">Uploaded Backgrounds</h4>
                <div className="grid grid-cols-2 gap-3">
                  {uploadedBackgrounds.map((bg, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        onBackgroundSelect(bg);
                        setShowModal(false);
                      }}
                      className="group relative rounded-lg border-2 border-gray-700 hover:border-gray-500 transition-all duration-200 overflow-hidden"
                    >
                      <img
                        src={bg}
                        alt={`Uploaded background ${index + 1}`}
                        className="w-full aspect-video object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <span className="text-white text-sm">Select</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

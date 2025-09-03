import React, { useCallback, useState } from 'react';
import { Upload, X, Camera } from 'lucide-react';
import { cn } from '../utils/cn';

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
  preview?: string;
  onRemove?: () => void;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  preview,
  onRemove,
  className
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image file must be smaller than 5MB');
      return;
    }

    setIsLoading(true);

    try {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      onImageSelect(file, previewUrl);
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [onImageSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  if (preview) {
    return (
      <div className={cn("relative group rounded-xl overflow-hidden", className)}>
        <img
          src={preview}
          alt="Character reference"
          className={cn(
            "w-full object-cover",
            className?.includes('aspect-square') ? "h-full" : "h-64"
          )}
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="flex gap-2">
            <label className="btn-secondary cursor-pointer">
              <Camera className="w-4 h-4 mr-2" />
              Change
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
            </label>
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
    <div
      className={cn(
        "relative border-2 border-dashed border-gray-700 rounded-xl transition-colors duration-200 cursor-pointer",
        isDragOver && "border-blue-500 bg-blue-500/10",
        "hover:border-gray-600 hover:bg-gray-800/50",
        className
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <label className={cn(
        "block w-full cursor-pointer",
        className?.includes('aspect-square') ? "h-full" : "h-64"
      )}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          disabled={isLoading}
        />
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          {isLoading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2 tracking-wide">
                Upload Reference Image
              </h3>
              <p className="text-sm text-gray-500">
                Drop an image here or click to browse
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Supports JPG, PNG, WebP • Max 5MB
              </p>
            </>
          )}
        </div>
      </label>
    </div>
  );
};

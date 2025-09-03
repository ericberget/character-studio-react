import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface CustomReferenceUploadProps {
  onCustomStyleSelect: (imageUrl: string, styleName: string) => void;
  onCustomPoseSelect: (imageUrl: string, poseName: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const CustomReferenceUpload: React.FC<CustomReferenceUploadProps> = ({
  onCustomStyleSelect,
  onCustomPoseSelect,
  isOpen: externalIsOpen,
  onClose
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const [uploadType, setUploadType] = useState<'style' | 'pose' | null>(null);
  const [customName, setCustomName] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleFileSelect = useCallback((file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewUrl(result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleSubmit = () => {
    if (uploadType && customName && previewUrl) {
      if (uploadType === 'style') {
        onCustomStyleSelect(previewUrl, customName);
      } else {
        onCustomPoseSelect(previewUrl, customName);
      }
      // Reset form
      setUploadType(null);
      setCustomName('');
      setPreviewUrl('');
      if (onClose) {
        onClose();
      } else {
        setInternalIsOpen(false);
      }
    }
  };

  const handleCancel = () => {
    setUploadType(null);
    setCustomName('');
    setPreviewUrl('');
    if (onClose) {
      onClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  return (
    <>
      {/* Upload Button - Only show if not externally controlled */}
      {externalIsOpen === undefined && (
        <button
          onClick={() => setInternalIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors duration-200"
        >
          <Upload className="w-4 h-4" />
          <span className="text-sm">Upload Custom Reference</span>
        </button>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Upload Custom Reference</h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!uploadType ? (
              // Step 1: Choose type
              <div className="space-y-4">
                <p className="text-gray-300 text-sm mb-4">
                  Choose what type of reference you want to upload:
                </p>
                <button
                  onClick={() => setUploadType('style')}
                  className="w-full p-4 border border-gray-600 rounded-lg hover:border-yellow-400 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Art Style Reference</h4>
                      <p className="text-gray-400 text-sm">Upload an image to define a custom art style</p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setUploadType('pose')}
                  className="w-full p-4 border border-gray-600 rounded-lg hover:border-yellow-400 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Pose Reference</h4>
                      <p className="text-gray-400 text-sm">Upload an image to define a custom pose</p>
                    </div>
                  </div>
                </button>
              </div>
            ) : (
              // Step 2: Upload and name
              <div className="space-y-4">
                <p className="text-gray-300 text-sm">
                  Upload a {uploadType === 'style' ? 'style' : 'pose'} reference image:
                </p>
                
                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-yellow-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file);
                    }}
                    className="hidden"
                    id="custom-reference-upload"
                  />
                  <label htmlFor="custom-reference-upload" className="cursor-pointer">
                    {previewUrl ? (
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="max-w-full max-h-48 mx-auto rounded-lg"
                      />
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                        <p className="text-gray-300">Click to upload image</p>
                        <p className="text-gray-500 text-sm">JPG, PNG, WebP</p>
                      </div>
                    )}
                  </label>
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {uploadType === 'style' ? 'Style' : 'Pose'} Name
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder={`Enter ${uploadType === 'style' ? 'style' : 'pose'} name...`}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:border-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!customName || !previewUrl}
                    className="flex-1 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-medium hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Reference
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

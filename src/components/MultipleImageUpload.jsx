import React, { useState, useRef } from 'react';
import { Upload, X, Plus, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


const MultipleImageUpload = ({
  images,
  onImagesChange,
  onFilesChange,
  uploading,
  maxImages = 5
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files).filter(file => 
        file.type.startsWith('image/')
      );
      handleFiles(files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files).filter(file => 
        file.type.startsWith('image/')
      );
      handleFiles(files);
    }
  };

  const handleFiles = (files) => {
    const remainingSlots = maxImages - images.length;
    const filesToAdd = files.slice(0, remainingSlots);
    
    if (filesToAdd.length > 0) {
      setSelectedFiles(prev => [...prev, ...filesToAdd]);
      onFilesChange([...selectedFiles, ...filesToAdd]);
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesChange(newFiles);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Product Images ({images.length + selectedFiles.length}/{maxImages})
      </label>

      {/* Drag and Drop Zone */}
      {images.length + selectedFiles.length < maxImages && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? 'border-[#FFC23C] bg-[#FFC23C]/5'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="space-y-3">
            <div className="flex justify-center">
              <Upload className={`h-10 w-10 ${dragActive ? 'text-[#FFC23C]' : 'text-gray-400'}`} />
            </div>
            <div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF up to 10MB each
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Image Grid */}
      {(images.length > 0 || selectedFiles.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <AnimatePresence>
            {/* Existing Images */}
            {images.map((image, index) => (
              <motion.div
                key={`existing-${index}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group aspect-square"
              >
                <img
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/150?text=Error";
                  }}
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                >
                  <X size={12} />
                </button>
                <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                  {index + 1}
                </div>
              </motion.div>
            ))}

            {/* New Files Preview */}
            {selectedFiles.map((file, index) => (
              <motion.div
                key={`new-${index}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group aspect-square"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`New ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg border border-gray-200"
                />
                <button
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                >
                  <X size={12} />
                </button>
                <div className="absolute bottom-1 left-1 bg-[#FFC23C] text-black text-xs px-1.5 py-0.5 rounded font-medium">
                  NEW
                </div>
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Add More Button */}
            {images.length + selectedFiles.length < maxImages && (
              <motion.button
                layout
                onClick={openFileDialog}
                className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
              >
                <Plus className="h-6 w-6 mb-1" />
                <span className="text-xs">Add More</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}

      {images.length + selectedFiles.length >= maxImages && (
        <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
          <ImageIcon className="inline h-4 w-4 mr-1" />
          Maximum of {maxImages} images reached. Remove an image to add more.
        </p>
      )}
    </div>
  );
};

export default MultipleImageUpload;
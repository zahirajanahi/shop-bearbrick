import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';



const ImageCarousel= ({
  images,
  alt,
  className = "",
  showThumbnails = true,
  autoPlay = false,
  autoPlayInterval = 5000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // If no images, show placeholder
  if (!images || images.length === 0) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-500">No Image</span>
      </div>
    );
  }

  // If only one image, show it without carousel controls
  if (images.length === 1) {
    return (
      <div className={`relative ${className}`}>
        <img
          src={images[0]}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
          }}
        />
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Main Image Container */}
      <div className="relative overflow-hidden rounded-lg">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`${alt} - Image ${currentIndex + 1}`}
            className="w-full h-full object-cover"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
            }}
          />
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
          aria-label="Previous image"
        >
          <ChevronLeft size={20} />
        </button>
        
        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
          aria-label="Next image"
        >
          <ChevronRight size={20} />
        </button>

        {/* Image Counter */}
        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Navigation */}
      {showThumbnails && images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === currentIndex
                  ? 'border-[#FFC23C] ring-2 ring-[#FFC23C]/30'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <img
                src={image}
                alt={`${alt} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/64x64?text=?";
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Dot Indicators (for mobile) */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-3 sm:hidden">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-[#FFC23C]'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
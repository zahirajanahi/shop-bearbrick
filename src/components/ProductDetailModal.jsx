import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, ChevronRight } from 'lucide-react';
import ImageCarousel from '../components/ImageCarousel';

const ProductDetailModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={handleContentClick}
            className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden w-full max-w-5xl shadow-2xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 h-auto max-h-[90vh] overflow-auto">
              {/* Image Section - Now with Carousel */}
              <div className="relative w-full h-60 sm:h-80 md:h-96 lg:h-auto  bg-gray-100 dark:bg-zinc-800">
                <ImageCarousel
                  images={product.images || [product.image_url]}
                  alt={product.title}
                  className="w-full md:h-[65vh] h-[54vh] object-cover"
                  showThumbnails={true}
                />
              </div>

              {/* Content Section */}
              <div className="relative md:pt-10 pt-72  p-10 p sm:p-6 md:p-8 flex flex-col">
                <button
                  onClick={onClose}
                  className="absolute md:top-4 top-26 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>

                <div className="space-y-4 flex-grow overflow-auto">
                  <div>
                    <p className="text-sm text-gray-500 bg-purple-400/10 w-14 ps-3 rounded-3xl py-1 dark:text-gray-400 mb-1">
                      {product.category || 'Limited Edition'}
                    </p>
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                      {product.title}
                    </h2>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-purple-500 mt-2">
                      {product.price} MAD
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Description
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                      {product.description}
                    </p>
                  </div>

                  {product.images && product.images.length > 1 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Images ({product.images.length})
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Swipe to view all product images
                      </p>
                    </div>
                  )}

                  {product.details?.specifications && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Specifications
                      </h3>
                      <ul className="space-y-2 text-sm sm:text-base">
                        {product.details.specifications.map((spec, index) => (
                          <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                            <ChevronRight size={16} className="mr-2 text-gray-400" />
                            {spec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {product.details?.features && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Features
                      </h3>
                      <ul className="space-y-2 text-sm sm:text-base">
                        {product.details.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                            <ChevronRight size={16} className="mr-2 text-gray-400" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onAddToCart(product)}
                  className="w-full bg-black dark:bg-white text-white dark:text-black py-3 sm:py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors mt-4"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailModal;
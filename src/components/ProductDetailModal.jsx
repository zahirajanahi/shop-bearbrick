import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart } from 'lucide-react';



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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6"
        >
          <motion.div
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              opacity: { duration: 0.2 }
            }}
            style={{ perspective: 1000 }}
            onClick={handleContentClick}
            className="bg-zinc-900 rounded-2xl overflow-hidden w-full max-w-[70%] mx-auto md:max-w-4xl max-h-[90vh] shadow-2xl"
          >
            <div className="flex flex-col lg:flex-row h-full">
              {/* Image Section */}
              <div className="lg:w-1/2 h-[200px] sm:h-[300px] lg:h-full relative overflow-hidden">
                <motion.img
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  src={product.image_url}
                  alt={product.title}
                  className="w-[80vw] h-[80vh] object-cover"
                />
              </div>

              {/* Content Section */}
              <div className="lg:w-1/2 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                <div className="flex justify-between items-start mb-4 sm:mb-6">
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl sm:text-2xl font-bold text-white pr-4"
                  >
                    {product.title}
                  </motion.h2>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors p-1"
                  >
                    <X size={24} />
                  </button>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-4 sm:space-y-6"
                >
                  <div>
                    <span className="text-2xl sm:text-3xl font-bold text-[#FFC23C]">
                      {product.price} MAD
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Description</h3>
                    <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {product.details?.specifications && (
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Specifications</h3>
                      <ul className="list-disc list-inside text-sm sm:text-base text-gray-400 space-y-1">
                        {product.details.specifications.map((spec, index) => (
                          <li key={index}>{spec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {product.details?.features && (
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Features</h3>
                      <ul className="list-disc list-inside text-sm sm:text-base text-gray-400 space-y-1">
                        {product.details.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onAddToCart(product)}
                    className="w-full bg-[#FFC23C] text-black px-4 sm:px-6 py-3 sm:px-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:bg-[#ffd167] transition-colors text-sm sm:text-base"
                  >
                    <ShoppingCart size={20} />
                    Add to Cart
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailModal;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus } from 'lucide-react';
import ProductDetailModal from '../components/ProductDetailModal';
import ImageCarousel from '../components/ImageCarousel';

const ProductCard = ({ product, onAddToCart }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="show"
        whileHover="hover"
        className="group relative bg-white/5 md:ms-0 ms-16 rounded-lg overflow-hidden border border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 w-full mb-6"
      >
        <div className="relative aspect-square overflow-hidden bg-gray-50 h-64.5">
          <ImageCarousel
            images={product.images || [product.image_url]} // Fallback to single image if no array
            alt={product.name || product.title}
            className="w-full h-full "
            showThumbnails={false}
          />
          
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Hidden on mobile, visible on desktop hover */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-black bg-opacity-40 lg:flex items-center justify-center hidden"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onAddToCart(product)}
              className="bg-white text-gray-950 px-6 py-3 rounded-full font-medium flex items-center gap-2 shadow-lg backdrop-blur-sm bg-opacity-90 hover:bg-opacity-100"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </motion.button>
          </motion.div>
        </div>
        
        <div className="p-4">
          <div className="mb-3 space-y-1">
            <h3 className="font-medium text-gray-100 line-clamp-1 text-sm sm:text-base">
              {product.title}
            </h3>
            <p className="text-xs text-gray-300 line-clamp-2">
              {product.description}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <p className="text-lg font-semibold text-gray-200">
                {product.price}
              </p>
              <span className="text-sm text-purple-300 font-medium">MAD</span>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-sm text-gray-400 hover:text-purple-300 transition-colors flex items-center gap-1"
              aria-label="View details"
            >
              <Plus size={16} className="text-purple-300" />
              Details
            </button>
          </div>
          
          {/* Mobile-only Add to Cart button */}
          <button
            onClick={() => onAddToCart(product)}
            className="lg:hidden mt-4 w-full bg-white text-gray-950 py-2 rounded-full font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <ShoppingCart size={18} />
            Add to Cart
          </button>
        </div>
      </motion.div>
      
      <ProductDetailModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={onAddToCart}
      />
    </>
  );
};

// Container component for vertical stacking
const ProductList = ({ products, onAddToCart }) => {
  return (
    <div className="grid grid-cols-1 gap-6 max-w-md mx-auto w-full">
      {products.map(product => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onAddToCart={onAddToCart} 
        />
      ))}
    </div>
  );
};

export default ProductCard;
export { ProductList };
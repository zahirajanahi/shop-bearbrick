import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/navbar';
import { useCart } from '../contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/footer';
import { MessageCircle, Search, SlidersHorizontal, X } from 'lucide-react';
import { Images } from "../constant";
import { LiaWhatsapp } from "react-icons/lia";
import CustomCursor from '../components/CustomCursor';
import Swal from 'sweetalert2';

export const Shop = () => {
  const [products, setProducts] = useState([]);
  const { cartItems, addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: 'all',
    category: 'all',
    sortBy: 'newest'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    Swal.fire({
      title: "Added to Cart!",
      text: `${product.title} has been added to your cart`,
      icon: "success",
      showConfirmButton: false,
      timer: 2000,
      toast: true,
      position: "top-end",
      background: "#1a1a1a",
      color: "#fff",
      iconColor: "#8B5CF6",
      customClass: {
        popup: "modern-swal-popup",
        title: "modern-swal-title",
        content: "modern-swal-content"
      }
    });
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/0661715003', '_blank');
  };

  const handleFilterChange = (title, value) => {
    setFilters(prev => ({
      ...prev,
      [title]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      priceRange: 'all',
      category: 'all',
      sortBy: 'newest'
    });
    setSearchTerm('');
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm || 
      product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesPrice = true;
    if (filters.priceRange === 'under100') {
      matchesPrice = product.price < 100;
    } else if (filters.priceRange === '100to500') {
      matchesPrice = product.price >= 100 && product.price <= 500;
    } else if (filters.priceRange === 'over500') {
      matchesPrice = product.price > 500;
    }

    const matchesCategory = filters.category === 'all' || product.category === filters.category;

    return matchesSearch && matchesPrice && matchesCategory;
  }).sort((a, b) => {
    if (filters.sortBy === 'priceAsc') {
      return a.price - b.price;
    } else if (filters.sortBy === 'priceDesc') {
      return b.price - a.price;
    } else {
      return new Date(b.created_at) - new Date(a.created_at);
    }
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Toaster position="top-right" />
      <Navbar cartItems={cartItems} />
      
      {/* Hero Section with Parallax Effect */}
      <motion.div 
        className="relative h-[70vh] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        />
        <motion.img 
          src={Images.shophero}
          alt="Collection Banner"
          className="absolute inset-0 w-full h-full object-cover object-center"
          initial={{ scale: 1.2, y: 0 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
          <motion.h1 
            className="text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Exclusive Collection
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 max-w-2xl text-center"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Discover our curated selection of premium collectibles
          </motion.p>
        </div>
      </motion.div>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Search and Filter Bar */}
        <motion.div 
          className="mb-8 flex flex-wrap gap-4 items-center justify-between"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="relative flex-1 min-w-[300px]">
            <input
              type="text"
              placeholder="Search your favorite pieces..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-gray-900/50 text-white rounded-xl border border-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
            />
            <Search className="absolute left-4 top-3.5 text-purple-400" size={20} />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl flex items-center gap-2 hover:bg-purple-700 transition-colors duration-300"
          >
            <SlidersHorizontal size={20} />
            Filters
          </motion.button>
        </motion.div>

        {/* Filter Panel */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mb-8 p-6 bg-gray-900/50 backdrop-blur-lg rounded-xl border border-purple-500/20">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">Refine Your Search</h3>
                  <button
                    onClick={resetFilters}
                    className="text-purple-400 hover:text-purple-300 transition-colors duration-300 text-sm flex items-center gap-1"
                  >
                    <X size={16} />
                    Reset All
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Price Range
                    </label>
                    <select
                      value={filters.priceRange}
                      onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                      className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                    >
                      <option value="all">All Prices</option>
                      <option value="under100">Under $100</option>
                      <option value="100to500">$100 - $500</option>
                      <option value="over500">Over $500</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Sort By
                    </label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                    >
                      <option value="newest">Newest First</option>
                      <option value="priceAsc">Price: Low to High</option>
                      <option value="priceDesc">Price: High to Low</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-800 rounded-xl h-64 mb-4"></div>
                <div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-800 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* No Results Message */}
        {!isLoading && filteredProducts.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-400 text-lg mb-4">No products found matching your criteria</p>
            <button
              onClick={resetFilters}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors duration-300"
            >
              Reset Filters
            </button>
          </motion.div>
        )}
      </main>

      {/* WhatsApp Button */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: [0, 1, 1, 0],
            y: [10, 0, 0, 10]
          }}
          transition={{ 
            duration: 3,
            times: [0, 0.1, 0.9, 1],
            repeat: Infinity,
            repeatDelay: 5
          }}
          className="mb-2 bg-purple-900/90 backdrop-blur-lg text-white px-4 py-2 rounded-xl text-sm shadow-lg"
        >
          Need help? Chat with us!
        </motion.div>
        
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 1 
          }}
          whileHover={{ 
            scale: 1.1,
            boxShadow: "0 0 25px rgba(139, 92, 246, 0.5)"
          }}
          whileTap={{ scale: 0.95 }}
          onClick={handleWhatsAppClick}
          className="bg-purple-600 text-white p-4 rounded-full shadow-lg flex items-center gap-2 group hover:bg-purple-700 transition-colors duration-300"
        >
          <LiaWhatsapp size={24} />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap">
            Chat with us
          </span>
        </motion.button>
      </div>

      <Footer />
    </div>
  );
};

export default Shop;
import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/navbar';
import { useCart } from '../contexts/CartContext';
import { motion } from 'framer-motion';
import Footer from '../components/footer';
import { Search, SlidersHorizontal} from 'lucide-react';
import { LiaWhatsapp } from "react-icons/lia";
import Swal from 'sweetalert2';
import { Images } from "../constant";



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
    
     const [showContactForm, setShowContactForm] = useState(false);
     const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
   
    //  const handleWhatsAppClick = () => {
    //    const message = encodeURIComponent(`Hello! I'm interested in purchasing items from your store. My cart total is ${total.toFixed(2)} MAD.`);
    //    window.open(`https://wa.me/+212661715003?text=${message}`, '_blank');
    //  };
   
  
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetchProducts();
  }, []);



  
  const handleAddToCart = (product) => {
    addToCart(product);

    // Show SweetAlert notification with a new style
Swal.fire({
  title: "Successfully Added!",
  text: "The product is now in your cart.",
  icon: "success",
  showConfirmButton: false,
  timer: 2500,
  toast: true,
  position: "top-right",
  background: "#2c3e50", 
  color: "#ecf0f1", 
  iconColor: "#c084fc", 
  customClass: {
    popup: "custom-swal-popup",
    title: "custom-swal-title",
    content: "custom-swal-content"
  }

    });

    
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {

      // Get all products first
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', 'figure') // Filter for 'figure' category
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProducts(data || []); // Ensure we always set an array
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
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
    <div className="min-h-screen bg-black">
      <Toaster position="top-right" />
      <Navbar cartItems={cartItems}  />

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
                className="mb-2 bg-black text-white px-4 py-2 rounded-lg text-sm shadow-lg"
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
                  boxShadow: "0 0 25px rgba(255, 194, 60, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
                // onClick={handleWhatsAppClick}
                className="bg-purple-400 text-black p-4 rounded-full shadow-lg flex items-center justify-center group"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                >
                  <LiaWhatsapp size={24} />
                </motion.div>
                <motion.span
                  initial={{ width: 0, opacity: 0 }}
                  whileHover={{ 
                    width: "auto",
                    opacity: 1,
                    marginLeft: "8px"
                  }}
                  className="overflow-hidden whitespace-nowrap font-semibold"
                >
                  Chat with us
                </motion.span>
              </motion.button>
            </div>
      
      {/* Hero Section */}
      <div className="relative md:h-[80vh] h-[50vh] bg-black overflow-hidden">
        <div className="absolute inset-0 ">
          <img 
            src={Images.shop}
            alt="Collection Banner"
            className="w-full md:h-[70vh] h-[45vh] object-cover "
          />
        </div>
        
        <div className="relative h-full max-w-7xl  px-4 flex flex-col mt-24 ms-5">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl md:mt-8 font-bold text-gray-100 mb-6"
          >
            Discover <span className='text-[#754b9f]'> Our</span> <br /> Collection
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-400 md:max-w-2xl w-[55vw]"
          >
            Explore our carefully curated selection of premium products
          </motion.p>
 
          <div className="relative flex-1 min-w-[300px] mt-6 text-zinc-100">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="md:w-[30vw] w-[50vw]  pl-10 pr-4 py-3 bg-transparent rounded-3xl border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all shadow-sm"
              />
              <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
         </div> 
            
        </div>
        
      </div>
      <motion.div 
              className="relative float-end me-20"
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-3 bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-3xl text-white hover:bg-zinc-700/50 transition-all duration-300 shadow-lg"
              >
                <SlidersHorizontal size={18} />
                <span className="font-medium">Filters</span>
              </button>

              {isFilterOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-72 bg-zinc-900/95 backdrop-blur-lg border border-zinc-700/50 rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  <div className="p-4">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Price Range
                      </label>
                      <select
                        value={filters.priceRange}
                        onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                        className="w-full p-2.5 bg-zinc-800/50 text-gray-200 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      >
                        <option value="all">All Prices</option>
                        <option value="under100">Under $100</option>
                        <option value="100to500">$100 - $500</option>
                        <option value="over500">Over $500</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Sort By
                      </label>
                      <select
                        value={filters.sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                        className="w-full p-2.5 bg-zinc-800/50 text-gray-200 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      >
                        <option value="newest">Newest First</option>
                        <option value="priceAsc">Price: Low to High</option>
                        <option value="priceDesc">Price: High to Low</option>
                      </select>
                    </div>

                    <button
                      onClick={resetFilters}
                      className="w-full mt-2 px-4 py-2 text-sm bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
                    >
                      Reset Filters
                    </button>
                  </div>
                </motion.div>
              )}
      </motion.div>


  <main className="max-w-7xl mx-auto  mb-28 mt-20 md:ms-10 me-28 ">

       


        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
        
        {/* Empty State */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">
              No products found matching your criteria
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
            >
              Reset Filters
            </button>
         =
          </div>
        )}
      </main>
     
      <Footer />
    </div>
  );
};
export default Shop;
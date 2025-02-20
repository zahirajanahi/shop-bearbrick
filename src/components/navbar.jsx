import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, ChevronDown } from 'lucide-react';
import { Images } from "../constant";
import { useNavigate } from 'react-router-dom'; 
import { useCart } from '../contexts/CartContext';
import CustomCursor from './CustomCursor';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { cartItems } = useCart();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClick = () => {
    navigate('/cartPage');
    setIsCartOpen(false);
    setIsOpen(false);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const CartButton = ({ className = "", showText = false }) => (
    <button 
      onClick={() => setIsCartOpen(!isCartOpen)} 
      className={`relative flex items-center gap-2 ${className}`}
    >
      <ShoppingBag className='h-5 w-5'/>
      {showText && <span>Cart</span>}
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </button>
  );

  const CartDropdown = () => (
    <div className={`
      ${isMobile ? 'fixed inset-x-4 top-20' : 'absolute right-0'}
      mt-2 w-[70vw] md:w-80 bg-black/90   backdrop-blur-lg rounded-2xl shadow-2xl py-4 px-2 z-50 border border-white/10
    `}>
      <div className="max-h-96 overflow-y-auto">
        {cartItems.length === 0 ? (
          <div className="text-center py-4 text-gray-400">
            Your cart is empty
          </div>
        ) : (
          <>
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-2 border-b border-white/10">
                <img 
                  src={item.image_url} 
                  alt={item.title} 
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-white/90 truncate">{item.title}</h4>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-gray-400">
                      {item.quantity} × {item.price} MAD
                    </span>
                    <span className="text-sm font-medium text-purple-200">
                      {(item.quantity * item.price).toFixed(2)} MAD
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <div className="p-4 border-t border-white/10 mt-2">
              <div className="flex justify-between mb-4">
                <span className="font-medium text-white/90">Total:</span>
                <span className="font-medium text-purple-200">{totalPrice.toFixed(2)} MAD</span>
              </div>
              <button 
                onClick={handleClick}
                className="w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700 transition-colors"
              >
                View Cart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const ShopDropdown = () => (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-black/90 backdrop-blur-lg rounded-2xl shadow-2xl py-2 px-1 z-50 border border-white/10 min-w-[200px]">
      <div className="flex flex-col space-y-1">
        <a 
          href="/shop" 
          className="px-4 py-2 text-white/90 hover:text-purple-400 hover:bg-white/5 rounded-xl transition-all duration-200 text-sm font-medium"
          onClick={() => setIsShopOpen(false)}
        >
          B-figures
        </a>
        <a 
          href="/shop-table" 
          className="px-4 py-2 text-white/90 hover:text-purple-400 hover:bg-white/5 rounded-xl transition-all duration-200 text-sm font-medium"
          onClick={() => setIsShopOpen(false)}
        >
          B-tableau
        </a>
      </div>
    </div>
  );

  return (
    <div className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-black/80 backdrop-blur-lg border-b border-white/10' 
        : 'bg-gradient-to-b from-black/50 to-transparent backdrop-blur-none'
    }`}>
      <nav className="max-w-7xl mx-auto py-4 px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <a href="/" className="transform hover:scale-105 transition-transform">
              <img src={Images.logo} alt="" className="h-12 hidden sm:block" />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 text-white">
            <a href="/" className="nav-link group">
              <span className="relative px-4 py-2 text-sm font-medium transition-colors hover:text-purple-400">
                Home
                <span className="absolute bottom-0 left-0 h-0.5 w-full scale-x-0 transform bg-purple-400 transition-transform group-hover:scale-x-100"></span>
              </span>
            </a>
          
            {/* Shop Dropdown Trigger */}
            <div className="relative group">
              <button 
                onClick={() => setIsShopOpen(!isShopOpen)}
                className="nav-link group flex items-center gap-1"
              >
                <span className="relative px-4 py-2 text-sm font-medium transition-colors hover:text-purple-400 flex items-center">
                  Shop
                  <ChevronDown className="ml-1 h-4 w-4" />
                  <span className="absolute bottom-0 left-0 h-0.5 w-full scale-x-0 transform bg-purple-400 transition-transform group-hover:scale-x-100"></span>
                </span>
              </button>
              {isShopOpen && <ShopDropdown />}
            </div>

            <a href="/faqs" className="nav-link group">
              <span className="relative px-4 py-2 text-sm font-medium transition-colors hover:text-purple-400">
              Faqs
                <span className="absolute bottom-0 left-0 h-0.5 w-full scale-x-0 transform bg-purple-400 transition-transform group-hover:scale-x-100"></span>
              </span>
            </a>

            <a href="/cartPage" className="nav-link group">
              <span className="relative px-4 py-2 text-sm font-medium transition-colors hover:text-purple-400">
              Cart
                <span className="absolute bottom-0 left-0 h-0.5 w-full scale-x-0 transform bg-purple-400 transition-transform group-hover:scale-x-100"></span>
              </span>
            </a>

          </div>

          {/* Desktop Cart Button & Dropdown */}
          <div className="hidden md:block relative">
            <CartButton className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border border-white/10 hover:border-purple-500/50" showText={true} />
          </div>

          {/* Mobile menu and cart buttons */}
          <div className="md:hidden flex items-center space-x-4">
            <CartButton className="text-white hover:text-purple-400 transition-colors" />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-purple-400 transition-colors p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 bg-black/90 backdrop-blur-xl rounded-2xl p-6 absolute left-4 right-4 border border-white/10">
            <div className="flex flex-col space-y-4">
              <a href="/" className="text-white/90 hover:text-purple-300 transition-colors text-sm font-medium">Home</a>
              <div className="space-y-2">
                <p className="text-white/60 text-sm font-medium">Shop</p>
                <a href="/shop" className="block pl-4 text-white/90 hover:text-purple-300 transition-colors text-sm font-medium">B-figures</a>
                <a href="/shop-table" className="block pl-4 text-white/90 hover:text-purple-300 transition-colors text-sm font-medium">B-tableau</a>
              </div>              <a href="/faqs" className="text-white/90 hover:text-purple-300 transition-colors text-sm font-medium">FAQs</a>
            </div>
          </div>
        )}

        {/* Cart Dropdown */}
        {isCartOpen && <CartDropdown />}
      </nav>


    </div>
  );
};

export default Navbar;
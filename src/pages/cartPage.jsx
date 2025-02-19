import React, { useState } from 'react';
import Navbar from '../components/navbar';
import { useCart } from '../contexts/CartContext';
import { Send, ShoppingCart, Trash2, Apple as WhatsApp } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/footer';
import 'lord-icon-element';
import { X } from 'lucide-react';
import CustomCursor from '../components/CustomCursor';


const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const [showContactForm, setShowContactForm] = useState(false);
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(`Hello! I'm interested in purchasing items from your store. My cart total is ${total.toFixed(2)} MAD.`);
    window.open(`https://wa.me/+2120774054190?text=${message}`, '_blank');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900">
        <Navbar cartItems={cartItems} />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-4 py-8 pt-28"
        >
          <div className="bg-zinc-800 p-12 rounded-2xl shadow-xl text-center border border-zinc-700">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
              }}
            >
              <ShoppingCart size={64} className="mx-auto text-[#FFC23C] mb-6" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-3">Your cart is empty</h2>
            <p className="text-gray-400 text-lg">Start adding some amazing KAWS items to your cart!</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900">
                   <CustomCursor/>

      <Navbar cartItems={cartItems} />
      <div className="max-w-3xl mx-auto px-4 py-8 pt-32">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold mb-6 text-white"
        >
          Your Shopping Cart
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-800 rounded-xl shadow-lg overflow-hidden border border-zinc-700 p-4"
        >
          <AnimatePresence mode="popLayout">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-4 pb-4 border-b border-zinc-700 last:border-0"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative overflow-hidden rounded-lg"
                  >
                    <img 
                      src={item.image_url} 
                      alt={item.title} 
                      className="w-24 h-24 object-cover"
                    />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-white">{item.title}</h3>
                    <p className="text-[#FFC23C] text-base mt-1">{item.price} MAD</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <motion.input
                      whileFocus={{ scale: 1.05 }}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      className="w-16 px-2 py-1 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#FFC23C] focus:border-transparent"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeFromCart(item.id)}
                      className="text-sky-50 transition-colors p-2"
                    >
                      
                      <X size={20} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </motion.div>

        <motion.div 
          layout
          className="mt-10 border-t border-zinc-700 pt-6"
        >
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg text-white">Total:</span>
            <motion.span 
              key={total}
              initial={{ scale: 1.2, color: '#FFC23C' }}
              animate={{ scale: 1, color: '#ffffff' }}
              className="text-2xl font-bold"
            >
              {total.toFixed(2)} MAD
            </motion.span>
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowContactForm(true)}
              className="border-[#FFC23C] border text-[#FFC23C] py-3 px-5 rounded-lg font-bold text-base hover:bg-[#FFD23F] hover:text-black transition-colors shadow-md"
            >
              Proceed to Contact
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleWhatsAppClick}
              className="flex items-center gap-2 bg-green-900 text-white py-3 px-5 rounded-lg font-bold text-base hover:bg-green-600 transition-colors shadow-md"
            >
              <Send size={20} className="transform" />
              Chat on WhatsApp
            </motion.button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showContactForm && (
          <ContactForm
            cartItems={cartItems}
            onClose={() => setShowContactForm(false)}
          />
        )}
      </AnimatePresence>

      <Footer/>
    </div>
    
  );
};

export default CartPage;

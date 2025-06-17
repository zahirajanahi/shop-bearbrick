import React, { useState } from 'react';
import Navbar from '../components/navbar';
import { useCart } from '../contexts/CartContext';
import { Send, ShoppingCart, X } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/footer';
import CustomCursor from '../components/CustomCursor';
import { LiaWhatsapp } from 'react-icons/lia';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const [showContactForm, setShowContactForm] = useState(false);
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(`Hello! I'm interested in purchasing items from your store. My cart total is ${total.toFixed(2)} MAD.`);
    window.open(`https://wa.me/212661553462?text=${message}`, '_blank');
  };

 

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white">

       
              
        <Navbar cartItems={cartItems} />
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
                  onClick={handleWhatsAppClick}
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
              <ShoppingCart size={64} className="mx-auto text-purple-500 mb-6" />
            </motion.div>
            <h2 className="text-3xl font-bold mb-3">Your cart is empty</h2>
            <p className="text-gray-400 text-lg">Start adding some amazing BEARBRICK items to your cart!</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <Navbar cartItems={cartItems} />
      
       

      <div className="max-w-[1200px] mx-auto px-8 py-12 pt-32">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-light mb-12 tracking-wide"
        >
          YOUR CART
        </motion.h1>
        
        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-8">
            <div className="grid grid-cols-[1fr,100px,40px] gap-4 text-sm text-gray-400 pb-2 border-b border-gray-600">
              <div>ITEM</div>
              <div className="text-center">QTY</div>
              <div></div>
            </div>
            
            <AnimatePresence mode="popLayout">
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-[1fr,100px,40px] gap-4 items-center py-4"
                >
                  <div className="flex items-center gap-5">
                    <div className="bg-gray-800 rounded-3xl flex items-center justify-center">
                      <img 
                        src={item.image_url} 
                        alt={item.title} 
                        className="md:w-[10vw] md:h-[23vh] w-[15w] rounded-3xl object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-1">{item.title}</h3>
                      <h3 className="font-light text-lg mb-1 text-gray-400">{item.description}</h3>
                      <p className="text-sm text-gray-400">MAD {item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="text-gray-400 hover:text-gray-200"
                      >
                        −
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-gray-400 hover:text-gray-200"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="flex justify-center text-gray-400 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <motion.div layout className="border-t border-gray-700 pt-6">
            <div className="flex justify-between items-center mb-8">
              <span className="text-sm text-gray-400">TOTAL</span>
              <motion.span 
                key={total}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg font-semibold text-white"
              >
                MAD {total.toFixed(2)}
              </motion.span>
            </div>

            <div className="flex justify-between gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowContactForm(true)}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-full text-sm font-light tracking-wide hover:bg-purple-700 transition-colors"
              >
                PROCEED TO CONTACT
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleWhatsAppClick}
                className="w-full flex items-center justify-center gap-2 text-green-700 border border-green-700 py-3 px-6 rounded-full text-sm font-light tracking-wide hover:bg-green-700 hover:text-white transition-colors"
              >
                <Send size={16} />
                CHAT ON WHATSAPP
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        <div className='text-black'>
        {showContactForm && (
          <ContactForm
            cartItems={cartItems}
            onClose={() => setShowContactForm(false)}
          />
        )}
        </div>
      
      </AnimatePresence>
      <Footer/>
    </div>
  );
};

export default CartPage;

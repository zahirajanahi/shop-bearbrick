import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { ChevronDown, ChevronUp, DivideIcon as LucideIcon, ShoppingBag, Truck, MessageCircle, Palette, HelpCircle, Package } from 'lucide-react';
import { LiaWhatsapp } from "react-icons/lia";
import CustomCursor from '../components/CustomCursor';



const faqs  = [
  {
    question: "How to Order?",
    answer: "Visit our shop page to browse our collection. Add your desired products to the cart. Once you're ready, proceed to the cart page where you can review your order. You can either fill out the contact form or send us your order details via WhatsApp. We'll guide you through the rest of the process!",
    icon: ShoppingBag
  },
  {
    question: "Shopping Procedure",
    answer: "After receiving your order through our contact form or WhatsApp, we'll review it and get in touch with you to confirm the details. Please ensure all contact information is filled out correctly to avoid any delays. We'll then guide you through the payment process and shipping arrangements.",
    icon: Truck
  },
  {
    question: "What is the point of KAWS?",
    answer: "KAWS, a former graffiti artist and skateboarder, represents accessible popular art for everyone. His work primarily draws inspiration from iconic figures in cinema and television, transforming them to reflect on contemporary society. Each piece serves as a commentary on modern culture while maintaining a distinctive artistic style.",
    icon: Palette
  },
  {
    question: "Are KAWS figures worth collecting?",
    answer: "Yes! KAWS figures are highly collectible items that often appreciate in value over time. They represent a unique intersection of street art, pop culture, and contemporary art, making them valuable both as art pieces and investments.",
    icon: Package
  },
  
];

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/0661715003', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900">
                         <CustomCursor/>

      <Navbar />
      
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
          className="bg-[#FFC23C] text-black p-4 rounded-full shadow-lg flex items-center justify-center group"
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

      <div className="max-w-4xl mx-auto px-4 py-16 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-400">Everything you need to know about KAWS and our store</p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left text-white hover:bg-zinc-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {React.createElement(faq.icon, { 
                    size: 20,
                    className: "text-[#FFC23C]"
                  })}
                  <span className="font-semibold">{faq.question}</span>
                </div>
                {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 py-4 text-gray-300 border-t border-zinc-700">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400">
            Still have questions? Feel free to{" "}
            <button
              onClick={handleWhatsAppClick}
              className="text-[#FFC23C] hover:underline inline-flex items-center gap-1"
            >
              contact us <MessageCircle size={16} />
            </button>
          </p>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default FaqPage;
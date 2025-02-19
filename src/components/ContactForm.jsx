import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { Send, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const ContactForm = ({ cartItems, onClose }) => {
  const form = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.current) return;

    setIsSubmitting(true);
    
    try {
      // Format cart items for email with HTML for images
      const itemsList = cartItems
        .map(item => `
          <div style="margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
            <img src="${item.image_url}" alt="${item.title}" style="width: 100px; height: 100px; object-fit: cover; margin-bottom: 10px;" />
            <p style="margin: 5px 0;">Product: ${item.title}</p>
            <p style="margin: 5px 0;">Quantity: ${item.quantity}</p>
            <p style="margin: 5px 0;">Price: ${(item.price * item.quantity).toFixed(2)} MAD</p>
          </div>
        `).join('');
      
      const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      
      // Create HTML email template with added contact information
      const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Order Details</h2>
          <div style="margin: 20px 0; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
            <h3 style="color: #333; margin-bottom: 15px;">Contact Information</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${form.current.user_name.value}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${form.current.user_email.value}</p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> ${form.current.user_phone.value}</p>
            <p style="margin: 5px 0;"><strong>Address:</strong> ${form.current.user_address.value}</p>
          </div>
          <div style="margin: 20px 0;">
            ${itemsList}
          </div>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #eee;">
            <h3 style="color: #333;">Total: ${total.toFixed(2)} MAD</h3>
          </div>
          <div style="margin-top: 20px;">
            <p style="margin: 5px 0;"><strong>Customer Message:</strong></p>
            <p style="margin: 5px 0;">${form.current.message.value}</p>
          </div>
        </div>
      `;

      // Create template parameters
      const templateParams = {
        user_name: form.current.user_name.value,
        user_email: form.current.user_email.value,
        user_phone: form.current.user_phone.value,
        user_address: form.current.user_address.value,
        message: form.current.message.value,
        html_content: emailContent,
      };

      await emailjs.send(
        'service_285k4k7',
        'template_htabt4j',
        templateParams,
        'FyhT020zdNVAzrJ4D'
      );

      toast.success('Message sent successfully!');
      onClose();
    } catch (error) {
      console.error('EmailJS Error:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4">Sent Your order </h2>
        <form ref={form} onSubmit={handleSubmit} className="space-y-4">
          <div className='flex space-x-2'>
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="user_name"
              required
              className="mt-1 w-[41vw] block md:w-[14vw] rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="user_email"
              required
              className="mt-1 block md:w-[16vw] w-[42vw] rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          </div>
          

          <div>
            <label className="block text-sm font-medium text-gray-700">
              <span className="flex items-center gap-2">
                <Phone size={16} /> Phone Number
              </span>
            </label>
            <input
              type="tel"
              name="user_phone"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              <span className="flex items-center gap-2">
                <MapPin size={16} /> Delivery Address
              </span>
            </label>
            <textarea
              name="user_address"
              rows={2}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Street address, City, Postal code"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Message (Optional)</label>
            <textarea
              name="message"
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Any special instructions or notes?"
            ></textarea>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-zinc-900 transition-colors flex items-center justify-center gap-2 disabled:bg-zinc-900"
            >
              <Send size={20} />
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
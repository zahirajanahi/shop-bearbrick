import React from 'react';
import { ShoppingCart, Trash2 } from 'lucide-react';

const Cart = ({ items, onRemoveFromCart, onUpdateQuantity, onCheckout }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-center gap-2 text-gray-500">
          <ShoppingCart size={24} />
          <p>Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Shopping Cart</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-4">
              <img src={item.image_url} alt={item.title} className="w-16 h-16 object-cover rounded" />
              <div>
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-gray-600">{item.price} MAD</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value))}
                className="w-16 px-2 py-1 border rounded"
              />
              <button
                onClick={() => onRemoveFromCart(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <div className="flex justify-between text-lg font-semibold">
          <span>Total:</span>
          <span>{total.toFixed(2)} MAD</span>
        </div>
        <button
          onClick={onCheckout}
          className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Proceed to Contact
        </button>
      </div>
    </div>
  );
};

export default Cart;
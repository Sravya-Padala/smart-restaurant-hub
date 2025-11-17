// src/pages/CartPage.jsx
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';


export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      // --- SOLUTION WRAPPER (for empty cart) ---
      // Added min-h-screen, bg-gray-900, text-white to match MenuPage
      // Added flex utils to center the content vertically and horizontally
      <div className="w-screen min-h-[calc(100vh-10rem)] bg-gray-900 text-white flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="!text-xl font-bold mb-4">Your Cart is Empty</h1>
          {/* --- TWEAK: Matched button style to your app's theme --- */}
          <Link
            to="/menu"
            className="mt-4 inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    // --- SOLUTION WRAPPER (for main content) ---
    // Added min-h-screen, bg-gray-900, text-white, and padding (p-4 sm:p-8)
    <div className="w-screen min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      {/* This container still centers your content, but now on a dark background */}
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
        <div className="space-y-4">
          {cartItems.map((item) => (
            // --- TWEAK: Changed border color for dark mode ---
            <div key={item.id} className="flex flex-wrap items-center justify-between border-b border-gray-700 pb-4 gap-4">
              <div>
                <h2 className="text-xl font-semibold">{item.name}</h2>
                {/* --- TWEAK: Lightened gray text for dark mode --- */}
                <p className="text-gray-400">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-4">
                {/* --- TWEAK: Matched quantity picker to dark theme --- */}
                <div className="flex items-center border border-gray-600 rounded">
                  <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-l transition-colors">-</button>
                  <span className="px-4 py-1 bg-gray-800">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-r transition-colors">+</button>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
                >
                  <FaTrashAlt size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-right">
          <h2 className="text-2xl font-bold">Total: ${totalPrice.toFixed(2)}</h2>
          <Link to="/checkout"> {/* Wrap the button */}
          <button className="mt-4 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded transition-colors">
            Proceed to Checkout
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
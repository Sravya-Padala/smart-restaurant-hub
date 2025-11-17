import { Link } from 'react-router-dom';
// 1. Import the icon for the contact page
import { FaShoppingCart, FaHeart, FaClipboardList, FaSignOutAlt, FaTimes, FaInfoCircle, FaEnvelope } from 'react-icons/fa';

export default function Sidebar({ isOpen, onClose, user, onLogout, totalCartItems }) {
  return (
    <>
      {/* Backdrop (z-50) */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      ></div>
      
      {/* Sidebar Panel (z-60, now on top of the backdrop) */}
      <div 
        className={`fixed top-0 left-0 h-full w-72 bg-gray-800 shadow-xl z-60 transition-transform transform md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Profile" className="h-10 w-10 rounded-full" />
            <span className="text-sm font-medium text-white truncate">
              {user ? user.email : 'Guest'}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link to="/cart" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                <FaShoppingCart size={18} />
                <span>Cart</span>
                {totalCartItems > 0 && (
                  <span className="ml-auto bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {totalCartItems}
                  </span>
                )}
              </Link>
            </li>
            <li>
              <Link to="/my-orders" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                <FaClipboardList size={18} />
                <span>My Orders</span>
              </Link>
            </li>
            <li>
              <Link to="/favorites" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                <FaHeart size={18} />
                <span>Favorites</span>
              </Link>
            </li>
            <li>
              <Link to="/about" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                <FaInfoCircle size={18} /> 
                <span>About Us</span>
              </Link>
            </li>
            {/* 2. Added the new "Contact" link here */}
            <li>
              <Link to="/contact" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                <FaEnvelope size={18} />
                <span>Contact</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        {user && (
          <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-700">
            <button 
              onClick={onLogout} 
              className="flex items-center w-full gap-4 p-3 rounded-lg text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors"
            >
              <FaSignOutAlt size={18} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
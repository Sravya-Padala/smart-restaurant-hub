import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { FaUserCircle, FaShoppingCart,FaCommentDots } from 'react-icons/fa';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import './index.css'; 


function App() {
  const { user, logOut } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logOut();
    navigate('/login');
  };

  const isAuthPage = ['/login', '/signup', '/forgot-password', '/update-password'].includes(location.pathname);
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef]);

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const closeDropdown = () => { setDropdownOpen(false); };
  
  const navClasses = isHomePage
    ? 'bg-transparent text-white absolute top-0 left-0 w-full z-20'
    : 'bg-gray-800 text-white shadow-md relative';

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className={`p-0 transition-colors duration-300 ${navClasses}`}>
        <div className="w-full flex justify-between items-center px-4 sm:px-6 lg:px-8">
          <Link to="/" className="block"> {/* Use block to contain the image */}
            <img 
              src="/logo.png" 
              alt="Smart Restaurant Hub Logo" 
              className="h-25 w-auto" // height of image 
            />
          </Link>

          <ul className="flex space-x-1 items-center">
            {user ? (
              <>
                <li><Link to="/" className="px-2 py-1 rounded-xl hover:bg-white transition-colors !text-orange-600 !hover:text-orange-600">Home</Link></li>
                <li><Link to="/menu" className="px-2 py-1 rounded-xl hover:bg-white transition-colors !text-orange-600 !hover:text-orange-600">Menu</Link></li>
                <li><Link to="/reservation" className="px-2 py-1 rounded-xl hover:bg-white transition-colors !text-orange-600 !hover:text-orange-600">Reservation</Link></li>
                <li><Link to="/about" className="px-2 py-1 rounded-xl hover:bg-white transition-colors !text-orange-600 !hover:text-orange-600">About</Link></li>
                <li><Link to="/contact" className="px-2 py-1 rounded-xl hover:bg-white transition-colors !text-orange-600 !hover:text-orange-600">Contact</Link></li>
                <li className="relative"><Link to="/cart" className="!text-orange-600 !hover:text-orange-600"><FaShoppingCart size={24} />{totalCartItems > 0 && (<span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{totalCartItems}</span>)}</Link></li>
                <li className="relative" ref={dropdownRef}><button onClick={() => setDropdownOpen(!isDropdownOpen)} className="focus:outline-none"><FaUserCircle size={28} /></button>{isDropdownOpen && (<div className="absolute right-0 mt-2 w-56 bg-gray-700 rounded-md shadow-lg py-1 z-10 border border-gray-600"><div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-600">{user.email}</div><Link to="/my-orders" className="block px-4 py-2 text-sm hover:bg-gray-600" onClick={closeDropdown}>My Orders</Link><Link to="/favorites" className="block px-4 py-2 text-sm hover:bg-gray-600" onClick={closeDropdown}>Favorites</Link><button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-gray-600">Logout</button></div>)}</li>
              </>
            ) : (
              <>
                {!isHomePage && !isAuthPage && ( <> <li><Link to="/reservation" className="hover:text-gray-300">Reservation</Link></li><li><Link to="/about" className="hover:text-gray-300">About</Link></li><li><Link to="/contact" className="hover:text-gray-300">Contact</Link></li> </>)}
                {!isAuthPage && ( <> <li><Link to="/login" className="hover:text-gray-300">Login</Link></li><li><Link to="/signup" className="hover:text-gray-300">Sign Up</Link></li> </>)}
              </>
            )}
          </ul>
        </div>
      </nav>
      
        <main className="flex-grow w-full">
          <Outlet />
        </main>
       {!isAuthPage && <Footer />}
       


     <button
        onClick={() => setIsChatOpen(true)} // Open chat on click
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 !bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-full shadow-lg z-40 transition-transform transform hover:scale-110"
        aria-label="Open chat"
      >
        <FaCommentDots size={24} />
      </button>

      {/* --- NEW: Render Chat Widget --- */}
      <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

    </div>  
  );
}


export default App;
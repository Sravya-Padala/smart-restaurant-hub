import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { getCategories } from './services/api';
import { FaUserCircle, FaShoppingCart, FaCommentDots, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import './index.css';
import ScrollToTop from './components/ScrollToTop'; 

function App() {
  const { user, logOut } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- Categories for mobile menu dropdown ---
  const [categories, setCategories] = useState([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleLogout = async () => {
    setDropdownOpen(false);
    setIsSidebarOpen(false);
    await logOut();
    navigate('/login');
  };

  const isAuthPage = ['/login', '/signup', '/forgot-password', '/update-password'].includes(location.pathname);
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (Array.isArray(response.data)) setCategories(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Click outside for desktop dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef]);

  // Close sidebar & category dropdown on navigation
  useEffect(() => {
    setIsSidebarOpen(false);
    setIsCategoryDropdownOpen(false);
  }, [location.pathname]);

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const navClasses = isHomePage
    ? 'bg-transparent text-white absolute top-0 left-0 w-full z-20'
    : 'bg-gray-800 text-white shadow-md relative';

  const mobileNavClasses = isHomePage
    ? 'bg-transparent text-white absolute top-0 left-0 w-full z-20'
    : 'bg-gray-800 text-white shadow-md sticky top-0';

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsCategoryDropdownOpen(false); // close immediately
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white md:pb-0 pb-20">

      {/* --- DESKTOP NAVIGATION --- */}
      <nav className={`p-0 transition-colors duration-300 ${navClasses} hidden md:block`}>
        <div className="w-full flex justify-between items-center px-4 sm:px-6 lg:px-8">
          <Link to="/" className="block">
            <img src="/logo.png" alt="Smart Restaurant Hub Logo" className="h-25 w-auto" />
          </Link>
          <ul className="flex space-x-1 items-center">
            {user ? (
              <>
                <li>
                  <NavLink 
                    to="/" 
                    className={({isActive}) => `px-2 py-1 rounded-xl transition-colors !text-orange-600 ${isActive ? 'bg-white text-orange-600' : 'hover:bg-white hover:text-orange-600'}`}
                    end
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/menu" 
                    className={({isActive}) => `px-2 py-1 rounded-xl transition-colors !text-orange-600 ${isActive ? 'bg-white text-orange-600' : 'hover:bg-white hover:text-orange-600'}`}
                  >
                    Menu
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/reservation" 
                    className={({isActive}) => `px-2 py-1 rounded-xl transition-colors !text-orange-600 ${isActive ? 'bg-white text-orange-600' : 'hover:bg-white hover:text-orange-600'}`}
                  >
                    Reservation
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/about" 
                    className={({isActive}) => `px-2 py-1 rounded-xl transition-colors !text-orange-600 ${isActive ? 'bg-white text-orange-600' : 'hover:bg-white hover:text-orange-600'}`}
                  >
                    About
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/contact" 
                    className={({isActive}) => `px-2 py-1 rounded-xl transition-colors !text-orange-600 ${isActive ? 'bg-white text-orange-600' : 'hover:bg-white hover:text-orange-600'}`}
                  >
                    Contact
                  </NavLink>
                </li>
                <li className="relative">
                  <Link to="/cart" className="!text-orange-600 !hover:text-orange-600">
                    <FaShoppingCart size={24} />
                    {totalCartItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {totalCartItems}
                      </span>
                    )}
                  </Link>
                </li>
                <li className="relative" ref={dropdownRef}>
                  <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="!bg-transparent !focus:outline-none">
                    <FaUserCircle size={28} />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-gray-700 rounded-md shadow-lg py-1 z-10 border border-gray-600">
                      <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-600">{user.email}</div>
                      <Link to="/my-orders" className="block px-4 py-2 text-sm hover:bg-gray-600" onClick={() => setDropdownOpen(false)}>My Orders</Link>
                      <Link to="/favorites" className="block px-4 py-2 text-sm hover:bg-gray-600" onClick={() => setDropdownOpen(false)}>Favorites</Link>
                      <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-gray-600">Logout</button>
                    </div>
                  )}
                </li>
              </>
            ) : (
              <>
                {!isHomePage && !isAuthPage && (
                  <>
                    <li><Link to="/reservation" className="hover:text-gray-300">Reservation</Link></li>
                    <li><Link to="/about" className="hover:text-gray-300">About</Link></li>
                    <li><Link to="/contact" className="hover:text-gray-300">Contact</Link></li>
                  </>
                )}
                {!isAuthPage && (
                  <>
                    <li><Link to="/login" className="hover:text-gray-300">Login</Link></li>
                    <li><Link to="/signup" className="hover:text-gray-300">Sign Up</Link></li>
                  </>
                )}
              </>
            )}
          </ul>
        </div>
      </nav>

      {/* --- MOBILE NAVIGATION --- */}
      <div className={`md:hidden ${mobileNavClasses} z-40`}>
        <div className="w-full flex justify-between items-center relative">
           {!isAuthPage && (
          <button onClick={() => setIsSidebarOpen(true)} className="block !focus:outline-none">
            <img src="/logo.png" alt="Smart Restaurant Hub Logo" className="h-10 w-auto" />
          </button>
           )}

          {location.pathname === '/menu' && (
            <div className="relative">
              <button 
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)} 
                className="flex items-center gap-1 text-base font-bold text-white !bg-transparent !border-none !focus:outline-none"
              >
                Our Menu
                {isCategoryDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {isCategoryDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded shadow-lg z-50">
                  <button 
                    onClick={() => handleCategorySelect('')}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 ${selectedCategory === '' ? '!bg-orange-500 text-white' : ''}`}
                  >
                    All Categories
                  </button>
                  {categories.map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => handleCategorySelect(cat)}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 ${selectedCategory === cat ? '!bg-orange-500 text-white' : ''}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {location.pathname !== '/menu' && location.pathname === '/reservation' && (
            <h1 className="!text-base font-bold text-white">Reserve a Table</h1>
          )}

          <div className="w-10"></div>
        </div>
      </div>

      {/* --- MOBILE SIDEBAR --- */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        user={user}
        onLogout={handleLogout}
        totalCartItems={totalCartItems}
      />

      <ScrollToTop />

      <main className="flex-grow w-full">
        <Outlet context={{ selectedCategory }} />
      </main>

      {!isAuthPage && <Footer />}
      {!isAuthPage && <BottomNav />}
     
     {!isAuthPage && (
      <>
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 !bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-full shadow-lg z-40 transition-transform transform hover:scale-110"
        aria-label="Open chat"
      >
        <FaCommentDots size={24} />
      </button>

      <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </>
     )}
    </div>
  );
}

export default App;

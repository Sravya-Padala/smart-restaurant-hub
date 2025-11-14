import { NavLink } from 'react-router-dom';
import { FaHome, FaUtensils, FaCalendarAlt, FaClipboardList } from 'react-icons/fa'; // Using FaClipboardList for "Order"

export default function BottomNav() {
  // This function provides styles for the active NavLink
  const getNavLinkClass = ({ isActive }) => {
    return `flex flex-col items-center justify-center w-full h-full transition-colors ${
      isActive ? 'text-orange-400' : 'text-gray-400 hover:text-gray-200'
    }`;
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full h-16 bg-gray-800 border-t border-gray-700 shadow-lg z-40 md:hidden">
      <div className="flex justify-around items-center h-full">
        <NavLink to="/" className={getNavLinkClass} end>
          <FaHome size={20} />
          <span className="text-xs mt-1">Home</span>
        </NavLink>
        <NavLink to="/menu" className={getNavLinkClass}>
          <FaUtensils size={20} />
          <span className="text-xs mt-1">Menu</span>
        </NavLink>
        <NavLink to="/cart" className={getNavLinkClass}>
          <FaClipboardList size={20} />
          <span className="text-xs mt-1">Order</span>
        </NavLink>
        <NavLink to="/reservation" className={getNavLinkClass}>
          <FaCalendarAlt size={20} />
          <span className="text-xs mt-1">Reserve</span>
        </NavLink>
      </div>
    </nav>
  );
}
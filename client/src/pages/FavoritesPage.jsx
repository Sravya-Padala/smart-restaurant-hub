// src/pages/FavoritesPage.jsx
import { useFavorites } from '../context/FavoritesContext';
import MenuItemCard from '../components/MenuItemCard';
import { Link } from 'react-router-dom';

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      // --- SOLUTION WRAPPER (for empty state) ---
      // Added full-screen, dark, and centering classes
      <div className="w-screen min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold">You have no favorite items yet!</h1>
          <p className="mt-2 text-gray-400">Click the heart on any menu item to save it here.</p>
          {/* --- TWEAK: Matched button to your app's theme --- */}
          <Link
            to="/menu"
            className="mt-4 inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded transition-colors"
          >
            Browse the Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    // --- SOLUTION WRAPPER (for main content) ---
    // Added full-screen, dark, and padding classes
    <div className="w-screen min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      {/* This container still centers your content, but now on the dark background */}
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Your Favorites</h2>
        {/* --- TWEAK: Matched grid from MenuPage for consistency --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8">
          {favorites.map(item => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}



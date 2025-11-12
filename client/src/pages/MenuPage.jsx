// src/pages/MenuPage.jsx
import { useState, useEffect } from 'react';
import MenuItemCard from '../components/MenuItemCard';
import { getMenu, getCategories } from '../services/api';

function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setError(null);
        const response = await getCategories();
        if (Array.isArray(response.data)) {
        setCategories(response.data);
        } else {
          console.error("API Error: /api/categories did not return an array.", response.data);
          setError('Could not load food categories (Invalid data format).');
          setCategories([]); // Ensure state is an empty array on error
        }
      } catch (err) {
        console.error("Error fetching client secret:", err);
        setError('Could not load food categories. Please try again later.');
     
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getMenu(selectedCategory);
        if (Array.isArray(response.data)) {
        setMenuItems(response.data);
        } else {
          console.error("API Error: /api/menu did not return an array.", response.data);
          setError('Could not load menu items (Invalid data format).');
          setMenuItems([]); // Ensure state is an empty array on error
        }
      } catch (err) {
        console.error("Error fetching client secret:", err);
        setError('Could not load menu items. Please try again later.');
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, [selectedCategory]);

  const getCategoryButtonStyle = (categoryName) => {
    return selectedCategory === categoryName
      ? 'bg-orange-500 text-white' // Active style
      : 'bg-gray-700 text-gray-200'; // Default style
  };

  return (
    <div className="w-screen min-h-screen bg-gray-900 text-white overflow-x-hidden">
      
      {/* --- DESKTOP HEADER/FILTER (Hidden on mobile) --- */}
      <div className="relative w-full bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 py-12 sm:py-16 md:py-20 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Our Menu
              </h1>
              <p className="text-gray-400 text-sm sm:text-base md:text-lg">
                Explore our carefully crafted culinary selections
              </p>
            </div>
            {/* Desktop Category Filter (Dropdown) */}
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
              <label htmlFor="category-select" className="text-gray-300 font-medium whitespace-nowrap">
                Filter by:
              </label>
              <select 
                id="category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg border-2 border-gray-600 bg-gray-800 text-white hover:border-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-30 transition-all duration-300"
              >
                <option value="">All Categories</option>
                {Array.isArray(categories) && categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* --- MOBILE CATEGORY FILTERS (Buttons, hidden on desktop) --- */}
      <div className="md:hidden p-4">
        {/* "Categories" h2 title has been REMOVED */}
        <div className="grid grid-cols-4 gap-2">
          {/* "All" Button */}
          <button
            onClick={() => setSelectedCategory('')}
            className={`py-2 px-1 text-xs font-medium rounded-lg shadow ${getCategoryButtonStyle('')}`}
          >
            All
          </button>
          {/* Category Buttons */}
          {Array.isArray(categories) && categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`py-2 px-1 text-xs font-medium rounded-lg shadow ${getCategoryButtonStyle(cat)} truncate`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* --- Loading State --- */}
      {loading && (
        <div className="w-full h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
            <p className="text-gray-400 text-lg">Loading menu...</p>
          </div>
        </div>
      )}

      {/* --- Error State --- */}
      {error && !loading && (
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 p-6 rounded-lg text-center">
            {error}
          </div>
        </div>
      )}

      {/* --- Menu Items Grid (Updated for mobile) --- */}
      {!loading && !error && (
        <div className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12">
          {menuItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No items available in this category</p>
            </div>
          ) : (
            // Added grid-auto-rows-fr to make all grid items equal height
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8 grid-auto-rows-fr">
              {Array.isArray(menuItems) && menuItems.map(item => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MenuPage;
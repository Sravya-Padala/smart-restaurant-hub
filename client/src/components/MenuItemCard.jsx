// src/components/MenuItemCard.jsx
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa'; // Import cart icon

function MenuItemCard({ item }) {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  return (
    // Set h-full and flex-col to ensure all cards are equal height
    <div className="border border-gray-700 bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all overflow-hidden h-full flex flex-col">
      
      {/* You can add an image here later if you want, e.g.: */}
      {/* <img src={item.image_url || 'https://placehold.co/400x300/333/fff?text=Food'} alt={item.name} className="w-full h-32 object-cover" /> */}

      {/* Content Area - flex-grow pushes the footer to the bottom */}
      <div className="p-4 flex-grow">
        <h3 className="text-lg font-bold mb-2 truncate">{item.name}</h3>
        {/* Truncate description to 2 lines to keep card size consistent */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-2 h-[2.5em]"> 
          {item.description}
        </p>
      </div>
      
      {/* Footer Area */}
      <div className="p-4 flex justify-between items-center mt-auto">
        <span className="font-semibold text-lg text-white">${item.price}</span>
        
        {/* Icons container */}
        <div className="flex items-center space-x-2">
          {/* Favorite Icon (left) */}
          <button 
            onClick={() => toggleFavorite(item)} 
            className="text-red-500 p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            {isFavorite(item.id) ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
          </button>
          
          {/* Cart Icon (right) */}
          <button 
            onClick={() => addToCart(item)} 
            className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors"
          >
            <FaShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuItemCard;
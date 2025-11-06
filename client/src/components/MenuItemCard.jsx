// src/components/MenuItemCard.jsx
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext'; // 1. Import useFavorites
import { FaHeart, FaRegHeart } from 'react-icons/fa'; // 2. Import heart icons

function MenuItemCard({ item }) {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites(); // 3. Get favorites functions

  return (
    <div className="border rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow relative">
      {/* 4. Add the heart icon button */}
      <button 
        onClick={() => toggleFavorite(item)} 
        className="absolute top-2 right-2 text-red-500 p-2 rounded-full hover:bg-gray-700"
      >
        {isFavorite(item.id) ? <FaHeart size={22} /> : <FaRegHeart size={22} />}
      </button>

      <h3 className="text-xl font-bold mb-2">{item.name}</h3>
      <p className="text-gray-600 mb-4">{item.description}</p>
      <div className="flex justify-between items-center">
        <span className="font-semibold text-lg">${item.price}</span>
        <button 
          onClick={() => addToCart(item)} 
          className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default MenuItemCard;
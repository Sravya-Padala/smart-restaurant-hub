// src/context/FavoritesContext.jsx
import { createContext, useState, useContext } from 'react';

const FavoritesContext = createContext({});

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Function to add or remove an item from favorites
  const toggleFavorite = (item) => {
    setFavorites((prevFavorites) => {
      const isAlreadyFavorite = prevFavorites.some((fav) => fav.id === item.id);
      if (isAlreadyFavorite) {
        // If it's already a favorite, remove it
        return prevFavorites.filter((fav) => fav.id !== item.id);
      } else {
        // Otherwise, add it to the list
        return [...prevFavorites, item];
      }
    });
  };

  // Helper function to check if an item is a favorite
  const isFavorite = (itemId) => {
    return favorites.some((fav) => fav.id === itemId);
  };

  const value = {
    favorites,
    toggleFavorite,
    isFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
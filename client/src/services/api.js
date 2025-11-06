import axios from 'axios';
import { supabase } from '../lib/supabaseClient';
// Define the base URL for your backend API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create an axios instance with the base URL
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- NEW: Axios Interceptor to add Auth Token ---
// This automatically adds the user's JWT token to requests if they are logged in.
apiClient.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- Define functions for each API endpoint ---

// Fetch all menu items or filter by category
export const getMenu = (category = '') => {
  const params = category ? { category } : {};
  return apiClient.get('/menu', { params });
};

// Fetch unique categories
export const getCategories = () => {
  return apiClient.get('/categories');
};

// Send a chat message
export const sendChatMessage = (message) => {
  return apiClient.post('/chat', { message });
};

// Submit the contact form
export const submitContactForm = (formData) => {
  return apiClient.post('/contact', formData);
};

// Submit the reservation form
export const submitReservation = (formData) => {
  return apiClient.post('/reservations', formData);
};

// Create a Stripe Payment Intent
export const createPaymentIntent = (items) => {
  // You might need to pass an auth token here in the future
  return apiClient.post('/create-payment-intent', { items });
};

// --- NEW: Cart API Functions ---
export const getCart = () => apiClient.get('/cart');
export const addToCart = (menuItemId, quantity = 1) => apiClient.post('/cart', { menu_item_id: menuItemId, quantity });
export const updateCartItemQuantity = (cartItemId, quantity) => apiClient.put(`/cart/${cartItemId}`, { quantity });
export const removeFromCart = (cartItemId) => apiClient.delete(`/cart/${cartItemId}`);

// --- NEW: Favorites API Functions ---
export const getFavorites = () => apiClient.get('/favorites');
export const addFavorite = (menuItemId) => apiClient.post('/favorites', { menu_item_id: menuItemId });
export const removeFavorite = (menuItemId) => apiClient.delete(`/favorites/${menuItemId}`);

// Export the configured axios instance if needed elsewhere (optional)
export default apiClient;
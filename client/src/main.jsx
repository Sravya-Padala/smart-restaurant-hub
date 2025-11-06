// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import MenuPage from './pages/MenuPage.jsx';
import LoginPage from './pages/LoginPage.jsx'; // Import LoginPage
import SignupPage from './pages/SignupPage.jsx';
import HomePage from './pages/HomePage';  // Import SignupPage
import { AuthProvider } from './context/AuthContext.jsx'; 
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx'; // Import new page
import UpdatePasswordPage from './pages/UpdatePasswordPage.jsx';
import ReservationPage from './pages/ReservationPage.jsx'; // Import new page
import AboutPage from './pages/AboutPage.jsx';             // Import new page
import ContactPage from './pages/ContactPage.jsx';// 
import { CartProvider } from './context/CartContext.jsx';
import CartPage from './pages/CartPage.jsx';
import { FavoritesProvider } from './context/FavoritesContext.jsx';
import FavoritesPage from './pages/FavoritesPage.jsx';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';

// --- Load Stripe ---
// Use the key from your environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> }, 
      { path: "/menu", element: <MenuPage /> },
      { path: "/login", element: <LoginPage /> },     // Add login route
      { path: "/signup", element: <SignupPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> }, // Add route
      { path: "/update-password", element: <UpdatePasswordPage /> },
      { path: "/reservation", element: <ReservationPage /> }, // Add route
      { path: "/about", element: <AboutPage /> },             // Add route
      { path: "/contact", element: <ContactPage /> }, 
      { path: "/cart", element: <CartPage /> },  
      { path: "/favorites", element: <FavoritesPage /> },
      { path: "/checkout", element: <CheckoutPage /> },
      { path: "/order-confirmation", element: <OrderConfirmationPage /> },
      
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider> 
          <Elements stripe={stripePromise}>
          <RouterProvider router={router} />
          </Elements>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>,
);
import React, { useState, useEffect } from 'react';
import { createPaymentIntent } from '../services/api';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';; 
import { useNavigate } from 'react-router-dom';

export default function CheckoutPage() {
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  useEffect(() => {
    if (cartItems.length > 0) {
      createPaymentIntent(cartItems)
        .then(res => {
          setClientSecret(res.data.clientSecret);
        })
        .catch(err => {
          console.error("Error fetching client secret:", err);
          setError("Could not initialize payment. Please try again.");
        });
    }
  }, [cartItems]);

  const handleCardChange = (event) => {
    setError(event.error ? event.error.message : "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements || !clientSecret) {
      setError("Payment system is not ready.");
      setProcessing(false);
      return;
    }

    const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: { name, email },
      },
    });

    if (paymentError) {
      setError(`Payment failed: ${paymentError.message}`);
      setProcessing(false);
    } else if (paymentIntent.status === 'succeeded') {
      setError(null);
      setProcessing(false);
      
      if (clearCart) {
        clearCart(); 
      }
      
      navigate('/order-confirmation');

    } else {
        setError(`Payment status: ${paymentIntent.status}.`);
        setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: { color: "#ffffff", fontSize: "16px", "::placeholder": { color: "#a0aec0" } },
      invalid: { color: "#fc8181", iconColor: "#fc8181" }
    },
    hidePostalCode: true
  };

  return (
    <div className="w-screen min-h-screen mx-auto flex items-center justify-center py-12 px-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Checkout</h2>

        <div className="mb-6 border-b border-gray-700 pb-4">
          <h3 className="text-xl font-semibold mb-2 text-white">Order Summary</h3>
          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between text-gray-300 text-sm mb-1">
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between text-white font-bold mt-2 text-lg">
            <span>Total:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center text-gray-400">Your cart is empty.</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-300 mb-2 text-sm">Name</label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" required className="w-full p-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm"/>
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-300 mb-2 text-sm">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" required className="w-full p-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm"/>
            </div>
            <div className="mb-6">
              <label className="block text-gray-300 mb-2 text-sm">Card Details</label>
              <div className="p-3 bg-gray-700 rounded-lg border-2 border-gray-600 focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500">
                <CardElement options={cardElementOptions} onChange={handleCardChange} />
              </div>
            </div>
            {error && (<div className="text-red-400 text-center text-sm mb-4 p-3 bg-red-900 bg-opacity-30 rounded-lg" role="alert">{error}</div>)}
            <button type="submit" disabled={processing || !stripe || !clientSecret} className="w-full bg-orange-600 text-white p-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors shadow-lg disabled:bg-gray-600 disabled:cursor-not-allowed">
              {processing ? "Processing..." : `Pay $${totalPrice.toFixed(2)}`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

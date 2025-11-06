import React from 'react';
import { Link } from 'react-router-dom';

export default function OrderConfirmationPage() {
  return (
    <div className="w-full max-w-2xl mx-auto py-16 px-4 text-center">
      <div className="bg-green-900 bg-opacity-30 border border-green-700 p-8 rounded-lg">
        <h1 className="text-4xl font-bold text-green-400 mb-4">Payment Successful!</h1>
        <p className="text-gray-300 mb-6">
          Thank you for your order. A confirmation email has been sent.
        </p>
        <Link 
          to="/menu" 
          className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
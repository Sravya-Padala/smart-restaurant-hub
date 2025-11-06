// src/pages/ForgotPasswordPage.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const { error } = await resetPassword(email);
      if (error) throw error;
      setMessage('Check your email for a password reset link.');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div 
      className="fixed inset-0 w-full flex items-center justify-center p-4 bg-gray-900"
      style={{
        backgroundImage: 'url(https://i.pinimg.com/736x/46/23/3f/46233f969bbfe40b5a8f5fe321e63f37.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
        
      }}
    >
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <form onSubmit={handleReset} className="w-full">
          <h2 className="text-2xl font-serif font-bold mb-6 text-center text-white">Reset your Password</h2>
          
          {error && (
            <p className="bg-red-500 bg-opacity-20 text-white p-3 mb-4 rounded border border-white">
              {error}
            </p>
          )}
          
          {message && (
            <p className="bg-green-500 bg-opacity-20 text-white p-3 mb-4 rounded border border-white">
              {message}
            </p>
          )}
          
          <p className="mb-6 text-gray-300 text-center">
            Enter your email address, and we'll send you a link to get back into your account.
          </p>
          
          <div className="mb-6">
            <label htmlFor="email" className="block font-serif text-gray-300 mb-2 text-sm">Email</label>
            <input 
              id="email"
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="example@gmail.com" 
              className="w-full p-3 italic bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-orange-600"
              required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full !bg-orange-600 text-white p-3 rounded-lg font-semibold hover:bg-white transition-colors shadow-lg"
          >
            Send Reset Link
          </button>
        </form>
        
        <p className="text-center mt-6 text-gray-300">
          Remembered your password? <Link to="/login" className="!text-orange-600 hover:text-white hover:underline font-semibold">Log In</Link>
        </p>
      </div>
    </div>
    
  );
}
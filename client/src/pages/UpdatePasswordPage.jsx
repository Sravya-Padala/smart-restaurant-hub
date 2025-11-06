// src/pages/UpdatePasswordPage.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function UpdatePasswordPage() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const { error } = await updatePassword(password);
      if (error) throw error;
      setMessage('Your password has been updated successfully!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
   <div 
      className="fixed inset-0 w-full flex items-center justify-center p-4 bg-gray-900"
      style={{
        backgroundImage: 'url(https://i.pinimg.com/1200x/f0/21/ed/f021edf8adac5b02c2bc5de2a94e2b95.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
        
      }}
    >
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <form onSubmit={handleUpdate} className="w-full">
          <h2 className="text-2xl font-serif font-bold mb-6 text-center text-white">Update your Password</h2>
          
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

          <div className="mb-4">
            <label htmlFor="password" className="block font-serif text-gray-300 mb-2 text-sm">New Password</label>
            <div className="relative">
              <input 
                id="password"
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="New Password" 
                className="w-full p-3 pr-12 italic bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-orange-600" 
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
              >
                {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block font-serif text-gray-300 mb-2 text-sm">Confirm Password</label>
            <div className="relative">
              <input 
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'} 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="Confirm Password" 
                className="w-full p-3 pr-12 italic bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-orange-600" 
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
              >
                {showConfirmPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full !bg-orange-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors shadow-lg"
          >
            Update Password
          </button>
        </form>
        
        <p className="text-center mt-6 text-gray-300">
          Remember your password? <Link to="/login" className="!text-orange-600 hover:text-blue-300 hover:underline font-semibold">Log In</Link>
        </p>
      </div>
    </div>
  );
}
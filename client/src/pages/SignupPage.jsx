import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function SignupPage() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const { data, error } = await signUp({ email, password });

      // Case 1: User already exists and is confirmed
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setError("This email has already been taken. Please log in.");
        return;
      }

      // Case 2: A different error occurred
      if (error) {
        throw error;
      }

      // Case 3: Successful signup
      if (data.user) {
        setMessage("Success! Please check your email for the verification link.");
      }
      
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div 
      className=" fixed inset-0 w-full flex items-center justify-center p-4 bg-gray-900"
      style={{
        backgroundImage: 'url("https://i.pinimg.com/1200x/cc/f3/7a/ccf37a9c13a91ecf93280ebf8b7cde74.jpg")',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
  
      }}
    >
      

      {/* Card container - centered with form */}
      <div className="w-full max-w-md bg-gray-800 bg-opacity-95 p-8 rounded-xl shadow-2xl border border-gray-700 relative z-10">
        <form onSubmit={handleSignup} className="w-full">
          <h2 className="text-2xl font-serif font-bold mb-6 text-center text-white">Create your Account</h2>
          
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
            <label htmlFor="email" className="block font-serif text-gray-300 mb-2 text-sm">Email</label>
            <input 
              id="email"
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="example@gmail.com" 
              className="w-full p-3 bg-gray-700 text-white border italic border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-orange-600"
              required 
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block font-serif text-gray-300 mb-2 text-sm">Password</label>
            <div className="relative">
              <input 
                id="password"
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="password" 
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

          <button 
            type="submit" 
            className="w-full !bg-orange-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors shadow-lg"
          >
            Sign Up
          </button>
        </form>
        
        <p className="text-center mt-6 text-gray-300">
          Already have an account? <Link to="/login" className="!text-orange-600 hover:text-blue-300 hover:underline font-semibold">Log In</Link>
        </p>
      </div>
    </div>
  );
}
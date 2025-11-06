import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginPage() {
  const { logIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { error } = await logIn({ email, password });
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setError("Incorrect email or password. Please try again.");
        } else { throw error; }
      } else {
        navigate('/menu');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    // Full viewport with background image on left
    <div 
      className="fixed inset-0 w-full flex items-center justify-center p-4 bg-gray-900"
      style={{
        backgroundImage: 'url(https://i.pinimg.com/736x/45/ea/8c/45ea8cbc73076a19d3e0eba55cf31922.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
        
      }}
    >
      {/* Dark overlay for better form visibility */}
      <div className="absolute inset-0 bg-black opacity-10"></div>

      {/* Card container - stays centered */}
      <div className="w-full max-w-md mx-auto bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 relative z-10">
        <form onSubmit={handleLogin} className="w-full">
          <h2 className="text-2xl font-serif font-bold mb-6 text-center text-white">Login to your Account</h2>
          
          {error && (
            <p className="bg-red-500 bg-opacity-20 text-white p-3 mb-4 rounded border border-white">
              {error}
            </p>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-300 font-serif mb-2 text-sm ">Email</label>
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
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-300 mb-2 text-sm font-serif">Password</label>
            <div className="relative">
              <input 
                id="password"
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="password" 
                className="w-full  italic p-3 pr-12 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-orange-600" 
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

          <div className="text-right mb-6">
            <Link to="/forgot-password" className="text-sm semi-serif !text-orange-600 hover:text-blue-300 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button 
            type="submit" 
            className="w-full !bg-orange-600 text-white p-3 rounded-lg font-semibold hover:bg-white transition-colors shadow-lg"
          >
            Log In
          </button>
        </form>
        
        <p className="text-center mt-6 text-gray-300">
          Don't have an account? <Link to="/signup" className="!text-orange-600  hover:text-black hover:underline font-semibold">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
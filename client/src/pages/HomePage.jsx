import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TestimonialSlider from '../components/TestimonialSlider';
import CountUpStats from '../components/CountUpStats'; 
import SpecialDishes from '../components/SpecialDishes';

const images = [
  'https://i.pinimg.com/1200x/d6/d9/5b/d6d95b30590bfb930bb644f1ea642fa6.jpg',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2960&auto=format&fit=crop', 
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=2881&auto=format&fit=crop', 
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=2880&auto=format&fit=crop', 
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2960&auto=format&fit=crop',
];

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); 
    return () => clearInterval(timer);
  }, []);

  const handleViewMenuClick = () => {
    if (user) {
      navigate('/menu');
    } else {
      navigate('/login');
    }
  };

  return (
    // Wrap everything in a React Fragment <>...</> so we can add the slider after the hero
    <>
      {/* --- Full-Screen Hero Section --- */}
      <div className="relative w-full xl:w-[1520px] h-[82vh] overflow-hidden">
        {/* Image Slider */}
        {images.map((url, index) => (
          <div
            key={index}
            className="absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out"
            style={{ opacity: index === currentImageIndex ? 1 : 0 }}
          >
            <img src={url} alt={`Restaurant food slide ${index + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      
        {/* Centered Text and Button Content */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center text-white p-4">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 leading-tight drop-shadow-lg">
            Welcome to Our Restaurant!
          </h1>
          <p className="text-lg sm:text-xl mb-8 max-w-2xl drop-shadow-md">
            The best food in town, made fresh for you.
          </p>
          <button 
            onClick={handleViewMenuClick} 
            className="bg-orange-500 text-white px-8 py-3 rounded-full text-xl hover:bg-orange-600 transition-transform transform hover:scale-105 shadow-lg"
          >
            View Our Menu
          </button>
        </div>
      </div>

      <div className="relative w-full">
        <svg 
          className="absolute bottom-0 w-full" 
          viewBox="0 0 1440 120" 
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block' }}
        >
          <path 
            fill="#000000" 
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          />
        </svg>
      </div>
      
      <SpecialDishes />
      <TestimonialSlider />
    <CountUpStats/>
    </>
  );
}
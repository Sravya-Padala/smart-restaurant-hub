import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- Links and Logos for Delivery Services ---
const deliveryServices = [
  { 
    url: 'https://www.doordash.com/', 
    logo: 'https://cdn.worldvectorlogo.com/logos/doordash-logo.svg', // White logo
    position: 'top-[15%] left-1/2 -translate-x-1/2', // Middle & Above
    delay: 0
  },
  { 
    url: 'https://www.toasttab.com/',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Toast_logo.svg', // White logo
    position: 'top-[40%] right-4', // Extreme right
    delay: 0.2
  },
  { 
    url: 'https://www.ubereats.com/',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Uber_Eats_logo_2020.svg', // White/Green logo
    position: 'top-[40%] left-4', // Extreme Left & Down
    delay: 0.4
  },
];

// Floating animation for the bubbles
const floatAnimation = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function OrderPage() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/menu'); // Go back to menu page
  };

  return (
    // Container is relative, filling the available space defined by App.jsx
    <div className="relative w-full  h-full min-h-[80vh] overflow-hidden bg-gray-900">
      
      {/* Background Image (Optional, keeping it dark/blurred) */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2874&auto=format&fit=crop')",
          filter: 'blur(10px) brightness(0.4)' 
        }}
      ></div>
      
      {/* The Bubbles */}
      <div className="relative w-full min-h-screen z-30 mt-12"> {/* mt-12 to push below title */}
        {deliveryServices.map((service) => (
          <motion.a
            key={service.name}
            href={service.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`absolute flex flex-col items-center justify-center 
                       w-32 h-32 md:w-40 md:h-40 
                       bg-gray-800 bg-opacity-90 border-2 border-orange-500 rounded-full 
                       shadow-[0_0_20px_rgba(249,115,22,0.5)] 
                       ${service.position}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, y: [0, -10, 0] }} // Scale in + Float
            transition={{ 
              scale: { duration: 0.5, delay: service.delay },
              y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: service.delay } // Continuous float
            }}
            whileHover={{ scale: 1.1, borderColor: '#fff' }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Logo */}
            <img 
              src={service.logo} 
              alt={`${service.name} logo`} 
              className="h-8 md:h-10 mb-2 object-contain w-20" 
            />
            {/* Name */}
            <span className="text-xs md:text-sm font-semibold text-white">
              {service.name}
            </span>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
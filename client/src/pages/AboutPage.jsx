import React from 'react';

const mainDishImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2900&auto=format&fit=crop';
const satelliteDishImages = [
 'https://www.cubesnjuliennes.com/wp-content/uploads/2020/01/Chicken-Biryani.jpg',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2960&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=2880&auto=format&fit=crop',
  'https://www.cubesnjuliennes.com/wp-content/uploads/2020/01/Chicken-Biryani.jpg',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=2880&auto=format&fit=crop',
  'https://www.cubesnjuliennes.com/wp-content/uploads/2020/01/Chicken-Biryani.jpg',
   'https://www.cubesnjuliennes.com/wp-content/uploads/2020/01/Chicken-Biryani.jpg'
];

export default function AboutPage() {
  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes revolve {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
      
      .orbit-container {
        animation: revolve 25s linear infinite;
      }
      
      .satellite-item {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
      
      .satellite-item img {
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="relative w-screen min-h-screen flex items-center justify-center bg-gray-900 text-white overflow-x-hidden py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 opacity-95"></div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between p-4 sm:p-6 md:p-8 gap-8 lg:gap-12">
        
        {/* Left Section: About Us Text */}
        <div className="flex-1 text-center lg:text-left w-full lg:w-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 text-orange-500 drop-shadow-lg">About Us</h1>
          <p className="text-base sm:text-lg md:text-xl leading-relaxed mb-6 text-gray-300 max-w-xl mx-auto lg:mx-0">
            Welcome to Smart Restaurant Hub, where culinary passion meets modern innovation. We believe in crafting unforgettable dining experiences with fresh, high-quality ingredients and a commitment to exceptional service.
          </p>
          <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 text-sm sm:text-base">
            Our Story
          </button>
        </div>

        {/* Right Section: Rotating Dishes */}
        <div className="flex-1 relative flex items-center justify-center w-full lg:w-auto">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center">
            
            {/* Main Dish */}
            <div className="absolute z-20 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-2xl">
              <img src={mainDishImage} alt="Main Dish" className="w-full h-full object-cover" />
            </div>

            {/* Orbit Container with Dashed Circle and Rotating Dishes */}
            <div className="absolute w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 orbit-container">
              
              {/* Dashed Circle */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 300">
                <circle
                  cx="150"
                  cy="150"
                  r="140"
                  fill="none"
                  stroke="#4a5568"
                  strokeWidth="2"
                  strokeDasharray="15 10"
                  strokeLinecap="round"
                />
              </svg>
              
              {/* Satellite Dishes - Positioned around the circle */}
              {satelliteDishImages.map((src, index) => {
                const angle = (index / satelliteDishImages.length) * 360;
                const radius = 140;
                const x = 150 + radius * Math.cos((angle - 90) * Math.PI / 180);
                const y = 150 + radius * Math.sin((angle - 90) * Math.PI / 180);
                
                return (
                  <div 
                    key={index} 
                    className="absolute w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-xl"
                    style={{ 
                      left: `${(x / 300) * 100}%`,
                      top: `${(y / 300) * 100}%`,
                      transform: 'translate(-50%, -50%)',
                      transformOrigin: 'center'
                    }}
                  >
                    <img src={src} alt={`Dish ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
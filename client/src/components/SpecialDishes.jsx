import React from 'react';

// Sample images for your special dishes (Replace with your own)
const dishImages = [
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=400&auto=format&fit=crop', // Pizza
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop', // Salad Bowl
  'https://images.unsplash.com/photo-1631515243349-ae1e2ab536f7?q=80&w=400&auto=format&fit=crop', // Biryani
  'https://in.pinterest.com/pin/293508100735751457/', // Pancakes
  'https://i.pinimg.com/1200x/72/a5/cf/72a5cf365358e16c17c6fb6abc8c72e9.jpg', // Grilled Meat
  'https://in.pinterest.com/pin/16395986139506558/', // Curry Dish
  'https://in.pinterest.com/pin/684899055871932069/', // Soup
];

export default function SpecialDishes() {
  // Duplicate the images to create a seamless looping effect
  const extendedImages = [...dishImages, ...dishImages];

  return (
    // Main section container with black background and reduced vertical padding
    <div className="bg-black text-white py-8 sm:py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Heading */}
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-orange-500">
          Our Specials
        </h2>

        {/* Scrolling Images Container */}
        {/* overflow-hidden hides the images outside this container */}
        <div className="w-full overflow-hidden relative group">
          {/* Inner container that holds and animates the images */}
          {/* Uses flex and animation defined in index.css */}
          <div className="flex animate-scroll-left group-hover:pause-animation">
            {extendedImages.map((src, index) => (
              <div key={index} className="flex-shrink-0 w-64 h-64 mx-3 rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={src} 
                  alt={`Special dish ${index + 1}`} 
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300" 
                />
              </div>
            ))}
          </div>
           {/* Optional: Add gradient overlays for fade effect */}
          <div className="absolute top-0 left-0 bottom-0 w-16 bg-gradient-to-r from-black to-transparent pointer-events-none"></div>
          <div className="absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
}
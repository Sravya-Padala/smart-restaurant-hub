import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaQuoteLeft } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  { quote: "Absolutely amazing food! The biryani was perfection, and the service was top-notch. Can't wait to come back.", author: "Samantha Lee" },
  { quote: "A hidden gem! Authentic flavors, generous portions, and a cozy atmosphere. Highly recommend the butter chicken.", author: "David Chen" },
  { quote: "My new favorite spot for Indian cuisine. Every dish we tried was fresh, flavorful, and beautifully presented.", author: "Maria Garcia" },
  { quote: "From the appetizers to the desserts, everything was exceptional. The Gulab Jamun was the perfect ending to a wonderful meal.", author: "John Smith" }
];

const sectionBackgroundImage = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2940&auto-format&fit=crop';

const variants = {
  enter: (direction) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: (direction) => ({ zIndex: 0, x: direction < 0 ? 50 : -50, opacity: 0 }),
};

export default function TestimonialSlider() {
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection) => {
    setPage([(page + newDirection + testimonials.length) % testimonials.length, newDirection]);
  };

  useEffect(() => {
    const timer = setInterval(() => paginate(1), 5000);
    return () => clearInterval(timer);
  }, [page]);

  const testimonialIndex = page;

  return (
    <div 
      className="relative w-full py-16 sm:py-24 bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${sectionBackgroundImage})`, backgroundAttachment: "fixed" }} 
    >
      {/* --- ADDED backdrop-filter: blur() TO THE OVERLAY --- */}
      <div className="absolute inset-0 bg-opacity-70 backdrop-blur-xs"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        
        <h2 className="text-4xl sm:text-5xl font-serif font-bold text-orange-400 mb-4 drop-shadow-lg">
          Our Customer Says
        </h2>
        
        <FaQuoteLeft className="text-orange-500 text-5xl mx-auto mb-6" />

        {/* --- THIS IS THE NEW, CORRECTED CONTAINER FOR THE SLIDER MECHANISM --- */}
        <div className="relative max-w-2xl mx-auto">
          
          {/* Review Box */}
          <div className="relative bg-gray-800 bg-opacity-70 backdrop-blur-sm p-8 pb-16 rounded-lg shadow-xl min-h-[280px] flex flex-col items-center justify-center border border-gray-700 overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={page}
                custom={direction}
                variants={variants}
                transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.3 } }}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute w-full px-8"
              >
                <p className="text-lg sm:text-xl italic mb-4 text-gray-200">
                  "{testimonials[testimonialIndex].quote}"
                </p>
                <p className="font-semibold text-orange-400 text-lg">
                  - {testimonials[testimonialIndex].author}
                </p>
              </motion.div>
            </AnimatePresence>
            
            <div className="absolute bottom-6 flex justify-center space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setPage([index, index > page ? 1 : -1])}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${testimonialIndex === index ? 'bg-orange-500 scale-150' : 'bg-gray-600 hover:bg-gray-400'}`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Arrow Buttons - Positioned relative to the new container */}
          <button 
              onClick={() => paginate(-1)} 
              className="absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 bg-gray-700 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition duration-300 z-20"
              aria-label="Previous testimonial"
          >
              <FaChevronLeft />
          </button>
          <button 
              onClick={() => paginate(1)} 
              className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 bg-gray-700 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition duration-300 z-20"
              aria-label="Next testimonial"
          >
              <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
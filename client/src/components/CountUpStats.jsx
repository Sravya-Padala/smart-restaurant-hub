import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

// Data for our counters
const stats = [
  { icon: '', end: 4372, label: 'Chicken Served' },
  { icon: '', end: 3795, label: 'Fish Fried' },
  { icon: '', end: 394, label: 'Our Chefs' },
  { icon: '', end: 1678, label: 'Soup Served' },
];

// Reusable animated number component
const AnimatedCounter = ({ end }) => {
  const [count, setCount] = useState(0);
  const duration = 2000; // 2 seconds

  useEffect(() => {
    let start = 0;
    const endValue = parseInt(end);
    if (start === endValue) return;

    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * endValue));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end]);

  return <span className="text-5xl md:text-6xl font-bold">{count.toLocaleString()}</span>;
};

// Main component for the stats section
export default function CountUpStats() {
  const { ref, inView } = useInView({
    triggerOnce: true, // Only trigger the animation once
    threshold: 0.3,    // Trigger when 30% of the element is visible
  });

  return (
    <div 
      ref={ref}
      className="relative w-full py-16 sm:py-24 bg-cover bg-center text-white  "
      style={{ backgroundImage: `url('/countstat_bg.jpeg')` }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        
        {/* Title Section */}
        <h2 className="text-4xl sm:text-5xl font-serif font-bold text-orange-400 mb-4 drop-shadow-lg">
          We Are Delicious Restaurant
        </h2>
        <div className="w-24 h-1 bg-orange-500 mx-auto mb-12"></div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="text-5xl mb-4 text-orange-300">{stat.icon}</div>
              {inView ? <AnimatedCounter end={stat.end} /> : <span className="text-5xl md:text-6xl font-bold">0</span>}
              <p className="mt-2 text-gray-300 font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
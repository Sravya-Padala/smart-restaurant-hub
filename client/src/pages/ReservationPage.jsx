import { useState, useEffect } from 'react';
import { submitReservation } from '../services/api';

// The biryani image you requested for the background
const backgroundImageUrl = 'https://www.cubesnjuliennes.com/wp-content/uploads/2020/01/Chicken-Biryani.jpg';

export default function ReservationPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    guests: '',
    date: '',
    time: '',
    requests: ''
  });
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status && status !== 'Submitting...') {
      const timer = setTimeout(() => setStatus(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({ ...prevState, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');
    setIsSubmitting(true);
    try {
      const response = await submitReservation(formData);
      setStatus(response.data.message);
      setFormData({ name: '', email: '', guests: '', date: '', time: '', requests: '' });
    } catch (error) {
      console.error("Reservation submission error:", error);
      setStatus('Failed to confirm reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // This is the main full-screen container that centers its content
    <div className="relative w-screen h-screen flex items-center justify-center p-4">
      
      {/* 1. Background Image Layer */}
      {/* This div fills the entire screen and displays the blurred image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center" 
        style={{ 
          backgroundImage: `url(${backgroundImageUrl})`, 
          filter: 'blur(8px)' // This creates the blur effect
        }}
      ></div>

    

      {/* 3. Form Container Layer */}
      {/* This is your existing code, now placed on top with `relative z-10` */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gray-800 bg-opacity-95 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl border border-orange-500 border-opacity-60 hover:border-opacity-100 transition-all duration-300">
          
          <div className="text-center mb-6">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-2 text-white">Reserve a Table</h2>
            <p className="text-gray-300 text-sm sm:text-base">Fill out the form to book your table</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Name and Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-gray-300 mb-2 text-xs sm:text-sm font-medium">Name</label>
                <input id="name" type="text" value={formData.name} onChange={handleChange} placeholder="Your Name" required className="w-full p-2.5 sm:p-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-30 transition-all duration-300 hover:border-orange-400 text-sm" />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-300 mb-2 text-xs sm:text-sm font-medium">Email</label>
                <input id="email" type="email" value={formData.email} onChange={handleChange} placeholder="Your Email" required className="w-full p-2.5 sm:p-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-30 transition-all duration-300 hover:border-orange-400 text-sm" />
              </div>
            </div>

            {/* Guests, Date, and Time Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="guests" className="block text-gray-300 mb-2 text-xs sm:text-sm font-medium">Guests</label>
                <input id="guests" type="number" value={formData.guests} onChange={handleChange} min="1" placeholder="e.g., 4" required className="w-full p-2.5 sm:p-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-30 transition-all duration-300 hover:border-orange-400 text-sm" />
              </div>
              <div>
                <label htmlFor="date" className="block text-gray-300 mb-2 text-xs sm:text-sm font-medium">Date</label>
                <input id="date" type="date" value={formData.date} onChange={handleChange} required className="w-full p-2.5 sm:p-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-30 transition-all duration-300 hover:border-orange-400 text-sm" />
              </div>
              <div>
                <label htmlFor="time" className="block text-gray-300 mb-2 text-xs sm:text-sm font-medium">Time</label>
                <input id="time" type="time" value={formData.time} onChange={handleChange} required className="w-full p-2.5 sm:p-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-30 transition-all duration-300 hover:border-orange-400 text-sm" />
              </div>
            </div>

            {/* Special Requests */}
            <div className="mb-4">
              <label htmlFor="requests" className="block text-gray-300 mb-2 text-xs sm:text-sm font-medium">Special Requests (Optional)</label>
              <textarea id="requests" value={formData.requests} onChange={handleChange} placeholder="e.g., window seat, high chair" rows="2" className="w-full p-2.5 sm:p-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-30 transition-all duration-300 hover:border-orange-400 resize-none text-sm"></textarea>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-3 rounded-lg font-bold text-sm sm:text-base hover:from-orange-600 hover:to-yellow-600 active:from-orange-700 active:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95">
              {isSubmitting ? 'Submitting...' : 'Confirm Reservation'}
            </button>

            {/* Status Message */}
            {status && status !== 'Submitting...' && (
              <p className={`text-center mt-4 text-xs sm:text-sm font-medium transition-all duration-300 ${status.includes('Failed') ? 'text-red-400' : 'text-green-400'}`}>
                {status}
              </p>
            )}
          </form>
        </div>  
      </div>
    </div>
  );
}


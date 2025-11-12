import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

// A high-quality, dark background image for the footer
const footerBackgroundImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2940&auto=format&fit=crop';

export default function Footer() {
  return (
    // The main footer element now acts as a wrapper for both sections
    <footer className="bg-gray-900">
      
      {/* --- Section 1: Main Footer Content with Background Image --- */}
      <div 
        className="relative text-gray-300 py-3 px-4" // REDUCED HEIGHT: py-16 is now py-12
        style={{ backgroundImage: `url(${footerBackgroundImage})` }}
      >
        {/* Dark overlay to ensure text is readable */}
        <div className="absolute inset-0 bg-black opacity-80"></div>

        {/* Main content container */}
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20"> {/* INCREASED GAP: gap-12 is now gap-16 */}
            
            {/* Column 1: About Us Section */}
            <div className="md:col-span-2 lg:col-span-1">
              <h4 className="text-xl font-bold text-white mb-4 border-b-2 border-orange-500 pb-2 inline-block">
                About Us
              </h4>
              <p className="leading-relaxed mb-6 text-gray-400 text-sm">
                Smart Restaurant Hub is where culinary passion meets modern innovation. We craft unforgettable dining experiences with fresh ingredients and exceptional service.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-9 h-9 flex items-center justify-center bg-gray-700 rounded-full hover:bg-orange-500 hover:text-white transition-all duration-300"><FaFacebookF /></a>
                <a href="#" className="w-9 h-9 flex items-center justify-center bg-gray-700 rounded-full hover:bg-orange-500 hover:text-white transition-all duration-300"><FaTwitter /></a>
                <a href="#" className="w-9 h-9 flex items-center justify-center bg-gray-700 rounded-full hover:bg-orange-500 hover:text-white transition-all duration-300"><FaInstagram /></a>
                <a href="#" className="w-9 h-9 flex items-center justify-center bg-gray-700 rounded-full hover:bg-orange-500 hover:text-white transition-all duration-300"><FaLinkedinIn /></a>
              </div>
            </div>

            {/* Column 2: Working Time Section */}
            <div>
              <h4 className="text-xl font-bold text-white mb-4 border-b-2 border-orange-500 pb-2 inline-block">
                Working Time
              </h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex justify-between"><span>Mon - Tue:</span><span className="font-semibold text-white">09:00 - 22:00</span></li>
                <li className="flex justify-between"><span>Wed:</span><span className="font-semibold text-white">08:30 - 20:30</span></li>
                <li className="flex justify-between"><span>Thu - Fri:</span><span className="font-semibold text-white">09:45 - 19:55</span></li>
                <li className="flex justify-between"><span>Saturday:</span><span className="font-semibold text-white">10:00 - 20:45</span></li>
                <li className="flex justify-between"><span>Sunday:</span><span className="font-semibold text-white">08:00 - 19:10</span></li>
                <li className="flex justify-between"><span>sunday:</span><span className="font-semibold text-red-400">Closed</span></li>
              </ul>
            </div>

            {/* Column 3: Newsletter Section */}
            <div>
              <h4 className="text-xl font-bold text-white mb-4 border-b-2 border-orange-500 pb-2 inline-block">
                Newsletter
              </h4>
              <p className="mb-4 text-gray-400 text-sm">
                Sign up to get fresh updates about our events & offers.
              </p>
              <div className="flex flex-col gap-2">
                <input 
                  type="email" 
                  placeholder="Enter Your Email" 
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" 
                />
                <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105">
                  Sign Up
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* --- Section 2: Separate Copyright Bar --- */}
      <div className="bg-gray-800 py-4 text-center text-gray-500 text-xs">
        <p>&copy; {new Date().getFullYear()} Smart Restaurant Hub. All rights reserved.</p>
      </div>
    </footer>
  );
  
}
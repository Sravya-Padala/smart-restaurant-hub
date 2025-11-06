import { useState } from 'react';
import { submitContactForm } from '../services/api';
import { FaPhoneAlt, FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const headerImageUrl = 'https://www.cubesnjuliennes.com/wp-content/uploads/2020/01/Chicken-Biryani.jpg';

const ContactInfoCard = ({ icon, title, detail }) => (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg flex flex-col sm:flex-row items-center sm:items-start gap-4 shadow-md hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-1">
        <div className="text-orange-500 text-2xl sm:text-3xl flex-shrink-0">{icon}</div>
        <div className="text-center sm:text-left">
            <h3 className="font-bold text-base sm:text-lg text-white">{title}</h3>
            <p className="text-gray-400 text-sm sm:text-base">{detail}</p>
        </div>
    </div>
);

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Sending...');
        setIsSubmitting(true);
        try {
            const response = await submitContactForm(formData);
            setStatus(response.data.message);
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error("Contact form submission error:", error);
            setStatus('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-screen min-h-screen bg-gray-900 overflow-x-hidden">
            {/* Header Section */}
            <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-80 flex items-center justify-center text-center p-4 overflow-hidden">
                <div 
                    className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-500 ease-in-out transform hover:scale-105" 
                    style={{ backgroundImage: `url(${headerImageUrl})`, filter: 'brightness(50%)' }}
                ></div>
                <div className="relative z-10 text-white px-4">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg">Contact Us</h1>
                    <p className="text-base sm:text-lg md:text-xl max-w-2xl drop-shadow-md">We'd love to hear from you! Reach out with any questions or to make a reservation.</p>
                </div>
            </div>

            {/* Contact Details & Form Section */}
            <div className="w-full py-8 sm:py-10 md:py-12 lg:py-16 px-3 sm:px-4 md:px-6 lg:px-8 bg-gray-900">
                <div className="w-full max-w-7xl mx-auto">
                    {/* Mobile: Stacked Layout */}
                    <div className="w-full flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12">
                        {/* Left Column - Contact Info */}
                        <div className="w-full lg:w-1/2 flex flex-col gap-6">
                            {/* Contact Cards Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <ContactInfoCard icon={<FaPhoneAlt />} title="Phone" detail="207-8767-452" />
                                <ContactInfoCard icon={<FaWhatsapp />} title="WhatsApp" detail="082-123-234-345" />
                                <ContactInfoCard icon={<FaEnvelope />} title="Email" detail="support@gmail.com" />
                                <ContactInfoCard icon={<FaMapMarkerAlt />} title="Our Shop" detail="2443 Oak Ridge, Leander, TX" />
                            </div>

                            {/* Map Section */}
                            <div className="w-full h-64 sm:h-72 md:h-80 rounded-lg overflow-hidden shadow-lg hover:shadow-orange-500/30 transition-shadow duration-300">
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110034.40020708688!2d-97.94273392434575!3d30.56133282672522!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x865b20104859f531%3A0x776c5b96716a135a!2sLeander%2C%20TX!5e0!3m2!1sen!2sus!4v1668102392039!5m2!1sen!2sus" 
                                    width="100%" 
                                    height="100%" 
                                    style={{ border: 0 }} 
                                    allowFullScreen="" 
                                    loading="lazy" 
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="w-full h-full"
                                ></iframe>
                            </div>
                        </div>

                        {/* Right Column - Form */}
                        <div className="w-full lg:w-1/2 bg-gray-800 p-5 sm:p-6 md:p-8 rounded-lg shadow-lg border border-orange-500 border-opacity-30 hover:border-opacity-100 transition-all duration-300">
                            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white">Get In Touch</h2>
                            <p className="text-gray-400 mb-6 text-sm sm:text-base">Have a question? Feel free to contact us.</p>
                            
                            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                                {/* Name and Email Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <input 
                                            type="text" 
                                            name="name" 
                                            value={formData.name} 
                                            onChange={handleChange} 
                                            placeholder="Your Name" 
                                            required 
                                            className="w-full p-3 sm:p-4 bg-gray-700 text-white rounded border-2 border-gray-600 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-30 transition-all duration-300 hover:border-orange-400 text-sm sm:text-base"
                                        />
                                    </div>
                                    <div>
                                        <input 
                                            type="email" 
                                            name="email" 
                                            value={formData.email} 
                                            onChange={handleChange} 
                                            placeholder="Your Email" 
                                            required 
                                            className="w-full p-3 sm:p-4 bg-gray-700 text-white rounded border-2 border-gray-600 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-30 transition-all duration-300 hover:border-orange-400 text-sm sm:text-base"
                                        />
                                    </div>
                                </div>

                                {/* Subject */}
                                <div>
                                    <input 
                                        type="text" 
                                        name="subject" 
                                        value={formData.subject} 
                                        onChange={handleChange} 
                                        placeholder="Subject" 
                                        required 
                                        className="w-full p-3 sm:p-4 bg-gray-700 text-white rounded border-2 border-gray-600 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-30 transition-all duration-300 hover:border-orange-400 text-sm sm:text-base"
                                    />
                                </div>

                                {/* Message */}
                                <div>
                                    <textarea 
                                        name="message" 
                                        value={formData.message} 
                                        onChange={handleChange} 
                                        placeholder="Your Message" 
                                        rows="4" 
                                        required 
                                        className="w-full p-3 sm:p-4 bg-gray-700 text-white rounded border-2 border-gray-600 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-30 transition-all duration-300 hover:border-orange-400 resize-none text-sm sm:text-base"
                                    ></textarea>
                                </div>

                                {/* Submit Button */}
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-3 sm:p-4 rounded-lg text-base sm:text-lg font-bold hover:from-orange-600 hover:to-yellow-600 active:from-orange-700 active:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Now'}
                                </button>

                                {/* Status Message */}
                                {status && (
                                    <p className={`text-center text-sm sm:text-base font-medium transition-all duration-300 ${status.includes('Failed') ? 'text-red-400' : 'text-green-400'}`}>
                                        {status}
                                    </p>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
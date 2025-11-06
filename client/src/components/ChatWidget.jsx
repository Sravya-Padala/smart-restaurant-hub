import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/api';
import { FaPaperPlane, FaTimes, FaRobot } from 'react-icons/fa';

export default function ChatWidget({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! How can I help you with our menu or reservations today?' } 
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null); 

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    const userMessage = input.trim();
    if (!userMessage) return;

    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(userMessage);
      const aiReply = response.data.reply;
      const newOptions = response.data.options;
      setMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
      if (newOptions?.length > 0) {
        setMessages(prev => [...prev, { sender: 'ai', type: 'options', options: newOptions }]);
      }
    } catch (error) { 
      console.error("Chat send error:", error); 
      setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); 
      handleSend();
    }
  };

  if (!isOpen) return null; 

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-80 h-[450px] bg-gray-800 rounded-lg shadow-xl border border-gray-700 flex flex-col z-50">
      {/* Header */}
      <div className="flex justify-between items-center p-3 bg-gray-700 rounded-t-lg">
        <div className="flex items-center gap-2">
            <FaRobot className="text-orange-400" />
            <h3 className="font-semibold text-white">Chat Assistant</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <FaTimes />
        </button>
      </div>

      {/* Message Display Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'}`}>
            <div 
              className={`max-w-[75%] p-2 rounded-lg text-sm ${
                msg.sender === 'ai' 
                  ? 'bg-gray-600 text-white' 
                  : 'bg-orange-600 text-white'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-gray-600 text-white p-2 rounded-lg text-sm italic">Typing...</div>
          </div>
        )}
        <div ref={messagesEndRef} /> 
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-gray-700 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about the menu..."
          className="flex-1 p-2 bg-gray-600 rounded border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 text-sm"
          disabled={isLoading}
        />
        <button 
          onClick={handleSend} 
          className="bg-orange-600 hover:bg-orange-700 text-white p-2 rounded disabled:bg-gray-500"
          disabled={isLoading || !input.trim()}
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}
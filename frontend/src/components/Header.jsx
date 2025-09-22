import React from 'react';
import { Train, Phone, Mail } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-purple-900 text-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Top bar */}
        <div className="flex justify-between items-center py-2 text-sm border-b border-blue-700">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Phone size={14} />
              <span>24/7 Helpline: 139</span>
            </div>
            <div className="flex items-center space-x-1">
              <Mail size={14} />
              <span>support@railwaybook.com</span>
            </div>
          </div>
          <div className="flex space-x-4">
            <button className="hover:text-blue-200 transition-colors">Login</button>
            <button className="hover:text-blue-200 transition-colors">Sign Up</button>
          </div>
        </div>

        {/* Main header */}
        <div className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Train size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">RailBook</h1>
                <p className="text-blue-200 text-sm">Your Journey, Our Priority</p>
              </div>
            </div>

            <nav className="hidden md:flex space-x-8">
              <a href="#" className="hover:text-blue-200 transition-colors font-medium">Home</a>
              <a href="#" className="hover:text-blue-200 transition-colors font-medium">My Bookings</a>
              <a href="#" className="hover:text-blue-200 transition-colors font-medium">Train Status</a>
              <a href="#" className="hover:text-blue-200 transition-colors font-medium">Contact</a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

import React, { useState } from 'react';
import {  Train, Phone, Mail, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-purple-900 text-white relative z-40">
        <div className="max-w-6xl mx-auto px-4">
          {/* Main header */}
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-500  p-2 rounded-lg">
            
                  <Train size={32} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">RailBook</h1>
                  <p className="text-blue-200 text-sm">Your Journey, Our Priority</p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-8">
                <Link to="/" className="hover:text-blue-200 transition-colors font-medium">Home</Link>
                <Link to="/bookings" className="hover:text-blue-200 transition-colors font-medium">My Bookings</Link>
                <Link to="/status" className="hover:text-blue-200 transition-colors font-medium">Train Status</Link>
                <Link to="/contact" className="hover:text-blue-200 transition-colors font-medium">Contact</Link>
                <Link to="/login" className="hover:text-blue-200 transition-colors font-medium">Login</Link>
              </nav>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleSidebar}
                className="md:hidden p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
                aria-label="Toggle menu"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>

          {/* Contact info bar - shows only on desktop */}
          <div className="hidden md:flex  py-3 text-sm border-t border-blue-700 ">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-1">
                <Phone size={14} />
                <span>24/7 Helpline: 139</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail size={14} />
                <span>support@railwaybook.com</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-blue-900 to-purple-900 text-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <Train size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold">RailBook</h2>
                <p className="text-blue-200 text-xs">Your Journey, Our Priority</p>
              </div>
            </div>
            <button
              onClick={closeSidebar}
              className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Contact Info */}
          <div className="mb-8 p-4 bg-white bg-opacity-10 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Phone size={16} />
              <span className="text-sm">24/7 Helpline: 139</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail size={16} />
              <span className="text-sm">support@railwaybook.com</span>
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="space-y-4">
            <Link
              to="/"
              onClick={closeSidebar}
              className="flex items-center py-3 px-4 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              to="/bookings"
              onClick={closeSidebar}
              className="flex items-center py-3 px-4 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors font-medium"
            >
              My Bookings
            </Link>
            <Link
              to="/status"
              onClick={closeSidebar}
              className="flex items-center py-3 px-4 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors font-medium"
            >
              Train Status
            </Link>
            <Link
              to="/contact"
              onClick={closeSidebar}
              className="flex items-center py-3 px-4 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors font-medium"
            >
              Contact
            </Link>
            <Link
              to="/login"
              onClick={closeSidebar}
              className="flex items-center py-3 px-4 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors font-medium "
            >
              Login
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;
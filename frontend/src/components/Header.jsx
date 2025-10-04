import React, { useState, useEffect } from 'react';
import { Train, Phone, Mail, Menu, X, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Load user info from localStorage on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) setCurrentUser(user);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setCurrentUser(null);
    setIsDropdownOpen(false);
    navigate('/login');
  };

  return (
    <>
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-purple-900 text-white relative z-40">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-orange-500 p-2 rounded-lg">
              <Train size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">RailBook</h1>
              <p className="text-blue-200 text-sm">Your Journey, Our Priority</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="hover:text-blue-200 transition-colors font-medium">Home</Link>
            <Link to="/bookings" className="hover:text-blue-200 transition-colors font-medium">My Bookings</Link>
            <Link to="/status" className="hover:text-blue-200 transition-colors font-medium">Train Status</Link>
            <Link to="/contact" className="hover:text-blue-200 transition-colors font-medium">Contact</Link>

            {/* Login/Profile */}
            {!currentUser ? (
              <Link to="/login" className="hover:text-blue-200 transition-colors font-medium">Login</Link>
            ) : (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition"
                >
                  <span>👤</span>
                  <span>{currentUser.username}</span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-gray-200">
                      <p className="font-semibold">{currentUser.name}</p>
                      <p className="text-sm text-gray-500">{currentUser.email}</p>
                      <p className="text-sm text-gray-500">Role: {currentUser.role}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-start space-x-2 px-4 py-2 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Contact info bar */}
        <div className="hidden md:flex py-3 text-sm border-t border-blue-700">
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
      </header>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleSidebar} />
          <div className={`fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-blue-900 to-purple-900 text-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-6">
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
                <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <nav className="space-y-4">
                <Link to="/" onClick={toggleSidebar} className="block py-3 px-4 hover:bg-white hover:bg-opacity-20 rounded-lg">Home</Link>
                <Link to="/bookings" onClick={toggleSidebar} className="block py-3 px-4 hover:bg-white hover:bg-opacity-20 rounded-lg">My Bookings</Link>
                <Link to="/status" onClick={toggleSidebar} className="block py-3 px-4 hover:bg-white hover:bg-opacity-20 rounded-lg">Train Status</Link>
                <Link to="/contact" onClick={toggleSidebar} className="block py-3 px-4 hover:bg-white hover:bg-opacity-20 rounded-lg">Contact</Link>

                {!currentUser ? (
                  <Link to="/login" onClick={toggleSidebar} className="block py-3 px-4 hover:bg-white hover:bg-opacity-20 rounded-lg">Login</Link>
                ) : (
                  <div className="relative">
                    <button onClick={toggleDropdown} className="flex items-center space-x-2 py-3 px-4 rounded-lg hover:bg-white hover:bg-opacity-20">
                      👤 {currentUser.username}
                    </button>
                    {isDropdownOpen && (
                      <div className="mt-2 w-full bg-white text-gray-800 rounded-lg p-4">
                        <p className="font-semibold">{currentUser.name}</p>
                        <p className="text-sm text-gray-500">{currentUser.email}</p>
                        <p className="text-sm text-gray-500">Role: {currentUser.role}</p>
                        <button onClick={handleLogout} className="mt-2 w-full bg-red-500 text-white py-2 rounded-lg">Logout</button>
                      </div>
                    )}
                  </div>
                )}
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;

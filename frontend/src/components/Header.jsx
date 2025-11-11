import React, { useState, useEffect } from 'react';
import { Train, Phone, Mail, Menu, X, LogOut, User, Settings } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Safe localStorage getter
  const getUserFromStorage = () => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  };

  // Load user info from localStorage
  useEffect(() => {
    const user = getUserFromStorage();
    setCurrentUser(user);
  }, [location.pathname]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setCurrentUser(null);
    setIsDropdownOpen(false);
    setIsSidebarOpen(false);
    navigate('/login');
  };

  // 🔧 Modified condition: Hide header for TTE, Admin, or Train Status page
  const user = getUserFromStorage();
  const hideHeader =
    (user && (user.role.toLowerCase() === 'tte' || user.role.toLowerCase() === 'admin')) ||
    location.pathname === '/status';

  if (hideHeader) {
    return null;
  }

  // Get role display name with emoji
  const getRoleDisplay = (role) => {
    if (!role) return '';
    
    switch (role.toLowerCase()) {
      case 'passenger': return '🚆 Passenger';
      case 'tte': return '🎫 TTE';
      case 'admin': return '⚙️ Admin';
      default: return role;
    }
  };

  return (
    <>
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-purple-900 text-white relative z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
              <div className="bg-orange-500 p-2 rounded-lg">
                <Train size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">RailBook</h1>
                <p className="text-blue-200 text-xs">Your Journey, Our Priority</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 items-center">
            <Link 
              to="/" 
              className="hover:text-blue-200 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-white hover:bg-opacity-10"
            >
              Home
            </Link>
            <Link 
              to="/bookings" 
              className="hover:text-blue-200 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-white hover:bg-opacity-10"
            >
              My Bookings
            </Link>
            <Link 
              to="/status" 
              className="hover:text-blue-200 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-white hover:bg-opacity-10"
            >
              Train Status
            </Link>

            {/* Login/Profile Section */}
            {!currentUser ? (
              <Link 
                to="/login" 
                className="bg-white text-blue-900 px-4 py-2 rounded-lg font-semibold hover:bg-blue-100 transition-colors flex items-center space-x-2"
              >
                <User size={16} />
                <span>Login</span>
              </Link>
            ) : (
              <div className="relative dropdown-container">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200 border border-white border-opacity-30"
                >
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <User size={16} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">
                      Welcome, {currentUser.username || currentUser.name || 'User'}
                    </p>
                    <p className="text-xs text-blue-200">
                      {getRoleDisplay(currentUser.role)}
                    </p>
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white text-gray-800 rounded-lg shadow-xl z-50 border border-gray-200">
                    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white">
                          <User size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{currentUser.name || currentUser.username || 'User'}</p>
                          <p className="text-sm text-gray-600 truncate">{currentUser.email || 'No email'}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Settings size={12} className="text-gray-400" />
                            <span className="text-xs text-gray-500 font-medium">{getRoleDisplay(currentUser.role)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <Link 
                        to="/profile" 
                        className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User size={16} />
                        <span>My Profile</span>
                      </Link>
                    </div>

                    <div className="p-2 border-t border-gray-200">
                      <button
                        onClick={handleLogout}
                        className="flex items-center justify-center space-x-2 w-full px-3 py-2 text-sm bg-red-50 text-red-700 hover:bg-red-100 rounded-md transition-colors font-medium"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
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
        <div className="hidden md:flex bg-blue-800 bg-opacity-50 py-2 text-sm">
          <div className="max-w-6xl mx-auto px-4 w-full flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone size={14} className="text-blue-200" />
                <span className="text-blue-100">24/7 Helpline: 139</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={14} className="text-blue-200" />
                <span className="text-blue-100">support@railbook.com</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
            onClick={toggleSidebar} 
          />
          
          {/* Sidebar */}
          <div className="fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-blue-900 to-purple-900 text-white z-50 transform transition-transform duration-300 ease-in-out md:hidden">
            <div className="p-6 h-full flex flex-col">
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
                  onClick={toggleSidebar} 
                  className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {currentUser && (
                <div className="mb-6 p-4 bg-white bg-opacity-10 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <User size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{currentUser.name || currentUser.username || 'User'}</p>
                      <p className="text-blue-200 text-xs">{currentUser.email || 'No email'}</p>
                      <p className="text-blue-200 text-xs font-medium">{getRoleDisplay(currentUser.role)}</p>
                    </div>
                  </div>
                </div>
              )}

              <nav className="space-y-2 flex-1">
                <Link 
                  to="/" 
                  onClick={toggleSidebar}
                  className="flex items-center space-x-3 py-3 px-4 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <span>🏠</span>
                  <span>Home</span>
                </Link>
              
                <Link 
                  to="/bookings" 
                  onClick={toggleSidebar}
                  className="flex items-center space-x-3 py-3 px-4 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <span>📘</span>
                  <span>My Bookings</span>
                </Link>

                <Link 
                  to="/status" 
                  onClick={toggleSidebar}
                  className="flex items-center space-x-3 py-3 px-4 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <span>🚆</span>
                  <span>Train Status</span>
                </Link>

                {currentUser ? (
                  <>
                    <Link 
                      to="/profile" 
                      onClick={toggleSidebar}
                      className="flex items-center space-x-3 py-3 px-4 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                    >
                      <User size={18} />
                      <span>My Profile</span>
                    </Link>
                    
                    <Link 
                      to="/settings" 
                      onClick={toggleSidebar}
                      className="flex items-center space-x-3 py-3 px-4 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                    >
                      <Settings size={18} />
                      <span>Settings</span>
                    </Link>
                  </>
                ) : null}
              </nav>

              <div className="pt-6 border-t border-white border-opacity-20">
                {!currentUser ? (
                  <Link 
                    to="/login" 
                    onClick={toggleSidebar}
                    className="w-full bg-white text-blue-900 py-3 px-4 rounded-lg font-semibold hover:bg-blue-100 transition-colors flex items-center justify-center space-x-2"
                  >
                    <User size={18} />
                    <span>Login to Account</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      toggleSidebar();
                      handleLogout();
                    }}
                    className="w-full bg-red-500 bg-opacity-20 text-red-100 py-3 px-4 rounded-lg font-semibold hover:bg-red-600 hover:bg-opacity-30 transition-colors flex items-center justify-center space-x-2 border border-red-400 border-opacity-30"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-white border-opacity-20">
                <div className="space-y-2 text-sm text-blue-200">
                  <div className="flex items-center space-x-2">
                    <Phone size={14} />
                    <span>24/7 Helpline: 139</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail size={14} />
                    <span>support@railbook.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Close dropdown when clicking outside */}
      <div 
        className={`fixed inset-0 z-30 ${isDropdownOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsDropdownOpen(false)}
      />
    </>
  );
};

export default Header;

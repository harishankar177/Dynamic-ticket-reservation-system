import React, { useState, useEffect } from 'react';
import { 
  Train, 
  ClipboardCheck, 
  Wrench, 
  Users, 
  IndianRupee, 
  Armchair, 
  FileText, 
  Home, 
  AlertTriangle, 
  Menu, 
  X,
  LogOut,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Layout = ({ children, activePage, onNavigate }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Safe localStorage getter
  const getUserFromStorage = () => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  };

  // ===== SESSION CHECK =====
  useEffect(() => {
    const checkSession = () => {
      setIsLoading(true);
      const user = getUserFromStorage();
      
      console.log('Layout - Checking session for user:', user);
      
      if (!user) {
        console.log('No user found, redirecting to login');
        navigate('/login', { replace: true });
        return;
      }
      
      // Check role (case insensitive)
      if (user.role.toLowerCase() !== 'tte') {
        console.log('User role is not TTE, redirecting to login');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        navigate('/login', { replace: true });
        return;
      }

      // Check if session has expired
      if (user.expires && new Date(user.expires) < new Date()) {
        console.log('Session expired, redirecting to login');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        navigate('/login', { replace: true });
        return;
      }

      console.log('TTE session validated, setting user');
      setCurrentUser(user);
      setIsLoading(false);
    };

    checkSession();

    // Check session expiration every minute
    const interval = setInterval(() => {
      const user = getUserFromStorage();
      if (user && user.expires && new Date(user.expires) < new Date()) {
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        navigate('/login', { replace: true });
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [navigate]);

  // ===== LOGOUT HANDLER =====
  const handleLogout = () => {
    console.log('Logging out TTE user');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login', { replace: true });
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'tickets', label: 'Ticket Checking', icon: ClipboardCheck },
    { id: 'coach', label: 'Coach Supervision', icon: Wrench },
    { id: 'assistance', label: 'Passenger Assistance', icon: Users },
    { id: 'fines', label: 'Fine Collection', icon: IndianRupee },
    { id: 'seats', label: 'Seat Availability', icon: Armchair },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
    { id: 'report', label: 'Journey Report', icon: FileText },
  ];

  const handleNavigate = (page) => {
    onNavigate(page);
    setIsSidebarOpen(false);
  };

  // Show loading while checking session
  if (isLoading) {
    return (
      <div className="flex h-screen bg-slate-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading TTE Portal...</p>
        </div>
      </div>
    );
  }

  // Don't render if no user (will redirect in useEffect)
  if (!currentUser) {
    return null;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-gradient-to-b from-slate-800 to-slate-900 text-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2 rounded-lg">
              <Train className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">TTE Portal</h1>
              <p className="text-xs text-slate-400">Ticket Examiner System</p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 overflow-y-auto h-[calc(100vh-200px)]">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigate(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activePage === item.id
                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700 bg-slate-900">
          <div className="bg-slate-700/50 rounded-lg p-3 mb-2">
            <p className="text-xs text-slate-400 mb-1">Logged in as TTE</p>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{currentUser?.name || currentUser?.username || 'TTE Officer'}</p>
                <p className="text-xs text-slate-400">{currentUser?.email || 'tte@railbook.com'}</p>
              </div>
            </div>
          </div>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-slate-700 hover:text-slate-900 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <div className="bg-orange-500 p-1.5 rounded-lg">
                <Train className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-slate-900">TTE Portal</h1>
            </div>
          </div>
          
          {/* Mobile User Info */}
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">{currentUser?.name || currentUser?.username || 'TTE Officer'}</p>
              <p className="text-xs text-slate-500">TTE</p>
            </div>
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
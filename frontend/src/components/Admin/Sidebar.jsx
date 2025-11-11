import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Train,
  Users,
  Ticket,
  DollarSign,
  User,
  MapPin,
  BarChart3,
  Megaphone,
  Settings,
  Menu,
  X,
  LogOut,
  List
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'trains', label: 'Manage Trains', icon: Train },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'bookings', label: 'Bookings', icon: Ticket },
  { id: 'revenue', label: 'Revenue & Finance', icon: DollarSign },
  { id: 'assignmentList', label: 'Assignment List', icon: List }, // ✅ replaced TTE Assignment
  { id: 'routes', label: 'Routes & Stations', icon: MapPin },
  { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
  { id: 'announcements', label: 'Announcements', icon: Megaphone },
  { id: 'settings', label: 'System Settings', icon: Settings },
];

export default function Sidebar({ activeSection, setActiveSection, isOpen, setIsOpen }) {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role === 'Admin') {
      setAdmin(user);
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login', { replace: true });
  };

  if (!admin) return null;

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 text-white rounded-lg shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-slate-800 text-white
        w-64 flex flex-col z-40 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Train size={32} className="text-emerald-400" />
            <div>
              <h1 className="text-xl font-bold">RailBook</h1>
              <p className="text-xs text-slate-400">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors
                ${activeSection === item.id
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700'}`}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
              <span className="text-sm font-bold">
                {admin.name ? admin.name.charAt(0).toUpperCase() : 'A'}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{admin.name || 'Admin User'}</p>
              <p className="text-xs text-slate-400">{admin.phone || 'N/A'}</p>
            </div>
            <button onClick={handleLogout} className="text-red-400 hover:text-red-500" title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

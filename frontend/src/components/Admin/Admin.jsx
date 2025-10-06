import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TrainManagement from './components/TrainManagement';
import UserManagement from './components/UserManagement';
import PassengerDetails from './components/PassengerDetails';
import TTEDetails from './components/TTEDetails';
import PlaceholderSection from './components/PlaceholderSection';
import {
  Ticket,
  DollarSign,
  AlertTriangle,
  MapPin,
  BarChart3,
  Megaphone,
  Settings
} from 'lucide-react';

const Admin = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <Dashboard
            onNavigateToPassengers={() => setActiveSection('passengers')}
            onNavigateToTTEs={() => setActiveSection('ttes')}
          />
        );
      case 'trains':
        return <TrainManagement />;
      case 'users':
        return <UserManagement />;
      case 'passengers':
        return <PassengerDetails onBack={() => setActiveSection('dashboard')} />;
      case 'ttes':
        return <TTEDetails onBack={() => setActiveSection('dashboard')} />;
      case 'bookings':
        return (
          <PlaceholderSection
            title="Booking Management"
            description="Monitor and manage all passenger bookings, cancellations, and refunds"
            icon={Ticket}
          />
        );
      case 'revenue':
        return (
          <PlaceholderSection
            title="Revenue & Finance"
            description="Track revenue, fines collected, and generate financial reports"
            icon={DollarSign}
          />
        );
      case 'incidents':
        return (
          <PlaceholderSection
            title="Incident Management"
            description="Review and resolve incidents, complaints, and emergency reports"
            icon={AlertTriangle}
          />
        );
      case 'routes':
        return (
          <PlaceholderSection
            title="Routes & Stations"
            description="Manage train routes, station details, and connections"
            icon={MapPin}
          />
        );
      case 'reports':
        return (
          <PlaceholderSection
            title="Reports & Analytics"
            description="Generate comprehensive reports on bookings, revenue, and performance"
            icon={BarChart3}
          />
        );
      case 'announcements':
        return (
          <PlaceholderSection
            title="Announcements"
            description="Send important updates, alerts, and offers to users"
            icon={Megaphone}
          />
        );
      case 'settings':
        return (
          <PlaceholderSection
            title="System Settings"
            description="Configure fare structures, stations, and platform preferences"
            icon={Settings}
          />
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <main className="flex-1 overflow-x-hidden">
        <div className="p-4 sm:p-6 lg:p-8 mt-16 lg:mt-0">
          {renderSection()}
        </div>
      </main>
    </div>
  );
};

export default Admin;

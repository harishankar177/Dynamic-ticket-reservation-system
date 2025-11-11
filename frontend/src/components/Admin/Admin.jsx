import React, { useState } from 'react';
import Sidebar from '../Admin/Sidebar';
import Dashboard from '../Admin/pages/Dashboard';
import TrainManagement from '../Admin/pages/TrainManagement';
import UserManagement from '../Admin/pages/UserManagement';
import PassengerDetails from '../Admin/pages/PassengerDetails';
import TTEDetails from '../Admin/pages/TTEDetails';
import RoutesAndStations from './pages/RoutesAndStations';
import TTEAssignmentForm from '../Admin/pages/TTEAssignmentForm'; // ✅ Assignment list
import TTEAssignmentDetails from '../Admin/pages/TTEAssignmentDetails';
import PlaceholderSection from '../Admin/pages/PlaceholderSection';
import {
  Ticket,
  DollarSign,
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
            description="Monitor and manage all passenger bookings"
            icon={Ticket}
          />
        );
      // ✅ New TTE Assignment
case 'tteAssignment':
  return (
    <TTEAssignmentDetails onSuccess={() => setActiveSection('dashboard')} />
  );
      // ✅ Assignment List
      case 'assignmentList':
        return (
          <TTEAssignmentForm onSuccess={() => setActiveSection('dashboard')} />
        );
      case 'routes':
        return <RoutesAndStations />;
      case 'reports':
        return (
          <PlaceholderSection
            title="Reports & Analytics"
            description="Generate comprehensive system reports"
            icon={BarChart3}
          />
        );
      case 'announcements':
        return (
          <PlaceholderSection
            title="Announcements"
            description="Send updates and alerts to users"
            icon={Megaphone}
          />
        );
      case 'settings':
        return (
          <PlaceholderSection
            title="System Settings"
            description="Configure fares and preferences"
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

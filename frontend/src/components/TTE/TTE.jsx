import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TTEProvider } from './context/TTEContext';
import Layout from './Layout';
import Dashboard from './pages/Dashboard';
import TicketChecking from './pages/TicketChecking';
import CoachSupervision from './pages/CoachSupervision';
import PassengerAssistance from './pages/PassengerAssistance';
import FineCollection from './pages/FineCollection';
import SeatAvailability from './pages/SeatAvailability';
import Incidents from './pages/Incidents';
import JourneyReport from './pages/JourneyReport';

const TTE = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('dashboard');

  // ===== SESSION CHECK =====
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'TTE') {
      // If not logged in or not TTE, redirect to login
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  // ===== LOGOUT HANDLER =====
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login', { replace: true });
  };

  // ===== RENDER PAGES =====
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'tickets':
        return <TicketChecking />;
      case 'coach':
        return <CoachSupervision />;
      case 'assistance':
        return <PassengerAssistance />;
      case 'fines':
        return <FineCollection />;
      case 'seats':
        return <SeatAvailability />;
      case 'incidents':
        return <Incidents />;
      case 'report':
        return <JourneyReport />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <TTEProvider>
      <Layout activePage={activePage} onNavigate={setActivePage} onLogout={handleLogout}>
        {renderPage()}
      </Layout>
    </TTEProvider>
  );
};

export default TTE;

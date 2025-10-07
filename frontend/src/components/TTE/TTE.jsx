import React, { useState } from 'react';
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
  const [activePage, setActivePage] = useState('dashboard');

  // ===== RENDER PAGES =====
  const renderPage = () => {
    try {
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
    } catch (error) {
      console.error('Error rendering page:', error);
      return (
        <div className="p-6">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Page</h2>
          <p className="text-gray-600">There was an error loading the {activePage} page. Please try again.</p>
        </div>
      );
    }
  };

  return (
    <TTEProvider>
      <Layout activePage={activePage} onNavigate={setActivePage}>
        {renderPage()}
      </Layout>
    </TTEProvider>
  );
};

export default TTE;
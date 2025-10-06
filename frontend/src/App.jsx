import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation
} from 'react-router-dom';
import { Train, Users, CreditCard, CheckCircle } from 'lucide-react';

import Header from './components/Header';
import SearchForm from './components/SearchForm';
import TrainList from './components/TrainList';
import PassengerDetails from './components/PassengerDetails';
import Payment from './components/Payment';
import BookingConfirmation from './components/BookingConfirmation';
import Auth from './components/login/Auth';
import SignUp from './components/login/SignUp';
import ForgotPassword from './components/login/ForgotPassword';
import TrainStatus from './components/Trainstatus/TrainStatus';
import TTE from './components/TTE/TTE';

// =======================
// ProtectedRoute Component
// =======================
const ProtectedRoute = ({ children, allowedRole }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) return <Navigate to="/login" replace />; // not logged in
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/login" replace />; // wrong role
  return children;
};

// =======================
// AppContent
// =======================
function AppContent() {
  const [searchData, setSearchData] = useState(null);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [bookingData, setBookingData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isLoginPage = location.pathname === '/login';

  // Auto-redirect TTE if logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      if (user.role === 'TTE' && location.pathname === '/login') {
        navigate('/tte-dashboard', { replace: true });
      }
    }
  }, [location.pathname]);

  // Booking steps
  const steps = [
    { icon: Train, title: 'Search Trains', path: '/' },
    { icon: Train, title: 'Select Train', path: '/trains' },
    { icon: Users, title: 'Passenger Details', path: '/passengers' },
    { icon: CreditCard, title: 'Payment', path: '/payment' },
    { icon: CheckCircle, title: 'Confirmation', path: '/confirmation' },
  ];

  const bookingStepsPaths = ['/', '/trains', '/passengers', '/payment', '/confirmation'];
  const currentStep = steps.findIndex(step => step.path === location.pathname);
  const showProgress = bookingStepsPaths.includes(location.pathname);

  // Handlers
  const handleSearch = (data) => { setSearchData(data); navigate('/trains'); };
  const handleTrainSelect = (train) => { setSelectedTrain(train); navigate('/passengers'); };
  const handlePassengerDetails = (passengerData) => { setPassengers(passengerData); navigate('/payment'); };
  const handlePayment = () => {
    const booking = {
      searchData,
      selectedTrain,
      passengers,
      totalAmount: selectedTrain?.price ? selectedTrain.price * (searchData?.passengers || 1) : 0,
      bookingId: `RB${Date.now()}`,
    };
    setBookingData(booking);
    navigate('/confirmation');
  };
  const handleNewBooking = () => { setSearchData(null); setSelectedTrain(null); setPassengers([]); setBookingData(null); navigate('/'); };

  return (
    <div className="min-h-screen w-full m-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {!isLoginPage && <Header />}

      {/* Booking Progress Steps */}
      {showProgress && !isLoginPage && (
        <div className="w-full m-0">
          <div className="flex items-center justify-between mb-8 bg-white rounded-lg shadow-sm p-6 max-w-full">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              return (
                <div key={index} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                  }`}><Icon size={20} /></div>
                  <span className={`ml-2 text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>{step.title}</span>
                  {index < steps.length - 1 && <div className={`w-8 h-0.5 ml-4 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Routes */}
      <div className="flex-1 w-full m-0">
        <Routes>
          {/* Passenger Flow */}
          <Route path="/" element={<SearchForm onSearch={handleSearch} />} />
          <Route path="/trains" element={searchData ? <TrainList searchData={searchData} onSelectTrain={handleTrainSelect} /> : <Navigate to="/" />} />
          <Route path="/passengers" element={selectedTrain ? <PassengerDetails passengerCount={searchData?.passengers} onSubmit={handlePassengerDetails} /> : <Navigate to="/trains" />} />
          <Route path="/payment" element={passengers.length ? <Payment totalAmount={selectedTrain?.price * (searchData?.passengers || 1)} onPayment={handlePayment} /> : <Navigate to="/passengers" />} />
          <Route path="/confirmation" element={bookingData ? <BookingConfirmation bookingData={bookingData} onNewBooking={handleNewBooking} /> : <Navigate to="/" />} />

          {/* Auth Pages */}
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<div className="max-w-md mx-auto mt-12 bg-white rounded-2xl p-8"><SignUp onSignIn={() => navigate('/login')} /></div>} />
          <Route path="/forgot" element={<div className="max-w-md mx-auto mt-12 bg-white rounded-2xl p-8"><ForgotPassword onBack={() => navigate('/login')} /></div>} />
          <Route path="/status" element={<TrainStatus />} />

          {/* TTE Dashboard */}
          
         <Route path="/tte/*" element={<ProtectedRoute allowedRole="TTE"><TTE /></ProtectedRoute>} />


          {/* Default Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

// =======================
// App
// =======================
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

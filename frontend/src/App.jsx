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
import SearchForm from './components/pages/SearchForm';
import TrainList from './components/pages/TrainList';
import PassengerDetails from './components/pages/PassengerDetails';
import Payment from './components/pages/Payment';
import BookingConfirmation from './components/pages/BookingConfirmation';
import Auth from './components/login/Auth';
import SignUp from './components/login/SignUp';
import ForgotPassword from './components/login/ForgotPassword';
import TrainStatus from './components/Trainstatus/TrainStatus';
import TTE from './components/TTE/TTE';
import Admin from './components/Admin/Admin';

// =======================
// ProtectedRoute Component
// =======================
const ProtectedRoute = ({ children, allowedRole }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/login" replace />;
  return children;
};

// =======================
// Role-based Layout Wrapper
// =======================
const RoleBasedLayout = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();
  
  // Don't show header for auth pages and specific roles
  const isAuthPage = ['/login', '/signup', '/forgot'].includes(location.pathname);
  
  if (isAuthPage) {
    // No header for login, signup, forgot password pages
    return (
      <div className="min-h-screen w-full m-0 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {children}
      </div>
    );
  }
  
  // Don't show header for TTE and Admin roles
  if (user && (user.role === 'TTE' || user.role === 'Admin')) {
    return (
      <div className="min-h-screen w-full m-0 bg-gray-50">
        {children}
      </div>
    );
  }
  
  // For passengers or logged out users on non-auth pages, show header
  return (
    <div className="min-h-screen w-full m-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      <Header />
      {children}
    </div>
  );
};

// =======================
// Role-based Home Redirect
// =======================
const HomeRedirect = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === 'Admin') return <Navigate to="/admin" replace />;
  if (user.role === 'TTE') return <Navigate to="/tte" replace />;
  return <SearchForm onSearch={() => {}} />;
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

  const user = JSON.parse(localStorage.getItem('user'));
  const isLoginPage = location.pathname === '/login';

  // =======================
  // Session persistence on refresh
  // =======================
  useEffect(() => {
    // Session is automatically maintained via localStorage
  }, []);

  // =======================
  // Auto redirect logged-in users away from login page
  // =======================
  useEffect(() => {
    if (user && isLoginPage) {
      if (user.role === 'Admin') navigate('/admin', { replace: true });
      else if (user.role === 'TTE') navigate('/tte', { replace: true });
      else navigate('/', { replace: true });
    }
  }, [location.pathname, user, navigate]);

  // =======================
  // Booking steps for Passenger
  // =======================
  const steps = [
    { icon: Train, title: 'Search Trains', path: '/' },
    { icon: Train, title: 'Select Train', path: '/trains' },
    { icon: Users, title: 'Passenger Details', path: '/passengers' },
    { icon: CreditCard, title: 'Payment', path: '/payment' },
    { icon: CheckCircle, title: 'Confirmation', path: '/confirmation' },
  ];

  const bookingStepsPaths = ['/', '/trains', '/passengers', '/payment', '/confirmation'];
  const currentStep = steps.findIndex(step => step.path === location.pathname);
  
  // Only show progress for logged-in passengers on booking pages
  const showProgress = bookingStepsPaths.includes(location.pathname) && 
                      user && 
                      user.role === 'Passenger';

  // =======================
  // Booking Handlers
  // =======================
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
  const handleNewBooking = () => {
    setSearchData(null);
    setSelectedTrain(null);
    setPassengers([]);
    setBookingData(null);
    navigate('/');
  };

  return (
    <RoleBasedLayout>
      {/* Booking Progress Steps - Only for passengers on booking pages */}
      {showProgress && (
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
          {/* Role-based home */}
          <Route path="/" element={<HomeRedirect />} />

          {/* Passenger Flow */}
          <Route path="/trains" element={
            <ProtectedRoute allowedRole="Passenger">
              {searchData ? <TrainList searchData={searchData} onSelectTrain={handleTrainSelect} /> : <Navigate to="/" />}
            </ProtectedRoute>
          } />
          <Route path="/passengers" element={
            <ProtectedRoute allowedRole="Passenger">
              {selectedTrain ? <PassengerDetails passengerCount={searchData?.passengers} onSubmit={handlePassengerDetails} /> : <Navigate to="/trains" />}
            </ProtectedRoute>
          } />
          <Route path="/payment" element={
            <ProtectedRoute allowedRole="Passenger">
              {passengers.length ? <Payment totalAmount={selectedTrain?.price * (searchData?.passengers || 1)} onPayment={handlePayment} /> : <Navigate to="/passengers" />}
            </ProtectedRoute>
          } />
          <Route path="/confirmation" element={
            <ProtectedRoute allowedRole="Passenger">
              {bookingData ? <BookingConfirmation bookingData={bookingData} onNewBooking={handleNewBooking} /> : <Navigate to="/" />}
            </ProtectedRoute>
          } />

          {/* Auth Pages - No Header will be shown for these */}
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<SignUp onSignIn={() => navigate('/login')} />} />
          <Route path="/forgot" element={<ForgotPassword onBack={() => navigate('/login')} />} />

          {/* Train Status */}
          <Route path="/status" element={<TrainStatus />} />

          {/* TTE Dashboard - No Header */}
          <Route path="/tte/*" element={
            <ProtectedRoute allowedRole="TTE">
              <TTE />
            </ProtectedRoute>
          } />

          {/* Admin Dashboard - No Header */}
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRole="Admin">
              <Admin />
            </ProtectedRoute>
          } />

          {/* Default Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </RoleBasedLayout>
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
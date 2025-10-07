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
  const getUserFromStorage = () => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  };

  const user = getUserFromStorage();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRole && user.role.toLowerCase() !== allowedRole.toLowerCase()) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// =======================
// Role-based Layout Wrapper
// =======================
const RoleBasedLayout = ({ children, showProgress, progressComponent }) => {
  const getUserFromStorage = () => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  };

  const user = getUserFromStorage();
  const location = useLocation();
  
  const isAuthPage = ['/login', '/signup', '/forgot'].includes(location.pathname);
  
  // Auth pages layout
  if (isAuthPage) {
    return (
      <div className="min-h-screen w-full m-0 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {children}
      </div>
    );
  }

  // TTE and Admin layout (no header)
  if (user && ['tte', 'admin'].includes(user.role.toLowerCase())) {
    return (
      <div className="min-h-screen w-full m-0 bg-gray-50">
        {children}
      </div>
    );
  }

  // Passenger layout (with header)
  return (
    <div className="min-h-screen w-full m-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      <Header />
      {showProgress && progressComponent}
      {children}
    </div>
  );
};

// =======================
// Role-based Home Redirect
// =======================
const HomeRedirect = ({ onSearch }) => {
  const getUserFromStorage = () => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  };

  const user = getUserFromStorage();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = user.role.toLowerCase();
  
  if (role === 'admin') return <Navigate to="/admin" replace />;
  if (role === 'tte') return <Navigate to="/tte" replace />;
  if (role === 'passenger') return <SearchForm onSearch={onSearch} />;

  return <Navigate to="/login" replace />;
};

// =======================
// ProgressSteps Component
// =======================
const ProgressSteps = ({ currentStep, steps }) => {
  return (
    <div className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            return (
              <div key={index} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <span className={`ml-3 text-sm font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
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
  
  const getUserFromStorage = () => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  };

  const user = getUserFromStorage();
  const role = user?.role?.toLowerCase();
  const isLoginPage = location.pathname === '/login';

  // Redirect logged-in users from login page
  useEffect(() => {
    if (user && isLoginPage) {
      const userRole = user.role.toLowerCase();
      if (userRole === 'admin') navigate('/admin', { replace: true });
      else if (userRole === 'tte') navigate('/tte', { replace: true });
      else navigate('/', { replace: true });
    }
  }, [location.pathname, user, navigate]);

  // Passenger booking steps
  const steps = [
    { icon: Train, title: 'Search Trains', path: '/' },
    { icon: Train, title: 'Select Train', path: '/trains' },
    { icon: Users, title: 'Passenger Details', path: '/passengers' },
    { icon: CreditCard, title: 'Payment', path: '/payment' },
    { icon: CheckCircle, title: 'Confirmation', path: '/confirmation' },
  ];
  
  const bookingStepsPaths = ['/', '/trains', '/passengers', '/payment', '/confirmation'];
  const currentStep = bookingStepsPaths.indexOf(location.pathname);
  const showProgress = bookingStepsPaths.includes(location.pathname) && role === 'passenger';
  const progressComponent = showProgress ? <ProgressSteps currentStep={currentStep} steps={steps} /> : null;

  // Booking Handlers
  const handleSearch = (data) => { 
    setSearchData(data); 
    setSelectedTrain(null);
    setPassengers([]);
    setBookingData(null);
    navigate('/trains'); 
  };

  const handleTrainSelect = (train) => { 
    setSelectedTrain(train); 
    navigate('/passengers'); 
  };

  const handlePassengerDetails = (passengerData) => { 
    setPassengers(passengerData); 
    navigate('/payment'); 
  };

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
    <RoleBasedLayout showProgress={showProgress} progressComponent={progressComponent}>
      <div className="flex-1 w-full">
        <Routes>
          {/* Home - Auto redirect based on role */}
          <Route path="/" element={<HomeRedirect onSearch={handleSearch} />} />

          {/* Passenger Booking Flow */}
          <Route 
            path="/trains" 
            element={
              <ProtectedRoute allowedRole="Passenger">
                {searchData ? (
                  <TrainList searchData={searchData} onSelectTrain={handleTrainSelect} />
                ) : <Navigate to="/" replace />}
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/passengers" 
            element={
              <ProtectedRoute allowedRole="Passenger">
                {selectedTrain ? (
                  <PassengerDetails passengerCount={searchData?.passengers} onSubmit={handlePassengerDetails} />
                ) : <Navigate to="/trains" replace />}
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/payment" 
            element={
              <ProtectedRoute allowedRole="Passenger">
                {passengers.length > 0 ? (
                  <Payment totalAmount={selectedTrain?.price * (searchData?.passengers || 1)} onPayment={handlePayment} />
                ) : <Navigate to="/passengers" replace />}
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/confirmation" 
            element={
              <ProtectedRoute allowedRole="Passenger">
                {bookingData ? (
                  <BookingConfirmation bookingData={bookingData} onNewBooking={handleNewBooking} />
                ) : <Navigate to="/" replace />}
              </ProtectedRoute>
            } 
          />

          {/* Auth Routes */}
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<SignUp onSignIn={() => navigate('/login')} />} />
          <Route path="/forgot" element={<ForgotPassword onBack={() => navigate('/login')} />} />

          {/* Other Routes */}
          <Route path="/status" element={<TrainStatus />} />
          
          {/* Role-based Routes */}
          <Route path="/tte/*" element={<ProtectedRoute allowedRole="TTE"><TTE /></ProtectedRoute>} />
          <Route path="/admin/*" element={<ProtectedRoute allowedRole="Admin"><Admin /></ProtectedRoute>} />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </RoleBasedLayout>
  );
}

// =======================
// Main App Component
// =======================
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
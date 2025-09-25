import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Train, Users, CreditCard, CheckCircle } from 'lucide-react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import TrainList from './components/TrainList';
import SeatSelection from './components/SeatSelection';
import PassengerDetails from './components/PassengerDetails';
import Payment from './components/Payment';
import BookingConfirmation from './components/BookingConfirmation';
import Login from './components/Login'

function AppContent() {
  const [searchData, setSearchData] = useState(null);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [bookingData, setBookingData] = useState(null);
  const navigate = useNavigate();

  const steps = [
    { icon: Train, title: 'Search Trains', path: '/' },
    { icon: Train, title: 'Select Train', path: '/trains' },
    { icon: Users, title: 'Choose Seats', path: '/seats' },
    { icon: Users, title: 'Passenger Details', path: '/passengers' },
    { icon: CreditCard, title: 'Payment', path: '/payment' },
    { icon: CheckCircle, title: 'Confirmation', path: '/confirmation' },
  ];

  // Find current step index based on location
  const currentStep = steps.findIndex(step => step.path === window.location.pathname);

  // Handlers now navigate to the next route
  const handleSearch = (data) => {
    setSearchData(data);
    navigate('/trains');
  };

  const handleTrainSelect = (train) => {
    setSelectedTrain(train);
    navigate('/seats');
  };

  const handleSeatSelect = (seats) => {
    setSelectedSeats(seats);
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
      selectedSeats,
      passengers,
      totalAmount: selectedSeats.reduce((total, seat) => total + seat.price, 0),
      bookingId: `RB${Date.now()}`,
    };
    setBookingData(booking);
    navigate('/confirmation');
  };

  const handleNewBooking = () => {
    setSearchData(null);
    setSelectedTrain(null);
    setSelectedSeats([]);
    setPassengers([]);
    setBookingData(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />

      {/* Progress Steps */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 bg-white rounded-lg shadow-sm p-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div key={index} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  isCompleted 
                    ? 'bg-green-500 text-white' 
                    : isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  <Icon size={20} />
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  isActive ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 ml-4 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Current Step Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <Routes>
            <Route path="/" element={<SearchForm onSearch={handleSearch} />} />
            <Route path="/trains" element={
              searchData ? (
                <TrainList searchData={searchData} onSelectTrain={handleTrainSelect} />
              ) : (
                <Navigate to="/" />
              )
            } />
            <Route path="/seats" element={
              selectedTrain ? (
                <SeatSelection
                  train={selectedTrain}
                  passengers={searchData?.passengers}
                  onSeatSelect={handleSeatSelect}
                />
              ) : (
                <Navigate to="/trains" />
              )
            } />
            <Route path="/passengers" element={
              selectedSeats.length ? (
                <PassengerDetails
                  passengerCount={searchData?.passengers}
                  selectedSeats={selectedSeats}
                  onSubmit={handlePassengerDetails}
                />
              ) : (
                <Navigate to="/seats" />
              )
            } />
            <Route path="/payment" element={
              passengers.length ? (
                <Payment
                  totalAmount={selectedSeats.reduce((total, seat) => total + seat.price, 0)}
                  onPayment={handlePayment}
                />
              ) : (
                <Navigate to="/passengers" />
              )
            } />
            <Route path="/confirmation" element={
              bookingData ? (
                <BookingConfirmation
                  bookingData={bookingData}
                  onNewBooking={handleNewBooking}
                />
              ) : (
                <Navigate to="/" />
              )
            } />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
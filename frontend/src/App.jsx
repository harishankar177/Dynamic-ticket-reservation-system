import React, { useState } from 'react';
import { Train, Users, CreditCard, CheckCircle } from 'lucide-react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import TrainList from './components/TrainList';
import SeatSelection from './components/SeatSelection';
import PassengerDetails from './components/PassengerDetails';
import Payment from './components/Payment';
import BookingConfirmation from './components/BookingConfirmation';

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [searchData, setSearchData] = useState(null);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [bookingData, setBookingData] = useState(null);

  const steps = [
    { icon: Train, title: 'Search Trains', component: SearchForm },
    { icon: Train, title: 'Select Train', component: TrainList },
    { icon: Users, title: 'Choose Seats', component: SeatSelection },
    { icon: Users, title: 'Passenger Details', component: PassengerDetails },
    { icon: CreditCard, title: 'Payment', component: Payment },
    { icon: CheckCircle, title: 'Confirmation', component: BookingConfirmation },
  ];

  const handleSearch = (data) => {
    setSearchData(data);
    setCurrentStep(1);
  };

  const handleTrainSelect = (train) => {
    setSelectedTrain(train);
    setCurrentStep(2);
  };

  const handleSeatSelect = (seats) => {
    setSelectedSeats(seats);
    setCurrentStep(3);
  };

  const handlePassengerDetails = (passengerData) => {
    setPassengers(passengerData);
    setCurrentStep(4);
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
    setCurrentStep(5);
  };

  const handleNewBooking = () => {
    setCurrentStep(0);
    setSearchData(null);
    setSelectedTrain(null);
    setSelectedSeats([]);
    setPassengers([]);
    setBookingData(null);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <SearchForm onSearch={handleSearch} />;
      case 1:
        return <TrainList searchData={searchData} onSelectTrain={handleTrainSelect} />;
      case 2:
        return (
          <SeatSelection
            train={selectedTrain}
            passengers={searchData.passengers}
            onSeatSelect={handleSeatSelect}
          />
        );
      case 3:
        return (
          <PassengerDetails
            passengerCount={searchData.passengers}
            selectedSeats={selectedSeats}
            onSubmit={handlePassengerDetails}
          />
        );
      case 4:
        return (
          <Payment
            totalAmount={selectedSeats.reduce((total, seat) => total + seat.price, 0)}
            onPayment={handlePayment}
          />
        );
      case 5:
        return (
          <BookingConfirmation
            bookingData={bookingData}
            onNewBooking={handleNewBooking}
          />
        );
      default:
        return null;
    }
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
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
}

export default App;

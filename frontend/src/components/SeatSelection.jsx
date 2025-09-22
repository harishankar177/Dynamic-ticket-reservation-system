import React, { useState } from 'react';
import { Users, Check, X } from 'lucide-react';

const SeatSelection = ({ train, passengers, onSeatSelect }) => {
  const [selectedClass, setSelectedClass] = useState(train.classes[0]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const classDetails = {
    '1A': { name: 'First AC', price: train.price + 1200, color: 'purple' },
    '2A': { name: 'Second AC', price: train.price + 800, color: 'blue' },
    '3A': { name: 'Third AC', price: train.price + 400, color: 'green' },
    'CC': { name: 'Chair Car', price: train.price + 200, color: 'orange' },
    'EC': { name: 'Executive Chair', price: train.price + 600, color: 'red' },
    'SL': { name: 'Sleeper', price: train.price, color: 'gray' },
  };

  const generateCoachLayout = (coachType) => {
    const rows = coachType === 'CC' || coachType === 'EC' ? 20 : 24;
    const seatsPerRow = coachType === 'CC' || coachType === 'EC' ? 4 : 8;
    const seats = [];

    for (let row = 1; row <= rows; row++) {
      for (let seat = 1; seat <= seatsPerRow; seat++) {
        const seatNumber = `${row}${String.fromCharCode(64 + seat)}`;
        const isOccupied = Math.random() < 0.3;
        const isSelected = selectedSeats.includes(`${coachType}1-${seatNumber}`);
        
        seats.push({
          id: `${coachType}1-${seatNumber}`,
          number: seatNumber,
          isOccupied,
          isSelected,
          row,
          seat,
        });
      }
    }
    return seats;
  };

  const coachSeats = generateCoachLayout(selectedClass);

  const handleSeatClick = (seatId) => {
    const seat = coachSeats.find(s => s.id === seatId);
    if (!seat || seat.isOccupied) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else if (selectedSeats.length < passengers) {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleConfirmSeats = () => {
    const seats = selectedSeats.map(seatId => ({
      coach: `${selectedClass}1`,
      seatNumber: seatId.split('-')[1],
      class: selectedClass,
      price: classDetails[selectedClass].price,
    }));
    onSeatSelect(seats);
  };

  const getSeatColor = (seat) => {
    if (seat.isOccupied) return 'bg-gray-300 cursor-not-allowed';
    if (seat.isSelected) return 'bg-green-500 text-white';
    return 'bg-white border-2 border-gray-200 hover:border-blue-400 cursor-pointer';
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Select Your Seats</h2>
        <div className="flex items-center text-gray-600 space-x-4">
          <span className="font-medium">{train.name} (#{train.number})</span>
          <span>•</span>
          <span>{passengers} {passengers === 1 ? 'Passenger' : 'Passengers'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Class Selection */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Class</h3>
          <div className="space-y-3">
            {train.classes.map((trainClass) => {
              const details = classDetails[trainClass];
              return (
                <button
                  key={trainClass}
                  onClick={() => {
                    setSelectedClass(trainClass);
                    setSelectedSeats([]);
                  }}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                    selectedClass === trainClass
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-800">{trainClass}</h4>
                      <p className="text-sm text-gray-600">{details.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">₹{details.price}</p>
                      <p className="text-xs text-gray-500">per seat</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Seat Legend */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-3">Seat Legend</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-white border-2 border-gray-200 rounded"></div>
                <span className="text-sm text-gray-600">Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-600">Selected</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <span className="text-sm text-gray-600">Occupied</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seat Map */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Coach {selectedClass}1</h3>
            <div className="text-sm text-gray-600">
              Selected: {selectedSeats.length}/{passengers} seats
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-8 gap-2 max-h-96 overflow-y-auto">
              {coachSeats.map((seat) => (
                <button
                  key={seat.id}
                  onClick={() => handleSeatClick(seat.id)}
                  className={`w-10 h-10 rounded text-xs font-medium flex items-center justify-center transition-all duration-200 ${getSeatColor(seat)}`}
                  disabled={seat.isOccupied}
                >
                  {seat.isOccupied ? (
                    <X size={12} className="text-gray-500" />
                  ) : seat.isSelected ? (
                    <Check size={12} />
                  ) : (
                    seat.number
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Seats Summary */}
          {selectedSeats.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-gray-800 mb-2">Selected Seats</h4>
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedSeats.map((seatId) => (
                  <span
                    key={seatId}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {seatId.split('-')[1]}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Amount:</span>
                <span className="text-xl font-bold text-blue-600">
                  ₹{selectedSeats.length * classDetails[selectedClass].price}
                </span>
              </div>
            </div>
          )}

          {/* Confirm Button */}
          <button
            onClick={handleConfirmSeats}
            disabled={selectedSeats.length !== passengers}
            className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
              selectedSeats.length === passengers
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {selectedSeats.length === passengers
              ? 'Confirm Seat Selection'
              : `Select ${passengers - selectedSeats.length} more ${passengers - selectedSeats.length === 1 ? 'seat' : 'seats'}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;

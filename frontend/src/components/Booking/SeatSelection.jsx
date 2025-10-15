import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';

const SeatSelection = ({ coach, train, requiredSeats, onClose, onConfirm }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (seatNumber, isAvailable) => {
    if (!isAvailable) return;
    setSelectedSeats((prev) => {
      if (prev.includes(seatNumber)) {
        return prev.filter((s) => s !== seatNumber);
      } else if (prev.length < requiredSeats) {
        return [...prev, seatNumber];
      }
      return prev;
    });
  };

  const getSeatColor = (seat, seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      return 'bg-blue-600 text-white border-blue-600';
    }
    if (!seat.isAvailable) {
      return 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed';
    }
    if (seat.isLower) {
      return 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200';
    }
    return 'bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200';
  };

  const getSeatLabel = (seat) => {
    let label = '';
    if (seat.isLower) label += 'L';
    else label += 'U';
    if (seat.isWindow) label += 'W';
    return label;
  };

  const getCoachLayout = () => {
    if (coach.type === '1A') {
      return { seatsPerRow: 4, aisleAfter: [1], hasWindow: true };
    } else if (coach.type === '2A') {
      return { seatsPerRow: 4, aisleAfter: [1], hasWindow: true };
    } else if (coach.type === '3A') {
      return { seatsPerRow: 6, aisleAfter: [1, 4], hasWindow: true };
    } else {
      return { seatsPerRow: 6, aisleAfter: [2], hasWindow: true };
    }
  };

  const layout = getCoachLayout();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Select Your Seats</h2>
              <p className="text-blue-100">
                {train.name} - Coach {coach.number} ({coach.type} Class)
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all"
            >
              <X size={24} />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm">
              <span className="font-semibold">{selectedSeats.length}</span> of{' '}
              <span className="font-semibold">{requiredSeats}</span> seats selected
            </div>
            <div className="w-64 bg-white bg-opacity-20 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${(selectedSeats.length / requiredSeats) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Coach Layout */}
            <div className="lg:col-span-3">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="mb-6 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-800">Coach Layout</h3>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-green-100 border-2 border-green-300 rounded" />
                      <span>Lower</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-yellow-100 border-2 border-yellow-300 rounded" />
                      <span>Upper</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-blue-600 rounded" />
                      <span>Selected</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gray-300 rounded" />
                      <span>Booked</span>
                    </div>
                  </div>
                </div>

                {/* Seat Grid */}
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-16 bg-gray-200 rounded-l-lg flex items-center justify-center">
                    <span className="text-gray-600 font-semibold text-sm transform -rotate-90 whitespace-nowrap">
                      ENTRANCE
                    </span>
                  </div>

                  <div className="ml-16 mr-16 space-y-3 py-4">
                    {coach.seats.map((row, rowIndex) => {
                      let seatIndex = 0;
                      return (
                        <div key={rowIndex} className="flex items-center justify-center space-x-2">
                          <span className="text-xs text-gray-500 w-8 text-center font-semibold">
                            {rowIndex + 1}
                          </span>

                          <div className="flex items-center space-x-2">
                            {row.map((seat, colIndex) => {
                              const currentSeatIndex = seatIndex++;
                              const showAisle = layout.aisleAfter.includes(colIndex);

                              return (
                                <React.Fragment key={currentSeatIndex}>
                                  <button
                                    onClick={() => toggleSeat(seat.number, seat.isAvailable)}
                                    disabled={!seat.isAvailable}
                                    className={`relative w-12 h-12 rounded border-2 font-semibold text-xs transition-all duration-200 ${
                                      seat.isAvailable ? 'hover:scale-110 cursor-pointer' : ''
                                    } ${getSeatColor(seat, seat.number)}`}
                                  >
                                    <div className="flex flex-col items-center justify-center">
                                      <span>{seat.number}</span>
                                      <span className="text-xs opacity-75">{getSeatLabel(seat)}</span>
                                    </div>
                                    {seat.isWindow && (
                                      <div className="absolute -right-1 -top-1 w-3 h-3 bg-cyan-500 rounded-full border border-white" />
                                    )}
                                  </button>
                                  {showAisle && (
                                    <div className="w-6 border-t-2 border-dashed border-gray-300" />
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="absolute right-0 top-0 bottom-0 w-16 bg-gray-200 rounded-r-lg flex items-center justify-center">
                    <span className="text-gray-600 font-semibold text-sm transform rotate-90 whitespace-nowrap">
                      WASHROOM
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <div className="bg-blue-50 rounded-lg p-4 sticky top-0">
                <h4 className="font-bold text-gray-800 mb-4">Booking Summary</h4>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Train:</span>
                    <span className="font-semibold">{train.number}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Coach:</span>
                    <span className="font-semibold">{coach.number}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Class:</span>
                    <span className="font-semibold">{coach.type}</span>
                  </div>
                </div>

                {selectedSeats.length > 0 && (
                  <div className="mb-6">
                    <h5 className="text-sm font-semibold text-gray-700 mb-2">Selected Seats:</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedSeats.map((seat) => (
                        <span
                          key={seat}
                          className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-semibold"
                        >
                          {seat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => onConfirm(selectedSeats)}
                  disabled={selectedSeats.length !== requiredSeats}
                  className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all ${
                    selectedSeats.length === requiredSeats
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <span>Proceed to Passenger Details</span>
                  <ArrowRight size={18} />
                </button>

                {selectedSeats.length !== requiredSeats && (
                  <p className="text-xs text-gray-600 text-center mt-2">
                    Please select {requiredSeats - selectedSeats.length} more seat(s)
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;



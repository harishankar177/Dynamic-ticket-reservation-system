import React, { useState } from 'react';
import { Train } from 'lucide-react';

const SeatSelection = ({ train, passengers, onSeatSelect }) => {
  const [selectedClass, setSelectedClass] = useState(train.classes[0]);

  const classDetails = {
    '1A': { name: 'First AC', price: train.price + 1200, color: 'purple' },
    '2A': { name: 'Second AC', price: train.price + 800, color: 'blue' },
    '3A': { name: 'Third AC', price: train.price + 400, color: 'green' },
    'CC': { name: 'Chair Car', price: train.price + 200, color: 'orange' },
    'EC': { name: 'Executive Chair', price: train.price + 600, color: 'red' },
    'SL': { name: 'Sleeper', price: train.price, color: 'gray' },
  };

  const handleConfirmSeats = () => {
    // For now, selecting full class as the seat choice
    const seats = Array.from({ length: passengers }).map((_, i) => ({
      coach: `${selectedClass}1`,
      seatNumber: `Seat ${i + 1}`,
      class: selectedClass,
      price: classDetails[selectedClass].price,
    }));
    onSeatSelect(seats);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Select Train Class</h2>
        <div className="flex items-center text-gray-600 space-x-4">
          <span className="font-medium">{train.name} (#{train.number})</span>
          <span>•</span>
          <span>{passengers} {passengers === 1 ? 'Passenger' : 'Passengers'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section: Class Selection */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Class</h3>
          <div className="space-y-3">
            {train.classes.map((trainClass) => {
              const details = classDetails[trainClass];
              return (
                <button
                  key={trainClass}
                  onClick={() => setSelectedClass(trainClass)}
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
        </div>

        {/* Right Section: Full Train Compartment View */}
        <div className="lg:col-span-2">
          <div className="bg-gray-100 rounded-xl p-6 flex flex-col items-center justify-center h-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Coach {selectedClass}1 - Full View
            </h3>

            <div className="w-full max-w-2xl h-64 bg-white border border-gray-300 rounded-lg shadow-inner flex flex-col">
              {/* Engine */}
              <div className="flex justify-center items-center h-12 bg-gray-300 border-b border-gray-400">
                <span className="text-sm font-medium text-gray-700 flex items-center">
                  <Train size={16} className="mr-2" /> Engine
                </span>
              </div>

              {/* Coach compartments */}
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 border-b border-gray-200 flex justify-between items-center px-4"
                >
                  <div
                    className={`w-16 h-12 rounded-md flex items-center justify-center bg-${classDetails[selectedClass].color}-200`}
                  >
                    <span className="text-xs font-medium text-gray-700">Comp {i * 2 + 1}</span>
                  </div>
                  <div
                    className={`w-16 h-12 rounded-md flex items-center justify-center bg-${classDetails[selectedClass].color}-200`}
                  >
                    <span className="text-xs font-medium text-gray-700">Comp {i * 2 + 2}</span>
                  </div>
                </div>
              ))}

              {/* End */}
              <div className="flex justify-center items-center h-12 bg-gray-300 border-t border-gray-400">
                <span className="text-sm font-medium text-gray-700">End</span>
              </div>
            </div>

            <p className="mt-4 text-gray-600 text-sm text-center">
              This is a visual representation of the train compartment layout.
            </p>

            {/* Confirm Button */}
            <button
              onClick={handleConfirmSeats}
              className="mt-6 w-full py-3 rounded-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Confirm Class Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;

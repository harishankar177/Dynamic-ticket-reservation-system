import React, { useState } from 'react';
import { User, Mail, Phone } from 'lucide-react';

const PassengerDetails = ({ passengerCount, selectedSeats, onSubmit }) => {
  const [passengers, setPassengers] = useState(
    Array(passengerCount).fill(null).map(() => ({
      name: '',
      age: 0,
      gender: '',
      email: '',
      phone: '',
    }))
  );

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value,
    };
    setPassengers(updatedPassengers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(passengers);
  };

  const isFormValid = passengers.every(
    (passenger) =>
      passenger.name &&
      passenger.age > 0 &&
      passenger.gender &&
      passenger.email &&
      passenger.phone
  );

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Passenger Details</h2>
        <p className="text-gray-600">Please provide details for all passengers</p>
      </div>

      {/* Booking Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Selected Seats</h4>
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map((seat, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white text-blue-800 rounded-full text-sm font-medium border"
                >
                  {seat.coach}-{seat.seatNumber}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Class</h4>
            <span className="px-3 py-1 bg-white text-purple-800 rounded-full text-sm font-medium border">
              {selectedSeats[0]?.class}
            </span>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Total Amount</h4>
            <p className="text-2xl font-bold text-blue-600">
              ₹{selectedSeats.reduce((total, seat) => total + seat.price, 0)}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {passengers.map((passenger, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <User className="text-blue-600 mr-2" size={20} />
                <h3 className="text-lg font-semibold text-gray-800">
                  Passenger {index + 1}
                  {selectedSeats[index] && (
                    <span className="ml-2 text-sm font-normal text-gray-600">
                      (Seat: {selectedSeats[index].coach}-{selectedSeats[index].seatNumber})
                    </span>
                  )}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={passenger.name}
                    onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter full name as per ID"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={passenger.age || ''}
                    onChange={(e) => handlePassengerChange(index, 'age', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter age"
                    min="1"
                    max="120"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={passenger.gender}
                    onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {index === 0 && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                          type="email"
                          value={passenger.email}
                          onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter email address"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                          type="tel"
                          value={passenger.phone}
                          onChange={(e) => handlePassengerChange(index, 'phone', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter 10-digit phone number"
                          pattern="[0-9]{10}"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-8">
          <h4 className="font-medium text-yellow-800 mb-2">Important Notes:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Please carry a valid photo ID proof during travel</li>
            <li>• Name should match exactly with your ID proof</li>
            <li>• Children above 5 years need a separate ticket</li>
            <li>• Senior citizens (above 60) and students may get discounts</li>
          </ul>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
              isFormValid
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Proceed to Payment
          </button>
        </div>
      </form>
    </div>
  );
};

export default PassengerDetails;

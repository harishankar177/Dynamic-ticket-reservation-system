import React, { useState } from 'react';
import { User, Phone, Calendar, Train } from 'lucide-react';

const PassengerDetails = ({
  passengerCount = 1,
  selectedTrains = [],
  totalAmount = 0,
  onSubmit
}) => {
  const [passengers, setPassengers] = useState(
    Array.from({ length: passengerCount }, () => ({
      name: '',
      phone: '',
      age: '',
      gender: '',
      email: ''
    }))
  );

  const handleChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) && email.length <= 50;
  };

  const validatePhone = (phone) => {
    const regex = /^\d{10}$/;
    return regex.test(phone);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.name || !p.age || !p.gender) {
        alert(`Please fill Name, Age, and Gender for passenger ${i + 1}`);
        return;
      }

      if (i === 0) {
        // First passenger: all fields mandatory
        if (!p.email || !validateEmail(p.email)) {
          alert('Please enter a valid email (max 50 chars) for the first passenger');
          return;
        }
        if (!p.phone || !validatePhone(p.phone)) {
          alert('Please enter a valid 10-digit phone number for the first passenger');
          return;
        }
      } else {
        // Other passengers: optional phone/email
        if (p.phone && !validatePhone(p.phone)) {
          alert(`Phone number for passenger ${i + 1} must be exactly 10 digits`);
          return;
        }
        if (p.email && !validateEmail(p.email)) {
          alert(`Email for passenger ${i + 1} is not valid or too long (max 50 chars)`);
          return;
        }
      }
    }

    onSubmit(passengers);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-2">Passenger Details</h2>
      <p className="text-gray-500 mb-6">Please provide details for all passengers</p>

      <div className="bg-purple-50 p-4 rounded-lg mb-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
        <div>
          <p className="text-gray-500 text-sm">Selected Trains</p>
          <span className="bg-white px-2 py-1 rounded flex items-center space-x-1">
            <Train size={16} />
            {selectedTrains.join(', ')}
          </span>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Total Amount</p>
          <span className="text-blue-600 font-semibold text-lg">₹{totalAmount}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {passengers.map((p, index) => (
          <div key={index} className="p-6 border rounded-lg space-y-4">
            <h3 className="font-medium text-lg">
              Passenger {index + 1} (Train: {selectedTrains[index] || 'N/A'})
            </h3>

            {/* Name */}
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
              <label className="w-full md:w-1/4 text-gray-600">Full Name *</label>
              <div className="flex-1 flex items-center space-x-2">
                <User size={18} />
                <input
                  type="text"
                  placeholder="Enter full name as per ID"
                  value={p.name}
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                  className="flex-1 p-2 border rounded w-full"
                  required
                />
              </div>
            </div>

            {/* Age */}
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
              <label className="w-full md:w-1/4 text-gray-600">Age *</label>
              <div className="flex-1 flex items-center space-x-2">
                <Calendar size={18} />
                <input
                  type="number"
                  placeholder="Enter age"
                  value={p.age}
                  onChange={(e) => handleChange(index, 'age', e.target.value)}
                  className="flex-1 p-2 border rounded w-full"
                  required
                  min={0}
                />
              </div>
            </div>

            {/* Gender */}
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
              <label className="w-full md:w-1/4 text-gray-600">Gender *</label>
              <select
                value={p.gender}
                onChange={(e) => handleChange(index, 'gender', e.target.value)}
                className="flex-1 p-2 border rounded w-full"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Email */}
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
              <label className="w-full md:w-1/4 text-gray-600">
                Email {index === 0 ? '*' : '(Optional)'}
              </label>
              <input
                type="email"
                placeholder="Enter email address"
                value={p.email}
                onChange={(e) => handleChange(index, 'email', e.target.value)}
                className="flex-1 p-2 border rounded w-full"
                maxLength={50}
                required={index === 0}
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
              <label className="w-full md:w-1/4 text-gray-600">
                Phone {index === 0 ? '*' : '(Optional)'}
              </label>
              <div className="flex-1 flex items-center space-x-2">
                <Phone size={18} />
                <input
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  value={p.phone}
                  onChange={(e) => handleChange(index, 'phone', e.target.value)}
                  className="flex-1 p-2 border rounded w-full"
                  maxLength={10}
                  required={index === 0}
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 text-lg font-medium"
        >
          Continue to Payment
        </button>
      </form>
    </div>
  );
};

export default PassengerDetails;

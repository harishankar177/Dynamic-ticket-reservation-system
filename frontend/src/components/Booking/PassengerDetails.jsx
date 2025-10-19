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
    // Restrict name field to alphabets and spaces only
    if (field === 'name') {
      value = value.replace(/[^a-zA-Z\s]/g, '');
    }

    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 50;
  const validatePhone = (phone) => /^\d{10}$/.test(phone);

  const handleSubmit = (e) => {
    e.preventDefault();
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.name || !p.age || !p.gender) {
        alert(`Please fill Name, Age, and Gender for passenger ${i + 1}`);
        return;
      }

      if (i === 0) {
        if (!p.email || !validateEmail(p.email)) {
          alert('Please enter a valid email (max 50 chars) for the first passenger');
          return;
        }
        if (!p.phone || !validatePhone(p.phone)) {
          alert('Please enter a valid 10-digit phone number for the first passenger');
          return;
        }
      } else {
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

      {/* 🔙 Back Button */}
      <button
        onClick={() => window.history.back()}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors font-medium mb-6"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        <span>Back to Train Selection</span>
      </button>

      {/* 🚆 Train Info Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-5 rounded-xl flex justify-between items-center shadow-lg mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Train size={28} />
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              {selectedTrains[0] || 'Selected Train'}
            </h2>
            <p className="text-sm opacity-90">
              Train #{selectedTrains.length > 1 ? selectedTrains.join(', ') : 'N/A'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">₹{totalAmount}</p>
          <p className="text-sm opacity-80">Total Fare</p>
        </div>
      </div>

      {/* 👤 Passenger Form */}
      <h2 className="text-2xl font-semibold mb-2">Passenger Details</h2>
      <p className="text-gray-500 mb-6">Please provide details for all passengers</p>

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
                  placeholder="Enter full name (letters only)"
                  value={p.name}
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                  className="flex-1 p-2 border rounded w-full"
                  required
                  pattern="[A-Za-z\s]+"
                  title="Name should contain only letters and spaces"
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

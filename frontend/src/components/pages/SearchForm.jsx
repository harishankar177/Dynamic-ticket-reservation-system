import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users, ArrowRightLeft } from 'lucide-react';

const SearchForm = ({ onSearch }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);

  // Predefined routes and trains
  const routes = {
    'Chennai Egmore': {
      'Kanniyakumari': ['Kanniyakumari SF Express', 'Kashi Tami Sangamam Express'],
      'Madurai': ['Madurai Tejas Express', 'Vaigai SF Express', 'Pothigai SF Express', 'Chendur SF Express']
    },
    'Kanniyakumari': {
      'New Delhi': ['Thirukkural SF Express', 'Himsagar Express']
    },
    'Chennai Central': {
      'Mysuru': ['Mysuru Shatabdi Express', 'Ashokapuram SF Express', 'Kaveri Express']
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!from || !to || !date || !passengers) return alert('Please fill all fields');
    onSearch({ from, to, date, passengers });
  };

  const swapStations = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleQuickSelect = (fromCity, toCity) => {
    setFrom(fromCity);
    setTo(toCity);
  };

  const cities = Object.keys(routes);
  const destinationOptions = from ? Object.keys(routes[from]) : [];

  const popularRoutes = [
    ['Chennai Egmore', 'Kanniyakumari'],
    ['Chennai Egmore', 'Madurai'],
    ['Kanniyakumari', 'New Delhi'],
    ['Chennai Central', 'Mysuru']
  ];

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Book Your Train Journey</h2>
        <p className="text-gray-600">Find and book trains on real Indian routes</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* From */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
              <select
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  setTo('');
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select departure city</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap */}
          <div className="flex items-end pb-3 justify-center">
            <button
              type="button"
              onClick={swapStations}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            >
              <ArrowRightLeft size={20} />
            </button>
          </div>

          {/* To */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                disabled={!from}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                required
              >
                <option value="">Select destination city</option>
                {destinationOptions.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Journey Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Passengers + Search Button */}
        <div className="flex flex-col md:flex-row gap-4 items-end mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Passengers</label>
            <div className="relative">
              <Users className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="number"
                min={1}
                value={passengers}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setPassengers(Number(value));
                  }
                }}
                placeholder="Enter number of passengers"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            <Search size={20} />
            <span>Search Trains</span>
          </button>
        </div>
      </form>

      {/* Popular Routes */}
      <div className="max-w-6xl mx-auto mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Popular Routes</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularRoutes.map(([fromCity, toCity], index) => (
            <div
              key={index}
              onClick={() => handleQuickSelect(fromCity, toCity)}
              className="cursor-pointer p-4 bg-white rounded-xl shadow hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-blue-300"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-800">{fromCity}</span>
                <ArrowRightLeft size={16} className="text-gray-400" />
                <span className="font-medium text-gray-800">{toCity}</span>
              </div>
              <p className="text-sm text-gray-600">
                Available Trains: {routes[fromCity][toCity]?.length || 0}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchForm;

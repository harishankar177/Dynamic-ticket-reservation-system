import React from 'react';
import { Clock, MapPin, Star, Wifi, Coffee, Shield } from 'lucide-react';

const TrainList = ({ searchData, onSelectTrain }) => {
  const trains = [
    {
      id: '1',
      name: 'Rajdhani Express',
      number: '12001',
      departure: '16:55',
      arrival: '09:15+1',
      duration: '16h 20m',
      price: 2340,
      availableSeats: 47,
      classes: ['1A', '2A', '3A', 'SL'],
    },
    {
      id: '2',
      name: 'Shatabdi Express',
      number: '12002',
      departure: '06:00',
      arrival: '14:30',
      duration: '8h 30m',
      price: 1850,
      availableSeats: 23,
      classes: ['CC', 'EC'],
    },
    {
      id: '3',
      name: 'Duronto Express',
      number: '12259',
      departure: '22:50',
      arrival: '15:10+1',
      duration: '16h 20m',
      price: 1980,
      availableSeats: 67,
      classes: ['1A', '2A', '3A', 'SL'],
    },
    {
      id: '4',
      name: 'Garib Rath',
      number: '12611',
      departure: '05:15',
      arrival: '21:45',
      duration: '16h 30m',
      price: 980,
      availableSeats: 134,
      classes: ['3A', 'CC'],
    },
    {
      id: '5',
      name: 'Jan Shatabdi',
      number: '12023',
      departure: '14:20',
      arrival: '06:50+1',
      duration: '16h 30m',
      price: 720,
      availableSeats: 89,
      classes: ['CC', 'SL'],
    },
  ];

  const getClassColor = (trainClass) => {
    switch (trainClass) {
      case '1A':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case '2A':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case '3A':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CC':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'EC':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'SL':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAvailabilityColor = (seats) => {
    if (seats > 50) return 'text-green-600';
    if (seats > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Available Trains</h2>
        <div className="flex items-center text-gray-600 space-x-4">
          <div className="flex items-center space-x-1">
            <MapPin size={16} />
            <span>{searchData.from} → {searchData.to}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock size={16} />
            <span>{new Date(searchData.date).toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>{searchData.passengers} {searchData.passengers === 1 ? 'Passenger' : 'Passengers'}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {trains.map((train) => (
          <div
            key={train.id}
            className="bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{train.name}</h3>
                    <p className="text-gray-600">#{train.number}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="text-yellow-500 fill-current" size={16} />
                    <span className="text-sm font-medium">4.2</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Wifi size={16} />
                    <Coffee size={16} />
                    <Shield size={16} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800">{train.departure}</p>
                  <p className="text-gray-600">{searchData.from}</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1 h-0.5 bg-gray-300"></div>
                    <Clock size={16} className="text-gray-400" />
                    <div className="flex-1 h-0.5 bg-gray-300"></div>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                  <p className="text-gray-600 font-medium">{train.duration}</p>
                </div>
                
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800">{train.arrival}</p>
                  <p className="text-gray-600">{searchData.to}</p>
                </div>
                
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">₹{train.price}</p>
                  <p className={`text-sm font-medium ${getAvailabilityColor(train.availableSeats)}`}>
                    {train.availableSeats} seats available
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {train.classes.map((trainClass) => (
                    <span
                      key={trainClass}
                      className={`px-3 py-1 text-xs font-medium border rounded-full ${getClassColor(trainClass)}`}
                    >
                      {trainClass}
                    </span>
                  ))}
                </div>
                
                <button
                  onClick={() => onSelectTrain(train)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Departure Time</label>
            <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>All Times</option>
              <option>Early Morning (00:00 - 06:00)</option>
              <option>Morning (06:00 - 12:00)</option>
              <option>Afternoon (12:00 - 18:00)</option>
              <option>Evening (18:00 - 24:00)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Journey Duration</label>
            <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>All Durations</option>
              <option>Under 12 hours</option>
              <option>12-18 hours</option>
              <option>18+ hours</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
            <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>All Prices</option>
              <option>Under ₹1000</option>
              <option>₹1000 - ₹2000</option>
              <option>₹2000+</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Train Type</label>
            <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>All Types</option>
              <option>Express</option>
              <option>Superfast</option>
              <option>Mail</option>
              <option>Passenger</option>
            </select>
          </div>
          </div>
      </div>
    </div>
  );
}
export default TrainList;


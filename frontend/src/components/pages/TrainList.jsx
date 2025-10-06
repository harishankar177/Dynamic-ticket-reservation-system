import React from 'react';
import { Clock, MapPin, Star, Wifi, Coffee, Shield } from 'lucide-react';

const TrainList = ({ searchData, onSelectTrain }) => {
  // ✅ Real train data (linked to SearchForm)
  const routeTrains = {
    'Chennai Egmore-Kanniyakumari': [
      {
        id: '1',
        name: 'Kanniyakumari SF Express',
        number: '12633',
        departure: '17:15',
        arrival: '06:20+1',
        duration: '13h 05m',
        price: 1450,
        availableSeats: 62,
        classes: ['1A', '2A', '3A', 'SL'],
      },
      {
        id: '2',
        name: 'Kashi Tami Sangamam Express',
        number: '12666',
        departure: '05:30',
        arrival: '19:15',
        duration: '13h 45m',
        price: 1320,
        availableSeats: 48,
        classes: ['2A', '3A', 'SL'],
      },
    ],

    'Chennai Egmore-Madurai': [
      {
        id: '3',
        name: 'Madurai Tejas Express',
        number: '22671',
        departure: '06:00',
        arrival: '12:20',
        duration: '6h 20m',
        price: 1120,
        availableSeats: 30,
        classes: ['EC', 'CC'],
      },
      {
        id: '4',
        name: 'Vaigai SF Express',
        number: '12635',
        departure: '13:50',
        arrival: '20:45',
        duration: '6h 55m',
        price: 980,
        availableSeats: 54,
        classes: ['2A', '3A', 'SL'],
      },
      {
        id: '5',
        name: 'Pothigai SF Express',
        number: '12661',
        departure: '20:15',
        arrival: '04:50+1',
        duration: '8h 35m',
        price: 1050,
        availableSeats: 70,
        classes: ['2A', '3A', 'SL'],
      },
      {
        id: '6',
        name: 'Chendur SF Express',
        number: '20681',
        departure: '18:20',
        arrival: '02:30+1',
        duration: '8h 10m',
        price: 990,
        availableSeats: 41,
        classes: ['2A', '3A', 'SL'],
      },
    ],

    'Kanniyakumari-New Delhi': [
      {
        id: '7',
        name: 'Thirukkural SF Express',
        number: '12641',
        departure: '19:15',
        arrival: '06:20+2',
        duration: '35h 05m',
        price: 2520,
        availableSeats: 28,
        classes: ['1A', '2A', '3A', 'SL'],
      },
      {
        id: '8',
        name: 'Himsagar Express',
        number: '16317',
        departure: '14:15',
        arrival: '10:30+3',
        duration: '68h 15m',
        price: 2980,
        availableSeats: 15,
        classes: ['2A', '3A', 'SL'],
      },
    ],

    'Chennai Central-Mysuru': [
      {
        id: '9',
        name: 'Mysuru Shatabdi Express',
        number: '12007',
        departure: '06:00',
        arrival: '13:00',
        duration: '7h 00m',
        price: 1150,
        availableSeats: 36,
        classes: ['CC', 'EC'],
      },
      {
        id: '10',
        name: 'Ashokapuram SF Express',
        number: '22682',
        departure: '23:30',
        arrival: '07:15+1',
        duration: '7h 45m',
        price: 920,
        availableSeats: 52,
        classes: ['2A', '3A', 'SL'],
      },
      {
        id: '11',
        name: 'Kaveri Express',
        number: '16021',
        departure: '21:00',
        arrival: '06:30+1',
        duration: '9h 30m',
        price: 880,
        availableSeats: 67,
        classes: ['2A', '3A', 'SL'],
      },
    ],
  };

  // Get trains based on search route
  const routeKey = `${searchData.from}-${searchData.to}`;
  const trains = routeTrains[routeKey] || [];

  const getClassColor = (trainClass) => {
    switch (trainClass) {
      case '1A': return 'bg-purple-100 text-purple-800 border-purple-200';
      case '2A': return 'bg-blue-100 text-blue-800 border-blue-200';
      case '3A': return 'bg-green-100 text-green-800 border-green-200';
      case 'CC': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'EC': return 'bg-red-100 text-red-800 border-red-200';
      case 'SL': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

      {trains.length === 0 ? (
        <p className="text-gray-600">⚠️ No trains found for this route.</p>
      ) : (
        <div className="space-y-4">
          {trains.map((train) => (
            <div
              key={train.id}
              className="bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 overflow-hidden"
            >
              <div className="p-6">
                {/* Train Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{train.name}</h3>
                    <p className="text-gray-600">#{train.number}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="text-yellow-500 fill-current" size={16} />
                    <span className="text-sm font-medium">4.2</span>
                  </div>
                </div>

                {/* Train Details */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">{train.departure}</p>
                    <p className="text-gray-600">{searchData.from}</p>
                  </div>
                  <div className="text-center">
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

                {/* Classes + Book */}
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
      )}
    </div>
  );
};

export default TrainList;

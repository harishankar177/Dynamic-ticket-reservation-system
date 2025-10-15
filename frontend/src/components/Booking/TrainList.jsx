import React, { useState } from 'react';
import { Clock, MapPin, Star, Info } from 'lucide-react';

const TrainList = ({ searchData, onSelectTrain, onShowLiveStatus }) => {
  const [selectedClass, setSelectedClass] = useState(null);

  const classPrices = {
    '1A': 3500,
    '2A': 2200,
    '3A': 1450,
    'SL': 850,
    'CC': 1800,
    'EC': 2500,
  };

  const routeTrains = {
    'Chennai Egmore-Kanniyakumari': [
      {
        id: '1',
        name: 'Kanniyakumari SF Express',
        number: '12633',
        departure: '17:15',
        arrival: '06:20+1',
        duration: '13h 05m',
        availableSeats: 62,
        classes: ['1A', '2A', '3A', 'SL'],
        classAvailability: {
          '1A': { available: 12, waitlist: 0 },
          '2A': { available: 18, waitlist: 0 },
          '3A': { available: 22, waitlist: 0 },
          'SL': { available: 10, waitlist: 5 },
        },
        route: [
          { name: 'Chennai Egmore', departure: '17:15', distance: 0, platform: '3' },
          { name: 'Tambaram', arrival: '17:45', departure: '17:47', distance: 27, platform: '2' },
          { name: 'Chengalpattu', arrival: '18:20', departure: '18:22', distance: 56, platform: '1' },
          { name: 'Villupuram', arrival: '19:45', departure: '19:50', distance: 156, platform: '4' },
          { name: 'Trichy', arrival: '22:30', departure: '22:35', distance: 322, platform: '2' },
          { name: 'Dindigul', arrival: '00:15', departure: '00:20', distance: 422, platform: '3' },
          { name: 'Madurai', arrival: '01:30', departure: '01:35', distance: 487, platform: '1' },
          { name: 'Virudunagar', arrival: '02:20', departure: '02:22', distance: 542, platform: '2' },
          { name: 'Tirunelveli', arrival: '04:10', departure: '04:15', distance: 654, platform: '3' },
          { name: 'Nagercoil', arrival: '05:45', departure: '05:50', distance: 731, platform: '1' },
          { name: 'Kanniyakumari', arrival: '06:20', distance: 752, platform: '1' },
        ],
        currentStation: 3,
        isRunning: true,
      },
      {
        id: '2',
        name: 'Kashi Tami Sangamam Express',
        number: '12666',
        departure: '05:30',
        arrival: '19:15',
        duration: '13h 45m',
        availableSeats: 48,
        classes: ['2A', '3A', 'SL'],
        classAvailability: {
          '2A': { available: 15, waitlist: 0 },
          '3A': { available: 20, waitlist: 0 },
          'SL': { available: 0, waitlist: 13 },
        },
        route: [
          { name: 'Chennai Egmore', departure: '05:30', distance: 0, platform: '2' },
          { name: 'Tambaram', arrival: '06:00', departure: '06:02', distance: 27, platform: '3' },
          { name: 'Chengalpattu', arrival: '06:35', departure: '06:37', distance: 56, platform: '2' },
          { name: 'Villupuram', arrival: '08:00', departure: '08:05', distance: 156, platform: '1' },
          { name: 'Trichy', arrival: '10:45', departure: '10:50', distance: 322, platform: '3' },
          { name: 'Dindigul', arrival: '12:30', departure: '12:35', distance: 422, platform: '2' },
          { name: 'Madurai', arrival: '13:45', departure: '13:50', distance: 487, platform: '4' },
          { name: 'Virudunagar', arrival: '14:35', departure: '14:37', distance: 542, platform: '1' },
          { name: 'Tirunelveli', arrival: '16:25', departure: '16:30', distance: 654, platform: '2' },
          { name: 'Nagercoil', arrival: '18:00', departure: '18:05', distance: 731, platform: '3' },
          { name: 'Kanniyakumari', arrival: '19:15', distance: 752, platform: '1' },
        ],
        currentStation: 0,
        isRunning: false,
      },
    ],
  };

  const routeKey = `${searchData.from}-${searchData.to}`;
  const trains = routeTrains[routeKey] || [];

  const getClassColor = (trainClass) => {
    switch (trainClass) {
      case '1A': return 'bg-amber-100 text-amber-800 border-amber-200';
      case '2A': return 'bg-blue-100 text-blue-800 border-blue-200';
      case '3A': return 'bg-green-100 text-green-800 border-green-200';
      case 'CC': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'EC': return 'bg-red-100 text-red-800 border-red-200';
      case 'SL': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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
        <p className="text-gray-600">No trains found for this route.</p>
      ) : (
        <div className="space-y-4">
          {trains.map((train) => (
            <div
              key={train.id}
              className="bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-bold text-gray-800">{train.name}</h3>
                    <span className="text-lg font-semibold text-blue-600">(#{train.number})</span>
                    {train.isRunning && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold animate-pulse">
                        Running
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Star className="text-yellow-500 fill-current" size={16} />
                      <span className="text-sm font-medium">4.2</span>
                    </div>
                    <button
                      onClick={() => onShowLiveStatus(train)}
                      className="flex items-center space-x-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg text-sm"
                    >
                      <Info size={16} />
                      <span>Live Status</span>
                    </button>
                  </div>
                </div>

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
                    {selectedClass?.trainId === train.id && (
                      <>
                        <p className="text-2xl font-bold text-blue-600">
                          ₹{classPrices[selectedClass.className]}
                        </p>
                        <p className="text-sm text-gray-600">{selectedClass.className} Class</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-col space-y-4">
                  <div className="flex flex-wrap gap-3">
                    {train.classes.map((trainClass) => {
                      const availability = train.classAvailability[trainClass];
                      const isSelected = selectedClass?.trainId === train.id && selectedClass?.className === trainClass;

                      return (
                        <div key={trainClass} className="flex flex-col items-center">
                          <button
                            onClick={() => setSelectedClass({ trainId: train.id, className: trainClass })}
                            className={`px-4 py-2 text-sm font-semibold border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
                              isSelected
                                ? 'border-blue-600 bg-blue-600 text-white shadow-lg'
                                : getClassColor(trainClass)
                            }`}
                          >
                            {trainClass}
                          </button>
                          <div className="mt-1 text-xs font-medium">
                            {availability.available > 0 ? (
                              <span className="text-green-600">Avail: {availability.available}</span>
                            ) : (
                              <span className="text-red-600">WL: {availability.waitlist}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        if (selectedClass?.trainId === train.id) {
                          onSelectTrain(train, selectedClass.className);
                        } else {
                          alert('Please select a class first');
                        }
                      }}
                      disabled={!selectedClass || selectedClass.trainId !== train.id}
                      className={`px-8 py-3 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl ${
                        selectedClass?.trainId === train.id
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Book Now
                    </button>
                  </div>
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
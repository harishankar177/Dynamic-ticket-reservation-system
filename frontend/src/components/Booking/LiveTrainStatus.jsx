import React, { useState, useEffect, useMemo } from 'react';
import { X, Clock, Activity, AlertCircle, Train as TrainIcon } from 'lucide-react';

const LiveTrainStatus = ({ train = {}, onClose, onSelectCoach }) => {
  // ✅ Safe route derivation
  const route = useMemo(() => {
    if (Array.isArray(train.route) && train.route.length > 0) {
      return train.route.map((r) => ({
        name: r.name || r.stopName || 'Unknown',
        arrival: r.arrival || '',
        departure: r.departure || '',
        platform: r.platform || '',
        distance: r.distance || 0,
        delay: r.delay || 0,
      }));
    } else if (Array.isArray(train.routes)) {
      return train.routes.map((r) => ({
        name: r.stopName || 'Unknown',
        arrival: r.arrival || '',
        departure: r.departure || '',
        platform: r.platform || '',
        distance: r.distance || 0,
        delay: r.delay || 0,
      }));
    } else if (train.from && train.to) {
      return [{ name: train.from }, { name: train.to }];
    }
    return [];
  }, [train]);

  // ✅ Safe classes derivation
  const classes = useMemo(() => {
    if (Array.isArray(train.classes) && train.classes.length > 0) return train.classes;
    if (Array.isArray(train.coaches))
      return Array.from(new Set(train.coaches.map((c) => c.type).filter(Boolean)));
    return ['SL', '3A', '2A'];
  }, [train]);

  // ✅ Safe availability map
  const classAvailability = useMemo(() => {
    const map = {};
    if (train.classAvailability) return train.classAvailability;
    if (Array.isArray(train.coaches)) {
      train.coaches.forEach((c) => {
        if (c && c.type) map[c.type] = { available: c.seatsAvailable ?? 0 };
      });
    }
    return map;
  }, [train]);

  // ✅ Live progress simulation
  const [currentStationIndex, setCurrentStationIndex] = useState(
    Math.min(train.currentStation ?? 0, Math.max(0, (route.length || 1) - 1))
  );
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (train.isRunning && route.length > 1) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setCurrentStationIndex((curr) => Math.min(curr + 1, route.length - 1));
            return 0;
          }
          return prev + 2;
        });
      }, 200);
      return () => clearInterval(timer);
    }
  }, [train.isRunning, route.length]);

  // ✅ Seat generation helpers
  const generateSeats = (total, available, classType) => {
    const rows = classType === '1A' ? 6 : classType === '2A' ? 18 : classType === '3A' ? 21 : 24;
    const seatsPerRow = 3;
    const seats = [];

    let seatNum = 1;
    for (let row = 0; row < rows; row++) {
      const rowSeats = [];
      for (let col = 0; col < seatsPerRow; col++) {
        const isAvailable = Math.random() < available / total;
        rowSeats.push({
          number: `${seatNum}`,
          isAvailable,
          isLower: row % 2 === 0,
          isWindow: col === 0 || col === seatsPerRow - 1,
        });
        seatNum++;
      }
      seats.push(rowSeats);
    }
    return seats;
  };

  // ✅ Coach generation
  const generateCoaches = () => {
    const coaches = [];
    classes.forEach((classType) => {
      const coachCount = classType === 'SL' ? 8 : classType === '3A' ? 4 : 2;
      const totalSeats =
        classType === 'SL' ? 72 : classType === '3A' ? 64 : classType === '2A' ? 54 : 18;
      const availability = classAvailability[classType] ?? {
        available: Math.floor(totalSeats * coachCount * 0.6),
      };

      for (let i = 1; i <= coachCount; i++) {
        const availableSeats =
          Math.floor((availability.available / coachCount) * 0.8) +
          Math.floor(Math.random() * 5);
        coaches.push({
          id: `${classType}-${i}`,
          type: classType,
          number: `${classType}${i}`,
          totalSeats,
          availableSeats: Math.max(0, Math.min(availableSeats, totalSeats)),
          seats: generateSeats(totalSeats, availableSeats, classType),
        });
      }
    });
    return coaches;
  };

  const [coaches] = useState(generateCoaches);

  const getStationStatus = (index) => {
    if (index < currentStationIndex) return 'completed';
    if (index === currentStationIndex) return 'current';
    return 'upcoming';
  };

  const getCoachColor = (type) => {
    switch (type) {
      case '1A':
        return 'bg-amber-500';
      case '2A':
        return 'bg-blue-500';
      case '3A':
        return 'bg-green-500';
      case 'SL':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  // ✅ Render (UI untouched)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{train.name || 'Train Details'}</h2>
            {train.number && <p className="text-blue-100">Train #{train.number}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Route Status */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Live Route Status</h3>
                {train.isRunning && (
                  <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 rounded-full">
                    <Activity className="text-green-600 animate-pulse" size={16} />
                    <span className="text-green-700 font-semibold text-sm">Running</span>
                  </div>
                )}
              </div>

              <div className="relative">
                {route.map((station, index) => {
                  const status = getStationStatus(index);
                  const isLast = index === route.length - 1;

                  return (
                    <div key={index} className="relative">
                      <div className="flex items-start space-x-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-4 h-4 rounded-full border-4 z-10 transition-all duration-300 ${
                              status === 'completed'
                                ? 'bg-green-500 border-green-200'
                                : status === 'current'
                                ? 'bg-blue-500 border-blue-200 animate-pulse scale-125'
                                : 'bg-gray-300 border-gray-100'
                            }`}
                          />
                          {!isLast && (
                            <div className="relative w-1 h-24 bg-gray-200 my-1">
                              {status === 'current' && (
                                <div
                                  className="absolute top-0 left-0 w-full bg-gradient-to-b from-blue-500 to-transparent transition-all duration-200"
                                  style={{ height: `${progress}%` }}
                                />
                              )}
                              {status === 'completed' && (
                                <div className="absolute top-0 left-0 w-full h-full bg-green-500" />
                              )}
                              {status === 'current' && (
                                <div
                                  className="absolute left-1/2 -translate-x-1/2 transition-all duration-200"
                                  style={{ top: `${progress}%` }}
                                >
                                  <TrainIcon className="text-blue-600 animate-bounce" size={20} />
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div
                          className={`flex-1 pb-8 ${
                            status === 'current' ? 'bg-blue-50 -ml-2 pl-2 pr-4 py-2 rounded-lg' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <h4
                              className={`font-bold ${
                                status === 'current' ? 'text-blue-700 text-lg' : 'text-gray-800'
                              }`}
                            >
                              {station.name}
                            </h4>
                            {station.platform && (
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                Platform {station.platform}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            {station.arrival && (
                              <div className="flex items-center space-x-1">
                                <Clock size={14} />
                                <span>Arr: {station.arrival}</span>
                              </div>
                            )}
                            {station.departure && (
                              <div className="flex items-center space-x-1">
                                <Clock size={14} />
                                <span>Dep: {station.departure}</span>
                              </div>
                            )}
                          </div>
                          {station.distance > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              {station.distance} km from origin
                            </p>
                          )}
                          {station.delay > 0 && (
                            <div className="flex items-center space-x-1 text-red-600 text-xs mt-1">
                              <AlertCircle size={12} />
                              <span>Delayed by {station.delay} min</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Coaches */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6">Select Coach</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-700 mb-3">Train Composition</h4>
                  <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                    <div className="flex items-center px-3 py-2 bg-gray-800 text-white rounded-lg text-sm font-semibold whitespace-nowrap">
                      Engine
                    </div>
                    {coaches.map((coach) => (
                      <div
                        key={coach.id}
                        className={`px-3 py-2 ${getCoachColor(coach.type)} text-white rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer hover:scale-105 transition-transform`}
                        onClick={() => onSelectCoach(coach)}
                      >
                        {coach.number}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto">
                  {coaches.map((coach) => (
                    <div
                      key={coach.id}
                      onClick={() => onSelectCoach(coach)}
                      className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 ${getCoachColor(coach.type)} rounded-full`} />
                          <h4 className="font-bold text-gray-800">{coach.number}</h4>
                        </div>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {coach.type} Class
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total Seats:</span>
                          <span className="font-semibold">{coach.totalSeats}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Available:</span>
                          <span
                            className={`font-semibold ${
                              coach.availableSeats > 10 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {coach.availableSeats}
                          </span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              coach.availableSeats > 10 ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{
                              width: `${(coach.availableSeats / coach.totalSeats) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTrainStatus;

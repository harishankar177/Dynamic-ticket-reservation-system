import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Star, Info } from 'lucide-react';
import axiosInstance from '../../axiosInstance';

const TrainList = ({ searchData, onSelectTrain, onShowLiveStatus }) => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const classPrices = {
    '1A': 3500,
    '2A': 2200,
    '3A': 1450,
    'SL': 850,
    'CC': 1800,
    'EC': 2500,
  };

  // Fetch trains from DB
  useEffect(() => {
    let mounted = true;

    const fetchTrains = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get('/trains');
        if (!mounted) return;

        const allTrains = res.data || [];

        // Filter trains that include both from/to in the right order
        const matchedTrains = allTrains.filter((train) => {
          const stops = [];
          if (train.from) stops.push(train.from);
          if (Array.isArray(train.routes))
            stops.push(...train.routes.map((r) => r.stopName));
          if (train.to) stops.push(train.to);

          const fromIndex = stops.findIndex((s) => s === searchData.from);
          const toIndex = stops.findIndex((s) => s === searchData.to);
          return fromIndex >= 0 && toIndex > fromIndex;
        });

        setTrains(matchedTrains);
      } catch (err) {
        console.error('Failed to fetch trains', err);
        setError('Failed to load trains. Please try again later.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (searchData && searchData.from && searchData.to) {
      fetchTrains();
    }

    return () => {
      mounted = false;
    };
  }, [searchData]);

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

  if (loading) {
    return (
      <div className="p-8 text-gray-700 text-center">
        <p>Loading available trains...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-600 text-center">
        <p>{error}</p>
      </div>
    );
  }

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
          {trains.map((train) => {
            const trainId = train._id || train.id;
            const isTrainSelected = selectedClass?.trainId === trainId;

            return (
              <div
                key={trainId}
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
                      {train.isRunning && (
                        <button
                          onClick={() => onShowLiveStatus(train)}
                          className="flex items-center space-x-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg text-sm"
                        >
                          <Info size={16} />
                          <span>Live Status</span>
                        </button>
                      )}
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
                      {isTrainSelected && (
                        <>
                          <p className="text-2xl font-bold text-blue-600">
                            ₹{classPrices[selectedClass?.className]}
                          </p>
                          <p className="text-sm text-gray-600">{selectedClass?.className} Class</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-4">
                    <div className="flex flex-wrap gap-3">
                      {(train.coaches || []).map((coach) => {
                        const trainClass = coach.type;
                        const availability = {
                          available: coach.seatsAvailable ?? 0,
                          waitlist: coach.waitlist ?? 0,
                        };
                        const isSelected =
                          selectedClass?.trainId === trainId &&
                          selectedClass?.className === trainClass;

                        return (
                          <div key={`${trainId}-${trainClass}`} className="flex flex-col items-center">
                            <button
                              onClick={() =>
                                setSelectedClass({ trainId, className: trainClass })
                              }
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
                                <span className="text-green-600">
                                  Avail: {availability.available}
                                </span>
                              ) : (
                                <span className="text-red-600">
                                  WL: {availability.waitlist}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          if (!selectedClass || selectedClass.trainId !== trainId) {
                            alert('Please select a class first');
                            return;
                          }

                          const price =
                            classPrices[selectedClass.className] ||
                            train.price ||
                            0;

                          const trainForBooking = {
                            ...train,
                            price,
                            selectedClass: selectedClass.className,
                          };

                          onSelectTrain(trainForBooking, selectedClass.className);
                        }}
                        disabled={!isTrainSelected}
                        className={`px-8 py-3 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl ${
                          isTrainSelected
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TrainList;

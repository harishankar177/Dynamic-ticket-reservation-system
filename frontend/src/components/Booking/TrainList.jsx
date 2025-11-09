import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Star, Info } from 'lucide-react';
import axiosInstance from '../../axiosInstance';

const TrainList = ({ searchData, onSelectTrain, onShowLiveStatus }) => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

        // Normalize station names to uppercase and trim spaces
        const normalize = (v) => (v || '').toString().trim().toUpperCase();

        // Get current time
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const searchDate = new Date(searchData.date);
        const isToday = searchDate.toDateString() === now.toDateString();

        // Filter trains that include both from/to in correct order and consider timing
        const matchedTrains = allTrains.filter((train) => {
          const stops = [];
          if (train.from) stops.push(train.from);
          if (Array.isArray(train.routes))
            stops.push(...train.routes.map((r) => r.stopName));
          if (train.to) stops.push(train.to);

          const normalizedStops = stops.map(normalize);
          const fromIndex = normalizedStops.findIndex((s) => s === normalize(searchData.from));
          const toIndex = normalizedStops.findIndex((s) => s === normalize(searchData.to));
          
          // Check route validity
          const isValidRoute = fromIndex >= 0 && toIndex > fromIndex;
          if (!isValidRoute) return false;

          // If searching for today's trains, filter based on departure time
          if (isToday) {
            const [departureHours, departureMinutes] = (train.departureTime || '00:00').split(':').map(Number);
            const departureTimeInMinutes = (departureHours * 60) + departureMinutes;
            const currentTimeInMinutes = (currentHour * 60) + currentMinute;
            
            // Only show trains that haven't departed yet (with 15 minutes buffer)
            return departureTimeInMinutes > (currentTimeInMinutes + 15);
          }

          // For future dates, show all trains
          return true;
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
        <div className="text-gray-600">
          <p className="text-lg font-semibold">No trains available for this route.</p>
          {new Date(searchData.date).toDateString() === new Date().toDateString() ? (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-700">
                Tip: All trains for today might have departed. Try searching for tomorrow's trains.
              </p>
              <p className="mt-2 text-gray-600 text-sm">
                For same-day bookings, please ensure you search at least 2 hours before the train's departure time.
              </p>
            </div>
          ) : (
            <p className="mt-2 text-gray-600">
              No trains are scheduled for this route on {new Date(searchData.date).toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}. Please try a different date.
            </p>
          )}
        </div>
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
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-xl font-bold text-gray-800">{train.name}</h3>
                      <span className="text-lg font-semibold text-blue-600">(#{train.number})</span>
                      {new Date(searchData.date).toDateString() === new Date().toDateString() && train.isRunning && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold animate-pulse">
                          Running Today
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Star className="text-yellow-500 fill-current" size={16} />
                        <span className="text-sm font-medium">4.2</span>
                      </div>
                      {new Date(searchData.date).toDateString() === new Date().toDateString() && train.isRunning && (
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

                  {/* Timing info */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                    <div className="text-center bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500 mb-1">Departure</p>
                      <p className="text-2xl font-bold text-gray-800">{train.departureTime || '—'}</p>
                      <p className="text-blue-600 font-medium mt-1">{train.from}</p>
                    </div>
                    <div className="text-center bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500 mb-1">Duration</p>
                      <p className="text-xl font-bold text-indigo-600">{train.duration || '—'}</p>
                    </div>
                    <div className="text-center bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500 mb-1">Arrival</p>
                      <p className="text-2xl font-bold text-gray-800">{train.arrivalTime || '—'}</p>
                      <p className="text-blue-600 font-medium mt-1">{train.to}</p>
                    </div>
                    <div className="text-center">
                      {isTrainSelected && (
                        <>
                            <div className="bg-blue-50 rounded-lg p-3 shadow-sm">
                              <p className="text-lg font-semibold text-blue-800">{selectedClass?.className} Class</p>
                              {(() => {
                                try {
                                  const stops = [];
                                  if (train.from) stops.push(train.from);
                                  if (Array.isArray(train.routes)) stops.push(...train.routes.map((r) => r.stopName));
                                  if (train.to) stops.push(train.to);

                                  const normalize = (v) => (v || '').toString().trim().toUpperCase();
                                  const normalizedStops = stops.map(normalize);
                                  const fromIdx = normalizedStops.findIndex((s) => s === normalize(searchData.from));
                                  const toIdx = normalizedStops.findIndex((s) => s === normalize(searchData.to));
                                  const totalStops = normalizedStops.length;
                                  const coach = train.coaches.find(c => c.type === selectedClass?.className);
                                  const fullPrice = coach?.price ?? 0;

                                  const segmentsTravelled = toIdx - fromIdx;
                                  const totalSegments = totalStops - 1;
                                  
                                  let price;
                                  let priceNote = '';
                                  let journeyType = '';

                                  if (fromIdx === 0 && toIdx === totalStops - 1) {
                                    price = fullPrice;
                                    journeyType = 'Full Journey';
                                    priceNote = 'Regular fare';
                                  } else {
                                    const basePrice = 120;
                                    const remainingPriceRange = fullPrice - basePrice;
                                    const priceIncreasePerSegment = remainingPriceRange / totalSegments;
                                    
                                    let calculatedPrice = basePrice;
                                    for (let i = 0; i < segmentsTravelled; i++) {
                                      const segmentPrice = priceIncreasePerSegment * (i + 1);
                                      calculatedPrice += segmentPrice;
                                    }
                                    
                                    price = Math.min(Math.ceil(calculatedPrice), fullPrice);
                                    price = Math.max(price, 120);
                                    
                                    journeyType = 'Partial Journey';
                                    priceNote = 'Progressive fare';
                                  }

                                  return (
                                    <>
                                      <p className="text-3xl font-bold text-blue-600 mt-1">
                                        ₹{price}
                                      </p>
                                      <p className="text-sm text-blue-600 mt-1">
                                        per passenger
                                      </p>
                                    </>
                                  );
                                } catch (e) {
                                  const coach = train.coaches.find(c => c.type === selectedClass?.className);
                                  const price = Math.max(coach?.price ?? 0, 100);
                                  return (
                                    <>
                                      <p className="text-3xl font-bold text-blue-600 mt-1">
                                        ₹{price}
                                      </p>
                                      <p className="text-sm text-blue-600 mt-1">
                                        per passenger
                                      </p>
                                    </>
                                  );
                                }
                              })()}
                            </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Coach + Booking section */}
                  <div className="flex flex-col space-y-4">
                    {new Date(searchData.date).toDateString() === new Date().toDateString() && train.isRunning ? (
                      <div className="text-center text-emerald-700 font-medium mt-2">
                        <p>This train is currently running today. Please check tomorrow's availability.</p>
                      </div>
                    ) : (
                      <>
                        {/* Coach selection */}
                        <div className="flex flex-wrap gap-3">
                          {(train.coaches || []).map((coach) => {
                            const trainClass = coach.type;
                            const isSelected =
                              selectedClass?.trainId === trainId &&
                              selectedClass?.className === trainClass;

                            return (
                              <div key={`${trainId}-${trainClass}`} className="flex flex-col items-center">
                                <button
                                  onClick={() => setSelectedClass({ trainId, className: trainClass })}
                                  className={`px-4 py-2 text-sm font-semibold border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
                                    isSelected
                                      ? 'border-blue-600 bg-blue-600 text-white shadow-lg'
                                      : getClassColor(trainClass)
                                  }`}
                                >
                                  {trainClass}
                                </button>
                                <div className="mt-1 text-xs font-medium text-green-600">
                                  Seats: {coach.seatsAvailable ?? 0}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Book Now */}
                        <div className="flex justify-end">
                          <button
                            onClick={() => {
                              if (!selectedClass || selectedClass.trainId !== trainId) {
                                alert('Please select a class first');
                                return;
                              }

                              const selectedCoach = train.coaches.find(
                                (c) => c.type === selectedClass.className
                              );

                              // ✅ Clean merged data for PassengerDetails page
                              const trainForBooking = {
                                trainId,
                                trainName: train.name,
                                trainNumber: train.number,
                                from: train.from,
                                to: train.to,
                                departureTime: train.departureTime,
                                arrivalTime: train.arrivalTime,
                                duration: train.duration,
                                selectedClass: selectedClass.className,
                                // Calculate price based on journey type
                                price: (() => {
                                  try {
                                    const normalize = (v) => (v || '').toString().trim().toUpperCase();
                                    const stops = [];
                                    if (train.from) stops.push(train.from);
                                    if (Array.isArray(train.routes)) stops.push(...train.routes.map((r) => r.stopName));
                                    if (train.to) stops.push(train.to);

                                    const normalizedStops = stops.map(normalize);
                                    const fromIdx = normalizedStops.findIndex((s) => s === normalize(searchData.from));
                                    const toIdx = normalizedStops.findIndex((s) => s === normalize(searchData.to));
                                    const totalStops = normalizedStops.length;

                                    const fullPrice = Number(selectedCoach?.price) || 0;
                                    const MIN_PRICE = 120; // Minimum price per passenger

                                    // If route indices found and valid
                                    if (fromIdx >= 0 && toIdx > fromIdx && totalStops > 1) {
                                      const segmentsTravelled = toIdx - fromIdx; // segments passenger will travel
                                      const totalSegments = totalStops - 1; // full journey segments
                                      
                                      // Case 1: Full journey (A to Z)
                                      if (fromIdx === 0 && toIdx === totalStops - 1) {
                                        return fullPrice;
                                      }
                                      
                                      // Progressive pricing based on segments
                                      const basePrice = MIN_PRICE; // Start with minimum price
                                      const remainingPriceRange = fullPrice - MIN_PRICE; // Available price range
                                      const priceIncreasePerSegment = remainingPriceRange / totalSegments;
                                      
                                      // Calculate progressive price based on segments travelled
                                      let calculatedPrice = basePrice;
                                      
                                      // Add price for each segment with progressive increase
                                      for (let i = 0; i < segmentsTravelled; i++) {
                                        const segmentPrice = priceIncreasePerSegment * (i + 1);
                                        calculatedPrice += segmentPrice;
                                      }
                                      
                                      // Ensure price doesn't exceed full price and isn't below minimum
                                      calculatedPrice = Math.min(Math.ceil(calculatedPrice), fullPrice);
                                      return Math.max(calculatedPrice, MIN_PRICE);
                                    }

                                    // Fallback to full price with minimum guarantee
                                    return Math.max(fullPrice, MIN_PRICE);
                                  } catch (e) {
                                    console.error('Price calculation error', e);
                                    return Math.max(Number(selectedCoach?.price) || 0, 134);
                                  }
                                })(),
                                seatsAvailable: selectedCoach?.seatsAvailable || 0,
                                coachDetails: train.coaches,
                                date: searchData.date,
                                passengers: searchData.passengers,
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
                      </>
                    )}
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

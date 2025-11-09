import React from 'react';
import { CheckCircle, Download, Mail, Phone, Calendar, MapPin, Train } from 'lucide-react';

const BookingConfirmation = ({ bookingData, onNewBooking }) => {
  // Format time to 24-hour format (HH:mm)
  const formatTime = (time) => {
    if (!time) return '—';
    // If time is already in correct format, return as is
    if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
      return time.padStart(5, '0'); // Ensure 5 characters (HH:MM)
    }
    try {
      const [hours, minutes] = time.split(':').map(Number);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } catch (e) {
      console.error('Time format error:', e);
      return '—';
    }
  };

  React.useEffect(() => {
    // Add entrance animation class when component mounts
    const container = document.getElementById('bookingConfirmationContainer');
    if (container) {
      container.style.animation = 'booking-entrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
    }

    // Debug log to check the data structure
    console.log('Booking Data:', bookingData);
    
    if (bookingData?.selectedTrain) {
      console.log('Train Times:', {
        departure: formatTime(bookingData.selectedTrain.departureTime),
        arrival: formatTime(bookingData.selectedTrain.arrivalTime)
      });
    }
  }, [bookingData]);

  // prefer the selectedStops passed from TrainList (station-to-station segment)
  const routeStops = (bookingData?.selectedTrain?.selectedStops && bookingData.selectedTrain.selectedStops.length)
    ? bookingData.selectedTrain.selectedStops
    : (bookingData?.selectedTrain?.routes || []);

  // format duration minutes -> "Hh Mm" or "Xm"
  const formatDuration = (minutes) => {
    if (minutes == null || isNaN(minutes)) return '—';
    const mins = Math.max(0, Math.round(minutes));
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  // compute minutes between first stop departure and last stop arrival
  // If a stop in `stops` is missing departure/arrival times, try to resolve
  // them from the provided fullRoute (if available) or fallback to train-level
  // departure/arrival times. This ensures the duration uses the actual
  // station times when available.
  const computeRouteMinutes = (stops, fullRoute = []) => {
    if (!stops || stops.length === 0) return null;

    const findTime = (stop, prefer) => {
      // prefer is 'departure' or 'arrival'
      if (!stop) return null;
      if (stop[prefer]) return stop[prefer];

      // try the other field on the same stop
      if (stop[prefer === 'departure' ? 'arrival' : 'departure']) {
        return stop[prefer === 'departure' ? 'arrival' : 'departure'];
      }

      // lookup by stopName in fullRoute
      if (fullRoute && Array.isArray(fullRoute)) {
        const name = (stop.stopName || '').toString().trim().toLowerCase();
        const found = fullRoute.find(fr => (fr.stopName || '').toString().trim().toLowerCase() === name);
        if (found) return found[prefer] || found[prefer === 'departure' ? 'arrival' : 'departure'] || null;
      }

      // no match
      return null;
    };

    const start = findTime(stops[0], 'departure') || null;
    const end = findTime(stops[stops.length - 1], 'arrival') || null;
    if (!start || !end) return null;

    const [sh, sm] = (start || '00:00').split(':').map(Number);
    const [eh, em] = (end || '00:00').split(':').map(Number);
    let startM = (Number.isFinite(sh) ? sh : 0) * 60 + (Number.isFinite(sm) ? sm : 0);
    let endM = (Number.isFinite(eh) ? eh : 0) * 60 + (Number.isFinite(em) ? em : 0);
    if (endM < startM) endM += 24 * 60; // cross-midnight
    return endM - startM;
  };

  // Early return / fallback when bookingData is not provided
  if (!bookingData) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Train size={36} />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">No booking data</h2>
          <p className="text-gray-600 mb-4">Please complete a booking to view the confirmation page.</p>
          <button
            onClick={onNewBooking}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Book Now
          </button>
        </div>
      </div>
    );
  }

  const handleDownloadTicket = () => {
    alert('Ticket download will be available shortly. Check your email for the e-ticket.');
  };

  const handleSendEmail = () => {
    alert('E-ticket sent to your registered email address.');
  };

  return (
    <div id="bookingConfirmationContainer" className="p-8 opacity-0">
      <div className="text-center mb-8 animate-title-reveal">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <CheckCircle className="text-green-600" size={48} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600 text-lg">Your train ticket has been successfully booked.</p>
        <p className="text-sm text-gray-500 mt-2">
          Booking ID: <span className="font-mono font-medium text-blue-600">{bookingData.bookingId}</span>
        </p>
        <button
          onClick={onNewBooking}
          className="mt-4 flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl mx-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span>Book Another Journey</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        <div 
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl p-6 shadow-lg"
          style={{ animation: 'train-details-entrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards 0.3s' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm" style={{ animation: 'detail-item-entrance 0.6s ease-out forwards 0.5s', opacity: 0 }}>
                <Train size={32} className="text-white" />
              </div>
              <div style={{ animation: 'detail-item-entrance 0.6s ease-out forwards 0.7s', opacity: 0 }}>
                <h3 className="text-2xl font-bold tracking-tight">
                  {bookingData?.selectedTrain?.trainName || bookingData?.selectedTrain?.name || 'Train Name'}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="px-2 py-0.5 bg-white/20 rounded text-sm font-medium backdrop-blur-sm">
                    Train #{bookingData?.selectedTrain?.trainNumber || bookingData?.selectedTrain?.number || 'N/A'}
                  </span>
                  <span className="px-2 py-0.5 bg-white/20 rounded text-sm font-medium backdrop-blur-sm">
                    {bookingData?.selectedTrain?.selectedClass || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right" style={{ animation: 'detail-item-entrance 0.6s ease-out forwards 0.9s', opacity: 0 }}>
              <p className="text-3xl font-bold">₹{bookingData.totalAmount}</p>
              <p className="text-blue-100 font-medium">Total Fare</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-b-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Journey Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <MapPin className="text-green-600" size={20} />
                  <p className="font-semibold text-gray-800">{bookingData?.selectedTrain?.from || '—'}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 shadow-sm">
                  <p className="text-2xl font-bold text-gray-800">
                    {formatTime(routeStops[0]?.departure || bookingData?.selectedTrain?.departureTime)}
                  </p>
                  <p className="text-sm text-green-600 font-medium">Departure Time</p>
                </div>
              </div>

              <div className="text-center transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Calendar className="text-blue-600" size={20} />
                  <p className="font-semibold text-gray-800">
                    {new Date(bookingData?.searchData?.date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 shadow-sm">
                  <p className="text-lg font-bold text-gray-800">
                    {(() => {
                      // Only compute/ display segment duration for station-to-station bookings.
                      // Prefer a numeric duration passed in (TrainList sets this for selectedStops).
                      const hasSelectedStops = bookingData?.selectedTrain?.selectedStops && bookingData.selectedTrain.selectedStops.length > 0;
                      let mins = null;
                      if (typeof bookingData?.selectedTrain?.duration === 'number') {
                        mins = bookingData.selectedTrain.duration;
                      } else if (hasSelectedStops) {
                        mins = computeRouteMinutes(routeStops);
                      } else {
                        mins = null; // do not compute full-train duration here
                      }
                      return mins != null ? formatDuration(mins) : '—';
                    })()}
                  </p>
                  <p className="text-sm text-blue-600 font-medium">Journey Duration</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {routeStops?.length ? `${routeStops.length} stops` : ''}
                  </p>
                </div>
              </div>

              <div className="text-center transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <MapPin className="text-red-600" size={20} />
                  <p className="font-semibold text-gray-800">{bookingData?.selectedTrain?.to || '—'}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 shadow-sm">
                  <p className="text-2xl font-bold text-gray-800">
                    {formatTime(routeStops[routeStops.length - 1]?.arrival || bookingData?.selectedTrain?.arrivalTime)}
                  </p>
                  <p className="text-sm text-red-600 font-medium">Arrival Time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Route stops hidden by user request */}

          <div className="p-6 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Passenger & Seat Details</h4>
            <div className="space-y-4">
              {(bookingData?.passengers || []).map((passenger, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{passenger.name}</p>
                      <p className="text-gray-600">{passenger.age} years, {passenger.gender}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">
                      {bookingData?.selectedSeats?.[index]?.coach}-{bookingData?.selectedSeats?.[index]?.seatNumber}
                    </p>
                    {/* use bracket notation to access a property named "class" to avoid syntax error */}
                    <p className="text-gray-600">{bookingData?.selectedSeats?.[index]?.['class']}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="text-blue-600" size={20} />
                <span className="text-gray-700">{bookingData?.passengers?.[0]?.email ?? '—'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-green-600" size={20} />
                <span className="text-gray-700">{bookingData?.passengers?.[0]?.phone ?? '—'}</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Important Information</h4>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <ul className="text-sm text-yellow-800 space-y-2">
                <li>• Please carry a valid photo ID proof during travel</li>
                <li>• Arrive at the station at least 30 minutes before departure</li>
                <li>• E-ticket has been sent to your registered email address</li>
                <li>• For cancellation, visit the booking website or nearest railway station</li>
                <li>• Keep your ticket handy for verification during travel</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <button
            onClick={handleDownloadTicket}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Download size={20} />
            <span>Download E-Ticket</span>
          </button>

          <button
            onClick={handleSendEmail}
            className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <Mail size={20} />
            <span>Send to Email</span>
          </button>

          <button
            onClick={onNewBooking}
            className="flex items-center justify-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            <Train size={20} />
            <span>Book Another Ticket</span>
          </button>
        </div>

        <div className="text-center mt-8 p-6 bg-gray-50 rounded-xl">
          <h4 className="font-semibold text-gray-800 mb-2">Need Help?</h4>
          <p className="text-gray-600 mb-4">Contact our 24/7 customer support</p>
          <div className="flex justify-center space-x-6">
            <div className="flex items-center space-x-2 text-gray-700">
              <Phone size={16} />
              <span className="font-medium">139 (Toll Free)</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <Mail size={16} />
              <span className="font-medium">support@railwaybook.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;

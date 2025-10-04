import React, { useState } from 'react';
import { Search, Ticket, MapPin, Calendar, Clock, User, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import CoachLayout from '../components/CoachLayout';

// Mock ticket dataset keyed by PNR (10 digits). Replace or connect to backend for real verification.
const MOCK_TICKETS = {
  '1234567890': {
    pnr: '1234567890',
    train: '12001 — Gatimaan Express',
    date: '2025-10-05',
    passengers: [
      { name: 'A. Kumar', seat: 'S1-12', status: 'CNF' },
      { name: 'R. Singh', seat: 'S1-13', status: 'CNF' },
    ],
    from: 'Hazrat Nizamuddin',
    to: 'Bhopal',
    boarding: 'Hazrat Nizamuddin, 06:10',
  },
  '9876543210': {
    pnr: '9876543210',
    train: '12951 — Rajdhani Express',
    date: '2025-10-08',
    passengers: [{ name: 'M. Patel', seat: 'A1-03', status: 'WL/2' }],
    from: 'Mumbai Central',
    to: 'New Delhi',
    boarding: 'Mumbai Central, 16:30',
  },
};

export default function PNRstatus({ onBack }) {
  const [pnrNumber, setPnrNumber] = useState('');
  const [pnrStatus, setPnrStatus] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = () => {
    setError('');
    setNotFound(false);
    const cleaned = (pnrNumber || '').trim();
    if (!/^\d{10}$/.test(cleaned)) {
      setError('PNR must be a 10-digit number.');
      return;
    }
    const status = MOCK_TICKETS[cleaned];
    if (status) {
      setPnrStatus(status);
    } else {
      setPnrStatus(null);
      setNotFound(true);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CNF':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'RAC':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'WL':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-teal-700 hover:text-teal-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </button>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Ticket className="w-14 h-14 text-teal-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">PNR Status</h1>
          <p className="text-slate-600">Check your booking details and seat information</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={pnrNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setPnrNumber(value);
                  setNotFound(false);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter 10-digit PNR number"
                className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors text-lg"
                maxLength={10}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={pnrNumber.length !== 10}
              className="px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Check Status
            </button>
          </div>

          {pnrNumber.length > 0 && pnrNumber.length < 10 && (
            <p className="mt-3 text-sm text-slate-500">
              PNR must be 10 digits ({pnrNumber.length}/10)
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            <p className="text-sm text-slate-600 w-full mb-2">Try these sample PNRs:</p>
            {Object.keys(MOCK_TICKETS).map((pnr) => (
              <button
                key={pnr}
                onClick={() => {
                  setPnrNumber(pnr);
                  setPnrStatus(MOCK_TICKETS[pnr]);
                  setNotFound(false);
                }}
                className="px-4 py-2 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors text-sm font-medium border-2 border-teal-200"
              >
                {pnr}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

        {notFound && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">PNR Not Found</h3>
            <p className="text-slate-600">
              The PNR number you entered could not be found. Please check and try again.
            </p>
          </div>
        )}

        {pnrStatus && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 p-6 text-white">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm opacity-90 mb-1">PNR Number</p>
                    <p className="text-3xl font-bold tracking-wider">{pnrStatus.pnrNumber}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-lg font-bold text-sm ${
                    pnrStatus.currentStatus === 'Confirmed'
                      ? 'bg-green-500'
                      : 'bg-yellow-500'
                  }`}>
                    {pnrStatus.currentStatus}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-lg">
                  <span className="font-bold">{pnrStatus.trainNumber}</span>
                  <span className="opacity-75">|</span>
                  <span>{pnrStatus.trainName}</span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-4 border-2 border-teal-200">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Boarding Station</p>
                        <p className="font-bold text-slate-800 text-lg">{pnrStatus.boardingStation}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border-2 border-emerald-200">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Destination Station</p>
                        <p className="font-bold text-slate-800 text-lg">{pnrStatus.destinationStation}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4 border-2 border-cyan-200">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Journey Date</p>
                        <p className="font-bold text-slate-800 text-lg">
                          {new Date(pnrStatus.dateOfJourney).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                    <div className="flex items-start gap-3">
                      <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Boarding Time</p>
                        <p className="font-bold text-slate-800 text-lg">{pnrStatus.boardingTime}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200 text-center">
                    <p className="text-sm text-slate-600 mb-1">Class</p>
                    <p className="text-2xl font-bold text-slate-800">{pnrStatus.bookingClass}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200 text-center">
                    <p className="text-sm text-slate-600 mb-1">Chart Status</p>
                    <p className="text-lg font-bold text-slate-800">{pnrStatus.chartStatus}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200 text-center">
                    <p className="text-sm text-slate-600 mb-1">Total Fare</p>
                    <p className="text-2xl font-bold text-slate-800">₹{pnrStatus.fare}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-teal-600" />
                <h2 className="text-2xl font-bold text-slate-800">Passenger Details</h2>
              </div>

              <div className="space-y-4">
                {pnrStatus.passengers.map((passenger, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-slate-50 to-teal-50 rounded-xl p-5 border-2 border-teal-200 hover:border-teal-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-bold text-lg text-slate-800">{passenger.name}</p>
                          <p className="text-sm text-slate-600">
                            {passenger.age} Years • {passenger.gender}
                          </p>
                        </div>
                      </div>
                      <div className={`px-4 py-2 rounded-lg border-2 font-bold ${getStatusColor(passenger.bookingStatus)}`}>
                        {passenger.bookingStatus}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white rounded-lg p-3 border border-slate-200">
                        <p className="text-xs text-slate-600 mb-1">Coach</p>
                        <p className="font-bold text-lg text-teal-600">{passenger.coachNumber}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-slate-200">
                        <p className="text-xs text-slate-600 mb-1">Seat Number</p>
                        <p className="font-bold text-lg text-teal-600">{passenger.seatNumber}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-slate-200">
                        <p className="text-xs text-slate-600 mb-1">Berth Type</p>
                        <p className="font-bold text-sm text-teal-600">{passenger.berthType}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <CoachLayout
              coachNumber={pnrStatus.passengers[0].coachNumber}
              passengers={pnrStatus.passengers}
              bookingClass={pnrStatus.bookingClass}
            />

            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-8 h-8 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Booking Confirmed</h3>
                  <p className="text-teal-50 leading-relaxed">
                    Your tickets have been booked successfully. Please carry a valid ID proof during your journey.
                    Make sure to reach the station at least 30 minutes before departure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { CheckCircle, Download, Mail, Phone, Calendar, MapPin, Train } from 'lucide-react';

const BookingConfirmation = ({ bookingData, onNewBooking }) => {

  // 🔹 Auto-generate seat & coach numbers if not passed
  const generateSeatDetails = (count) => {
    const generated = [];
    const coachPrefix =
      bookingData?.selectedTrain?.selectedClass?.toLowerCase().includes("ac") ? "A" : "S";

    for (let i = 0; i < count; i++) {
      generated.push({
        coach: `${coachPrefix}1`,                // Coach example → S1, A1
        seatNumber: `${i + 1}`,                 // Seat number → 1,2,3...
        class: bookingData?.selectedTrain?.selectedClass ?? "General"
      });
    }
    return generated;
  };

  // 🔹 Decide final seat list
  const finalSeatList =
    bookingData?.selectedSeats?.length > 0
      ? bookingData.selectedSeats
      : generateSeatDetails(bookingData?.passengers?.length || 0);


  // Format time to 24-hour format (HH:mm)
  const formatTime = (time) => {
    if (!time) return '—';
    if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
      return time.padStart(5, '0');
    }
    try {
      const [hours, minutes] = time.split(':').map(Number);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } catch (e) {
      return '—';
    }
  };

  React.useEffect(() => {
    const container = document.getElementById('bookingConfirmationContainer');
    if (container) {
      container.style.animation = 'booking-entrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
    }
  }, []);

  const routeStops = (bookingData?.selectedTrain?.selectedStops && bookingData.selectedTrain.selectedStops.length)
    ? bookingData.selectedTrain.selectedStops
    : (bookingData?.selectedTrain?.routes || []);

  const handleDownloadTicket = () => {
    alert('Ticket download will be available shortly. Check your email for the e-ticket.');
  };

  const handleSendEmail = () => {
    alert('E-ticket sent to your registered email address.');
  };

  if (!bookingData) {
    return (
      <div className="p-8 text-center">
        <button onClick={onNewBooking} className="bg-purple-600 text-white px-4 py-2 rounded-lg">
          Book Now
        </button>
      </div>
    );
  }

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
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                <Train size={32} className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">
                  {bookingData?.selectedTrain?.trainName || bookingData?.selectedTrain?.name || 'Train Name'}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="px-2 py-0.5 bg-white/20 rounded text-sm">
                    Train #{bookingData?.selectedTrain?.trainNumber || bookingData?.selectedTrain?.number || 'N/A'}
                  </span>
                  <span className="px-2 py-0.5 bg-white/20 rounded text-sm">
                    {bookingData?.selectedTrain?.selectedClass || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">₹{bookingData.totalAmount}</p>
              <p className="text-blue-100 font-medium">Total Fare</p>
            </div>
          </div>
        </div>

        {/* 🚆 Passenger Details – With Auto Seat + Coach Display */}
        <div className="bg-white border border-gray-200 rounded-b-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Passenger & Seat Details</h4>
            <div className="space-y-4">
              {(bookingData?.passengers || []).map((passenger, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{passenger.name}</p>
                      <p className="text-gray-600">{passenger.age} years, {passenger.gender}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">
                      {finalSeatList[index]?.coach}-{finalSeatList[index]?.seatNumber}
                    </p>
                    <p className="text-gray-600">{finalSeatList[index]?.class}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact, Important notes and Buttons remain unchanged */}
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
            <ul className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-sm text-yellow-800 space-y-2">
              <li>• Carry a valid ID proof</li>
              <li>• Reach station 30 mins early</li>
              <li>• E-ticket sent to registered email</li>
              <li>• Cancellation available online</li>
              <li>• Ticket required for verification</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <button onClick={handleDownloadTicket} className="bg-blue-600 text-white px-6 py-3 rounded-lg">
            <Download size={20} /> Download E-Ticket
          </button>
          <button onClick={handleSendEmail} className="bg-green-600 text-white px-6 py-3 rounded-lg">
            <Mail size={20} /> Send to Email
          </button>
          <button onClick={onNewBooking} className="bg-purple-600 text-white px-6 py-3 rounded-lg">
            <Train size={20} /> Book Another Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;

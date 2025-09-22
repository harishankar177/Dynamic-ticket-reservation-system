import React from 'react';
import { CheckCircle, Download, Mail, Phone, Calendar, MapPin, Train } from 'lucide-react';

const BookingConfirmation = ({ bookingData, onNewBooking }) => {
  const handleDownloadTicket = () => {
    alert('Ticket download will be available shortly. Check your email for the e-ticket.');
  };

  const handleSendEmail = () => {
    alert('E-ticket sent to your registered email address.');
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <CheckCircle className="text-green-600" size={48} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600 text-lg">Your train ticket has been successfully booked.</p>
        <p className="text-sm text-gray-500 mt-2">
          Booking ID: <span className="font-mono font-medium text-blue-600">{bookingData.bookingId}</span>
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Train size={32} />
              <div>
                <h3 className="text-xl font-bold">{bookingData.selectedTrain.name}</h3>
                <p className="text-blue-100">Train #{bookingData.selectedTrain.number}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">₹{bookingData.totalAmount}</p>
              <p className="text-blue-100">Total Fare</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-b-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Journey Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <MapPin className="text-green-600" size={20} />
                  <p className="font-semibold text-gray-800">{bookingData.searchData.from}</p>
                </div>
                <p className="text-2xl font-bold text-gray-800">{bookingData.selectedTrain.departure}</p>
                <p className="text-gray-600">Departure</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Calendar className="text-blue-600" size={20} />
                  <p className="font-semibold text-gray-800">
                    {new Date(bookingData.searchData.date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <p className="text-lg font-medium text-gray-600">{bookingData.selectedTrain.duration}</p>
                <p className="text-gray-600">Duration</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <MapPin className="text-red-600" size={20} />
                  <p className="font-semibold text-gray-800">{bookingData.searchData.to}</p>
                </div>
                <p className="text-2xl font-bold text-gray-800">{bookingData.selectedTrain.arrival}</p>
                <p className="text-gray-600">Arrival</p>
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Passenger & Seat Details</h4>
            <div className="space-y-4">
              {bookingData.passengers.map((passenger, index) => (
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
                      {bookingData.selectedSeats[index]?.coach}-{bookingData.selectedSeats[index]?.seatNumber}
                    </p>
                    <p className="text-gray-600">{bookingData.selectedSeats[index]?.class}</p>
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
                <span className="text-gray-700">{bookingData.passengers[0].email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-green-600" size={20} />
                <span className="text-gray-700">{bookingData.passengers[0].phone}</span>
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

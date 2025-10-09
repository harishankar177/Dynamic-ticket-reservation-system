import React, { useEffect, useState } from 'react';

const sampleBookings = [
  {
    id: 'T123',
    train: 'Kanniyakumari SF Express',
    date: '2025-10-10',
    status: 'Completed',
    seat: 'A1, A2',
  },
  {
    id: 'T124',
    train: 'Chennai Express',
    date: '2025-10-12',
    status: 'Pending',
    seat: 'B1, B2',
  },
  {
    id: 'T125',
    train: 'Coimbatore Express',
    date: '2025-10-15',
    status: 'Cancelled',
    seat: 'C1',
  },
];

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('All');

  // Load bookings from localStorage or sample data
  useEffect(() => {
    const userBookings = JSON.parse(localStorage.getItem('bookings')) || sampleBookings;
    setBookings(userBookings);
  }, []);

  const cancelBooking = (id) => {
    const updatedBookings = bookings.map((b) =>
      b.id === id ? { ...b, status: 'Cancelled' } : b
    );
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    alert('Booking cancelled successfully!');
  };

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter((b) =>
    activeTab === 'All' ? true : b.status === activeTab
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">🎟️ My Bookings</h2>

      {/* Tabs */}
      <div className="flex justify-center space-x-3 mb-8">
        {['All', 'Completed', 'Pending', 'Cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium shadow transition-all ${
              activeTab === tab
                ? 'bg-blue-600 text-white shadow-md scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-5">
        {filteredBookings.length === 0 ? (
          <p className="text-gray-500 text-center italic">
            No {activeTab.toLowerCase()} bookings found.
          </p>
        ) : (
          filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="p-5 border rounded-xl shadow-sm hover:shadow-lg transition-shadow bg-white flex justify-between items-center"
            >
              {/* Booking Info */}
              <div>
                <p className="font-semibold text-lg">{booking.train}</p>
                <p className="text-sm text-gray-600">📅 Date: {booking.date}</p>
                <p className="text-sm text-gray-600">💺 Seats: {booking.seat}</p>
                <span
                  className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${
                    booking.status === 'Completed'
                      ? 'bg-green-100 text-green-700'
                      : booking.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {booking.status}
                </span>
              </div>

              {/* Cancel Button for Pending */}
              {booking.status === 'Pending' && (
                <button
                  onClick={() => cancelBooking(booking.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyBookings;

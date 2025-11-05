import { useState, useRef } from 'react';
import { Train, Calendar, MapPin, Download, Eye, X, RefreshCw, Star, AlertCircle, CheckCircle } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const mockBookings = [
  {
    id: '1',
    pnr: '6543210987',
    trainName: 'Pandian Express',
    trainNumber: '12637',
    date: '2025-11-06',
    from: 'Chennai',
    to: 'Madurai',
    class: 'Sleeper (SL)',
    status: 'upcoming',
    price: 450,
    seatNumber: 'S7-42'
  },
  {
    id: '2',
    pnr: '8765432109',
    trainName: 'Shatabdi Express',
    trainNumber: '12002',
    date: '2025-10-28',
    from: 'New Delhi',
    to: 'Bhopal',
    class: 'AC Chair Car',
    status: 'completed',
    price: 850,
    seatNumber: 'C4-18',
    rating: 4
  },
  {
    id: '3',
    pnr: '5432167890',
    trainName: 'Rajdhani Express',
    trainNumber: '12301',
    date: '2025-11-15',
    from: 'Mumbai',
    to: 'Ahmedabad',
    class: '2AC',
    status: 'upcoming',
    price: 1200,
    seatNumber: 'A1-25'
  },
  {
    id: '4',
    pnr: '9876543210',
    trainName: 'Duronto Express',
    trainNumber: '12213',
    date: '2025-09-15',
    from: 'Kolkata',
    to: 'Pune',
    class: '3AC',
    status: 'completed',
    price: 980,
    seatNumber: 'B3-12'
  },
  {
    id: '5',
    pnr: '1234567890',
    trainName: 'Garib Rath',
    trainNumber: '12909',
    date: '2025-10-05',
    from: 'Bangalore',
    to: 'Chennai',
    class: '3AC',
    status: 'cancelled',
    price: 420
  }
];

function MyBookings() {
  const [filter, setFilter] = useState('all');
  const [bookings, setBookings] = useState(mockBookings);
  const [ratingBooking, setRatingBooking] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [cancelModal, setCancelModal] = useState(null);
  const [detailsModal, setDetailsModal] = useState(null);
  const ticketRef = useRef(null);

  const filteredBookings = bookings.filter((booking) =>
    filter === 'all' ? true : booking.status === filter
  );

  const getStatusBadge = (status) => {
    const styles = {
      upcoming: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    const icons = {
      upcoming: '⏳',
      completed: '✅',
      cancelled: '❌'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${styles[status]}`}>
        {icons[status]} {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleRating = (bookingId, rating) => {
    setBookings(
      bookings.map((b) => (b.id === bookingId ? { ...b, rating } : b))
    );
    setRatingBooking(null);
  };

  const handleRebook = (booking) => {
    alert(`Rebooking ${booking.trainName} - Form will be auto-filled with this booking's details`);
  };

  const handleCancelConfirm = (bookingId) => {
    setBookings(
      bookings.map((b) =>
        b.id === bookingId ? { ...b, status: 'cancelled' } : b
      )
    );
    setCancelModal(null);
  };

  const handleDownloadPDF = (booking) => {
    if (!ticketRef.current) return;
    const element = ticketRef.current;
    const options = {
      margin: 10,
      filename: `ticket-${booking.pnr}.pdf`,
      image: { type: 'png', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };
    html2pdf().set(options).from(element).save();
  };

  const getBookingById = (id) => bookings.find((b) => b.id === id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Train className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-800">My Bookings</h1>
          </div>
          <p className="text-slate-600 ml-11">View and manage all your train tickets</p>
        </div>

        <div className="flex gap-3 mb-8 flex-wrap">
          {['all', 'upcoming', 'completed', 'cancelled'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                filter === f
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200">
              <Train className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">No bookings found</p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className={`bg-white rounded-xl shadow-md border-2 transition-all hover:shadow-xl ${
                  booking.status === 'completed'
                    ? 'border-slate-200 opacity-90'
                    : booking.status === 'cancelled'
                    ? 'border-red-200 opacity-80'
                    : 'border-blue-200'
                }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-slate-800">
                          {booking.trainName}
                        </h3>
                        <span className="text-slate-500 text-lg">
                          ({booking.trainNumber})
                        </span>
                      </div>
                      <div className="text-sm text-slate-600 font-medium">
                        PNR:{' '}
                        <span className="text-slate-800 text-base font-semibold">
                          {booking.pnr}
                        </span>
                      </div>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Date</p>
                        <p className="text-sm font-semibold text-slate-800">
                          {new Date(booking.date).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Route</p>
                        <p className="text-sm font-semibold text-slate-800">
                          {booking.from} → {booking.to}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Train className="w-5 h-5 text-orange-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Class</p>
                        <p className="text-sm font-semibold text-slate-800">
                          {booking.class}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 text-purple-600 font-bold flex items-center justify-center flex-shrink-0">
                        ₹
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Fare</p>
                        <p className="text-sm font-semibold text-slate-800">
                          ₹{booking.price}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() => setDetailsModal(booking.id)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>

                    <button
                      onClick={() => {
                        setDetailsModal(booking.id);
                        setTimeout(() => handleDownloadPDF(booking), 100);
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>

                    {booking.status === 'upcoming' && (
                      <button
                        onClick={() => setCancelModal(booking.id)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
                      >
                        <X className="w-4 h-4" />
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      {cancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 transform transition-all">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">
              Cancel Booking?
            </h2>
            <p className="text-slate-600 text-center mb-6">
              Are you sure you want to cancel this booking?
            </p>
            <div className="space-y-3">
              <button
                onClick={() => handleCancelConfirm(cancelModal)}
                className="w-full px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all"
              >
                Yes, Cancel Booking
              </button>
              <button
                onClick={() => setCancelModal(null)}
                className="w-full px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-medium transition-all"
              >
                Keep Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {detailsModal && getBookingById(detailsModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">Ticket Details</h2>
              <button
                onClick={() => setDetailsModal(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <div ref={ticketRef} className="p-8 bg-gradient-to-br from-blue-50 to-slate-50">
              <div className="bg-white rounded-xl border-2 border-blue-200 p-8">
                <div className="text-center mb-8 pb-8 border-b-2 border-dashed border-slate-200">
                  <div className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg mb-4 font-bold">
                    TICKET CONFIRMATION
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900">
                    {getBookingById(detailsModal)?.trainName}
                  </h3>
                  <p className="text-slate-600 mt-2">
                    Train #{getBookingById(detailsModal)?.trainNumber}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">
                      Passenger Name
                    </p>
                    <p className="text-lg font-bold text-slate-900 mt-1">John Doe</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">
                      PNR Number
                    </p>
                    <p className="text-lg font-bold text-slate-900 mt-1 tracking-wider">
                      {getBookingById(detailsModal)?.pnr}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6 flex gap-3">
              <button
                onClick={() => setDetailsModal(null)}
                className="flex-1 px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-medium transition-all"
              >
                Close
              </button>
              <button
                onClick={() => handleDownloadPDF(getBookingById(detailsModal))}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBookings;

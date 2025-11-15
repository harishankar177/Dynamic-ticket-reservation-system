import React from 'react';
import { CheckCircle, Download, Mail, Phone, Train } from 'lucide-react';

const BookingConfirmation = ({ bookingData, onNewBooking }) => {

  // 🔹 Auto-generate seat & coach numbers if user didn't select
  const generateSeatDetails = (count) => {
    const generated = [];
    const coachPrefix =
      bookingData?.selectedTrain?.selectedClass?.toLowerCase().includes("ac") ? "A" : "S";

    for (let i = 0; i < count; i++) {
      generated.push({
        coach: `${coachPrefix}1`,
        seatNumber: `${i + 1}`,
        class: bookingData?.selectedTrain?.selectedClass ?? "General"
      });
    }
    return generated;
  };

  const finalSeatList =
    bookingData?.selectedSeats?.length > 0
      ? bookingData.selectedSeats
      : generateSeatDetails(bookingData?.passengers?.length || 0);

  // ⭐ API: Save booking to backend database
  const saveBookingToDB = async () => {
    try {
      const payload = {
        bookingId: bookingData.bookingId,
        trainName: bookingData?.selectedTrain?.trainName,
        trainNumber: bookingData?.selectedTrain?.trainNumber,
        passengers: bookingData.passengers,
        seats: finalSeatList,
        email: bookingData?.passengers?.[0]?.email,
        phone: bookingData?.passengers?.[0]?.phone,
        paymentStatus: "Paid",
        amountPaid: bookingData.totalAmount,
      };

      const res = await fetch("http://localhost:3000/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("🎉 Booking Saved Successfully:", data);

    } catch (error) {
      console.error("❌ Booking Save Failed:", error);
    }
  };

  // 🔹 Run only once to avoid duplicate saving
  React.useEffect(() => {
    saveBookingToDB();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 📥 Dummy function for future implementation
  const handleDownloadTicket = () => {
    alert("Ticket download feature coming soon!");
  };

  const handleSendEmail = () => {
    alert("Ticket email sending feature coming soon!");
  };

  return (
    <div id="bookingConfirmationContainer" className="p-8 opacity-100">
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
                  {bookingData?.selectedTrain?.trainName}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="px-2 py-0.5 bg-white/20 rounded text-sm">
                    Train #{bookingData?.selectedTrain?.trainNumber}
                  </span>
                  <span className="px-2 py-0.5 bg-white/20 rounded text-sm">
                    {bookingData?.selectedTrain?.selectedClass}
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

        {/* Passenger & Seat Details */}
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

          {/* Contact Info */}
          <div className="p-6 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="text-blue-600" size={20} />
                <span className="text-gray-700">{bookingData?.passengers?.[0]?.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-green-600" size={20} />
                <span className="text-gray-700">{bookingData?.passengers?.[0]?.phone}</span>
              </div>
            </div>
          </div>

          {/* Info List */}
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

        {/* Footer Actions */}
        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <button onClick={handleDownloadTicket} className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2">
            <Download size={20} /> Download E-Ticket
          </button>

          <button onClick={handleSendEmail} className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2">
            <Mail size={20} /> Send to Email
          </button>

          <button onClick={onNewBooking} className="bg-purple-600 text-white px-6 py-3 rounded-lg flex items-center gap-2">
            <Train size={20} /> Book Another Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;

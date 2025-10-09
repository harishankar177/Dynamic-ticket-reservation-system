import React, { useState } from 'react';
import { Search, Ticket } from 'lucide-react';

export default function PNRStatus() {
  const [pnr, setPnr] = useState('');
  const [pnrData, setPnrData] = useState(null);

  // Mock ticket data
  const mockTickets = {
    "1234567890": {
      name: "Arjun Kumar",
      train: "Kanniyakumari SF Express",
      seat: "S3 - 45",
      from: "Chennai Egmore",
      to: "Kanniyakumari",
      status: "Confirmed"
    },
    "9876543210": {
      name: "Priya Sharma",
      train: "Madurai Tejas Express",
      seat: "C1 - 12",
      from: "Chennai Egmore",
      to: "Madurai",
      status: "Waiting List (WL 5)"
    }
  };

  const handleCheckPNR = () => {
    if (mockTickets[pnr]) {
      setPnrData(mockTickets[pnr]);
    } else {
      setPnrData({ error: "No ticket found for this PNR." });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
        <div className="text-center mb-6">
          <Ticket className="w-16 h-16 text-blue-600 mx-auto mb-2" />
          <h1 className="text-3xl font-bold text-gray-800">Check PNR Status</h1>
          <p className="text-gray-600">Enter your 10-digit PNR number</p>
        </div>

        {/* Input */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter PNR Number"
            value={pnr}
            onChange={(e) => setPnr(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCheckPNR}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Search size={18} />
            Check
          </button>
        </div>

        {/* Result */}
        {pnrData && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            {pnrData.error ? (
              <p className="text-red-600 font-medium">{pnrData.error}</p>
            ) : (
              <div>
                <p><span className="font-semibold">Passenger:</span> {pnrData.name}</p>
                <p><span className="font-semibold">Train:</span> {pnrData.train}</p>
                <p><span className="font-semibold">Seat:</span> {pnrData.seat}</p>
                <p><span className="font-semibold">From:</span> {pnrData.from}</p>
                <p><span className="font-semibold">To:</span> {pnrData.to}</p>
                <p><span className="font-semibold">Status:</span> {pnrData.status}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

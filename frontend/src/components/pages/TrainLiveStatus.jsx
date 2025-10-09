import React, { useState } from 'react';
import { Search, MapPin, Train } from 'lucide-react';

export default function TrainLiveStatus() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [results, setResults] = useState([]);

  const routes = {
    "Chennai Egmore-Kanniyakumari": [
      "Kanniyakumari SF Express",
      "Kashi Tami Sangamam Express"
    ],
    "Chennai Egmore-Madurai": [
      "Madurai Tejas Express",
      "Vaigai SF Express",
      "Pothigai SF Express",
      "Chendur SF Express"
    ],
    "Kanniyakumari-New Delhi": [
      "Thirukkural SF Express",
      "Himsagar Express"
    ],
    "Chennai Central-Mysuru": [
      "Mysuru Shatabdi Express",
      "Ashokapuram SF Express",
      "Kaveri Express"
    ]
  };

  const handleSearch = () => {
    const key1 = `${from}-${to}`;
    const key2 = `${to}-${from}`;
    if (routes[key1]) setResults(routes[key1]);
    else if (routes[key2]) setResults(routes[key2]);
    else setResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <Train className="w-16 h-16 text-orange-600 mx-auto mb-2" />
          <h1 className="text-3xl font-bold text-gray-800">Live Train Status</h1>
          <p className="text-gray-600">Search for trains & track live status</p>
        </div>

        {/* Search Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
            <MapPin size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="From"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full focus:outline-none"
            />
          </div>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
            <MapPin size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="To"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full focus:outline-none"
            />
          </div>
        </div>
        <button
          onClick={handleSearch}
          className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
        >
          <Search size={18} />
          Search Trains
        </button>

        {/* Results */}
        <div className="mt-6">
          {results.length > 0 ? (
            <div className="space-y-3">
              {results.map((train, idx) => (
                <div
                  key={idx}
                  className="p-4 border rounded-lg flex items-center justify-between hover:bg-orange-50 transition"
                >
                  <div>
                    <p className="font-semibold">{train}</p>
                    <p className="text-sm text-gray-500">Live status: On Time ✅</p>
                  </div>
                  <button className="text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded-lg hover:bg-orange-200 transition">
                    Track
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center mt-4">No trains found for this route.</p>
          )}
        </div>
      </div>
    </div>
  );
}

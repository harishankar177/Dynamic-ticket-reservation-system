import React, { useState, useEffect, useMemo } from "react";
import axiosInstance from "../../../axiosInstance";
import { MapPin, Search, ChevronDown, ChevronUp, Train } from "lucide-react";

const RoutesAndStations = () => {
  const [trains, setTrains] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedTrain, setExpandedTrain] = useState(null);
  const [error, setError] = useState(null);

  // ✅ Fetch trains
  useEffect(() => {
    const fetchTrains = async () => {
      try {
        const res = await axiosInstance.get("/trains");
        setTrains(res.data);
      } catch (err) {
        console.error("Error fetching trains:", err);
        setError("Failed to load train data. Please try again later.");
      }
    };
    fetchTrains();
  }, []);

  // ✅ Filter
  const filteredTrains = useMemo(() => {
    return trains.filter(
      (t) =>
        t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.to?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [trains, searchTerm]);

  const toggleExpand = (id) => {
    setExpandedTrain(expandedTrain === id ? null : id);
  };

  // ✅ Error handler
  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-red-500 text-lg font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* 🔍 Search Bar */}
        <div className="flex items-center gap-2 mb-6">
          <Search className="text-gray-500" />
          <input
            type="text"
            placeholder="Search train by name, number, or route..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* 🚆 Train Cards */}
        {filteredTrains.length === 0 ? (
          <p className="text-gray-500 text-center">No trains found.</p>
        ) : (
          filteredTrains.map((train) => (
            <div
              key={train._id}
              className="bg-white shadow-md rounded-lg mb-4 overflow-hidden border border-gray-200"
            >
              {/* 🔹 Train Header */}
              <div
                onClick={() => toggleExpand(train._id)}
                className="flex justify-between items-center bg-blue-100 p-4 cursor-pointer hover:bg-blue-200 transition"
              >
                <div>
                  <h2 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                    <Train size={18} /> {train.name} ({train.number})
                  </h2>
                  <p className="text-sm text-gray-700 mt-1">
                    {train.from} → {train.to}
                  </p>
                </div>

                {/* ✅ Running Status Badge */}
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      train.isRunning
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : "bg-red-100 text-red-700 border border-red-300"
                    }`}
                  >
                    {train.isRunning ? "Running" : "Not Running"}
                  </span>
                  {expandedTrain === train._id ? (
                    <ChevronUp className="text-blue-700" />
                  ) : (
                    <ChevronDown className="text-blue-700" />
                  )}
                </div>
              </div>

              {/* 🔽 Expanded Details */}
              {expandedTrain === train._id && (
                <div className="p-5 bg-white border-t border-gray-200">
                  {/* 🗺️ Route Info */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 flex items-center gap-2">
                      <MapPin className="text-blue-500" /> Route Details
                    </h3>

                    {Array.isArray(train.routes) && train.routes.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm border border-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="border px-3 py-2 text-left">Stop</th>
                              <th className="border px-3 py-2 text-left">Arrival</th>
                              <th className="border px-3 py-2 text-left">Departure</th>
                              <th className="border px-3 py-2 text-left">Halt Duration</th>
                            </tr>
                          </thead>
                          <tbody>
                            {train.routes.map((stop, i) => (
                              <tr key={i} className="hover:bg-gray-50">
                                <td className="border px-3 py-2">{stop.stopName || "—"}</td>
                                <td className="border px-3 py-2">{stop.arrival || "—"}</td>
                                <td className="border px-3 py-2">{stop.departure || "—"}</td>
                                <td className="border px-3 py-2 text-gray-600">
                                  {stop.haltDuration ? `⏱ ${stop.haltDuration}` : "—"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">
                        No route data available.
                      </p>
                    )}
                  </div>

                  {/* 🚉 Coaches Info */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">
                      Coach Classes & Prices
                    </h3>

                    {Array.isArray(train.coaches) && train.coaches.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {train.coaches.map((coach, idx) => (
                          <div
                            key={idx}
                            className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm hover:shadow-md transition"
                          >
                            <h4 className="text-blue-700 font-semibold mb-1">
                              {coach.type || "Unknown"}
                            </h4>
                            <p className="text-sm text-gray-700">
                              Coaches:{" "}
                              <span className="font-medium">{coach.count || 0}</span>
                            </p>
                            <p className="text-sm text-gray-700">
                              Seats Available:{" "}
                              <span className="font-medium">
                                {coach.seatsAvailable || 0}
                              </span>
                            </p>
                            <p className="text-sm text-gray-700">
                              Price per Seat:{" "}
                              <span className="font-semibold text-green-700">
                                ₹{coach.price?.toLocaleString() || "—"}
                              </span>
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">
                        No coach data available.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RoutesAndStations;

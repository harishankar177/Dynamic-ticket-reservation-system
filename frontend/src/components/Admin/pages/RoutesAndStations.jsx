import React, { useEffect, useState } from 'react';
import axios from '../../../axiosInstance';
import { MapPin, Search, ChevronDown, ChevronUp } from 'lucide-react';

export default function RoutesAndStations() {
  const [trains, setTrains] = useState([]);
  const [search, setSearch] = useState('');
  const [openTrain, setOpenTrain] = useState(null);

  const fetchTrains = async () => {
    try {
      const res = await axios.get('/trains');
      setTrains(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch trains for routes:', err);
      setTrains([]);
    }
  };

  useEffect(() => {
    fetchTrains();
  }, []);

  const filtered = trains.filter(
    (t) =>
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.number?.toString().includes(search) ||
      t.from?.toLowerCase().includes(search.toLowerCase()) ||
      t.to?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Routes & Stations</h2>
          <p className="text-sm text-slate-600">View train routes and station stops</p>
        </div>
        <div className="w-80 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search trains or stations..."
            className="w-full pl-10 pr-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        {filtered.length === 0 ? (
          <div className="text-center text-slate-500 py-8">No trains or routes found.</div>
        ) : (
          <div className="space-y-3">
            {filtered.map((train) => (
              <div key={train._id} className="border rounded-lg overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100"
                  onClick={() => setOpenTrain(openTrain === train._id ? null : train._id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-md bg-emerald-100 flex items-center justify-center">
                        <MapPin className="text-emerald-600" />
                      </div>
                      <div className={`absolute -top-1 -left-1 w-3 h-3 rounded-full ${
                        train.isRunning ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                    </div>
                    <div className="text-left flex-grow">
                      <div className="font-semibold text-slate-800">{train.name} ({train.number})</div>
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <span>{train.from} → {train.to}</span>
                        <span className="mx-2">•</span>
                        <span className="text-emerald-600">
                          {train.departureTime ? `Dep: ${train.departureTime}` : 'No departure time'}
                        </span>
                        <span className="mx-2">•</span>
                        <span className="text-blue-600">
                          {train.arrivalTime ? `Arr: ${train.arrivalTime}` : 'No arrival time'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-slate-500 text-sm">{train.routes?.length || 0} stops</div>
                    <span className="ml-1">{openTrain === train._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
                  </div>
                </button>

                {openTrain === train._id && (
                  <div className="p-4 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-semibold text-slate-700 mb-3">Route Summary</h4>
                        <div className="bg-slate-50 p-3 rounded-lg space-y-2">
                          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                            <span className="text-slate-600">Departure Time</span>
                            <span className="font-medium text-emerald-600">{train.departureTime || 'Not Set'}</span>
                          </div>
                          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                            <span className="text-slate-600">Arrival Time</span>
                            <span className="font-medium text-blue-600">{train.arrivalTime || 'Not Set'}</span>
                          </div>
                          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                            <span className="text-slate-600">Status</span>
                            <span className={`font-medium ${train.isRunning ? 'text-green-600' : 'text-gray-600'}`}>
                              {train.isRunning ? '🟢 Running' : '⚪ Stopped'}
                            </span>
                          </div>
                        </div>

                        {/* Coaches Section */}
                        <h4 className="font-semibold text-slate-700 mb-3 mt-4">Coach Classes</h4>
                        <div className="bg-slate-50 p-3 rounded-lg space-y-2">
                          {train.coaches?.map((coach, idx) => (
                            coach.count > 0 && (
                              <div key={idx} className="flex items-center justify-between border-b last:border-b-0 border-slate-200 pb-2 last:pb-0">
                                <div>
                                  <span className="font-medium text-slate-700">{coach.type}</span>
                                  <div className="text-xs text-slate-500">
                                    {coach.count} coach{coach.count > 1 ? 'es' : ''}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="font-medium text-emerald-600">
                                    {coach.seatsAvailable}
                                  </span>
                                  <div className="text-xs text-slate-500">seats available</div>
                                </div>
                              </div>
                            )
                          ))}
                          {!train.coaches?.some(c => c.count > 0) && (
                            <div className="text-slate-500 text-sm text-center py-2">
                              No coaches configured
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <h4 className="font-semibold text-slate-700 mb-3">Stops</h4>
                        <div className="space-y-2">
                          {(train.routes || []).map((stop, idx) => (
                            <div key={idx} className="flex items-center justify-between border rounded px-3 py-2 bg-slate-50">
                              <div>
                                <div className="font-medium">{stop.stopName || `Stop ${idx + 1}`}</div>
                                <div className="text-xs text-slate-500">Arrival: {stop.arrival || '—'} • Departure: {stop.departure || '—'}</div>
                              </div>
                              <div className="text-sm text-slate-600">{idx + 1}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

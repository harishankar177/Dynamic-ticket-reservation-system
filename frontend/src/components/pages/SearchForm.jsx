import React, { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, Calendar, Users, ArrowRightLeft } from 'lucide-react';
import axiosInstance from '../../axiosInstance';

const SearchForm = ({ onSearch }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);

  const [stations, setStations] = useState([]);
  const [allTrains, setAllTrains] = useState([]);

  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchTrains = async () => {
      try {
        const res = await axiosInstance.get('/trains');
        if (!mounted) return;
        const trains = res.data || [];
        setAllTrains(trains);

        const setOfStations = new Set();
        trains.forEach((t) => {
          if (t.from) setOfStations.add(t.from);
          if (t.to) setOfStations.add(t.to);
          if (Array.isArray(t.routes)) {
            t.routes.forEach((r) => {
              if (r.stopName) setOfStations.add(r.stopName);
            });
          }
        });
        setStations(Array.from(setOfStations).sort());
      } catch (err) {
        console.error('Failed to fetch trains/stations', err);
      }
    };
    fetchTrains();
    return () => { mounted = false; };
  }, []);

  const swapStations = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleQuickSelect = (fromCity, toCity) => {
    setFrom(fromCity);
    setTo(toCity);
  };

  const destinationOptions = useMemo(() => {
    if (!from || !allTrains.length) return [];
    const destSet = new Set();
    allTrains.forEach((t) => {
      const stops = [];
      if (t.from) stops.push(t.from);
      if (Array.isArray(t.routes)) stops.push(...t.routes.map((r) => r.stopName));
      if (t.to) stops.push(t.to);
      const fromIndex = stops.findIndex((s) => s === from);
      if (fromIndex >= 0) {
        for (let i = fromIndex + 1; i < stops.length; i++) {
          if (stops[i]) destSet.add(stops[i]);
        }
      }
    });
    return Array.from(destSet).sort();
  }, [from, allTrains]);

  const routes = useMemo(() => {
    const map = {};
    allTrains.forEach((t) => {
      const stops = [];
      if (t.from) stops.push(t.from);
      if (Array.isArray(t.routes)) stops.push(...t.routes.map((r) => r.stopName));
      if (t.to) stops.push(t.to);
      for (let i = 0; i < stops.length; i++) {
        for (let j = i + 1; j < stops.length; j++) {
          const a = stops[i];
          const b = stops[j];
          if (!a || !b) continue;
          if (!map[a]) map[a] = {};
          if (!map[a][b]) map[a][b] = [];
          map[a][b].push(t);
        }
      }
    });
    return map;
  }, [allTrains]);

  const popularRoutes = [
    ['Chennai Egmore', 'Kanniyakumari'],
    ['Chennai Egmore', 'Madurai'],
    ['Kanniyakumari', 'New Delhi'],
    ['Chennai Central', 'Mysuru']
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!from || !to || !date || !passengers) return alert('Please fill all fields');
    onSearch({ from, to, date, passengers });
  };

  const filteredFromStations = useMemo(() => {
    if (!from.trim()) return [];
    return stations.filter((s) =>
      s.toLowerCase().includes(from.toLowerCase())
    );
  }, [from, stations]);

  const filteredToStations = useMemo(() => {
    if (!to.trim()) return [];
    return destinationOptions.filter((s) =>
      s.toLowerCase().includes(to.toLowerCase())
    );
  }, [to, destinationOptions]);

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Book Your Train Journey</h2>
        <p className="text-gray-600">Find and book trains on real Indian routes</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 relative">
          {/* From */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  setShowFromDropdown(!!e.target.value);
                  setTo('');
                }}
                onFocus={() => setShowFromDropdown(!!from)}
                onBlur={() => setTimeout(() => setShowFromDropdown(false), 150)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter departure station"
                required
              />
              {showFromDropdown && filteredFromStations.length > 0 && (
                <ul className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto">
                  {filteredFromStations.map((station) => (
                    <li
                      key={station}
                      onMouseDown={() => {
                        setFrom(station);
                        setShowFromDropdown(false);
                      }}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-700"
                    >
                      {station}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Swap */}
          <div className="flex items-end pb-3 justify-center">
            <button
              type="button"
              onClick={swapStations}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            >
              <ArrowRightLeft size={20} />
            </button>
          </div>

          {/* To */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  setShowToDropdown(!!e.target.value);
                }}
                onFocus={() => setShowToDropdown(!!to)}
                onBlur={() => setTimeout(() => setShowToDropdown(false), 150)}
                disabled={!from}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                placeholder={from ? 'Enter destination station' : 'Select departure first'}
                required
              />
              {showToDropdown && filteredToStations.length > 0 && (
                <ul className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto">
                  {filteredToStations.map((station) => (
                    <li
                      key={station}
                      onMouseDown={() => {
                        setTo(station);
                        setShowToDropdown(false);
                      }}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-700"
                    >
                      {station}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Date */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Journey Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Passengers + Search Button */}
        <div className="flex flex-col md:flex-row gap-4 items-end mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Passengers</label>
            <div className="relative">
              <Users className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="number"
                min={1}
                value={passengers}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setPassengers(Number(value));
                  }
                }}
                placeholder="Enter number of passengers"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            <Search size={20} />
            <span>Search Trains</span>
          </button>
        </div>
      </form>

      {/* Popular Routes */}
      <div className="max-w-6xl mx-auto mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Popular Routes</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularRoutes.map(([fromCity, toCity], index) => (
            <div
              key={index}
              onClick={() => handleQuickSelect(fromCity, toCity)}
              className="cursor-pointer p-4 bg-white rounded-xl shadow hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-blue-300"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-800">{fromCity}</span>
                <ArrowRightLeft size={16} className="text-gray-400" />
                <span className="font-medium text-gray-800">{toCity}</span>
              </div>
              <p className="text-sm text-gray-600">
                Available Trains: {routes?.[fromCity]?.[toCity]?.length || 0}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
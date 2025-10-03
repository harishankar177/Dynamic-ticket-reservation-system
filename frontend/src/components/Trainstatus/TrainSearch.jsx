import { useState } from 'react';
import { Search,   Train, MapPin } from 'lucide-react';
import { mockTrains } from '../data/mockData';

export default function TrainSearch({ onSelectTrain }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTrains, setFilteredTrains] = useState([]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredTrains([]);
      return;
    }

    const results = mockTrains.filter(
      (train) =>
        train.trainNumber.toLowerCase().includes(query.toLowerCase()) ||
        train.trainName.toLowerCase().includes(query.toLowerCase()) ||
        train.sourceStation.toLowerCase().includes(query.toLowerCase()) ||
        train.destinationStation.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTrains(results);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Train className="w-12 h-12 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Train Status</h1>
          <p className="text-slate-600">Search for trains and check real-time status</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by train number or name..."
              className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors text-lg"
            />
          </div>
        </div>

        {searchQuery && filteredTrains.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-600 text-lg">No trains found matching your search</p>
          </div>
        )}

        {filteredTrains.length > 0 && (
          <div className="space-y-4">
            {filteredTrains.map((train) => (
              <div
                key={train.id}
                onClick={() => onSelectTrain(train.trainNumber)}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-bold text-slate-800">
                          {train.trainNumber}
                        </span>
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                          {train.trainType}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-slate-700 group-hover:text-orange-600 transition-colors">
                        {train.trainName}
                      </h3>
                    </div>
                    <Train className="w-8 h-8 text-orange-600 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="flex items-center gap-4 text-slate-600">
                    <div className="flex items-center gap-2 flex-1">
                      <MapPin className="w-5 h-5 text-green-600" />
                      <span className="font-medium">{train.sourceStation}</span>
                    </div>
                    <div className="w-12 h-0.5 bg-slate-300"></div>
                    <div className="flex items-center gap-2 flex-1 justify-end">
                      <span className="font-medium">{train.destinationStation}</span>
                      <MapPin className="w-5 h-5 text-red-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-3 border-t border-slate-100">
                  <p className="text-sm text-slate-600 text-center">
                    Click to view live status and schedule
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!searchQuery && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Popular Trains</h2>
            <div className="grid gap-3">
              {mockTrains.slice(0, 5).map((train) => (
                <button
                  key={train.id}
                  onClick={() => onSelectTrain(train.trainNumber)}
                  className="text-left p-4 rounded-xl hover:bg-slate-50 transition-colors border-2 border-transparent hover:border-orange-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">{train.trainNumber}</span>
                      <span className="text-slate-600 ml-3">{train.trainName}</span>
                    </div>
                    <span className="text-sm text-slate-500">{train.trainType}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

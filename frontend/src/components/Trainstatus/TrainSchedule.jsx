import { useState, useEffect } from 'react';
import {  Train, MapPin, Clock, ArrowLeft, Calendar } from 'lucide-react';
import { mockSchedules, mockTrains } from '../data/mockData';

export default function TrainSchedule({ trainNumber, onBack }) {
  const [schedule, setSchedule] = useState([]);
  const train = mockTrains.find((t) => t.trainNumber === trainNumber);

  useEffect(() => {
    const trainSchedule = mockSchedules[trainNumber] || [];
    setSchedule(trainSchedule);
  }, [trainNumber]);

  if (!train) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-slate-600">Train not found</p>
          <button
            onClick={onBack}
            className="mt-6 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getTotalDuration = () => {
    if (schedule.length < 2) return 'N/A';
    const first = schedule[0];
    const last = schedule[schedule.length - 1];

    if (!first.departureTime || !last.arrivalTime) return 'N/A';

    const [depHour, depMin] = first.departureTime.split(':').map(Number);
    const [arrHour, arrMin] = last.arrivalTime.split(':').map(Number);

    let totalMinutes = (arrHour * 60 + arrMin) - (depHour * 60 + depMin);
    if (last.day > first.day) {
      totalMinutes += (last.day - first.day) * 24 * 60;
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
  };

  const getTotalDistance = () => {
    if (schedule.length === 0) return 0;
    return schedule[schedule.length - 1].distanceFromSource;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Status</span>
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Train className="w-8 h-8" />
              <div>
                <h1 className="text-3xl font-bold">{train.trainNumber}</h1>
                <p className="text-emerald-100 text-lg">{train.trainName}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                <p className="text-blue-100 text-sm mb-1">Total Stops</p>
                <p className="text-2xl font-bold">{schedule.length}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                <p className="text-blue-100 text-sm mb-1">Duration</p>
                <p className="text-2xl font-bold">{getTotalDuration()}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                <p className="text-blue-100 text-sm mb-1">Distance</p>
                <p className="text-2xl font-bold">{getTotalDistance()} km</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Complete Schedule</h2>

            {schedule.length === 0 ? (
              <div className="text-center py-8 text-slate-600">
                Schedule not available for this train
              </div>
            ) : (
              <div className="space-y-2">
                {schedule.map((stop, index) => {
                  const isFirst = index === 0;
                  const isLast = index === schedule.length - 1;

                  return (
                    <div
                      key={stop.id}
                      className="relative bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors border-2 border-slate-200 hover:border-emerald-200"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                              isFirst
                                ? 'bg-green-600'
                                : isLast
                                ? 'bg-red-600'
                                : 'bg-emerald-600'
                            }`}
                          >
                            {stop.stopNumber}
                          </div>
                          {!isLast && (
                            <div className="w-1 h-8 bg-emerald-300 rounded-full my-1"></div>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <MapPin className="w-5 h-5 text-emerald-600" />
                                <h3 className="text-lg font-bold text-slate-800">
                                  {stop.stationName}
                                </h3>
                              </div>
                              <p className="text-sm text-slate-600">
                                Station Code: <span className="font-semibold">{stop.stationCode}</span>
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-slate-600">Platform</p>
                              <p className="text-2xl font-bold text-emerald-600">
                                {stop.platformNumber}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mt-3">
                            <div className="bg-white rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <Clock className="w-4 h-4 text-green-600" />
                                <p className="text-xs text-slate-600">Arrival</p>
                              </div>
                              <p className="font-bold text-slate-800">
                                {stop.arrivalTime === '--' ? 'Source' : stop.arrivalTime}
                              </p>
                            </div>

                            <div className="bg-white rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <Clock className="w-4 h-4 text-red-600" />
                                <p className="text-xs text-slate-600">Departure</p>
                              </div>
                              <p className="font-bold text-slate-800">
                                {stop.departureTime === '--' ? 'Destination' : stop.departureTime}
                              </p>
                            </div>

                            <div className="bg-white rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <MapPin className="w-4 h-4 text-emerald-600" />
                                <p className="text-xs text-slate-600">Distance</p>
                              </div>
                              <p className="font-bold text-slate-800">
                                {stop.distanceFromSource} km
                              </p>
                            </div>
                          </div>

                          {stop.day > 1 && (
                            <div className="mt-2 flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-orange-600" />
                              <span className="text-orange-600 font-medium">
                                Day {stop.day} of journey
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-3">Journey Summary</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-green-600" />
              <div>
                <p className="text-sm text-slate-600">From</p>
                <p className="font-bold text-slate-800">{train.sourceStation}</p>
              </div>
            </div>
            <div className="text-center px-4">
              <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-red-400 rounded-full mb-2"></div>
              <p className="text-sm text-slate-600">{getTotalDistance()} km</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-slate-600">To</p>
                <p className="font-bold text-slate-800">{train.destinationStation}</p>
              </div>
              <MapPin className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

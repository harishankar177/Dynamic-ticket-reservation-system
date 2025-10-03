import { useState, useEffect } from 'react';
import {  Train, MapPin, Clock, AlertCircle, CheckCircle, ArrowLeft, Calendar } from 'lucide-react';
import { mockTrainStatus, mockTrains } from '../data/mockData';

export default function LiveStatus({ trainNumber, onBack, onViewSchedule }) {
  const [status, setStatus] = useState(null);
  const [lastUpdate, setLastUpdate] = useState('');

  useEffect(() => {
    const trainStatus = mockTrainStatus.find((s) => s.trainNumber === trainNumber);
    setStatus(trainStatus || null);
  }, [trainNumber]);

  useEffect(() => {
    if (!status) return;

    const updateTime = () => {
      const now = new Date();
      const updated = new Date(status.lastUpdated);
      const diff = Math.floor((now.getTime() - updated.getTime()) / 60000);

      if (diff < 1) {
        setLastUpdate('Just now');
      } else if (diff < 60) {
        setLastUpdate(`${diff} min ago`);
      } else {
        setLastUpdate(`${Math.floor(diff / 60)} hr ago`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, [status]);

  const train = mockTrains.find((t) => t.trainNumber === trainNumber);

  if (!status || !train) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <p className="text-xl text-slate-600">Status not available for train {trainNumber}</p>
          <button
            onClick={onBack}
            className="mt-6 px-6 py-3 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = () => {
    switch (status.status) {
      case 'On Time':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Delayed':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getStatusIcon = () => {
    switch (status.status) {
      case 'On Time':
        return <CheckCircle className="w-6 h-6" />;
      case 'Delayed':
        return <Clock className="w-6 h-6" />;
      case 'Cancelled':
        return <AlertCircle className="w-6 h-6" />;
      default:
        return <Train className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-rose-700 hover:text-rose-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Search</span>
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-rose-600 to-pink-700 p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <Train className="w-8 h-8" />
              <div>
                <h1 className="text-3xl font-bold">{train.trainNumber}</h1>
                <p className="text-rose-100 text-lg">{train.trainName}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(status.journeyDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Updated {lastUpdate}</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className={`flex items-center gap-3 p-4 rounded-xl border-2 ${getStatusColor()} mb-6`}>
              {getStatusIcon()}
              <div className="flex-1">
                <p className="font-bold text-lg">{status.status}</p>
                {status.delayMinutes > 0 && (
                  <p className="text-sm">Delayed by {status.delayMinutes} minutes</p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">Route</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 flex-1">
                    <MapPin className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-slate-800">{train.sourceStation}</p>
                      <p className="text-sm text-slate-500">Origin</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-16 h-1 bg-gradient-to-r from-green-400 to-red-400 rounded-full"></div>
                  <div className="flex items-center gap-2 flex-1 justify-end text-right">
                    <div>
                      <p className="font-semibold text-slate-800">{train.destinationStation}</p>
                      <p className="text-sm text-slate-500">Destination</p>
                    </div>
                    <MapPin className="w-5 h-5 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-rose-50 rounded-xl p-4 border-2 border-rose-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Current Location</p>
                    <p className="font-bold text-lg text-slate-800">{status.currentStationName}</p>
                    <p className="text-sm text-slate-600">Station Code: {status.currentStationCode}</p>
                  </div>
                </div>
              </div>

              {status.expectedArrival && (
                <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200">
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-slate-600" />
                    <div>
                      <p className="text-sm text-slate-600">Expected Arrival at Destination</p>
                      <p className="font-bold text-lg text-slate-800">
                        {new Date(status.expectedArrival).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={onViewSchedule}
              className="w-full mt-6 py-4 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              View Full Schedule
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Train Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-600 mb-1">Train Type</p>
              <p className="font-semibold text-slate-800">{train.trainType}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-600 mb-1">Journey Date</p>
              <p className="font-semibold text-slate-800">
                {new Date(status.journeyDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

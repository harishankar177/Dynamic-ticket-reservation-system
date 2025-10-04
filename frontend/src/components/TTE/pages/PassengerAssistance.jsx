import React, { useState } from 'react';
import { useTTE } from '../context/TTEContext';
import { Users, Plus, HelpCircle } from 'lucide-react';

const PassengerAssistance = () => {
  const { currentDuty, assistances, addAssistance } = useTTE();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    assistanceType: 'seat_finding',
    coachNumber: '',
    seatNumber: '',
    passengerName: '',
    description: '',
    resolution: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentDuty) return;

    addAssistance({
      ...formData,
      dutyAssignmentId: currentDuty.id,
    });

    setFormData({
      assistanceType: 'seat_finding',
      coachNumber: '',
      seatNumber: '',
      passengerName: '',
      description: '',
      resolution: '',
    });
    setShowForm(false);
  };

  const typeLabels = {
    seat_finding: 'Seat Finding',
    dispute_resolution: 'Dispute Resolution',
    information: 'Information',
    other: 'Other',
  };

  const typeColors = {
    seat_finding: 'bg-blue-100 text-blue-700',
    dispute_resolution: 'bg-orange-100 text-orange-700',
    information: 'bg-green-100 text-green-700',
    other: 'bg-slate-100 text-slate-700',
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
          <Users className="w-8 h-8 text-orange-500" />
          Passenger Assistance
        </h1>
        <p className="text-slate-600">Help passengers and resolve disputes</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Assistance Records</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Record Assistance
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-slate-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Assistance Type *
                </label>
                <select
                  value={formData.assistanceType}
                  onChange={(e) =>
                    setFormData({ ...formData, assistanceType: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="seat_finding">Seat Finding</option>
                  <option value="dispute_resolution">Dispute Resolution</option>
                  <option value="information">Information</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Coach Number *
                </label>
                <select
                  value={formData.coachNumber}
                  onChange={(e) => setFormData({ ...formData, coachNumber: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select Coach</option>
                  {currentDuty?.coachNumbers.map((coach) => (
                    <option key={coach} value={coach}>
                      {coach}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Seat Number
                </label>
                <input
                  type="text"
                  value={formData.seatNumber}
                  onChange={(e) => setFormData({ ...formData, seatNumber: e.target.value })}
                  placeholder="e.g., 45 (optional)"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Passenger Name
                </label>
                <input
                  type="text"
                  value={formData.passengerName}
                  onChange={(e) => setFormData({ ...formData, passengerName: e.target.value })}
                  placeholder="Passenger name (optional)"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                  placeholder="Describe the assistance provided..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Resolution
                </label>
                <textarea
                  value={formData.resolution}
                  onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                  rows={2}
                  placeholder="How was the issue resolved..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Save Record
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {assistances.length > 0 ? (
            assistances
              .slice()
              .reverse()
              .map((assistance) => (
                <div
                  key={assistance.id}
                  className="border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-orange-500" />
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          typeColors[assistance.assistanceType]
                        }`}
                      >
                        {typeLabels[assistance.assistanceType]}
                      </span>
                    </div>
                    <div className="text-right text-xs text-slate-500">
                      {new Date(assistance.assistedAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-slate-600">Coach</p>
                      <p className="font-medium text-slate-800">{assistance.coachNumber}</p>
                    </div>
                    {assistance.seatNumber && (
                      <div>
                        <p className="text-slate-600">Seat</p>
                        <p className="font-medium text-slate-800">{assistance.seatNumber}</p>
                      </div>
                    )}
                    {assistance.passengerName && (
                      <div>
                        <p className="text-slate-600">Passenger</p>
                        <p className="font-medium text-slate-800">{assistance.passengerName}</p>
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <h5 className="font-medium text-slate-700 text-sm mb-1">Description:</h5>
                    <p className="text-sm text-slate-600">{assistance.description}</p>
                  </div>

                  {assistance.resolution && (
                    <div>
                      <h5 className="font-medium text-slate-700 text-sm mb-1">Resolution:</h5>
                      <p className="text-sm text-slate-600">{assistance.resolution}</p>
                    </div>
                  )}
                </div>
              ))
          ) : (
            <p className="text-center text-slate-500 py-12">
              No assistance records yet. Click "Record Assistance" to start.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PassengerAssistance;

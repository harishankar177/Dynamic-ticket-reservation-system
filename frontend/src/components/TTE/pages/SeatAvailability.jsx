import React, { useState } from 'react';
import { useTTE } from '../context/TTEContext';
import { Armchair, Plus, Search } from 'lucide-react';

const SeatAvailability = () => {
  const { currentDuty, seatAvailability, addSeatAvailability, updateSeatAvailability } = useTTE();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    coachNumber: '',
    seatNumber: '',
    fromStation: '',
    toStation: '',
    status: 'available',
    soldTo: '',
    amountCollected: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentDuty) return;

    addSeatAvailability({
      ...formData,
      dutyAssignmentId: currentDuty.id,
      amountCollected: formData.amountCollected
        ? parseFloat(formData.amountCollected)
        : undefined,
    });

    setFormData({
      coachNumber: '',
      seatNumber: '',
      fromStation: '',
      toStation: '',
      status: 'available',
      soldTo: '',
      amountCollected: '',
    });
    setShowForm(false);
  };

  const markAsSold = (id) => {
    const soldTo = prompt('Enter passenger name:');
    const amount = prompt('Enter amount collected (₹):');

    if (soldTo && amount) {
      updateSeatAvailability(id, {
        status: 'sold',
        soldTo,
        amountCollected: parseFloat(amount),
      });
    }
  };

  const filteredSeats = seatAvailability.filter(
    (seat) =>
      seat.coachNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seat.seatNumber.includes(searchTerm) ||
      seat.fromStation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seat.toStation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableSeats = seatAvailability.filter((s) => s.status === 'available').length;
  const soldSeats = seatAvailability.filter((s) => s.status === 'sold').length;
  const totalRevenue = seatAvailability
    .filter((s) => s.status === 'sold')
    .reduce((sum, s) => sum + (s.amountCollected || 0), 0);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
          <Armchair className="w-8 h-8 text-orange-500" />
          Seat Availability Management
        </h1>
        <p className="text-slate-600">Manage vacant seats and sell tickets during station stops</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
          <p className="text-blue-100 text-sm mb-1">Available Seats</p>
          <p className="text-3xl font-bold">{availableSeats}</p>
          <p className="text-blue-100 text-xs mt-2">Ready to sell</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
          <p className="text-green-100 text-sm mb-1">Sold En Route</p>
          <p className="text-3xl font-bold">{soldSeats}</p>
          <p className="text-green-100 text-xs mt-2">Seats sold during journey</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-sm p-6 text-white">
          <p className="text-orange-100 text-sm mb-1">Revenue Collected</p>
          <p className="text-3xl font-bold">₹{totalRevenue.toFixed(2)}</p>
          <p className="text-orange-100 text-xs mt-2">From seat sales</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by coach, seat, or station..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Available Seat
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-slate-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  Seat Number *
                </label>
                <input
                  type="text"
                  value={formData.seatNumber}
                  onChange={(e) => setFormData({ ...formData, seatNumber: e.target.value })}
                  required
                  placeholder="e.g., 45"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Available From Station *
                </label>
                <input
                  type="text"
                  value={formData.fromStation}
                  onChange={(e) => setFormData({ ...formData, fromStation: e.target.value })}
                  required
                  placeholder="e.g., New Delhi"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Available To Station *
                </label>
                <input
                  type="text"
                  value={formData.toStation}
                  onChange={(e) => setFormData({ ...formData, toStation: e.target.value })}
                  required
                  placeholder="e.g., Mumbai Central"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Add Seat
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

        <div className="space-y-3">
          {filteredSeats.length > 0 ? (
            filteredSeats
              .slice()
              .reverse()
              .map((seat) => (
                <div
                  key={seat.id}
                  className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Armchair className="w-5 h-5 text-orange-500" />
                        <h4 className="font-semibold text-slate-800">
                          Coach {seat.coachNumber}, Seat {seat.seatNumber}
                        </h4>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            seat.status === 'available'
                              ? 'bg-green-100 text-green-700'
                              : seat.status === 'sold'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {seat.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-slate-600">From</p>
                          <p className="font-medium text-slate-800">{seat.fromStation}</p>
                        </div>
                        <div>
                          <p className="text-slate-600">To</p>
                          <p className="font-medium text-slate-800">{seat.toStation}</p>
                        </div>
                        {seat.soldTo && (
                          <div>
                            <p className="text-slate-600">Sold To</p>
                            <p className="font-medium text-slate-800">{seat.soldTo}</p>
                          </div>
                        )}
                        {seat.amountCollected && (
                          <div>
                            <p className="text-slate-600">Amount</p>
                            <p className="font-bold text-green-600">
                              ₹{seat.amountCollected.toFixed(2)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-xs text-slate-500">
                        {new Date(seat.updatedAt).toLocaleString()}
                      </div>
                      {seat.status === 'available' && (
                        <button
                          onClick={() => markAsSold(seat.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded text-sm transition-colors"
                        >
                          Mark as Sold
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <p className="text-center text-slate-500 py-12">
              No seat availability records yet. Click "Add Available Seat" to start.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeatAvailability;

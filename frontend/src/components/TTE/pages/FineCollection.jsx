import React, { useState } from 'react';
import { useTTE } from '../context/TTEContext';
import { IndianRupee, Plus, Search } from 'lucide-react';

const FineCollection = () => {
  const { currentDuty, fines, addFine, updateFine } = useTTE();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    passengerName: '',
    coachNumber: '',
    seatNumber: '',
    reason: '',
    amount: '',
    paymentStatus: 'collected',
    paymentMethod: 'cash',
    receiptNumber: '',
    notes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentDuty) return;

    addFine({
      ...formData,
      dutyAssignmentId: currentDuty.id,
      amount: parseFloat(formData.amount),
    });

    setFormData({
      passengerName: '',
      coachNumber: '',
      seatNumber: '',
      reason: '',
      amount: '',
      paymentStatus: 'collected',
      paymentMethod: 'cash',
      receiptNumber: '',
      notes: '',
    });
    setShowForm(false);
  };

  const filteredFines = fines.filter(
    (fine) =>
      fine.passengerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fine.coachNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (fine.receiptNumber && fine.receiptNumber.includes(searchTerm))
  );

  const totalCollected = fines
    .filter((f) => f.paymentStatus === 'collected')
    .reduce((sum, f) => sum + f.amount, 0);

  const totalPending = fines
    .filter((f) => f.paymentStatus === 'pending')
    .reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
          <IndianRupee className="w-8 h-8 text-orange-500" />
          Fine Collection
        </h1>
        <p className="text-slate-600">Collect fines for ticketless travel and violations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
          <p className="text-green-100 text-sm mb-1">Total Collected</p>
          <p className="text-3xl font-bold">₹{totalCollected.toFixed(2)}</p>
          <p className="text-green-100 text-xs mt-2">
            {fines.filter((f) => f.paymentStatus === 'collected').length} fines collected
          </p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-sm p-6 text-white">
          <p className="text-orange-100 text-sm mb-1">Pending Collection</p>
          <p className="text-3xl font-bold">₹{totalPending.toFixed(2)}</p>
          <p className="text-orange-100 text-xs mt-2">
            {fines.filter((f) => f.paymentStatus === 'pending').length} fines pending
          </p>
        </div>
        <div className="bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl shadow-sm p-6 text-white">
          <p className="text-slate-100 text-sm mb-1">Total Fines</p>
          <p className="text-3xl font-bold">{fines.length}</p>
          <p className="text-slate-100 text-xs mt-2">All time</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, coach, or receipt..."
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
            Record Fine
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-slate-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Passenger Name *
                </label>
                <input
                  type="text"
                  value={formData.passengerName}
                  onChange={(e) => setFormData({ ...formData, passengerName: e.target.value })}
                  required
                  placeholder="Full name"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
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
                  Fine Amount (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  placeholder="e.g., 500"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Reason for Fine *
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  required
                  rows={2}
                  placeholder="e.g., Travelling without valid ticket"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Payment Status *
                </label>
                <select
                  value={formData.paymentStatus}
                  onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="collected">Collected</option>
                  <option value="pending">Pending</option>
                  <option value="waived">Waived</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="cash">Cash</option>
                  <option value="upi">UPI</option>
                  <option value="card">Card</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Receipt Number
                </label>
                <input
                  type="text"
                  value={formData.receiptNumber}
                  onChange={(e) => setFormData({ ...formData, receiptNumber: e.target.value })}
                  placeholder="e.g., RCT123456"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  placeholder="Additional notes..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Save Fine
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
          {filteredFines.length > 0 ? (
            filteredFines
              .slice()
              .reverse()
              .map((fine) => (
                <div
                  key={fine.id}
                  className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-slate-800">{fine.passengerName}</h4>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            fine.paymentStatus === 'collected'
                              ? 'bg-green-100 text-green-700'
                              : fine.paymentStatus === 'pending'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {fine.paymentStatus}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{fine.reason}</p>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <p className="text-slate-600">Amount</p>
                          <p className="font-bold text-orange-600">₹{fine.amount.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Coach</p>
                          <p className="font-medium text-slate-800">{fine.coachNumber}</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Seat</p>
                          <p className="font-medium text-slate-800">{fine.seatNumber}</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Payment</p>
                          <p className="font-medium text-slate-800 capitalize">
                            {fine.paymentMethod || '-'}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-600">Receipt</p>
                          <p className="font-medium text-slate-800">
                            {fine.receiptNumber || '-'}
                          </p>
                        </div>
                      </div>
                      {fine.notes && (
                        <p className="text-sm text-slate-600 mt-2">Note: {fine.notes}</p>
                      )}
                    </div>
                    <div className="text-right text-xs text-slate-500 ml-4">
                      {new Date(fine.collectedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <p className="text-center text-slate-500 py-12">
              No fines recorded yet. Click "Record Fine" to start.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FineCollection;

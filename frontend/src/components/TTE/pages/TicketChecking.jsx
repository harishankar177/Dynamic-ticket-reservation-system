import React, { useState } from 'react';
import { useTTE } from '../context/TTEContext';
import { ClipboardCheck, Search, Plus, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const TicketChecking = () => {
  const { currentDuty, ticketChecks, addTicketCheck } = useTTE();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    coachNumber: '',
    seatNumber: '',
    passengerName: '',
    ticketType: 'reserved',
    ticketNumber: '',
    idVerified: false,
    status: 'valid',
    notes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentDuty) return;

    addTicketCheck({
      ...formData,
      dutyAssignmentId: currentDuty.id,
    });

    setFormData({
      coachNumber: '',
      seatNumber: '',
      passengerName: '',
      ticketType: 'reserved',
      ticketNumber: '',
      idVerified: false,
      status: 'valid',
      notes: '',
    });
    setShowForm(false);
  };

  const filteredChecks = ticketChecks.filter(
    (check) =>
      check.passengerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      check.ticketNumber.includes(searchTerm) ||
      check.coachNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusStats = {
    valid: ticketChecks.filter((c) => c.status === 'valid').length,
    invalid: ticketChecks.filter((c) => c.status === 'invalid').length,
    no_ticket: ticketChecks.filter((c) => c.status === 'no_ticket').length,
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
          <ClipboardCheck className="w-8 h-8 text-orange-500" />
          Ticket Checking & Verification
        </h1>
        <p className="text-slate-600">Verify and record passenger tickets</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Valid Tickets</p>
              <p className="text-3xl font-bold text-green-600">{statusStats.valid}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Invalid Tickets</p>
              <p className="text-3xl font-bold text-orange-600">{statusStats.invalid}</p>
            </div>
            <AlertCircle className="w-12 h-12 text-orange-500 opacity-20" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">No Ticket</p>
              <p className="text-3xl font-bold text-red-600">{statusStats.no_ticket}</p>
            </div>
            <XCircle className="w-12 h-12 text-red-500 opacity-20" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, ticket number, or coach..."
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
            Check Ticket
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-slate-50 rounded-lg p-6 mb-6">
            {/* Form fields */}
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
                  Ticket Type *
                </label>
                <select
                  value={formData.ticketType}
                  onChange={(e) => setFormData({ ...formData, ticketType: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="reserved">Reserved</option>
                  <option value="unreserved">Unreserved</option>
                  <option value="season">Season Ticket</option>
                  <option value="e-ticket">E-Ticket</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Ticket/PNR Number *
                </label>
                <input
                  type="text"
                  value={formData.ticketNumber}
                  onChange={(e) => setFormData({ ...formData, ticketNumber: e.target.value })}
                  required
                  placeholder="e.g., PNR123456789"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Verification Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="valid">Valid</option>
                  <option value="invalid">Invalid</option>
                  <option value="no_ticket">No Ticket</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.idVerified}
                    onChange={(e) => setFormData({ ...formData, idVerified: e.target.checked })}
                    className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium text-slate-700">ID Proof Verified</span>
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  placeholder="Any additional notes..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Save Check
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
          {filteredChecks.length > 0 ? (
            filteredChecks.reverse().map((check) => (
              <div
                key={check.id}
                className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-slate-800">{check.passengerName}</h4>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          check.status === 'valid'
                            ? 'bg-green-100 text-green-700'
                            : check.status === 'invalid'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {check.status}
                      </span>
                      {check.idVerified && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          ID Verified
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-slate-600">Coach</p>
                        <p className="font-medium text-slate-800">{check.coachNumber}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Seat</p>
                        <p className="font-medium text-slate-800">{check.seatNumber}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Ticket Type</p>
                        <p className="font-medium text-slate-800 capitalize">{check.ticketType}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Ticket No.</p>
                        <p className="font-medium text-slate-800">{check.ticketNumber}</p>
                      </div>
                    </div>
                    {check.notes && (
                      <p className="text-sm text-slate-600 mt-2">Note: {check.notes}</p>
                    )}
                  </div>
                  <div className="text-right text-xs text-slate-500">
                    {new Date(check.checkedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-slate-500 py-12">
              No ticket checks recorded yet. Click "Check Ticket" to start.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketChecking;

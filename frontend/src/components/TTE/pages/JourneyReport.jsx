import React, { useState, useEffect } from 'react';
import { useTTE } from '../context/TTEContext';
import { FileText, Save, Printer } from 'lucide-react';

const JourneyReport = () => {
  const {
    currentDuty,
    ticketChecks,
    fines,
    incidents,
    seatAvailability,
    journeyReport,
    setJourneyReport,
  } = useTTE();

  const [summary, setSummary] = useState('');

  const totalTicketsChecked = ticketChecks.length;
  const validTickets = ticketChecks.filter((t) => t.status === 'valid').length;
  const invalidTickets = ticketChecks.filter((t) => t.status === 'invalid').length;
  const noTickets = ticketChecks.filter((t) => t.status === 'no_ticket').length;

  const totalFinesCollected = fines
    .filter((f) => f.paymentStatus === 'collected')
    .reduce((sum, f) => sum + f.amount, 0);

  const totalIncidents = incidents.length;
  const unresolvedIncidents = incidents.filter((i) => !i.resolved).length;

  const seatsSoldEnroute = seatAvailability.filter((s) => s.status === 'sold').length;
  const seatRevenue = seatAvailability
    .filter((s) => s.status === 'sold')
    .reduce((sum, s) => sum + (s.amountCollected || 0), 0);

  useEffect(() => {
    if (journeyReport) {
      setSummary(journeyReport.summary);
    }
  }, [journeyReport]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentDuty) return;

    const report = {
      id: `jr-${Date.now()}`,
      dutyAssignmentId: currentDuty.id,
      totalTicketsChecked,
      totalFinesCollected,
      totalIncidents,
      seatsSoldEnroute,
      summary,
      submittedAt: new Date().toISOString(),
    };

    setJourneyReport(report);
    alert('Journey report submitted successfully!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
          <FileText className="w-8 h-8 text-orange-500" />
          End of Journey Report
        </h1>
        <p className="text-slate-600">Submit your daily duty report</p>
      </div>

      {currentDuty && (
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl p-6 mb-8 text-white">
          <h2 className="text-xl font-bold mb-4">Journey Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-slate-300 mb-1">Train</p>
              <p className="font-semibold">
                {currentDuty.train?.trainName} ({currentDuty.train?.trainNumber})
              </p>
            </div>
            <div>
              <p className="text-slate-300 mb-1">Route</p>
              <p className="font-semibold">{currentDuty.train?.route}</p>
            </div>
            <div>
              <p className="text-slate-300 mb-1">Date</p>
              <p className="font-semibold">
                {new Date(currentDuty.dutyDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-slate-300 mb-1">Assigned Coaches</p>
              <p className="font-semibold">{currentDuty.coachNumbers.join(', ')}</p>
            </div>
            <div>
              <p className="text-slate-300 mb-1">Duty Status</p>
              <p className="font-semibold capitalize">{currentDuty.status}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-sm text-slate-600 mb-2">Tickets Checked</h3>
          <p className="text-3xl font-bold text-slate-800 mb-2">{totalTicketsChecked}</p>
          <div className="text-xs text-slate-500">
            <p>Valid: {validTickets}</p>
            <p>Invalid: {invalidTickets}</p>
            <p>No Ticket: {noTickets}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-sm text-slate-600 mb-2">Fines Collected</h3>
          <p className="text-3xl font-bold text-green-600 mb-2">
            ₹{totalFinesCollected.toFixed(2)}
          </p>
          <div className="text-xs text-slate-500">
            <p>Total Fines: {fines.length}</p>
            <p>Collected: {fines.filter((f) => f.paymentStatus === 'collected').length}</p>
            <p>Pending: {fines.filter((f) => f.paymentStatus === 'pending').length}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-sm text-slate-600 mb-2">Incidents</h3>
          <p className="text-3xl font-bold text-orange-600 mb-2">{totalIncidents}</p>
          <div className="text-xs text-slate-500">
            <p>Resolved: {totalIncidents - unresolvedIncidents}</p>
            <p>Unresolved: {unresolvedIncidents}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-sm text-slate-600 mb-2">Seats Sold En Route</h3>
          <p className="text-3xl font-bold text-blue-600 mb-2">{seatsSoldEnroute}</p>
          <div className="text-xs text-slate-500">
            <p>Revenue: ₹{seatRevenue.toFixed(2)}</p>
            <p>Available: {seatAvailability.filter((s) => s.status === 'available').length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Summary & Observations</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Journey Summary *
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
              rows={8}
              placeholder="Provide a detailed summary of your duty including any notable observations, issues faced, passenger behavior, coach conditions, and recommendations for improvement..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <p className="text-xs text-slate-500 mt-2">
              Include details about pre-departure checks, passenger interactions, maintenance issues reported, and any special circumstances during the journey.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!!journeyReport}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-medium"
            >
              <Save className="w-5 h-5" />
              {journeyReport ? 'Report Submitted' : 'Submit Report'}
            </button>
            {journeyReport && (
              <button
                type="button"
                onClick={handlePrint}
                className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-medium"
              >
                <Printer className="w-5 h-5" />
                Print Report
              </button>
            )}
          </div>
        </form>

        {journeyReport && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">
              Report submitted successfully on{' '}
              {new Date(journeyReport.submittedAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>

      <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Report Guidelines</h3>
        <ul className="space-y-2 text-sm text-slate-700">
          <li className="flex items-start gap-2">
            <span className="text-orange-500 font-bold">•</span>
            <span>Include all pre-departure inspections and coach condition checks</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500 font-bold">•</span>
            <span>Document any passenger disputes or assistance provided</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500 font-bold">•</span>
            <span>Note all maintenance issues reported to railway authorities</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500 font-bold">•</span>
            <span>Report any ticketless travel cases and fines collected</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500 font-bold">•</span>
            <span>Include recommendations for improving passenger experience</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500 font-bold">•</span>
            <span>Submit all collected fares and fines to railway office</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default JourneyReport;

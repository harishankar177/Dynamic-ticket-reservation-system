import React, { useState } from 'react';
import { useTTE } from '../context/TTEContext';
import { AlertTriangle, Plus, CheckCircle } from 'lucide-react';

const Incidents = () => {
  const { currentDuty, incidents, addIncident, updateIncident } = useTTE();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    incidentType: 'fare_evasion',
    coachNumber: '',
    description: '',
    passengersInvolved: '',
    actionTaken: '',
    reportedTo: '',
    severity: 'low',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentDuty) return;

    addIncident({
      ...formData,
      dutyAssignmentId: currentDuty.id,
      resolved: false,
    });

    setFormData({
      incidentType: 'fare_evasion',
      coachNumber: '',
      description: '',
      passengersInvolved: '',
      actionTaken: '',
      reportedTo: '',
      severity: 'low',
    });
    setShowForm(false);
  };

  const toggleResolved = (id, currentStatus) => {
    updateIncident(id, { resolved: !currentStatus });
  };

  const typeLabels = {
    fare_evasion: 'Fare Evasion',
    passenger_misconduct: 'Passenger Misconduct',
    emergency: 'Emergency',
    other: 'Other',
  };

  const typeColors = {
    fare_evasion: 'bg-orange-100 text-orange-700',
    passenger_misconduct: 'bg-red-100 text-red-700',
    emergency: 'bg-red-600 text-white',
    other: 'bg-slate-100 text-slate-700',
  };

  const severityColors = {
    low: 'bg-blue-100 text-blue-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-orange-100 text-orange-700',
    critical: 'bg-red-100 text-red-700',
  };

  const activeIncidents = incidents.filter((i) => !i.resolved).length;
  const resolvedIncidents = incidents.filter((i) => i.resolved).length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-orange-500" />
          Incident Reporting
        </h1>
        <p className="text-slate-600">Record and track incidents during journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm mb-1">Active Incidents</p>
              <p className="text-3xl font-bold">{activeIncidents}</p>
              <p className="text-orange-100 text-xs mt-2">Require attention</p>
            </div>
            <AlertTriangle className="w-12 h-12 opacity-30" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Resolved Incidents</p>
              <p className="text-3xl font-bold">{resolvedIncidents}</p>
              <p className="text-green-100 text-xs mt-2">Successfully handled</p>
            </div>
            <CheckCircle className="w-12 h-12 opacity-30" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Incident Records</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Report Incident
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-slate-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Incident Type *
                </label>
                <select
                  value={formData.incidentType}
                  onChange={(e) => setFormData({ ...formData, incidentType: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="fare_evasion">Fare Evasion</option>
                  <option value="passenger_misconduct">Passenger Misconduct</option>
                  <option value="emergency">Emergency</option>
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
                  Severity *
                </label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Reported To
                </label>
                <input
                  type="text"
                  value={formData.reportedTo}
                  onChange={(e) => setFormData({ ...formData, reportedTo: e.target.value })}
                  placeholder="e.g., Guard, RPF"
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
                  placeholder="Describe the incident in detail..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Passengers Involved
                </label>
                <input
                  type="text"
                  value={formData.passengersInvolved}
                  onChange={(e) =>
                    setFormData({ ...formData, passengersInvolved: e.target.value })
                  }
                  placeholder="Names or details of passengers involved"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Action Taken
                </label>
                <textarea
                  value={formData.actionTaken}
                  onChange={(e) => setFormData({ ...formData, actionTaken: e.target.value })}
                  rows={2}
                  placeholder="Describe actions taken..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Save Incident
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
          {incidents.length > 0 ? (
            incidents
              .slice()
              .reverse()
              .map((incident) => (
                <div
                  key={incident.id}
                  className={`border rounded-lg p-6 transition-colors ${
                    incident.resolved
                      ? 'border-slate-200 bg-slate-50/50'
                      : 'border-orange-200 bg-orange-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          typeColors[incident.incidentType]
                        }`}
                      >
                        {typeLabels[incident.incidentType]}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          severityColors[incident.severity]
                        }`}
                      >
                        {incident.severity.toUpperCase()}
                      </span>
                      {incident.resolved && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Resolved
                        </span>
                      )}
                    </div>
                    <div className="text-right text-xs text-slate-500">
                      {new Date(incident.occurredAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-slate-800 mb-2">
                      Coach {incident.coachNumber}
                    </h4>
                    <p className="text-sm text-slate-700">{incident.description}</p>
                  </div>

                  {incident.passengersInvolved && (
                    <div className="mb-3">
                      <h5 className="font-medium text-slate-700 text-sm mb-1">
                        Passengers Involved:
                      </h5>
                      <p className="text-sm text-slate-600">{incident.passengersInvolved}</p>
                    </div>
                  )}

                  {incident.actionTaken && (
                    <div className="mb-3">
                      <h5 className="font-medium text-slate-700 text-sm mb-1">Action Taken:</h5>
                      <p className="text-sm text-slate-600">{incident.actionTaken}</p>
                    </div>
                  )}

                  {incident.reportedTo && (
                    <div className="mb-3">
                      <h5 className="font-medium text-slate-700 text-sm mb-1">Reported To:</h5>
                      <p className="text-sm text-slate-600">{incident.reportedTo}</p>
                    </div>
                  )}

                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => toggleResolved(incident.id, incident.resolved)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        incident.resolved
                          ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {incident.resolved ? 'Mark as Unresolved' : 'Mark as Resolved'}
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <p className="text-center text-slate-500 py-12">
              No incidents recorded yet. Click "Report Incident" to start.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Incidents;

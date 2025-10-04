import React, { useState } from 'react';
import { useTTE } from '../context/TTEContext';
import { Wrench, Plus, Star, AlertCircle } from 'lucide-react';

const CoachSupervision = () => {
  const { currentDuty, inspections, addInspection } = useTTE();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    coachNumber: '',
    inspectionType: 'during_journey',
    cleanlinessRating: 5,
    maintenanceIssues: [],
    actionTaken: '',
    notes: '',
  });
  const [newIssue, setNewIssue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentDuty) return;

    addInspection({
      ...formData,
      dutyAssignmentId: currentDuty.id,
    });

    setFormData({
      coachNumber: '',
      inspectionType: 'during_journey',
      cleanlinessRating: 5,
      maintenanceIssues: [],
      actionTaken: '',
      notes: '',
    });
    setShowForm(false);
  };

  const addMaintenanceIssue = () => {
    if (newIssue.trim()) {
      setFormData({
        ...formData,
        maintenanceIssues: [...formData.maintenanceIssues, newIssue.trim()],
      });
      setNewIssue('');
    }
  };

  const removeIssue = (index) => {
    setFormData({
      ...formData,
      maintenanceIssues: formData.maintenanceIssues.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
          <Wrench className="w-8 h-8 text-orange-500" />
          Coach Supervision
        </h1>
        <p className="text-slate-600">Monitor cleanliness and maintenance issues</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Inspections</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Inspection
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
                  Inspection Type *
                </label>
                <select
                  value={formData.inspectionType}
                  onChange={(e) =>
                    setFormData({ ...formData, inspectionType: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="pre_departure">Pre-Departure</option>
                  <option value="during_journey">During Journey</option>
                  <option value="end_journey">End of Journey</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Cleanliness Rating: {formData.cleanlinessRating}/5
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFormData({ ...formData, cleanlinessRating: rating })}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          rating <= formData.cleanlinessRating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Maintenance Issues
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newIssue}
                    onChange={(e) => setNewIssue(e.target.value)}
                    placeholder="Describe issue..."
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={addMaintenanceIssue}
                    className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
                {formData.maintenanceIssues.length > 0 && (
                  <div className="space-y-2">
                    {formData.maintenanceIssues.map((issue, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200"
                      >
                        <span className="text-sm text-slate-700">{issue}</span>
                        <button
                          type="button"
                          onClick={() => removeIssue(index)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Additional Notes
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
                Save Inspection
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
          {inspections.length > 0 ? (
            inspections
              .slice()
              .reverse()
              .map((inspection) => (
                <div
                  key={inspection.id}
                  className="border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-slate-800">
                          Coach {inspection.coachNumber}
                        </h4>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 capitalize">
                          {inspection.inspectionType.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <Star
                            key={rating}
                            className={`w-5 h-5 ${
                              rating <= inspection.cleanlinessRating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-slate-600">
                          Cleanliness: {inspection.cleanlinessRating}/5
                        </span>
                      </div>
                    </div>
                    <div className="text-right text-xs text-slate-500">
                      {new Date(inspection.inspectedAt).toLocaleString()}
                    </div>
                  </div>

                  {inspection.maintenanceIssues.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                        <h5 className="font-medium text-slate-700">Maintenance Issues:</h5>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 ml-6">
                        {inspection.maintenanceIssues.map((issue, index) => (
                          <li key={index}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {inspection.actionTaken && (
                    <div className="mb-2">
                      <h5 className="font-medium text-slate-700 text-sm mb-1">Action Taken:</h5>
                      <p className="text-sm text-slate-600">{inspection.actionTaken}</p>
                    </div>
                  )}

                  {inspection.notes && (
                    <div>
                      <h5 className="font-medium text-slate-700 text-sm mb-1">Notes:</h5>
                      <p className="text-sm text-slate-600">{inspection.notes}</p>
                    </div>
                  )}
                </div>
              ))
          ) : (
            <p className="text-center text-slate-500 py-12">
              No inspections recorded yet. Click "New Inspection" to start.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoachSupervision;

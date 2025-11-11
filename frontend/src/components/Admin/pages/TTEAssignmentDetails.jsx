import React, { useState } from "react";
import {
  ClipboardList,
  PlusCircle,
  XCircle,
  Calendar,
  Train,
  MapPin,
  FileText,
  UserCheck,
} from "lucide-react";

export default function TTEAssignmentDetails() {
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      tteName: "John Doe",
      trainNumber: "12658 – Chennai Express",
      dutyDate: "2025-11-13",
      dutyType: "Morning",
      fromStation: "Chennai",
      toStation: "Bangalore",
      remarks: "Special inspection duty",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    tteName: "",
    trainNumber: "",
    dutyDate: "",
    dutyType: "",
    fromStation: "",
    toStation: "",
    remarks: "",
  });

  const dutyOptions = ["Morning", "Evening", "Night", "Full Day"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.tteName || !form.trainNumber || !form.dutyDate || !form.dutyType) {
      alert("Please fill all required fields!");
      return;
    }

    setAssignments([...assignments, { id: assignments.length + 1, ...form }]);
    setForm({
      tteName: "",
      trainNumber: "",
      dutyDate: "",
      dutyType: "",
      fromStation: "",
      toStation: "",
      remarks: "",
    });
    setShowForm(false);
  };

  const dutyBadgeColor = (type) => {
    switch (type) {
      case "Morning":
        return "bg-yellow-100 text-yellow-700";
      case "Evening":
        return "bg-purple-100 text-purple-700";
      case "Night":
        return "bg-blue-100 text-blue-700";
      case "Full Day":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-gradient-to-b from-indigo-50 to-white rounded-xl shadow-lg p-8 transition-all duration-300">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div className="flex items-center gap-3">
          <ClipboardList className="text-indigo-600" size={28} />
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
            TTE Assignment Management
          </h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-white shadow-md transition 
            ${showForm ? "bg-red-500 hover:bg-red-600" : "bg-indigo-600 hover:bg-indigo-700"}`}
        >
          {showForm ? (
            <>
              <XCircle size={20} />
              Close Form
            </>
          ) : (
            <>
              <PlusCircle size={20} />
              Add New Assignment
            </>
          )}
        </button>
      </div>

      {/* Collapsible Form */}
      {showForm && (
        <div className="mb-8 p-6 bg-white border border-indigo-100 rounded-2xl shadow-sm animate-fadeIn">
          <h3 className="text-xl font-semibold mb-5 text-gray-800 flex items-center gap-2">
            <UserCheck className="text-indigo-600" size={22} />
            Add TTE Duty Assignment
          </h3>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* TTE Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                TTE Name / ID
              </label>
              <select
                name="tteName"
                value={form.tteName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Select TTE</option>
                <option>John Doe (TTE001)</option>
                <option>Priya Sharma (TTE002)</option>
              </select>
            </div>

            {/* Train */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Train Number / Name
              </label>
              <select
                name="trainNumber"
                value={form.trainNumber}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Select Train</option>
                <option>12658 – Chennai Express</option>
                <option>12659 – Bangalore Mail</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Duty
              </label>
              <input
                type="date"
                name="dutyDate"
                value={form.dutyDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* Duty Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duty Type
              </label>
              <select
                name="dutyType"
                value={form.dutyType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Select Duty Type</option>
                {dutyOptions.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* From Station */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Station
              </label>
              <input
                type="text"
                name="fromStation"
                value={form.fromStation}
                onChange={handleChange}
                placeholder="Enter starting station"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* To Station */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Station
              </label>
              <input
                type="text"
                name="toStation"
                value={form.toStation}
                onChange={handleChange}
                placeholder="Enter destination station"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* Remarks */}
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remarks / Notes
              </label>
              <textarea
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                placeholder="Optional: Add special duty info"
                rows="3"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* Buttons */}
            <div className="lg:col-span-3 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm"
              >
                Save Assignment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl border border-gray-200 shadow-sm">
          <thead className="bg-indigo-100 text-gray-700">
            <tr>
              <th className="text-left px-4 py-3">TTE Name</th>
              <th className="text-left px-4 py-3">Train</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Duty Type</th>
              <th className="text-left px-4 py-3">From</th>
              <th className="text-left px-4 py-3">To</th>
              <th className="text-left px-4 py-3">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a) => (
              <tr
                key={a.id}
                className="border-t hover:bg-indigo-50 transition-colors"
              >
                <td className="px-4 py-3 font-medium">{a.tteName}</td>
                <td className="px-4 py-3 flex items-center gap-2">
                  <Train className="text-indigo-500" size={16} /> {a.trainNumber}
                </td>
                <td className="px-4 py-3 flex items-center gap-1">
                  <Calendar className="text-gray-500" size={15} />
                  {a.dutyDate}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${dutyBadgeColor(
                      a.dutyType
                    )}`}
                  >
                    {a.dutyType}
                  </span>
                </td>
                <td className="px-4 py-3 flex items-center gap-1">
                  <MapPin className="text-green-500" size={15} />
                  {a.fromStation}
                </td>
                <td className="px-4 py-3 flex items-center gap-1">
                  <MapPin className="text-red-500" size={15} />
                  {a.toStation}
                </td>
                <td className="px-4 py-3 text-gray-600 italic">
                  <FileText size={14} className="inline text-gray-400 mr-1" />
                  {a.remarks || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

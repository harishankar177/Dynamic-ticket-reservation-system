import React, { useState, useEffect } from "react";
import {
  Calendar,
  User,
  Train,
  Clock,
  MapPin,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

export default function AssignmentList({ refreshTrigger = 0, onSelectAssignment }) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // ====== LOAD MOCK DATA ======
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setAssignments([
        {
          id: "1",
          duty_date: "2025-11-10",
          duty_type: "Morning Shift",
          from_station: "Chennai Central",
          to_station: "Bengaluru",
          remarks: "Check reserved and waiting list passengers.",
          status: "Scheduled",
          assigned_at: "2025-11-09T10:00:00Z",
          tte_name: "Ravi Kumar",
          tte_employee_id: "TTE101",
          train_number: "12657",
          train_name: "Brindavan Express",
          train_id: "train_1",
        },
        {
          id: "2",
          duty_date: "2025-11-11",
          duty_type: "Night Shift",
          from_station: "Bengaluru",
          to_station: "Chennai Central",
          remarks: "Handle sleeper coach verification.",
          status: "In Progress",
          assigned_at: "2025-11-09T09:00:00Z",
          tte_name: "Suresh Nair",
          tte_employee_id: "TTE102",
          train_number: "12658",
          train_name: "Brindavan Express (Return)",
          train_id: "train_2",
        },
      ]);
      setLoading(false);
    }, 500);
  }, [refreshTrigger]);

  // ====== UPDATE STATUS LOCALLY ======
  const updateStatus = (assignmentId, newStatus) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === assignmentId ? { ...a, status: newStatus } : a
      )
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Scheduled":
        return <Clock className="w-4 h-4" />;
      case "In Progress":
        return <AlertCircle className="w-4 h-4" />;
      case "Completed":
        return <CheckCircle className="w-4 h-4" />;
      case "Cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const filteredAssignments =
    filter === "all"
      ? assignments
      : assignments.filter((a) => a.status === filter);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading assignments...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-800">
            TTE Duty Assignments
          </h3>
          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
            {filteredAssignments.length} {filter === "all" ? "Total" : filter}
          </span>
        </div>

        <div className="flex gap-2">
          {["all", "Scheduled", "In Progress", "Completed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status === "all" ? "All" : status}
            </button>
          ))}
        </div>
      </div>

      {/* ===== BODY ===== */}
      {filteredAssignments.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No assignments found</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className="border-2 border-gray-200 rounded-lg p-5 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
              onClick={() =>
                onSelectAssignment?.(assignment.train_id, assignment.duty_date)
              }
            >
              {/* TOP HEADER */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="font-bold text-lg text-gray-800">
                      {assignment.tte_name}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({assignment.tte_employee_id})
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Train className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold">
                      {assignment.train_number}
                    </span>
                    <span className="text-gray-600">
                      - {assignment.train_name}
                    </span>
                  </div>
                </div>
                <span
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border-2 ${getStatusColor(
                    assignment.status
                  )}`}
                >
                  {getStatusIcon(assignment.status)}
                  {assignment.status}
                </span>
              </div>

              {/* DETAIL GRID */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 rounded-lg p-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 text-gray-600 text-xs mb-1">
                    <Calendar className="w-3 h-3" />
                    <span className="font-semibold">Duty Date</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    {new Date(assignment.duty_date).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-600 text-xs mb-1">
                    <Clock className="w-3 h-3" />
                    <span className="font-semibold">Duty Type</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    {assignment.duty_type}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-600 text-xs mb-1">
                    <MapPin className="w-3 h-3 text-green-600" />
                    <span className="font-semibold">From</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    {assignment.from_station}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-600 text-xs mb-1">
                    <MapPin className="w-3 h-3 text-red-600" />
                    <span className="font-semibold">To</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    {assignment.to_station}
                  </p>
                </div>
              </div>

              {assignment.remarks && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                  <p className="text-sm text-blue-900">
                    <span className="font-semibold">Note:</span>{" "}
                    {assignment.remarks}
                  </p>
                </div>
              )}

              {/* ACTION BUTTONS */}
              {assignment.status !== "Completed" &&
                assignment.status !== "Cancelled" && (
                  <div className="flex gap-2 pt-3 border-t">
                    {assignment.status === "Scheduled" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(assignment.id, "In Progress");
                        }}
                        className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-yellow-600 transition-all"
                      >
                        Start Duty
                      </button>
                    )}
                    {assignment.status === "In Progress" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(assignment.id, "Completed");
                        }}
                        className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-green-600 transition-all"
                      >
                        Complete Duty
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(assignment.id, "Cancelled");
                      }}
                      className="bg-red-500 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-red-600 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

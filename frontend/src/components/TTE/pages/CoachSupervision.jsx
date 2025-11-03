import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ClipboardList,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const categories = [
  {
    title: "Coach Cleanliness Monitoring",
    color: "blue",
    items: [
      "Toilet cleanliness",
      "Floor condition",
      "Windows/panes clean",
      "Dustbins emptied",
      "OBHS team response",
    ],
  },
  {
    title: "Electrical & Lighting Checks",
    color: "yellow",
    items: [
      "Lights functioning",
      "Fans working",
      "Charging points working",
      "AC/Heater performance",
    ],
  },
  {
    title: "Seating & Berth Condition",
    color: "green",
    items: [
      "Seat/berth condition",
      "Seat numbering visible",
      "Window latches working",
    ],
  },
  {
    title: "Doors, Windows & Safety Equipment",
    color: "red",
    items: [
      "Door locks working",
      "Emergency windows functional",
      "Fire extinguisher available",
      "First aid box present",
    ],
  },
  {
    title: "Water Supply & Sanitation",
    color: "sky",
    items: [
      "Water available in tanks",
      "Toilet flush working",
      "Leakages present",
    ],
  },
  {
    title: "Security & Passenger Comfort",
    color: "purple",
    items: [
      "Unattended baggage",
      "Coach security ok",
      "Passenger comfort level",
    ],
  },
  {
    title: "Reporting & Communication",
    color: "slate",
    items: [
      "Report submitted",
      "Coordination with staff",
    ],
  },
];

const CoachSupervisionChecklist = () => {
  const [expanded, setExpanded] = useState({});
  const [checklist, setChecklist] = useState({});

  const toggleExpand = (category) => {
    setExpanded((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const updateStatus = (category, item, status) => {
    setChecklist((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [item]: { ...(prev[category]?.[item] || {}), status },
      },
    }));
  };

  const updateRemark = (category, item, remark) => {
    setChecklist((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [item]: { ...(prev[category]?.[item] || {}), remark },
      },
    }));
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center gap-3">
        <ClipboardList className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-slate-800">
          Coach Supervision Duty Checklist
        </h1>
      </div>

      <p className="text-slate-600 mb-6">
        Monitor and record coach cleanliness, maintenance, and safety parameters during your duty.
      </p>

      <div className="space-y-6">
        {categories.map((cat) => (
          <div
            key={cat.title}
            className="bg-white border border-slate-200 rounded-xl shadow-sm"
          >
            {/* Header */}
            <div
              className={`flex justify-between items-center p-4 bg-${cat.color}-50 cursor-pointer rounded-t-xl`}
              onClick={() => toggleExpand(cat.title)}
            >
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <ClipboardList className={`w-5 h-5 text-${cat.color}-600`} />
                {cat.title}
              </h2>
              {expanded[cat.title] ? (
                <ChevronUp className="text-slate-500 w-5 h-5" />
              ) : (
                <ChevronDown className="text-slate-500 w-5 h-5" />
              )}
            </div>

            {/* Checklist Content */}
            {expanded[cat.title] && (
              <div className="p-4 space-y-4">
                {cat.items.map((item) => {
                  const itemData = checklist[cat.title]?.[item] || {};
                  return (
                    <div
                      key={item}
                      className="flex flex-col md:flex-row md:items-center justify-between border border-slate-200 rounded-lg p-3 gap-3"
                    >
                      <p className="text-slate-800 font-medium">{item}</p>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateStatus(cat.title, item, "ok")}
                          className={`p-2 rounded-full border ${
                            itemData.status === "ok"
                              ? "bg-green-500 text-white border-green-600"
                              : "border-green-300 text-green-600 hover:bg-green-100"
                          }`}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => updateStatus(cat.title, item, "attention")}
                          className={`p-2 rounded-full border ${
                            itemData.status === "attention"
                              ? "bg-yellow-400 text-yellow-900 border-yellow-600"
                              : "border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                          }`}
                        >
                          <AlertCircle className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => updateStatus(cat.title, item, "fail")}
                          className={`p-2 rounded-full border ${
                            itemData.status === "fail"
                              ? "bg-red-500 text-white border-red-600"
                              : "border-red-300 text-red-600 hover:bg-red-100"
                          }`}
                        >
                          <XCircle className="w-5 h-5" />
                        </button>

                        <input
                          type="text"
                          placeholder="Remarks"
                          value={itemData.remark || ""}
                          onChange={(e) =>
                            updateRemark(cat.title, item, e.target.value)
                          }
                          className="border border-slate-300 rounded-lg px-3 py-1 text-sm text-slate-700 w-52 md:w-64 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-10 bg-slate-50 border border-slate-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-3">
          Summary of Findings
        </h3>
        <pre className="text-sm bg-white p-4 rounded-lg border border-slate-200 overflow-x-auto text-slate-700">
          {JSON.stringify(checklist, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default CoachSupervisionChecklist;

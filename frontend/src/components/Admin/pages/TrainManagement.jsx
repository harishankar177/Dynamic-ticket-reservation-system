import React, { useState, useEffect } from "react";
import axios from "../../../axiosInstance";
import { Plus, Search, Edit2, Trash2, Settings, X } from "lucide-react";

export default function TrainManagement() {
  const [trains, setTrains] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentTrainId, setCurrentTrainId] = useState(null);

  const [newTrain, setNewTrain] = useState({
    name: "",
    number: "",
    from: "",
    to: "",
    departureTime: "",
    arrivalTime: "",
    status: "active",
    isRunning: false,
    routes: [{ stopName: "", arrival: "", departure: "" }],
    coaches: [
      { type: "Sleeper", count: 0, seatsAvailable: 0 },
      { type: "Seater", count: 0, seatsAvailable: 0 },
      { type: "AC", count: 0, seatsAvailable: 0 },
      { type: "Chair Car", count: 0, seatsAvailable: 0 },
      { type: "First Class", count: 0, seatsAvailable: 0 },
      { type: "2AC", count: 0, seatsAvailable: 0 },
      { type: "3AC", count: 0, seatsAvailable: 0 },
    ],
  });

  // Fetch trains
  const fetchTrains = async () => {
    try {
      const res = await axios.get("/trains");
      setTrains(res.data);
    } catch (err) {
      console.error("Failed to fetch trains:", err);
    }
  };

  useEffect(() => {
    fetchTrains();
  }, []);

  // Add or Edit Train
  const handleAddTrain = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`/trains/${currentTrainId}`, newTrain);
      } else {
        await axios.post("/trains", newTrain);
      }
      setNewTrain({
        name: "",
        number: "",
        from: "",
        to: "",
        departureTime: "",
        arrivalTime: "",
        status: "active",
        isRunning: false,
        routes: [{ stopName: "", arrival: "", departure: "" }],
        coaches: [
          { type: "Sleeper", count: 0, seatsAvailable: 0 },
          { type: "Seater", count: 0, seatsAvailable: 0 },
          { type: "AC", count: 0, seatsAvailable: 0 },
          { type: "Chair Car", count: 0, seatsAvailable: 0 },
          { type: "First Class", count: 0, seatsAvailable: 0 },
          { type: "2AC", count: 0, seatsAvailable: 0 },
          { type: "3AC", count: 0, seatsAvailable: 0 },
        ],
      });
      setIsModalOpen(false);
      setEditMode(false);
      fetchTrains();
    } catch (err) {
      console.error("Failed to save train:", err);
    }
  };

  const handleEditTrain = (train) => {
    setNewTrain(train);
    setCurrentTrainId(train._id);
    setEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteTrain = async (id) => {
    try {
      await axios.delete(`/trains/${id}`);
      fetchTrains();
    } catch (err) {
      console.error("Failed to delete train:", err);
    }
  };

  const handleToggleStatus = async (train) => {
    try {
      await axios.put(`/trains/${train._id}`, {
        ...train,
        status: train.status === "active" ? "maintenance" : "active",
      });
      fetchTrains();
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  const handleCoachCountChange = (index, delta) => {
    const updated = [...newTrain.coaches];
    updated[index].count = Math.max(0, updated[index].count + delta);
    setNewTrain({ ...newTrain, coaches: updated });
  };

  const handleRouteChange = (index, field, value) => {
    const updated = [...newTrain.routes];
    updated[index][field] = value;
    setNewTrain({ ...newTrain, routes: updated });
  };

  const addRouteStop = () => {
    setNewTrain({
      ...newTrain,
      routes: [...newTrain.routes, { stopName: "", arrival: "", departure: "" }],
    });
  };

  const removeRouteStop = (index) => {
    const updated = [...newTrain.routes];
    updated.splice(index, 1);
    setNewTrain({ ...newTrain, routes: updated });
  };

  const filteredTrains = trains.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.number.includes(searchTerm) ||
      t.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.to.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
            Manage Trains
          </h2>
          <p className="text-slate-600">
            Add, edit, and manage train operations
          </p>
        </div>
        <button
          onClick={() => {
            setIsModalOpen(true);
            setEditMode(false);
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          <span>Add New Train</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
        <div className="mb-6">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name, number, from, to..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                  Number
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                  Name
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                  From
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                  To
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTrains.map((train) => (
                <tr
                  key={train._id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="py-3 px-4 text-sm font-medium text-slate-800">
                    {train.number}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-700">
                    {train.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-700">
                    {train.from}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-700">
                    {train.to}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        train.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {train.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    <button onClick={() => handleEditTrain(train)} title="Edit">
                      <Edit2 size={16} className="text-slate-600" />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(train)}
                      title="Toggle Status"
                    >
                      <Settings size={16} className="text-slate-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteTrain(train._id)}
                      title="Delete"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-3xl relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-700"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              {editMode ? "Edit Train" : "Add New Train"}
            </h3>
            <form onSubmit={handleAddTrain} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Train Number"
                  value={newTrain.number}
                  onChange={(e) =>
                    setNewTrain({
                      ...newTrain,
                      number: e.target.value.replace(/[^0-9]/g, ""),
                    })
                  }
                  required
                  className="w-full border px-3 py-2 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Train Name"
                  value={newTrain.name}
                  onChange={(e) =>
                    setNewTrain({
                      ...newTrain,
                      name: e.target.value.replace(/[^a-zA-Z\s]/g, ""),
                    })
                  }
                  required
                  className="w-full border px-3 py-2 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="From"
                  value={newTrain.from}
                  onChange={(e) =>
                    setNewTrain({ ...newTrain, from: e.target.value })
                  }
                  required
                  className="w-full border px-3 py-2 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="To"
                  value={newTrain.to}
                  onChange={(e) =>
                    setNewTrain({ ...newTrain, to: e.target.value })
                  }
                  required
                  className="w-full border px-3 py-2 rounded-lg"
                />
                <input
                  type="time"
                  placeholder="Departure Time"
                  value={newTrain.departureTime}
                  onChange={(e) =>
                    setNewTrain({ ...newTrain, departureTime: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded-lg"
                />
                <input
                  type="time"
                  placeholder="Arrival Time"
                  value={newTrain.arrivalTime}
                  onChange={(e) =>
                    setNewTrain({ ...newTrain, arrivalTime: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>

              {/* Running Status */}
              <div className="flex items-center gap-2 mt-2">
                <label className="text-slate-700 font-medium">
                  Train Running:
                </label>
                <input
                  type="checkbox"
                  checked={newTrain.isRunning}
                  onChange={(e) =>
                    setNewTrain({
                      ...newTrain,
                      isRunning: e.target.checked,
                    })
                  }
                />
              </div>

              {/* Routes */}
              <div>
                <h4 className="font-semibold text-slate-700 mt-3 mb-2">
                  Routes & Stops
                </h4>
                {newTrain.routes.map((route, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-2 items-center"
                  >
                    <input
                      type="text"
                      placeholder="Stop Name"
                      value={route.stopName}
                      onChange={(e) =>
                        handleRouteChange(index, "stopName", e.target.value)
                      }
                      className="border rounded-lg px-2 py-1"
                    />
                    <input
                      type="time"
                      placeholder="Arrival"
                      value={route.arrival}
                      onChange={(e) =>
                        handleRouteChange(index, "arrival", e.target.value)
                      }
                      className="border rounded-lg px-2 py-1"
                    />
                    <input
                      type="time"
                      placeholder="Departure"
                      value={route.departure}
                      onChange={(e) =>
                        handleRouteChange(index, "departure", e.target.value)
                      }
                      className="border rounded-lg px-2 py-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeRouteStop(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addRouteStop}
                  className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  + Add Stop
                </button>
              </div>

              {/* Coaches Section */}
              <div>
                <h4 className="font-semibold text-slate-700 mt-3 mb-2">
                  Coaches
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {newTrain.coaches.map((coach, index) => (
                    <div
                      key={coach.type}
                      className="flex flex-col border rounded-lg p-3 bg-slate-50 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-slate-800">
                          {coach.type}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCoachCountChange(index, -1)}
                            className="px-2 py-1 bg-slate-200 hover:bg-slate-300 rounded text-slate-700 font-bold"
                          >
                            –
                          </button>
                          <span className="w-6 text-center font-semibold">
                            {coach.count}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCoachCountChange(index, 1)}
                            className="px-2 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Seat Availability */}
                      <div className="flex items-center justify-between mt-1">
                        <label className="text-sm text-slate-600">
                          Seats Available:
                        </label>
                        <input
                          type="number"
                          value={coach.seatsAvailable || 0}
                          onChange={(e) => {
                            const updated = [...newTrain.coaches];
                            updated[index].seatsAvailable = Math.max(
                              0,
                              parseInt(e.target.value || 0)
                            );
                            setNewTrain({ ...newTrain, coaches: updated });
                          }}
                          className="border border-slate-300 rounded-lg px-2 py-1 w-20 text-center focus:ring-2 focus:ring-emerald-500 outline-none"
                          min="0"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
                >
                  {editMode ? "Save Changes" : "Add Train"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

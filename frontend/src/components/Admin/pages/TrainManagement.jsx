import React, { useState, useEffect } from "react";
import axiosInstance from "../../../axiosInstance";
import { Pencil, Trash2, PlusCircle, Train, X } from "lucide-react";

const TrainManagement = () => {
  const [trains, setTrains] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTrain, setEditingTrain] = useState(null);

  const emptyTrain = {
    name: "",
    number: "",
    from: "",
    to: "",
    status: "active",
    isRunning: false,
    departureTime: "",
    arrivalTime: "",
    routes: [{ stopName: "", arrival: "", departure: "", haltDuration: "" }],
    coaches: [{ type: "", count: 0, seatsAvailable: 0, price: 0 }],
  };

  const [newTrain, setNewTrain] = useState(emptyTrain);

  // ✅ Fetch Trains
  useEffect(() => {
    fetchTrains();
  }, []);

  const fetchTrains = async () => {
    try {
      const res = await axiosInstance.get("/trains");
      setTrains(res.data);
    } catch (err) {
      console.error("Error fetching trains:", err);
    }
  };

  // ✅ Handle Input
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewTrain({
      ...newTrain,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ✅ Handle Route Change
  const handleRouteChange = (index, e) => {
    const { name, value } = e.target;
    const updatedRoutes = [...newTrain.routes];
    updatedRoutes[index][name] = value;
    setNewTrain({ ...newTrain, routes: updatedRoutes });
  };

  // ✅ Handle Coach Change
  const handleCoachChange = (index, e) => {
    const { name, value } = e.target;
    const updatedCoaches = [...newTrain.coaches];
    updatedCoaches[index][name] = value;
    setNewTrain({ ...newTrain, coaches: updatedCoaches });
  };

  // ✅ Add Route / Coach
  const addRoute = () => {
    setNewTrain({
      ...newTrain,
      routes: [
        ...newTrain.routes,
        { stopName: "", arrival: "", departure: "", haltDuration: "" },
      ],
    });
  };

  const addCoach = () => {
    setNewTrain({
      ...newTrain,
      coaches: [
        ...newTrain.coaches,
        { type: "", count: 0, seatsAvailable: 0, price: 0 },
      ],
    });
  };

  // ✅ Remove Route / Coach
  const removeRoute = (index) => {
    const updatedRoutes = newTrain.routes.filter((_, i) => i !== index);
    setNewTrain({ ...newTrain, routes: updatedRoutes });
  };

  const removeCoach = (index) => {
    const updatedCoaches = newTrain.coaches.filter((_, i) => i !== index);
    setNewTrain({ ...newTrain, coaches: updatedCoaches });
  };

  // ✅ Clean Data Before Save
  const cleanTrainData = (data) => ({
    ...data,
    routes: data.routes.filter((r) => r.stopName.trim() !== ""),
    coaches: data.coaches
      .filter((c) => c.type.trim() !== "")
      .map((c) => ({
        ...c,
        count: Number(c.count) || 0,
        seatsAvailable: Number(c.seatsAvailable) || 0,
        price: Number(c.price) || 0,
      })),
  });

  // ✅ Save / Update Train
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cleaned = cleanTrainData(newTrain);

      if (editingTrain) {
        await axiosInstance.put(`/trains/${editingTrain._id}`, cleaned);
      } else {
        await axiosInstance.post("/trains", cleaned);
      }

      fetchTrains();
      handleCloseModal();
    } catch (err) {
      console.error("Error saving train:", err);
    }
  };

  // ✅ Delete Train
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this train?")) return;
    try {
      await axiosInstance.delete(`/trains/${id}`);
      fetchTrains();
    } catch (err) {
      console.error("Error deleting train:", err);
    }
  };

  // ✅ Edit
  const handleEdit = (train) => {
    setEditingTrain(train);
    setNewTrain(train);
    setShowModal(true);
  };

  // ✅ Close Modal
  const handleCloseModal = () => {
    setEditingTrain(null);
    setShowModal(false);
    setNewTrain(emptyTrain);
  };

  const filteredTrains = trains.filter(
    (t) =>
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.number?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-blue-700">
          <Train size={26} /> Train Management
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <PlusCircle size={18} /> Add Train
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by train name or number..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
      />

      <div className="grid md:grid-cols-2 gap-4">
        {filteredTrains.map((train) => (
          <div
            key={train._id}
            className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                {train.name} ({train.number})
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(train)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(train._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <p className="text-gray-600 mt-2">
              From: {train.from} → To: {train.to}
            </p>
            <p className="text-sm text-gray-500">
              Departure: {train.departureTime || "N/A"} | Arrival:{" "}
              {train.arrivalTime || "N/A"}
            </p>
            <p
              className={`mt-2 text-sm font-medium ${
                train.isRunning ? "text-green-600" : "text-red-600"
              }`}
            >
              {train.isRunning ? "🚆 Currently Running" : "❌ Not Running"}
            </p>
          </div>
        ))}
      </div>

      {/* 🔹 Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-3xl shadow-lg overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-blue-700">
                {editingTrain ? "Edit Train" : "Add New Train"}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-600">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Train Name"
                  value={newTrain.name}
                  onChange={handleInputChange}
                  required
                  className="border p-2 rounded-md w-full"
                />
                <input
                  type="text"
                  name="number"
                  placeholder="Train Number"
                  value={newTrain.number}
                  onChange={handleInputChange}
                  required
                  className="border p-2 rounded-md w-full"
                />
                <input
                  type="text"
                  name="from"
                  placeholder="From"
                  value={newTrain.from}
                  onChange={handleInputChange}
                  required
                  className="border p-2 rounded-md w-full"
                />
                <input
                  type="text"
                  name="to"
                  placeholder="To"
                  value={newTrain.to}
                  onChange={handleInputChange}
                  required
                  className="border p-2 rounded-md w-full"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="font-medium text-gray-700">
                  <input
                    type="checkbox"
                    name="isRunning"
                    checked={newTrain.isRunning}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Train is Running
                </label>
              </div>

              {/* ✅ Routes */}
              <div>
                <h4 className="font-semibold mb-2 text-gray-700">Route Stops</h4>
                {newTrain.routes.map((route, index) => (
                  <div
                    key={index}
                    className="grid md:grid-cols-5 gap-3 mb-2 border p-2 rounded-md bg-gray-50 items-center"
                  >
                    <input
                      type="text"
                      name="stopName"
                      placeholder="Stop Name"
                      value={route.stopName}
                      onChange={(e) => handleRouteChange(index, e)}
                      className="border p-2 rounded-md"
                    />
                    <input
                      type="text"
                      name="arrival"
                      placeholder="Arrival Time"
                      value={route.arrival}
                      onChange={(e) => handleRouteChange(index, e)}
                      className="border p-2 rounded-md"
                    />
                    <input
                      type="text"
                      name="departure"
                      placeholder="Departure Time"
                      value={route.departure}
                      onChange={(e) => handleRouteChange(index, e)}
                      className="border p-2 rounded-md"
                    />
                    <input
                      type="text"
                      name="haltDuration"
                      placeholder="Halt Duration (mins)"
                      value={route.haltDuration}
                      onChange={(e) => handleRouteChange(index, e)}
                      className="border p-2 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeRoute(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addRoute}
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  + Add Route Stop
                </button>
              </div>

              {/* ✅ Coaches */}
              <div>
                <h4 className="font-semibold mb-2 text-gray-700">Coaches</h4>
                {newTrain.coaches.map((coach, index) => (
                  <div
                    key={index}
                    className="grid md:grid-cols-5 gap-3 mb-2 border p-2 rounded-md bg-gray-50 items-center"
                  >
                    <input
                      type="text"
                      name="type"
                      placeholder="Coach Type (e.g., Sleeper)"
                      value={coach.type}
                      onChange={(e) => handleCoachChange(index, e)}
                      className="border p-2 rounded-md"
                    />
                    <input
                      type="number"
                      name="count"
                      placeholder="Count"
                      value={coach.count}
                      onChange={(e) => handleCoachChange(index, e)}
                      className="border p-2 rounded-md"
                    />
                    <input
                      type="number"
                      name="seatsAvailable"
                      placeholder="Seats Available"
                      value={coach.seatsAvailable}
                      onChange={(e) => handleCoachChange(index, e)}
                      className="border p-2 rounded-md"
                    />
                    <input
                      type="number"
                      name="price"
                      placeholder="Price (₹)"
                      value={coach.price}
                      onChange={(e) => handleCoachChange(index, e)}
                      className="border p-2 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeCoach(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addCoach}
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  + Add Coach
                </button>
              </div>

              {/* ✅ Footer */}
              <div className="flex justify-end mt-6 gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                >
                  {editingTrain ? "Update Train" : "Add Train"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainManagement;

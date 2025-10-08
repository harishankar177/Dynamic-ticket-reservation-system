import React, { useState } from 'react';
import { Plus, Search, CreditCard as Edit2, Trash2, Settings, X } from 'lucide-react';

export default function TrainManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [trains, setTrains] = useState([
    { id: 1, number: '12345', name: 'Rajdhani Express', seats: 1200, farePerKm: 1.5, status: 'active', route: 'Mumbai - Delhi' },
    { id: 2, number: '67890', name: 'Shatabdi Express', seats: 800, farePerKm: 2.0, status: 'active', route: 'Chennai - Bangalore' },
    { id: 3, number: '45678', name: 'Duronto Express', seats: 1000, farePerKm: 1.8, status: 'active', route: 'Kolkata - Patna' },
    { id: 4, number: '23456', name: 'Garib Rath', seats: 1500, farePerKm: 0.8, status: 'maintenance', route: 'Ahmedabad - Jaipur' },
    { id: 5, number: '78901', name: 'Jan Shatabdi', seats: 900, farePerKm: 1.2, status: 'active', route: 'Pune - Hyderabad' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentTrainId, setCurrentTrainId] = useState(null);

  const [newTrain, setNewTrain] = useState({
    number: '',
    name: '',
    route: '',
    seats: '',
    farePerKm: '',
    status: 'active',
  });

  const filteredTrains = trains.filter(train =>
    train.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    train.number.includes(searchTerm) ||
    train.route.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTrain = (e) => {
    e.preventDefault();
    if (editMode) {
      setTrains(trains.map(t => t.id === currentTrainId ? { ...t, ...newTrain } : t));
    } else {
      const trainToAdd = {
        id: trains.length + 1,
        ...newTrain,
        seats: parseInt(newTrain.seats, 10),
        farePerKm: parseFloat(newTrain.farePerKm),
      };
      setTrains([...trains, trainToAdd]);
    }

    setNewTrain({ number: '', name: '', route: '', seats: '', farePerKm: '', status: 'active' });
    setIsModalOpen(false);
    setEditMode(false);
  };

  const handleEditTrain = (train) => {
    setNewTrain(train);
    setCurrentTrainId(train.id);
    setEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteTrain = (id) => {
    setTrains(trains.filter(train => train.id !== id));
  };

  const handleToggleStatus = (id) => {
    setTrains(trains.map(train =>
      train.id === id
        ? { ...train, status: train.status === 'active' ? 'maintenance' : 'active' }
        : train
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Manage Trains</h2>
          <p className="text-slate-600">Add, edit, and manage train operations</p>
        </div>
        <button
          onClick={() => { setIsModalOpen(true); setEditMode(false); }}
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search trains by number, name, or route..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Train Number</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Route</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Seats</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Fare/km</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrains.map((train) => (
                <tr key={train.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-slate-800">{train.number}</td>
                  <td className="py-3 px-4 text-sm text-slate-700">{train.name}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{train.route}</td>
                  <td className="py-3 px-4 text-sm text-slate-700">{train.seats}</td>
                  <td className="py-3 px-4 text-sm text-slate-700">₹{train.farePerKm}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      train.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {train.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEditTrain(train)} className="p-2 hover:bg-slate-200 rounded-lg transition-colors" title="Edit">
                        <Edit2 size={16} className="text-slate-600" />
                      </button>
                      <button onClick={() => handleToggleStatus(train.id)} className="p-2 hover:bg-slate-200 rounded-lg transition-colors" title="Toggle Status">
                        <Settings size={16} className="text-slate-600" />
                      </button>
                      <button onClick={() => handleDeleteTrain(train.id)} className="p-2 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile List */}
        <div className="md:hidden space-y-4">
          {filteredTrains.map((train) => (
            <div key={train.id} className="bg-slate-50 rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800">{train.name}</h3>
                  <p className="text-sm text-slate-600">#{train.number}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  train.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {train.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-slate-500">Route:</span><p className="text-slate-800">{train.route}</p></div>
                <div><span className="text-slate-500">Seats:</span><p className="text-slate-800">{train.seats}</p></div>
                <div><span className="text-slate-500">Fare/km:</span><p className="text-slate-800">₹{train.farePerKm}</p></div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                <button onClick={() => handleEditTrain(train)} className="flex-1 py-2 px-3 bg-white hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Edit2 size={16} /><span className="text-sm">Edit</span>
                </button>
                <button onClick={() => handleToggleStatus(train.id)} className="flex-1 py-2 px-3 bg-white hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Settings size={16} /><span className="text-sm">Toggle</span>
                </button>
                <button onClick={() => handleDeleteTrain(train.id)} className="py-2 px-3 bg-white hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={16} className="text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Train Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-700"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-slate-800 mb-4">{editMode ? 'Edit Train' : 'Add New Train'}</h3>
            <form onSubmit={handleAddTrain} className="space-y-4">
              <input type="text" placeholder="Train Number" value={newTrain.number} onChange={(e) => setNewTrain({ ...newTrain, number: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500" required />
              <input type="text" placeholder="Train Name" value={newTrain.name} onChange={(e) => setNewTrain({ ...newTrain, name: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500" required />
              <input type="text" placeholder="Route (e.g., Mumbai - Delhi)" value={newTrain.route} onChange={(e) => setNewTrain({ ...newTrain, route: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500" required />
              <input type="number" placeholder="Seats" value={newTrain.seats} onChange={(e) => setNewTrain({ ...newTrain, seats: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500" required />
              <input type="number" step="0.1" placeholder="Fare per km" value={newTrain.farePerKm} onChange={(e) => setNewTrain({ ...newTrain, farePerKm: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500" required />
              <select value={newTrain.status} onChange={(e) => setNewTrain({ ...newTrain, status: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500">
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
              </select>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">
                  {editMode ? 'Save Changes' : 'Add Train'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { Plus, Search, CreditCard as Edit2, Trash2, Settings } from 'lucide-react';

export default function TrainManagement() {
  const [searchTerm, setSearchTerm] = useState('');

  const trains = [
    { id: 1, number: '12345', name: 'Rajdhani Express', seats: 1200, farePerKm: 1.5, status: 'active', route: 'Mumbai - Delhi' },
    { id: 2, number: '67890', name: 'Shatabdi Express', seats: 800, farePerKm: 2.0, status: 'active', route: 'Chennai - Bangalore' },
    { id: 3, number: '45678', name: 'Duronto Express', seats: 1000, farePerKm: 1.8, status: 'active', route: 'Kolkata - Patna' },
    { id: 4, number: '23456', name: 'Garib Rath', seats: 1500, farePerKm: 0.8, status: 'maintenance', route: 'Ahmedabad - Jaipur' },
    { id: 5, number: '78901', name: 'Jan Shatabdi', seats: 900, farePerKm: 1.2, status: 'active', route: 'Pune - Hyderabad' },
  ];

  const filteredTrains = trains.filter(train =>
    train.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    train.number.includes(searchTerm) ||
    train.route.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Manage Trains</h2>
          <p className="text-slate-600">Add, edit, and manage train operations</p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors justify-center sm:justify-start">
          <Plus size={20} />
          <span>Add New Train</span>
        </button>
      </div>

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
                      <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors" title="Edit">
                        <Edit2 size={16} className="text-slate-600" />
                      </button>
                      <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors" title="Settings">
                        <Settings size={16} className="text-slate-600" />
                      </button>
                      <button className="p-2 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile view */}
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
                <div>
                  <span className="text-slate-500">Route:</span>
                  <p className="text-slate-800">{train.route}</p>
                </div>
                <div>
                  <span className="text-slate-500">Seats:</span>
                  <p className="text-slate-800">{train.seats}</p>
                </div>
                <div>
                  <span className="text-slate-500">Fare/km:</span>
                  <p className="text-slate-800">₹{train.farePerKm}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                <button className="flex-1 py-2 px-3 bg-white hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Edit2 size={16} />
                  <span className="text-sm">Edit</span>
                </button>
                <button className="flex-1 py-2 px-3 bg-white hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Settings size={16} />
                  <span className="text-sm">Manage</span>
                </button>
                <button className="py-2 px-3 bg-white hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={16} className="text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Plus, Search, CreditCard as Edit2, Trash2, UserCheck, UserX } from 'lucide-react';

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all'); // Removed TypeScript type

  const users = [
    { id: 1, name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '+91 98765 43210', role: 'passenger', isActive: true, joinDate: '2024-01-15' },
    { id: 2, name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 98765 43211', role: 'passenger', isActive: true, joinDate: '2024-02-20' },
    { id: 3, name: 'Amit Patel', email: 'amit@example.com', phone: '+91 98765 43212', role: 'tte', isActive: true, joinDate: '2023-11-10' },
    { id: 4, name: 'Sneha Gupta', email: 'sneha@example.com', phone: '+91 98765 43213', role: 'tte', isActive: true, joinDate: '2023-12-05' },
    { id: 5, name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91 98765 43214', role: 'passenger', isActive: false, joinDate: '2024-03-12' },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.phone.includes(searchTerm);
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">User Management</h2>
          <p className="text-slate-600">Manage passengers, TTEs, and administrators</p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors justify-center sm:justify-start">
          <Plus size={20} />
          <span>Add New User</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search users by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Roles</option>
            <option value="passenger">Passengers</option>
            <option value="tte">TTEs</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Phone</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Role</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Join Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-slate-800">{user.name}</td>
                  <td className="py-3 px-4 text-sm text-slate-700">{user.email}</td>
                  <td className="py-3 px-4 text-sm text-slate-700">{user.phone}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-violet-100 text-violet-700' :
                      user.role === 'tte' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-700">{user.joinDate}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors" title="Edit">
                        <Edit2 size={16} className="text-slate-600" />
                      </button>
                      <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors" title={user.isActive ? 'Deactivate' : 'Activate'}>
                        {user.isActive ? <UserX size={16} className="text-amber-600" /> : <UserCheck size={16} className="text-green-600" />}
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

        {/* Mobile List */}
        <div className="md:hidden space-y-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-slate-50 rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800">{user.name}</h3>
                  <p className="text-sm text-slate-600">{user.email}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-slate-500">Phone:</span>
                  <p className="text-slate-800">{user.phone}</p>
                </div>
                <div>
                  <span className="text-slate-500">Role:</span>
                  <p className="text-slate-800">{user.role.toUpperCase()}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500">Joined:</span>
                  <p className="text-slate-800">{user.joinDate}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

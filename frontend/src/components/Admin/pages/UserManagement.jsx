import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, CreditCard as Edit2, Trash2, UserCheck, UserX, X } from 'lucide-react';

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'tte',
    registerNumber: '',
    isActive: true,
    joinDate: new Date().toISOString().split('T')[0],
  });

  const API_BASE = 'http://localhost:3000/api/users'; // replace with your backend URL

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_BASE);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm);
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleAddOrEditUser = async e => {
    e.preventDefault();

    // Validation
    if (!validateEmail(newUser.email)) return alert('Please enter a valid email.');
    if (newUser.phone.length !== 10) return alert('Phone must be 10 digits.');
    if (newUser.role === 'passenger') return alert('Admins cannot add passengers.');
    if (newUser.role === 'tte' && !newUser.registerNumber.trim())
      return alert('Please enter TTE Register Number.');

    try {
      if (editUserId) {
        // Edit user
        await axios.put(`${API_BASE}/${editUserId}`, newUser);
      } else {
        // Add user
        await axios.post(API_BASE, newUser);
      }
      fetchUsers();
      resetForm();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Something went wrong.');
    }
  };

  const handleEditClick = user => {
    setEditUserId(user._id);
    setNewUser({ ...user, joinDate: user.joinDate?.split('T')[0] });
    setIsModalOpen(true);
  };

  const handleToggleStatus = async id => {
    try {
      const user = users.find(u => u._id === id);
      await axios.patch(`${API_BASE}/${id}/status`, { isActive: !user.isActive });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setNewUser({
      name: '',
      email: '',
      phone: '',
      role: 'tte',
      registerNumber: '',
      isActive: true,
      joinDate: new Date().toISOString().split('T')[0],
    });
    setEditUserId(null);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">User Management</h2>
          <p className="text-slate-600">Manage TTEs and administrators</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors justify-center sm:justify-start"
        >
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
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <select
            value={filterRole}
            onChange={e => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Roles</option>
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
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Register No.</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Join Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-slate-800">{user.name}</td>
                  <td className="py-3 px-4 text-sm text-slate-700">{user.email}</td>
                  <td className="py-3 px-4 text-sm text-slate-700">{user.phone}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin'
                          ? 'bg-violet-100 text-violet-700'
                          : user.role === 'tte'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-700">
                    {user.role === 'tte' ? user.registerNumber || '-' : '-'}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-700">{user.joinDate?.split('T')[0]}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} className="text-slate-600" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user._id)}
                        className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                        title={user.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {user.isActive ? (
                          <UserX size={16} className="text-amber-600" />
                        ) : (
                          <UserCheck size={16} className="text-green-600" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg relative">
            <button
              onClick={resetForm}
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-700"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              {editUserId ? 'Edit User' : 'Add New User'}
            </h3>
            <form onSubmit={handleAddOrEditUser} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={newUser.name}
                onChange={e =>
                  setNewUser({ ...newUser, name: e.target.value.replace(/[^a-zA-Z\s]/g, '') })
                }
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                required
              />
              <input
                type="text"
                placeholder="Phone"
                value={newUser.phone}
                maxLength={10}
                onChange={e => setNewUser({ ...newUser, phone: e.target.value.replace(/[^0-9]/g, '') })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                required
              />
              <select
                value={newUser.role}
                onChange={e => setNewUser({ ...newUser, role: e.target.value, registerNumber: '' })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="tte">TTE</option>
                <option value="admin">Admin</option>
              </select>

              {newUser.role === 'tte' && (
                <input
                  type="text"
                  placeholder="TTE Register Number"
                  value={newUser.registerNumber}
                  onChange={e => setNewUser({ ...newUser, registerNumber: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                  required
                />
              )}

              <select
                value={newUser.isActive ? 'active' : 'inactive'}
                onChange={e => setNewUser({ ...newUser, isActive: e.target.value === 'active' })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <input
                type="date"
                value={newUser.joinDate}
                onChange={e => setNewUser({ ...newUser, joinDate: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  {editUserId ? 'Save Changes' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

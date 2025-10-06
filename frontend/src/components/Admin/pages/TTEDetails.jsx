import React from 'react';
import { ArrowLeft, Users, CheckCircle, AlertTriangle, DollarSign, Brain as Train, Calendar, Award } from 'lucide-react';

export default function TTEDetails({ onBack }) {
  const tteStats = {
    totalTTEs: 234,
    onDutyToday: 156,
    completedShifts: 3421,
    finesCollected: 2850000,
  };

  const tteList = [
    {
      id: 1,
      name: 'Amit Patel',
      employeeId: 'TTE001',
      phone: '+91 98765 43212',
      email: 'amit@railbook.com',
      assignedTrain: 'Rajdhani Express #12345',
      status: 'on-duty',
      shiftsCompleted: 145,
      finesIssued: 23,
      totalFines: 45600,
      rating: 4.8,
      joinDate: '2023-11-10',
    },
    {
      id: 2,
      name: 'Sneha Gupta',
      employeeId: 'TTE002',
      phone: '+91 98765 43213',
      email: 'sneha@railbook.com',
      assignedTrain: 'Shatabdi Express #67890',
      status: 'on-duty',
      shiftsCompleted: 132,
      finesIssued: 18,
      totalFines: 38400,
      rating: 4.9,
      joinDate: '2023-12-05',
    },
    {
      id: 3,
      name: 'Rahul Verma',
      employeeId: 'TTE003',
      phone: '+91 98765 43217',
      email: 'rahul@railbook.com',
      assignedTrain: 'Duronto Express #45678',
      status: 'off-duty',
      shiftsCompleted: 167,
      finesIssued: 31,
      totalFines: 62100,
      rating: 4.7,
      joinDate: '2023-10-15',
    },
    {
      id: 4,
      name: 'Pooja Singh',
      employeeId: 'TTE004',
      phone: '+91 98765 43218',
      email: 'pooja@railbook.com',
      assignedTrain: 'Garib Rath #23456',
      status: 'on-duty',
      shiftsCompleted: 98,
      finesIssued: 15,
      totalFines: 28900,
      rating: 4.6,
      joinDate: '2024-01-20',
    },
    {
      id: 5,
      name: 'Karan Sharma',
      employeeId: 'TTE005',
      phone: '+91 98765 43219',
      email: 'karan@railbook.com',
      assignedTrain: 'Jan Shatabdi #78901',
      status: 'on-leave',
      shiftsCompleted: 156,
      finesIssued: 27,
      totalFines: 51200,
      rating: 4.8,
      joinDate: '2023-11-28',
    },
  ];

  const topPerformers = [
    { name: 'Amit Patel', shifts: 145, rating: 4.8, fines: 45600 },
    { name: 'Sneha Gupta', shifts: 132, rating: 4.9, fines: 38400 },
    { name: 'Rahul Verma', shifts: 167, rating: 4.7, fines: 62100 },
    { name: 'Karan Sharma', shifts: 156, rating: 4.8, fines: 51200 },
  ];

  const recentIncidents = [
    { tte: 'Amit Patel', type: 'Ticketless Passenger', train: '#12345', time: '2 hours ago', status: 'resolved' },
    { tte: 'Sneha Gupta', type: 'Complaint', train: '#67890', time: '4 hours ago', status: 'investigating' },
    { tte: 'Rahul Verma', type: 'Emergency', train: '#45678', time: '6 hours ago', status: 'resolved' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'on-duty':
        return 'bg-green-100 text-green-700';
      case 'off-duty':
        return 'bg-slate-100 text-slate-700';
      case 'on-leave':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
          <ArrowLeft size={24} className="text-slate-700" />
        </button>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800">TTE Management</h2>
          <p className="text-slate-600">Traveling Ticket Examiner details and performance metrics</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Users size={32} />
            <div className="text-right">
              <p className="text-emerald-100 text-sm">Total TTEs</p>
              <h3 className="text-3xl font-bold">{tteStats.totalTTEs}</h3>
            </div>
          </div>
          <p className="text-sm text-emerald-100">Active employees</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle size={32} />
            <div className="text-right">
              <p className="text-blue-100 text-sm">On Duty Today</p>
              <h3 className="text-3xl font-bold">{tteStats.onDutyToday}</h3>
            </div>
          </div>
          <p className="text-sm text-blue-100">Currently working</p>
        </div>

        <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Calendar size={32} />
            <div className="text-right">
              <p className="text-violet-100 text-sm">Completed Shifts</p>
              <h3 className="text-3xl font-bold">{tteStats.completedShifts.toLocaleString()}</h3>
            </div>
          </div>
          <p className="text-sm text-violet-100">Total shifts this month</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <DollarSign size={32} />
            <div className="text-right">
              <p className="text-amber-100 text-sm">Fines Collected</p>
              <h3 className="text-3xl font-bold">₹{(tteStats.finesCollected / 100000).toFixed(1)}L</h3>
            </div>
          </div>
          <p className="text-sm text-amber-100">Total fines issued</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* TTE Staff Table */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">TTE Staff Details</h3>
            <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">View All</button>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">TTE Details</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Assigned Train</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Shifts</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Fines</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Rating</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {tteList.map((tte) => (
                  <tr key={tte.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{tte.name}</p>
                        <p className="text-xs text-slate-500">{tte.employeeId}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Train size={16} className="text-slate-400" />
                        <span className="text-sm text-slate-700">{tte.assignedTrain}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-slate-800">{tte.shiftsCompleted}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm font-medium text-slate-800">₹{tte.totalFines.toLocaleString()}</p>
                        <p className="text-xs text-slate-500">{tte.finesIssued} issued</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Award size={16} className="text-amber-500" />
                        <span className="text-sm font-medium text-slate-800">{tte.rating}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(tte.status)}`}>
                        {tte.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile List */}
          <div className="md:hidden space-y-4">
            {tteList.map((tte) => (
              <div key={tte.id} className="bg-slate-50 rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-800">{tte.name}</h4>
                    <p className="text-xs text-slate-500">{tte.employeeId}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(tte.status)}`}>
                    {tte.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Train size={16} className="text-slate-400" />
                  <span className="text-slate-700">{tte.assignedTrain}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-sm">
                  <div>
                    <span className="text-slate-500 text-xs">Shifts</span>
                    <p className="font-semibold text-slate-800">{tte.shiftsCompleted}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs">Fines</span>
                    <p className="font-semibold text-slate-800">₹{tte.totalFines.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs">Rating</span>
                    <div className="flex items-center gap-1">
                      <Award size={14} className="text-amber-500" />
                      <p className="font-semibold text-slate-800">{tte.rating}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side Panels */}
        <div className="space-y-6">
          {/* Top Performers */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Top Performers</h3>
            <div className="space-y-3">
              {topPerformers.map((performer, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{performer.name}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <span>{performer.shifts} shifts</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Award size={12} className="text-amber-500" />
                        <span>{performer.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Incidents */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Incidents</h3>
            <div className="space-y-3">
              {recentIncidents.map((incident, index) => (
                <div key={index} className="p-3 rounded-lg bg-slate-50">
                  <div className="flex items-start gap-2 mb-2">
                    <AlertTriangle
                      size={16}
                      className={`mt-0.5 ${incident.status === 'resolved' ? 'text-green-600' : 'text-amber-600'}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{incident.type}</p>
                      <p className="text-xs text-slate-500">by {incident.tte}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Train {incident.train}</span>
                    <span
                      className={`px-2 py-1 rounded-full font-medium ${
                        incident.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {incident.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { useTTE } from '../context/TTEContext';
import { Brain as Train, ClipboardCheck, IndianRupee, AlertTriangle, Clock, Calendar, CheckCircle, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { currentDuty, ticketChecks, fines, incidents } = useTTE();

  const stats = [
    {
      label: 'Tickets Checked',
      value: ticketChecks.length,
      icon: ClipboardCheck,
      color: 'bg-blue-500',
      change: '+12 today',
    },
    {
      label: 'Fines Collected',
      value: `₹${fines.reduce((sum, f) => sum + (f.paymentStatus === 'collected' ? f.amount : 0), 0)}`,
      icon: IndianRupee,
      color: 'bg-green-500',
      change: `${fines.filter(f => f.paymentStatus === 'collected').length} collected`,
    },
    {
      label: 'Active Incidents',
      value: incidents.filter((i) => !i.resolved).length,
      icon: AlertTriangle,
      color: 'bg-orange-500',
      change: incidents.length > 0 ? 'Requires attention' : 'All clear',
    },
    {
      label: 'Duty Status',
      value: currentDuty?.status === 'active' ? 'Active' : 'Inactive',
      icon: CheckCircle,
      color: currentDuty?.status === 'active' ? 'bg-emerald-500' : 'bg-gray-500',
      change: currentDuty?.status === 'active' ? 'On duty' : 'Off duty',
    },
  ];

  const recentTicketChecks = ticketChecks.slice(-5).reverse();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">TTE Dashboard</h1>
        <p className="text-slate-600">Welcome back! Here's your daily overview</p>
      </div>

      {currentDuty && (
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Train className="w-6 h-6" />
                <span className="text-sm font-medium opacity-90">Current Assignment</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {currentDuty.train?.trainName || 'Train'}
              </h2>
              <p className="text-orange-100 mb-4">
                Train #{currentDuty.train?.trainNumber} • {currentDuty.train?.route}
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{new Date(currentDuty.dutyDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Train className="w-4 h-4" />
                  <span className="text-sm">Coaches: {currentDuty.coachNumbers.join(', ')}</span>
                </div>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-semibold uppercase text-sm">
                  {currentDuty.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-slate-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-4 h-4 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</h3>
              <p className="text-sm text-slate-600 mb-2">{stat.label}</p>
              <p className="text-xs text-slate-500">{stat.change}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            Recent Ticket Checks
          </h3>
          {recentTicketChecks.length > 0 ? (
            <div className="space-y-3">
              {recentTicketChecks.map((check) => (
                <div
                  key={check.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-slate-800">{check.passengerName}</p>
                    <p className="text-sm text-slate-600">
                      Coach {check.coachNumber}, Seat {check.seatNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        check.status === 'valid'
                          ? 'bg-green-100 text-green-700'
                          : check.status === 'invalid'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {check.status}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">{check.ticketType}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">No ticket checks yet</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Daily Routine Checklist
          </h3>
          <div className="space-y-3">
            {[
              { task: 'Pre-departure coach inspection', status: 'pending' },
              { task: 'Verify all tickets before departure', status: 'pending' },
              { task: 'Check coach cleanliness', status: 'pending' },
              { task: 'Review seat availability', status: 'pending' },
              { task: 'Submit end-of-journey report', status: 'pending' },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
              >
                <input
                  type="checkbox"
                  className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                />
                <span className="text-slate-700">{item.task}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

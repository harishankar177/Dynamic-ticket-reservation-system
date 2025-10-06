import React from 'react';
import {
  Users,
  Brain as Train,
  Ticket,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Activity,
  Calendar
} from 'lucide-react';
import StatCard from './StatCard';

const Dashboard = ({ onNavigateToPassengers, onNavigateToTTEs }) => {
  const stats = [
    {
      title: 'Total Passengers',
      value: '12,458',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'blue',
      onClick: onNavigateToPassengers,
    },
    {
      title: 'Total TTEs',
      value: '234',
      change: '+3.2%',
      trend: 'up',
      icon: Users,
      color: 'emerald',
      onClick: onNavigateToTTEs,
    },
    {
      title: 'Active Trains',
      value: '156',
      change: '-2',
      trend: 'down',
      icon: Train,
      color: 'amber',
    },
    {
      title: 'Total Bookings',
      value: '8,732',
      change: '+18.3%',
      trend: 'up',
      icon: Ticket,
      color: 'violet',
    },
    {
      title: 'Total Revenue',
      value: '₹45.2L',
      change: '+24.8%',
      trend: 'up',
      icon: DollarSign,
      color: 'green',
    },
    {
      title: 'Pending Incidents',
      value: '23',
      change: '-5',
      trend: 'down',
      icon: AlertCircle,
      color: 'red',
    },
    {
      title: 'Today Bookings',
      value: '487',
      change: '+32.1%',
      trend: 'up',
      icon: Calendar,
      color: 'cyan',
    },
    {
      title: 'System Uptime',
      value: '99.9%',
      change: 'Stable',
      trend: 'neutral',
      icon: Activity,
      color: 'teal',
    },
  ];

  const recentActivity = [
    { action: 'New booking', details: 'Train #12345 - Mumbai to Delhi', time: '2 min ago', type: 'success' },
    { action: 'Incident reported', details: 'Complaint on Train #67890', time: '15 min ago', type: 'warning' },
    { action: 'TTE assigned', details: 'John Doe assigned to Train #45678', time: '1 hour ago', type: 'info' },
    { action: 'Payment received', details: '₹2,450 from booking #BK12345', time: '2 hours ago', type: 'success' },
    { action: 'Train maintenance', details: 'Train #23456 scheduled for service', time: '3 hours ago', type: 'warning' },
  ];

  const upcomingTrains = [
    { number: '12345', name: 'Rajdhani Express', route: 'Mumbai - Delhi', departure: '08:30 AM', status: 'On Time' },
    { number: '67890', name: 'Shatabdi Express', route: 'Chennai - Bangalore', departure: '09:15 AM', status: 'Delayed' },
    { number: '45678', name: 'Duronto Express', route: 'Kolkata - Patna', departure: '10:00 AM', status: 'On Time' },
    { number: '23456', name: 'Garib Rath', route: 'Ahmedabad - Jaipur', departure: '11:30 AM', status: 'On Time' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Dashboard Overview</h2>
        <p className="text-slate-600">Real-time insights and system metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Activity Section */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Recent Activity</h3>
            <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div
                  className={`
                    w-2 h-2 mt-2 rounded-full flex-shrink-0
                    ${activity.type === 'success' ? 'bg-green-500' : ''}
                    ${activity.type === 'warning' ? 'bg-amber-500' : ''}
                    ${activity.type === 'info' ? 'bg-blue-500' : ''}
                  `}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{activity.action}</p>
                  <p className="text-xs text-slate-600 truncate">{activity.details}</p>
                </div>
                <span className="text-xs text-slate-500 whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Trains Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Upcoming Trains</h3>
            <TrendingUp size={20} className="text-emerald-600" />
          </div>
          <div className="space-y-3">
            {upcomingTrains.map((train, index) => (
              <div key={index} className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex items-start justify-between mb-1">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800 truncate">{train.name}</p>
                    <p className="text-xs text-slate-600 truncate">#{train.number}</p>
                  </div>
                  <span
                    className={`
                      text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ml-2
                      ${train.status === 'On Time' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}
                    `}
                  >
                    {train.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate">{train.route}</p>
                <p className="text-xs text-slate-600 mt-1">{train.departure}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

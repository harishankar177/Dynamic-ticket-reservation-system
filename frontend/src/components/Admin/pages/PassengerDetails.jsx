import React from 'react';
import { ArrowLeft, User, Mail, Phone, Calendar, Ticket, DollarSign, MapPin } from 'lucide-react';

const PassengerDetails = ({ onBack }) => {
  const passengerStats = {
    totalPassengers: 12458,
    activeToday: 487,
    totalBookings: 8732,
    totalRevenue: 4520000,
  };

  const recentPassengers = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      phone: '+91 98765 43210',
      joinDate: '2024-01-15',
      totalBookings: 12,
      totalSpent: 24500,
      lastBooking: '2024-10-05',
      status: 'active',
    },
    {
      id: 2,
      name: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '+91 98765 43211',
      joinDate: '2024-02-20',
      totalBookings: 8,
      totalSpent: 18200,
      lastBooking: '2024-10-04',
      status: 'active',
    },
    {
      id: 3,
      name: 'Vikram Singh',
      email: 'vikram@example.com',
      phone: '+91 98765 43214',
      joinDate: '2024-03-12',
      totalBookings: 15,
      totalSpent: 32100,
      lastBooking: '2024-10-03',
      status: 'active',
    },
    {
      id: 4,
      name: 'Anita Desai',
      email: 'anita@example.com',
      phone: '+91 98765 43215',
      joinDate: '2024-01-08',
      totalBookings: 20,
      totalSpent: 45600,
      lastBooking: '2024-10-02',
      status: 'active',
    },
    {
      id: 5,
      name: 'Rahul Mehta',
      email: 'rahul@example.com',
      phone: '+91 98765 43216',
      joinDate: '2023-12-10',
      totalBookings: 25,
      totalSpent: 52300,
      lastBooking: '2024-09-28',
      status: 'inactive',
    },
  ];

  const topPassengers = [
    { name: 'Suresh Raina', bookings: 45, spent: 98500 },
    { name: 'Meera Nair', bookings: 38, spent: 87200 },
    { name: 'Karan Johar', bookings: 35, spent: 76400 },
    { name: 'Deepa Shah', bookings: 32, spent: 71800 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-slate-700" />
        </button>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Passenger Management</h2>
          <p className="text-slate-600">Complete passenger information and booking history</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Total Passengers */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <User size={32} />
            <div className="text-right">
              <p className="text-blue-100 text-sm">Total Passengers</p>
              <h3 className="text-3xl font-bold">{passengerStats.totalPassengers.toLocaleString()}</h3>
            </div>
          </div>
          <p className="text-sm text-blue-100">Registered users</p>
        </div>

        {/* Active Today */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Calendar size={32} />
            <div className="text-right">
              <p className="text-emerald-100 text-sm">Active Today</p>
              <h3 className="text-3xl font-bold">{passengerStats.activeToday.toLocaleString()}</h3>
            </div>
          </div>
          <p className="text-sm text-emerald-100">Users with bookings today</p>
        </div>

        {/* Total Bookings */}
        <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Ticket size={32} />
            <div className="text-right">
              <p className="text-violet-100 text-sm">Total Bookings</p>
              <h3 className="text-3xl font-bold">{passengerStats.totalBookings.toLocaleString()}</h3>
            </div>
          </div>
          <p className="text-sm text-violet-100">All-time bookings</p>
        </div>

        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <DollarSign size={32} />
            <div className="text-right">
              <p className="text-amber-100 text-sm">Total Revenue</p>
              <h3 className="text-3xl font-bold">₹{(passengerStats.totalRevenue / 100000).toFixed(1)}L</h3>
            </div>
          </div>
          <p className="text-sm text-amber-100">From passenger bookings</p>
        </div>
      </div>

      {/* Tables & Side Info */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Passengers Table */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Recent Passengers</h3>
            <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              View All
            </button>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Passenger</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Contact</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Bookings</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Total Spent</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Last Booking</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPassengers.map((passenger) => (
                  <tr key={passenger.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{passenger.name}</p>
                        <p className="text-xs text-slate-500">Joined {passenger.joinDate}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-slate-400" />
                          <span className="text-xs text-slate-600">{passenger.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-slate-400" />
                          <span className="text-xs text-slate-600">{passenger.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-slate-800">{passenger.totalBookings}</td>
                    <td className="py-3 px-4 text-sm font-medium text-slate-800">₹{passenger.totalSpent.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{passenger.lastBooking}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          passenger.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {passenger.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {recentPassengers.map((passenger) => (
              <div key={passenger.id} className="bg-slate-50 rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-800">{passenger.name}</h4>
                    <p className="text-xs text-slate-500">Joined {passenger.joinDate}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      passenger.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {passenger.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-slate-400" />
                    <span className="text-slate-600">{passenger.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-slate-400" />
                    <span className="text-slate-600">{passenger.phone}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-sm">
                  <div>
                    <span className="text-slate-500 text-xs">Bookings</span>
                    <p className="font-semibold text-slate-800">{passenger.totalBookings}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs">Spent</span>
                    <p className="font-semibold text-slate-800">₹{passenger.totalSpent.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs">Last Booking</span>
                    <p className="font-semibold text-slate-800 text-xs">{passenger.lastBooking}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side Info */}
        <div className="space-y-6">
          {/* Top Passengers */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Top Passengers</h3>
            <div className="space-y-3">
              {topPassengers.map((passenger, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{passenger.name}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span>{passenger.bookings} bookings</span>
                      <span>•</span>
                      <span>₹{passenger.spent.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Routes */}
          <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
            <MapPin size={32} className="text-emerald-600 mb-3" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Popular Routes</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Mumbai - Delhi</span>
                <span className="font-semibold text-slate-800">2,345</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Chennai - Bangalore</span>
                <span className="font-semibold text-slate-800">1,876</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Kolkata - Patna</span>
                <span className="font-semibold text-slate-800">1,542</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerDetails;

import React, { useState, useMemo } from 'react';
import { useTTE } from '../context/TTEContext';
import {
  Users,
  Search,
  Filter,
  SlidersHorizontal,
  User,
  MapPin,
  Ticket,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';

const PassengerList = () => {
  const { currentDuty = {}, passengers = [], markAttendance = () => {} } = useTTE() || {};

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoach, setSelectedCoach] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter safely
  const filteredPassengers = useMemo(() => {
    if (!Array.isArray(passengers)) return [];
    return passengers.filter((passenger = {}) => {
      const name = passenger.name?.toLowerCase() || '';
      const pnr = passenger.pnr?.toLowerCase() || '';
      const seatNumber = passenger.seatNumber?.toString() || '';
      const coachNumber = passenger.coachNumber || '';
      const bookingStatus = passenger.bookingStatus || '';

      const matchesSearch =
        name.includes(searchTerm.toLowerCase()) ||
        pnr.includes(searchTerm.toLowerCase()) ||
        seatNumber.includes(searchTerm);

      const matchesCoach = selectedCoach === 'all' || coachNumber === selectedCoach;
      const matchesStatus =
        selectedStatus === 'all' || bookingStatus.startsWith(selectedStatus);

      return matchesSearch && matchesCoach && matchesStatus;
    });
  }, [passengers, searchTerm, selectedCoach, selectedStatus]);

  // Group by coach safely
  const coachGroups = useMemo(() => {
    const groups = {};
    if (!Array.isArray(filteredPassengers)) return groups;

    filteredPassengers.forEach((passenger = {}) => {
      const coach = passenger.coachNumber || 'Unknown';
      if (!groups[coach]) groups[coach] = [];
      groups[coach].push(passenger);
    });
    return groups;
  }, [filteredPassengers]);

  // Attendance stats
  const stats = useMemo(() => {
    if (!Array.isArray(passengers)) return { total: 0, present: 0, absent: 0, unchecked: 0 };
    const total = passengers.length;
    const present = passengers.filter((p) => p?.attendanceStatus === 'present').length;
    const absent = passengers.filter((p) => p?.attendanceStatus === 'absent').length;
    const unchecked = passengers.filter((p) => p?.attendanceStatus === 'unchecked').length;
    return { total, present, absent, unchecked };
  }, [passengers]);

  const getStatusColor = (status = '') => {
    if (status === 'CNF') return 'bg-green-100 text-green-700';
    if (status === 'RAC') return 'bg-orange-100 text-orange-700';
    if (status.startsWith('WL')) return 'bg-red-100 text-red-700';
    return 'bg-slate-100 text-slate-700';
  };

  const handleAttendance = (passengerId, status) => {
    if (typeof markAttendance === 'function') {
      markAttendance(passengerId, status);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
          <Users className="w-8 h-8 text-blue-500" />
          Passenger List & Attendance
        </h1>
        <p className="text-slate-600">
          Mark attendance and view passenger details for{' '}
          <span className="font-semibold text-slate-800">
            {currentDuty?.trainNumber || 'N/A'} - {currentDuty?.trainName || 'Unknown Train'}
          </span>
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-blue-100 text-sm">Total Passengers</p>
            <Users className="w-5 h-5 text-blue-200" />
          </div>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-green-100 text-sm">Present</p>
            <CheckCircle2 className="w-5 h-5 text-green-200" />
          </div>
          <p className="text-3xl font-bold">{stats.present}</p>
          <p className="text-green-100 text-xs mt-1">
            {stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}% attendance
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-sm p-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-red-100 text-sm">Absent</p>
            <XCircle className="w-5 h-5 text-red-200" />
          </div>
          <p className="text-3xl font-bold">{stats.absent}</p>
          <p className="text-red-100 text-xs mt-1">Vacant seats available</p>
        </div>

        <div className="bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl shadow-sm p-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-100 text-sm">Not Checked</p>
            <Clock className="w-5 h-5 text-slate-200" />
          </div>
          <p className="text-3xl font-bold">{stats.unchecked}</p>
          <p className="text-slate-100 text-xs mt-1">Pending verification</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, PNR, or seat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all ${
              showFilters
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="bg-slate-50 rounded-lg p-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Filter by Coach
              </label>
              <select
                value={selectedCoach}
                onChange={(e) => setSelectedCoach(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Coaches</option>
                {currentDuty?.coachNumbers?.map((coach, i) => (
                  <option key={i} value={coach}>
                    Coach {coach}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Filter by Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="CNF">Confirmed</option>
                <option value="RAC">RAC</option>
                <option value="WL">Waitlist</option>
              </select>
            </div>
          </div>
        )}

        <div className="text-sm text-slate-600 mb-4">
          Showing <span className="font-semibold text-slate-800">{filteredPassengers.length}</span>{' '}
          of <span className="font-semibold text-slate-800">{passengers.length}</span> passengers
        </div>

        {/* Passenger List */}
        {Object.keys(coachGroups).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(coachGroups)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([coach, coachPassengers]) => (
                <div key={coach} className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-100 to-slate-50 px-4 py-3 border-b border-slate-200">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                      <div className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">
                        Coach {coach}
                      </div>
                      <span className="text-slate-600 text-sm">
                        {coachPassengers.length} passenger
                        {coachPassengers.length !== 1 ? 's' : ''}
                      </span>
                    </h3>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {coachPassengers.map((passenger, idx) => (
                      <div
                        key={passenger?.id || idx}
                        className="p-4 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="bg-blue-100 text-blue-600 rounded-full p-2">
                                <User className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-slate-800 text-lg">
                                  {passenger?.name || 'Unnamed'}
                                </h4>
                                <p className="text-sm text-slate-600">
                                  {passenger?.age || '-'} years • {passenger?.gender || '-'}
                                </p>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                  passenger?.bookingStatus || ''
                                )}`}
                              >
                                {passenger?.bookingStatus || 'N/A'}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-3 text-sm">
                              <div>
                                <p className="text-slate-500 text-xs mb-1">PNR</p>
                                <p className="font-mono font-medium text-slate-800">
                                  {passenger?.pnr || '-'}
                                </p>
                              </div>
                              <div>
                                <p className="text-slate-500 text-xs mb-1">Seat</p>
                                <p className="font-semibold text-slate-800">
                                  {passenger?.coachNumber || '?'}-{passenger?.seatNumber || '?'}
                                </p>
                              </div>
                              <div>
                                <p className="text-slate-500 text-xs mb-1">Journey</p>
                                <div className="flex items-center gap-1 text-slate-800">
                                  <MapPin className="w-3 h-3" />
                                  <span className="font-medium text-xs">
                                    {passenger?.from || '---'} → {passenger?.to || '---'}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <p className="text-slate-500 text-xs mb-1">Ticket Type</p>
                                <p className="font-medium text-slate-800">
                                  {passenger?.ticketType || '-'}
                                </p>
                              </div>
                              <div>
                                <p className="text-slate-500 text-xs mb-1">Fare</p>
                                <p className="font-bold text-green-600">
                                  ₹{passenger?.fare || '0'}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="ml-4 flex flex-col gap-2">
                            <div className="text-xs text-slate-600 mb-1 text-center">
                              Attendance
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAttendance(passenger?.id, 'present')}
                                className={`px-3 py-2 rounded-lg flex items-center gap-1 text-xs font-medium transition-all ${
                                  passenger?.attendanceStatus === 'present'
                                    ? 'bg-green-500 text-white shadow-md'
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                Present
                              </button>
                              <button
                                onClick={() => handleAttendance(passenger?.id, 'absent')}
                                className={`px-3 py-2 rounded-lg flex items-center gap-1 text-xs font-medium transition-all ${
                                  passenger?.attendanceStatus === 'absent'
                                    ? 'bg-red-500 text-white shadow-md'
                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                }`}
                              >
                                <XCircle className="w-4 h-4" />
                                Absent
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No passengers found</p>
            <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PassengerList;

import React, { useState, useMemo } from 'react';
import { useTTE } from '../context/TTEContext';
import { Armchair, CheckCircle2, XCircle, AlertCircle, Filter } from 'lucide-react';

const SeatAvailability = () => {
  // Safe defaults to prevent undefined crashes
  const { currentDuty, passengers = [] } = useTTE() || {};
  const coachNumbers = currentDuty?.coachNumbers || [];
  const [selectedCoach, setSelectedCoach] = useState(coachNumbers[0] || '');

  const coachData = useMemo(() => {
    if (!selectedCoach) return { totalSeats: 0, occupiedSeats: [], vacantSeats: [] };

    const totalSeats = 72;
    const coachPassengers = Array.isArray(passengers)
      ? passengers.filter((p) => p?.coachNumber === selectedCoach)
      : [];

    const occupiedSeats = [];
    const seatNumbersMap = new Map();

    coachPassengers.forEach((p) => {
      if (p?.seatNumber) seatNumbersMap.set(p.seatNumber, p);
    });

    for (let i = 1; i <= totalSeats; i++) {
      const seatNum = i.toString();
      const passenger = seatNumbersMap.get(seatNum);
      if (passenger) {
        occupiedSeats.push({
          seatNumber: seatNum,
          passenger,
          status: passenger?.attendanceStatus?.trim() || 'unchecked',
        });
      }
    }

    const occupiedSeatNumbers = new Set(occupiedSeats.map((s) => parseInt(s.seatNumber)));
    const vacantSeats = [];
    for (let i = 1; i <= totalSeats; i++) {
      if (!occupiedSeatNumbers.has(i)) vacantSeats.push(i.toString());
    }

    return { totalSeats, occupiedSeats, vacantSeats };
  }, [selectedCoach, passengers]);

  const stats = useMemo(() => {
    const present = coachData.occupiedSeats.filter((s) => s.status === 'present').length;
    const absent = coachData.occupiedSeats.filter((s) => s.status === 'absent').length;
    const unchecked = coachData.occupiedSeats.filter((s) => s.status === 'unchecked').length;
    const vacant = coachData.vacantSeats.length;
    const occupied = coachData.occupiedSeats.length;

    return { present, absent, unchecked, vacant, occupied, total: coachData.totalSeats };
  }, [coachData]);

  const getSeatLayout = () => {
    const seats = [];
    for (let i = 1; i <= coachData.totalSeats; i++) {
      seats.push({ number: i, type: 'seat' });
      if (i % 4 === 0 && i !== coachData.totalSeats) seats.push({ number: -1, type: 'aisle' });
    }
    return seats;
  };

  const getSeatStatus = (seatNumber) => {
    const seatStr = seatNumber.toString();
    const occupied = coachData.occupiedSeats.find((s) => s.seatNumber === seatStr);
    if (occupied) return { status: occupied.status, passenger: occupied.passenger };
    return { status: 'vacant' };
  };

  // 🟡 Updated: More visible and consistent colors
  const getSeatColor = (status) => {
    switch (status) {
      case 'vacant':
        return 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200';
      case 'present':
        return 'bg-green-500 border-green-600 text-white hover:bg-green-600';
      case 'absent':
        return 'bg-red-500 border-red-600 text-white hover:bg-red-600';
      case 'unchecked':
        return 'bg-yellow-500 border-yellow-600 text-yellow-900 hover:bg-yellow-400';
      default:
        return 'bg-slate-100 border-slate-300 text-slate-600';
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
          <Armchair className="w-8 h-8 text-blue-500" />
          Seat Availability
        </h1>
        <p className="text-slate-600">
          View vacant and occupied seats for{' '}
          <span className="font-semibold text-slate-800">
            {currentDuty?.trainNumber || 'N/A'} - {currentDuty?.trainName || 'N/A'}
          </span>
        </p>
      </div>

      {/* Coach Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">Select Coach</label>
        <select
          value={selectedCoach}
          onChange={(e) => setSelectedCoach(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 max-w-xs"
        >
          {coachNumbers.length > 0 ? (
            coachNumbers.map((coach) => (
              <option key={coach} value={coach}>
                Coach {coach}
              </option>
            ))
          ) : (
            <option disabled>No coaches available</option>
          )}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Total Seats', value: stats.total, icon: Armchair, color: 'blue' },
          { label: 'Present', value: stats.present, icon: CheckCircle2, color: 'green' },
          { label: 'Absent', value: stats.absent, icon: XCircle, color: 'red' },
          { label: 'Not Checked', value: stats.unchecked, icon: AlertCircle, color: 'yellow' },
          { label: 'Vacant', value: stats.vacant, icon: Filter, color: 'slate' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className={`bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-xl shadow-sm p-5 text-white`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className={`text-${color}-100 text-sm`}>{label}</p>
              <Icon className={`w-5 h-5 text-${color}-200`} />
            </div>
            <p className="text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { color: 'slate', label: 'Vacant', desc: 'Available', icon: Armchair },
            { color: 'green', label: 'Present', desc: 'Occupied', icon: CheckCircle2 },
            { color: 'red', label: 'Absent', desc: 'Can allocate', icon: XCircle },
            { color: 'yellow', label: 'Unchecked', desc: 'Not verified', icon: AlertCircle },
          ].map(({ color, label, desc, icon: Icon }) => (
            <div key={label} className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg bg-${color}-500 border-2 border-${color}-600 flex items-center justify-center`}
              >
                <Icon className={`w-5 h-5 text-${color === 'yellow' ? 'yellow-900' : 'white'}`} />
              </div>
              <div>
                <p className="font-medium text-slate-800">{label}</p>
                <p className="text-xs text-slate-600">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seat Map */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">
            Coach {selectedCoach || 'N/A'} - Seat Map
          </h3>
          <div className="text-sm text-slate-600">
            {stats.occupied} occupied • {stats.vacant} vacant
          </div>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {getSeatLayout().map((seat, index) => {
            if (seat.type === 'aisle') return <div key={`aisle-${index}`} className="h-14" />;
            const seatInfo = getSeatStatus(seat.number);
            const isVacant = seatInfo.status === 'vacant';

            return (
              <div
                key={seat.number}
                className={`relative h-14 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer ${getSeatColor(
                  seatInfo.status
                )}`}
                title={
                  isVacant
                    ? `Seat ${seat.number} - Vacant`
                    : `Seat ${seat.number} - ${seatInfo.passenger?.name || 'N/A'} (${seatInfo.status})`
                }
              >
                <div className="text-center">
                  <p className="text-xs font-bold">{seat.number}</p>
                  {!isVacant && (
                    <div className="absolute -top-1 -right-1">
                      {seatInfo.status === 'present' && (
                        <CheckCircle2 className="w-4 h-4 text-white bg-green-600 rounded-full" />
                      )}
                      {seatInfo.status === 'absent' && (
                        <XCircle className="w-4 h-4 text-white bg-red-600 rounded-full" />
                      )}
                      {seatInfo.status === 'unchecked' && (
                        <AlertCircle className="w-4 h-4 text-yellow-800 bg-yellow-300 rounded-full" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vacant Seats */}
      {stats.vacant > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mt-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Vacant Seats ({stats.vacant})
          </h3>
          <div className="flex flex-wrap gap-2">
            {coachData.vacantSeats.map((seatNum) => (
              <div
                key={seatNum}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg border border-slate-300 font-mono font-semibold"
              >
                {selectedCoach}-{seatNum}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Absent Passengers */}
      {stats.absent > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mt-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Absent Passengers - Seats Available for Allocation ({stats.absent})
          </h3>
          <div className="space-y-3">
            {coachData.occupiedSeats
              .filter((s) => s.status === 'absent')
              .map((seat) => (
                <div
                  key={seat.seatNumber}
                  className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200"
                >
                  <div>
                    <p className="font-semibold text-slate-800">{seat.passenger?.name || 'N/A'}</p>
                    <p className="text-sm text-slate-600">
                      PNR: {seat.passenger?.pnr || 'N/A'} • Age: {seat.passenger?.age || 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-red-600">
                      Seat {selectedCoach}-{seat.seatNumber}
                    </p>
                    <p className="text-xs text-red-600">Available for allocation</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatAvailability;

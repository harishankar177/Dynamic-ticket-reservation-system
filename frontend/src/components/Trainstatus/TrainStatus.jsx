import React from 'react';
import {  Train, Ticket, Search } from 'lucide-react';

export default function TrainStatus({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gradient-to-br ">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Train className="w-20 h-20 text-black" />
          </div>
          <h1 className="text-5xl font-bold text-black mb-4">Indian Railways</h1>
          <p className="text-xl-black-slate-300">Track trains and check PNR status in real-time</p>
        </div>

        {/* Buttons for Train Status & PNR Status */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <button
            onClick={() => onNavigate('train')}
            className="group relative overflow-hidden bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl shadow-2xl hover:shadow-orange-500/50 transition-all duration-500 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-10">
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <Search className="w-10 h-10 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">Train Status</h2>
              <p className="text-orange-100 text-lg leading-relaxed">
                Search for trains, check live running status, view schedules, and track delays
              </p>
              <div className="mt-6 flex items-center justify-center gap-2 text-white font-semibold">
                <span>Get Started</span>
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('pnr')}
            className="group relative overflow-hidden bg-gradient-to-br from-teal-500 to-cyan-600 rounded-3xl shadow-2xl hover:shadow-teal-500/50 transition-all duration-500 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-10">
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <Ticket className="w-10 h-10 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">PNR Status</h2>
              <p className="text-teal-100 text-lg leading-relaxed">
                Check booking details, seat numbers, coach layout, and passenger information
              </p>
              <div className="mt-6 flex items-center justify-center gap-2 text-white font-semibold">
                <span>Check Now</span>
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

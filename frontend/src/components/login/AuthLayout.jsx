import React from 'react';
import {  Train, Shield, Smartphone, CheckCircle } from 'lucide-react';

const AuthLayout = ({ children }) => {
  const features = [
    { icon: Shield, title: 'Secure', desc: 'Bank-level security' },
    { icon: Smartphone, title: 'Smart', desc: 'AI-powered booking' },
    { icon: CheckCircle, title: 'Reliable', desc: '99.9% uptime' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="text-white space-y-8 lg:pr-8">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-500 p-3 rounded-xl">
              <Train className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">RailBook</h1>
              <p className="text-blue-200">Smart Railway Booking</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              Your Journey Starts Here
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Experience seamless train booking with real-time tracking, smart seat selection, 
              and personalized travel insights.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 text-center transform hover:scale-105 transition-transform duration-200"
              >
                <feature.icon className="h-8 w-8 mx-auto mb-2 text-orange-400" />
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-blue-200">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

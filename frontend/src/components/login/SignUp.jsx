import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, CheckCircle, XCircle, Smartphone } from 'lucide-react';
import axios from 'axios';

const SignUp = ({ onSignIn }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleOtpChange = (index, value) => {
    if (/^\d?$/.test(value)) { // only allow 1 digit number
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const sendOtp = async () => {
    if (!formData.email) return;
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/send-otp", { email: formData.email });
      console.log("OTP sent:", res.data.otp); // show OTP in terminal for testing
      setOtpSent(true);
      alert("OTP sent to " + formData.email);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to send OTP");
    }
    setIsLoading(false);
  };

  const verifyOtp = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      alert("Enter full 6-digit OTP");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email: formData.email,
        otp: otpValue
      });
      if (res.data.success) {
        setIsOtpVerified(true);
        alert("OTP Verified ✅");
      }
    } catch (err) {
      alert(err.response?.data?.error || "Invalid OTP ❌");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isOtpVerified) {
      alert("Please verify OTP first!");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/signup", formData);
      alert("Sign up successful!");
      if (onSignIn) onSignIn(); // redirect to SignIn page
    } catch (err) {
      alert(err.response?.data?.error || "Sign up failed");
    }
    setIsLoading(false);
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Create Account</h3>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg"
              placeholder="Enter username"
              required
            />
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg"
              placeholder="Enter full name"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg"
              placeholder="Enter email"
              required
              disabled={otpSent}
            />
          </div>
        </div>

        {/* Phone */}
      
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
  <div className="relative">
    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
    <input
      type="tel"
      value={formData.phone}
      onChange={(e) => {
        if (/^\d{0,10}$/.test(e.target.value)) { // only digits max 10
          setFormData(prev => ({ ...prev, phone: e.target.value }));
        }
      }}
      className="w-full pl-10 pr-4 py-3 border rounded-lg"
      placeholder="Enter phone number"
      required
    />
  </div>
</div>

        {/* OTP */}
        <div className="space-y-4">
          {!otpSent && (
            <button type="button" onClick={sendOtp} disabled={!formData.email || isLoading}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg">
              {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
          )}
          {otpSent && (
            <div>
              <label className="block text-sm font-medium mb-2">Enter OTP</label>
              <div className="flex space-x-2">
                {otp.map((_, i) => (
                  <input key={i} id={`otp-${i}`} type="text" maxLength={1}
                    value={otp[i]} onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-12 h-12 text-center border rounded-lg" />
                ))}
                {isOtpVerified ? (
                  <CheckCircle className="h-6 w-6 text-green-500 ml-2" />
                ) : (
                  otp.join('').length === 6 && <XCircle className="h-6 w-6 text-red-500 ml-2" />
                )}
              </div>
              {!isOtpVerified && (
                <button type="button" onClick={verifyOtp}
                  className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg">Verify OTP</button>
              )}
            </div>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="w-full pl-10 pr-12 py-3 border rounded-lg"
              placeholder="Enter password"
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg"
              placeholder="Confirm password"
              required
            />
          </div>
        </div>

        {/* Submit */}
        <button type="submit" disabled={isLoading || !isOtpVerified}
          className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center space-x-2">
          {isLoading ? <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full"></div> : <><span>Create Account</span> <ArrowRight className="h-5 w-5" /></>}
        </button>

      </form>
    </div>
  );
};

export default SignUp;

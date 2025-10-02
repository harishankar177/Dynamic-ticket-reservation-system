import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const SignUp = ({ onSignIn }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
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
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const sendOtp = async () => {
    if (!formData.email) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setOtpSent(true);
    setIsLoading(false);
    alert("OTP sent to " + formData.email);
  };

  const verifyOtp = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6 || otpValue.includes('')) {
      alert("Enter full 6-digit OTP");
      return;
    }

    // ✅ Replace this with backend API call
    if (otpValue === "123456") {
      setIsOtpVerified(true);
      alert("OTP Verified ✅");
    } else {
      setIsOtpVerified(false);
      alert("Invalid OTP ❌");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        username: formData.username,
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      const res = await axios.post('http://localhost:5000/api/auth/signup', payload);
      alert('Sign up successful!');
      if (onSignIn) onSignIn();
    } catch (err) {
      alert(err.response?.data?.error || 'Sign up failed');
    }
    setIsLoading(false);
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h3>
        <p className="text-gray-600">Join millions of travelers</p>
      </div>

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
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your full name"
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
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your email"
              required
              disabled={otpSent}
            />
          </div>
        </div>

        {/* OTP Section */}
        <div className="space-y-4">
          {!otpSent && (
            <button
              type="button"
              onClick={sendOtp}
              disabled={!formData.email || isLoading}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
          )}

          {otpSent && (
            <div className="transform transition-all duration-300">
              <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>

              <div className="relative flex space-x-2 mb-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={otp[index]}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold"
                  />
                ))}

                {/* ✅ Tick or ❌ Cross */}
                <div className="absolute right-[-40px] top-1/2 -translate-y-1/2">
                  {isOtpVerified ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    otp.join('').length === 6 && <XCircle className="h-6 w-6 text-red-500" />
                  )}
                </div>
              </div>

              {!isOtpVerified && (
                <button
                  type="button"
                  onClick={verifyOtp}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Verify OTP
                </button>
              )}

              {isOtpVerified && (
                <p className="text-sm text-green-600 font-medium mt-1">OTP Verified Successfully ✅</p>
              )}

              <p className="text-sm text-gray-600 mt-2">
                OTP sent to {formData.email}.
                <button 
                  type="button" 
                  className="text-blue-600 hover:underline ml-1"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp(['', '', '', '', '', '']);
                    setIsOtpVerified(false);
                  }}
                >
                  Change email
                </button>
              </p>
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
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
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
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Confirm your password"
              required
            />
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start">
          <input
            type="checkbox"
            id="terms"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
            required
          />
          <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
            I agree to the <button type="button" className="text-blue-600 hover:underline">Terms of Service</button> and{' '}
            <button type="button" className="text-blue-600 hover:underline">Privacy Policy</button>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading || !isOtpVerified}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>

      {/* Toggle to Sign In */}
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?
          <button
            onClick={onSignIn}
            className="ml-1 text-blue-600 hover:underline font-medium"
          >
            Sign in
          </button>
        </p>
      </div>

      {/* Social Login */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

      <div className="mt-6 grid grid-cols-1 gap-3">
        {/* Google Button */}
        <button className="w-full inline-flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google Logo"
            className="h-5 w-5"
          />
          <span className="ml-2 font-medium">Google</span>
        </button>
      </div>
    </div>
  </div>
  );
};

export default SignUp;
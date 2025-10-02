import React, { useState } from "react";
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";

const ForgotPassword = ({ onBack }) => {
  const [step, setStep] = useState("email"); // email -> otp -> reset
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleOtpChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      // move focus to next input
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);

    // Simulate API call to send OTP
    await new Promise((resolve) => setTimeout(resolve, 1500));

    alert(`OTP sent to ${email}`);
    setStep("otp");
    setIsLoading(false);
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      alert("Enter full 6-digit OTP");
      return;
    }

    setIsLoading(true);

    // Simulate OTP verification
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (otpValue === "123456") {
      alert("OTP Verified ✅");
      setStep("reset");
    } else {
      alert("Invalid OTP ❌");
    }
    setIsLoading(false);
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);

    // Simulate API call to reset password
    await new Promise((resolve) => setTimeout(resolve, 1500));

    alert("Password reset successfully!");
    setIsLoading(false);
    onBack(); // go back to SignIn
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>
      </div>

      {step === "email" && (
        <div>
          <div className="text-center mb-6">
            <div className="bg-blue-100 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Forgot Password?</h2>
            <p className="text-gray-600">Enter your email to receive OTP</p>
          </div>

          <form onSubmit={sendEmail} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full"></div>
              ) : (
                <>
                  <span>Send OTP</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {step === "otp" && (
        <div>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Verify OTP</h2>
            <p className="text-gray-600">Enter the 6-digit OTP sent to {email}</p>
          </div>

          <form onSubmit={verifyOtp} className="space-y-4">
            <div className="flex justify-center space-x-2">
              {otp.map((_, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength={1}
                  value={otp[i]}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.some((val) => !val)}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full"></div>
              ) : (
                <>
                  <span>Verify OTP</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {step === "reset" && (
        <div>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
            <p className="text-gray-600">Enter a new password</p>
          </div>

          <form onSubmit={resetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                minLength={8}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !newPassword || !confirmPassword}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full"></div>
              ) : (
                <>
                  <span>Reset Password</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;

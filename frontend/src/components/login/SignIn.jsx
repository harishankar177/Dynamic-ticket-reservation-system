import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SignIn = ({ onForgotPassword, onSignUp }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Safe localStorage getter
  const getUserFromStorage = () => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  };

  // ======= SESSION CHECK =======
  useEffect(() => {
    const checkExistingSession = () => {
      const user = getUserFromStorage();
      if (user) {
        // Check if session has expired
        if (user.expires && new Date(user.expires) < new Date()) {
          localStorage.removeItem('user');
          localStorage.removeItem('role');
          return;
        }
        
        console.log('Existing session found, redirecting...', user.role);
        // Redirect based on role if valid session exists
        const role = user.role.toLowerCase();
        if (role === 'tte') {
          navigate('/tte', { replace: true });
        } else if (role === 'passenger') {
          navigate('/', { replace: true });
        } else if (role === 'admin') {
          navigate('/admin', { replace: true });
        }
      }
    };

    checkExistingSession();
  }, [navigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    setError('');

    try {
      // API call to RailbookDB authentication endpoint
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        const userData = response.data.user;

        // Validate that user has a valid role
        const validRoles = ['passenger', 'tte', 'admin'];
        if (!userData.role || !validRoles.includes(userData.role.toLowerCase())) {
          setError('Invalid user role. Please contact administrator.');
          setIsLoading(false);
          return;
        }

        // Enhanced session storage with timestamp
        const sessionData = {
          ...userData,
          loginTime: new Date().toISOString(),
          sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };

        // Save user session with remember me option
        if (formData.rememberMe) {
          // Extended session for 30 days
          sessionData.expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
          sessionData.rememberMe = true;
        } else {
          // Default session (7 days)
          sessionData.expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
          sessionData.rememberMe = false;
        }
        
        localStorage.setItem('user', JSON.stringify(sessionData));
        localStorage.setItem('role', userData.role);

        console.log('Login successful as:', userData.role);
        console.log('User data from RailbookDB:', userData);
        
        // Show success message
        const roleDisplay = {
          'passenger': 'Passenger 🚆',
          'tte': 'TTE Officer 🎫', 
          'admin': 'Administrator ⚙️'
        }[userData.role.toLowerCase()] || userData.role;

        // Role-based redirect with slight delay for better UX
        setTimeout(() => {
          const role = userData.role.toLowerCase();
          if (role === 'passenger') {
            navigate('/', { replace: true });
          } else if (role === 'tte') {
            navigate('/tte', { replace: true });
          } else if (role === 'admin') {
            navigate('/admin', { replace: true });
          }
        }, 500);

      } else {
        setError(response.data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle different types of errors
      if (err.response) {
        // Server responded with error status
        setError(err.response.data?.error || err.response.data?.message || 'Login failed');
      } else if (err.request) {
        // Network error
        setError('Network error: Unable to connect to server. Please check your connection.');
      } else {
        // Other errors
        setError('An unexpected error occurred. Please try again.');
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h3>
    
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your registered email"
              required
              autoComplete="email"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.rememberMe}
              onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={isLoading}
            />
            <span className="ml-2 text-sm text-gray-600">Keep me logged in</span>
          </label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-blue-600 hover:underline disabled:opacity-50"
            disabled={isLoading}
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Signing In...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>

      {/* Toggle to Sign Up */}
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Don't have an account?
          <button
            type="button"
            onClick={onSignUp}
            className="ml-1 text-blue-600 hover:underline font-medium"
            disabled={isLoading}
          >
            Sign up
          </button>
        </p>
      </div>

     
    </div>
  );
};

export default SignIn;
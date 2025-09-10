import React, { useState } from 'react';
import { FiUser, FiLock, FiMail, FiX, FiEye, FiEyeOff } from 'react-icons/fi';
import { apiPost } from '../utils/apiClient';

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'verify' | 'forgot' | 'reset'
  const [formData, setFormData] = useState({
    email: '',
    regNumber: '',
    password: '',
    displayName: ''
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const nextValue = name === 'regNumber'
      ? value.toUpperCase().replace(/\s+/g, '')
      : value;
    setFormData(prev => ({
      ...prev,
      [name]: nextValue
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (mode === 'register') {
        await apiPost('/auth/register', formData);
        // Auto-login after successful registration
        const loginResponse = await apiPost('/auth/login', {
          emailOrReg: formData.email || formData.regNumber,
          password: formData.password
        });
        localStorage.setItem('findloc.token', loginResponse.token);
        localStorage.setItem('findloc.user', JSON.stringify(loginResponse.user));
        onSuccess(loginResponse.user);
        setFormData(prev => ({ ...prev, email: loginResponse.user.email }));
        // Prompt verification if not verified (email already sent by backend)
        if (!loginResponse.user.emailVerified) {
          setMode('verify');
        } else {
          onClose();
        }
      } else if (mode === 'login') {
        const response = await apiPost('/auth/login', {
          emailOrReg: formData.email || formData.regNumber,
          password: formData.password
        });
        localStorage.setItem('findloc.token', response.token);
        localStorage.setItem('findloc.user', JSON.stringify(response.user));
        onSuccess(response.user);
        setFormData(prev => ({ ...prev, email: response.user.email }));
        if (!response.user.emailVerified) {
          await apiPost('/auth/send-verification', { email: response.user.email }).catch(() => { /* ignore */ });
          setMode('verify');
        } else {
          onClose();
        }
      } else if (mode === 'verify') {
        await apiPost('/auth/verify-email', { email: formData.email, token: verificationCode });
        // Refresh user info
        const response = await apiPost('/auth/login', { emailOrReg: formData.email || formData.regNumber, password: formData.password });
        localStorage.setItem('findloc.token', response.token);
        localStorage.setItem('findloc.user', JSON.stringify(response.user));
        onSuccess(response.user);
        onClose();
      } else if (mode === 'forgot') {
        await apiPost('/auth/request-password-reset', { email: formData.email });
        setMode('reset');
      } else if (mode === 'reset') {
        if (!newPassword || newPassword.length < 6) throw new Error('Password too short');
        await apiPost('/auth/reset-password', { email: formData.email, token: resetCode, newPassword });
        // Auto-login after reset
        const response = await apiPost('/auth/login', { emailOrReg: formData.email, password: newPassword });
        localStorage.setItem('findloc.token', response.token);
        localStorage.setItem('findloc.user', JSON.stringify(response.user));
        onSuccess(response.user);
        onClose();
      }
      
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ email: '', regNumber: '', password: '', displayName: '' });
    setVerificationCode('');
    setResetCode('');
    setNewPassword('');
    setError('');
    setShowPassword(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'register' && 'Create Account'}
            {mode === 'verify' && 'Verify Your Email'}
            {mode === 'forgot' && 'Reset Password'}
            {mode === 'reset' && 'Set New Password'}
          </h2>
          <button
            onClick={() => { onClose(); resetForm(); }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Display Name (Register only) */}
          {mode === 'register' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <FiUser className="w-4 h-4 mr-2" />
                Display Name
              </label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your name"
                required={mode === 'register'}
              />
            </div>
          )}

          {/* Email (required for all users) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <FiMail className="w-4 h-4 mr-2" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your.email@example.com"
              required={mode === 'register' || mode === 'forgot' || mode === 'reset' || mode === 'verify'}
            />
            <p className="text-xs text-gray-500">All users must provide a valid email address. Teachers/staff can leave reg number blank.</p>
          </div>

          {/* Registration Number (students only, optional for staff/teachers) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <FiUser className="w-4 h-4 mr-2" />
              Registration Number (students)
            </label>
            <input
              type="text"
              name="regNumber"
              value={formData.regNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g. 2021/SC/19294"
            />
            <p className="text-xs text-gray-500">Format: YYYY/DEPT/NUMBER (e.g., 2021/SC/19294). Teachers/staff can leave this blank.</p>
            {mode === 'login' && (
              <p className="text-xs text-gray-500">You can sign in with email or registration number</p>
            )}
          </div>

          {/* Password (only for login/register) */}
          {(mode === 'login' || mode === 'register') && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <FiLock className="w-4 h-4 mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
              {mode === 'register' && (
                <p className="text-xs text-gray-500">Minimum 6 characters</p>
              )}
            </div>
          )}

          {/* Email Verification Mode */}
          {mode === 'verify' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Enter verification code sent to your email</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Verification code"
                required
              />
              <p className="text-xs text-gray-500">Didn’t get it? <button type="button" className="text-blue-600" onClick={() => apiPost('/auth/send-verification', { email: formData.email }).catch(() => { /* ignore */ })}>Resend</button></p>
            </div>
          )}

          {/* Forgot Password / Reset */}
          {mode === 'forgot' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Enter your email to receive a reset code</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your.email@example.com"
                required
              />
            </div>
          )}
          {mode === 'reset' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Enter the reset code sent to your email</label>
              <input
                type="text"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Reset code"
                required
              />
              <label className="text-sm font-medium text-gray-700">New password</label>
              <input
                type="password"
                value={newPassword}
                minLength={6}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="New password"
                required
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {mode === 'login' ? 'Signing In...' : mode === 'register' ? 'Creating Account...' : mode === 'verify' ? 'Verifying...' : mode === 'forgot' ? 'Sending Code...' : 'Resetting Password...'}
              </div>
            ) : (
              mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : mode === 'verify' ? 'Verify Email' : mode === 'forgot' ? 'Send Reset Code' : 'Reset Password'
            )}
          </button>

          {/* Switch Mode */}
          <div className="text-center pt-4 border-t border-gray-200 space-y-2">
            {mode === 'login' && (
              <p className="text-sm text-gray-600">
                Forgot your password?
                <button type="button" onClick={() => setMode('forgot')} className="ml-2 text-blue-600 hover:text-blue-700 font-medium">Reset</button>
              </p>
            )}
            <p className="text-sm text-gray-600">
              {mode === 'login' ? "Don't have an account?" : mode === 'register' ? "Already have an account?" : 'Return to sign in?'}
              <button
                type="button"
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="ml-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;

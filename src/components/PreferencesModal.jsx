import React, { useState, useEffect } from 'react';
import { FiSettings, FiX, FiSave, FiUser, FiClock, FiMap } from 'react-icons/fi';
import { dataStore } from '../utils/dataStore';
import { apiGet, apiPost } from '../utils/apiClient';

const PreferencesModal = ({ isOpen, onClose, user }) => {
  const [preferences, setPreferences] = useState({
    avoidDirt: false,
    preferLit: false,
    avoidStairs: false,
    speedMetersPerMin: 80
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [routeHistory, setRouteHistory] = useState([]);

  const loadPreferences = async () => {
    setIsLoading(true);
    try {
      if (user && import.meta.env.VITE_API_BASE_URL) {
        // Try to load from API
        try {
          const prefs = await apiGet('/preferences');
          setPreferences(prefs);
        } catch {
          // Fallback to local storage
          setPreferences(dataStore.getPreferences());
        }
      } else {
        // Use local storage
        setPreferences(dataStore.getPreferences());
      }
    } catch {
      setError('Failed to load preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const loadRouteHistory = async () => {
    try {
      if (user && import.meta.env.VITE_API_BASE_URL) {
        try {
          const history = await apiGet('/routes/history');
          setRouteHistory(history.slice(0, 10)); // Show last 10
        } catch {
          // Fallback to local storage
          setRouteHistory(dataStore.getRouteHistory().slice(0, 10));
        }
      } else {
        setRouteHistory(dataStore.getRouteHistory().slice(0, 10));
      }
    } catch {
      // Ignore errors for route history
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadPreferences();
      loadRouteHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, user]);

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    
    try {
      if (user && import.meta.env.VITE_API_BASE_URL) {
        // Save to API
        try {
          await apiPost('/preferences', preferences);
        } catch {
          // Fallback to local storage
          dataStore.savePreferences(preferences);
        }
      } else {
        // Save to local storage
        dataStore.savePreferences(preferences);
      }
      
      onClose();
    } catch {
      setError('Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('findloc.token');
    localStorage.removeItem('findloc.user');
    window.location.reload();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <FiSettings className="w-5 h-5 mr-2" />
            Settings & Preferences
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* User Info */}
          {user && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <FiUser className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{user.displayName || 'Campus Navigator'}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Sign Out
              </button>
            </div>
          )}

          {/* Navigation Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <FiMap className="w-5 h-5 mr-2" />
              Navigation Preferences
            </h3>
            
            <div className="space-y-4">
              {/* Avoid Dirt Paths */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Avoid dirt paths</label>
                  <p className="text-xs text-gray-500">Prefer paved walkways when available</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.avoidDirt}
                    onChange={(e) => handlePreferenceChange('avoidDirt', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Prefer Lit Paths */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Prefer lit paths</label>
                  <p className="text-xs text-gray-500">Choose well-lit routes for safety</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.preferLit}
                    onChange={(e) => handlePreferenceChange('preferLit', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Avoid Stairs */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Avoid stairs</label>
                  <p className="text-xs text-gray-500">Accessibility-friendly routing</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.avoidStairs}
                    onChange={(e) => handlePreferenceChange('avoidStairs', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Walking Speed */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Walking speed</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="60"
                    max="120"
                    step="10"
                    value={preferences.speedMetersPerMin}
                    onChange={(e) => handlePreferenceChange('speedMetersPerMin', parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-sm font-medium text-gray-700 w-16">
                    {preferences.speedMetersPerMin}m/min
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Slow</span>
                  <span>Normal</span>
                  <span>Fast</span>
                </div>
              </div>
            </div>
          </div>

          {/* Route History */}
          {routeHistory.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <FiClock className="w-5 h-5 mr-2" />
                Recent Routes
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {routeHistory.map((route, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {route.destination || 'Campus Route'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {route.routeSummary?.distance}m • {route.routeSummary?.duration}min • {route.routeSummary?.method}
                        </p>
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(route.createdAt || route.at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Save Button */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || isLoading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4 mr-2" />
                  Save Preferences
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesModal;

import React from 'react';
import { FiInfo, FiMapPin, FiSmartphone, FiWifi, FiX } from 'react-icons/fi';

const LocationAccuracyHelper = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-2xl p-6 max-w-md w-full mx-4 text-white border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <FiMapPin className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Improve Location Accuracy</h3>
              <p className="text-sm text-white/70">Get precise GPS positioning</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <FiSmartphone className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm mb-1">Enable GPS</h4>
                <p className="text-xs text-white/80">
                  Turn on location services in your device settings for precise positioning
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <FiWifi className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm mb-1">WiFi Triangulation</h4>
                <p className="text-xs text-white/80">
                  Keep WiFi enabled even if not connected - helps with indoor positioning
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <FiInfo className="w-5 h-5 text-orange-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm mb-1">Best Results</h4>
                <p className="text-xs text-white/80">
                  Go outdoors or near a window for fastest GPS lock. Indoor positioning may take longer.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/20">
          <p className="text-xs text-white/60 text-center">
            🛰️ Using high-accuracy GPS instead of IP geolocation for precise campus navigation
          </p>
        </div>
      </div>
    </div>
  );
};

export default LocationAccuracyHelper;

import React, { useState, useMemo } from 'react';
import { FiSearch, FiX, FiMapPin, FiNavigation, FiClock } from 'react-icons/fi';

const SearchModal = ({ isOpen, onClose, destinations, onSelect, userLocation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter destinations based on search query
  const filteredDestinations = useMemo(() => {
    if (!searchQuery.trim()) return destinations;
    
    return destinations.filter(dest =>
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [destinations, searchQuery]);

  // Calculate estimated distance (simple approximation)
  const calculateDistance = (dest) => {
    if (!userLocation) return null;
    
    const R = 6371000; // Earth's radius in meters
    const dLat = (dest.lat - userLocation.lat) * Math.PI / 180;
    const dLng = (dest.lng - userLocation.lng) * Math.PI / 180;
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(dest.lat * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in meters
    
    return Math.round(distance);
  };

  // Get building icon based on type
  const getBuildingIcon = (type, name) => {
    const iconMap = {
      'building': '🏢',
      'hostel': '🏠',
      'entrance': '🚪'
    };

    // Special cases
    if (name.includes('Library')) return '📚';
    if (name.includes('Medical')) return '🏥';
    if (name.includes('Science')) return '🔬';
    if (name.includes('Engineering')) return '⚙️';
    if (name.includes('Student')) return '🎓';
    if (name.includes('Sports')) return '🏃‍♂️';
    if (name.includes('Admin')) return '🏛️';

    return iconMap[type] || '📍';
  };

  // Get estimated walking time
  const getWalkingTime = (distance) => {
    if (!distance) return null;
    const walkingSpeed = 1.4; // m/s
    const timeInMinutes = Math.round(distance / walkingSpeed / 60);
    return Math.max(1, timeInMinutes); // At least 1 minute
  };

  if (!isOpen) {
    console.log('🔍 SearchModal: isOpen is false, not rendering');
    return null;
  }

  console.log('🔍 SearchModal: Rendering modal, destinations:', destinations.length);

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity z-[9998]"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4 z-[9999]">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden z-[9999]">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <FiSearch className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Find Destination</h2>
                  <p className="text-indigo-100 text-sm">Search campus buildings and locations</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <FiX className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for buildings, hostels, or facilities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                autoFocus
              />
            </div>
          </div>

          {/* Results */}
          <div className="overflow-y-auto max-h-96">
            {filteredDestinations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <FiMapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No destinations found</p>
                <p className="text-sm">Try searching for buildings, hostels, or facilities</p>
              </div>
            ) : (
              <div className="p-4 space-y-2">
                {filteredDestinations.map((destination, index) => {
                  const distance = calculateDistance(destination);
                  const walkingTime = getWalkingTime(distance);
                  
                  return (
                    <button
                      key={index}
                      onClick={() => onSelect(destination)}
                      className="w-full p-4 text-left hover:bg-gray-50 rounded-xl transition-all duration-200 border border-transparent hover:border-gray-200 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {/* Building Icon */}
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform duration-200">
                            {getBuildingIcon(destination.type, destination.name)}
                          </div>
                          
                          {/* Building Info */}
                          <div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                              {destination.name}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                                {destination.type}
                              </span>
                              <span className="text-xs text-gray-500">
                                {destination.lat.toFixed(4)}, {destination.lng.toFixed(4)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Distance & Time */}
                        <div className="text-right">
                          {distance && (
                            <>
                              <div className="flex items-center text-sm text-gray-600 mb-1">
                                <FiNavigation className="w-4 h-4 mr-1" />
                                {distance < 1000 ? `${distance}m` : `${(distance / 1000).toFixed(1)}km`}
                              </div>
                              {walkingTime && (
                                <div className="flex items-center text-xs text-gray-500">
                                  <FiClock className="w-3 h-3 mr-1" />
                                  {walkingTime} min walk
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{filteredDestinations.length} destination(s) found</span>
              <div className="flex items-center space-x-1">
                <span>Powered by A* Algorithm</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;

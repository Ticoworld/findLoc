import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FiSearch, FiMapPin, FiNavigation, FiMenu, FiUser, FiClock } from 'react-icons/fi';
import { findOptimalRoute, getCampusDestinations } from '../utils/googleMapsService';
import GoogleMapComponent from '../components/GoogleMapComponent';
import SearchModal from '../components/SearchModal';
import RouteInfo from '../components/RouteInfo';
import RoutePlanningPanel from '../components/RoutePlanningPanel';
import NotificationSystem from '../components/NotificationSystem';
import LocationAccuracyHelper from '../components/LocationAccuracyHelper';
import { useNotifications } from '../hooks/useNotifications';
import '../utils/apiDebug'; // Import debug utility

const ModernHome = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [destinations] = useState(getCampusDestinations());
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showLocationHelper, setShowLocationHelper] = useState(false);
  
  // Notification system
  const {
    notifications,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLocationConfirmation,
    showRouteError,
    showGeolocationError
  } = useNotifications();
  
  // Ref to prevent multiple location requests
  const locationRequestedRef = useRef(false);
  const initialLoadRef = useRef(false);

  // Enhanced location detection with multiple strategies
  const requestLocation = useCallback((isManual = false) => {
    // Prevent multiple simultaneous requests
    if (locationRequestedRef.current && !isManual) {
      console.log('🔄 Location request already in progress, skipping...');
      return;
    }
    
    locationRequestedRef.current = true;
    
    console.log(`🔍 ${isManual ? 'Manual' : 'Auto'} GPS location request started...`);
    
    if ('geolocation' in navigator) {
      console.log('📍 Requesting high-accuracy GPS location...');
      
      // Show loading notification only for manual requests
      let loadingNotificationId = null;
      if (isManual) {
        loadingNotificationId = showInfo(
          'Getting Your Location',
          'Using GPS satellites for precise positioning...',
          { duration: 0 }
        );
      }
      
      // Try watchPosition first for better accuracy (recommended by MDN)
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          locationRequestedRef.current = false; // Reset flag on success
          
          // Clear the watch after getting a good reading
          navigator.geolocation.clearWatch(watchId);
          
          // Clear loading notification
          if (loadingNotificationId) {
            removeNotification(loadingNotificationId);
          }
          
          const { latitude, longitude, accuracy } = position.coords;
          console.log('✅ High-accuracy GPS location obtained:', { 
            latitude, 
            longitude, 
            accuracy: `${accuracy}m`,
            timestamp: new Date().toISOString()
          });
          
          // Check distance from AE-FUNAI (Ebonyi State)
          const aeFunaiLat = 6.1378266;
          const aeFunaiLng = 8.1459486;
          
          // Calculate distance from AE-FUNAI
          const distance = Math.sqrt(
            Math.pow(latitude - aeFunaiLat, 2) + Math.pow(longitude - aeFunaiLng, 2)
          ) * 111000; // Convert to meters (approximate)
          
          console.log(`📏 Distance from AE-FUNAI: ${Math.round(distance)}m, Accuracy: ${Math.round(accuracy)}m`);
          
          // Determine if this looks like a real GPS reading vs IP-based
          const isLikelyGPS = accuracy < 1000; // GPS usually gives <1000m accuracy
          const isInNigeria = latitude >= 4 && latitude <= 14 && longitude >= 3 && longitude <= 15;
          const isReasonablyNearCampus = distance < 50000; // Within 50km of campus
          
          // Auto-accept only if: GPS accurate + in Nigeria + reasonably near campus + not manual
          // Always ask for confirmation if far from campus, even with good GPS
          if (isLikelyGPS && isInNigeria && isReasonablyNearCampus && !isManual) {
            setUserLocation({ lat: latitude, lng: longitude });
            console.log('✅ Auto-accepted: Good GPS near campus');
          } else if (isManual && isLikelyGPS && isReasonablyNearCampus) {
            // Manual request near campus with good GPS - accept and notify
            setUserLocation({ lat: latitude, lng: longitude });
            showSuccess(
              'GPS Location Found',
              `Precise coordinates (±${Math.round(accuracy)}m accuracy)`,
              { duration: 3000 }
            );
            
            // Warn about poor accuracy if needed
            if (accuracy > 1000) {
              showWarning(
                'GPS Accuracy Notice',
                `Location accuracy is ${Math.round(accuracy)}m. Go outdoors for better precision.`,
                { duration: 4000 }
              );
            }
          } else {
            // Always show confirmation dialog if:
            // - User is far from campus (>50km)
            // - Poor GPS accuracy (>1000m)
            // - Outside Nigeria bounds
            // - Any manual request when far from campus
            console.log('🤔 Showing location confirmation - distance:', Math.round(distance/1000) + 'km, accuracy:', Math.round(accuracy) + 'm');
            
            // Show location confirmation dialog
            showLocationConfirmation(
              distance,
              latitude,
              longitude,
              accuracy,
              () => {
                // User wants to use detected location
                setUserLocation({ lat: latitude, lng: longitude });
                showSuccess(
                  'Location Set',
                  `Using detected location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
                  { duration: 4000 }
                );
              },
              () => {
                // User wants to use campus default
                setUserLocation({ lat: 6.125396, lng: 8.142920 });
                showSuccess(
                  'Campus Location Set',
                  'Using Computer Science Department as starting point',
                  { duration: 3000 }
                );
              }
            );
          }
        },
        (error) => {
          locationRequestedRef.current = false; // Reset flag on error
          
          // Clear loading notification
          if (loadingNotificationId) {
            removeNotification(loadingNotificationId);
          }
          
          console.error('❌ Geolocation error:', error);
          
          let errorMessage = '';
          let errorTitle = 'GPS Error';
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorTitle = 'Location Permission Denied';
              errorMessage = 'Please allow location access in your browser settings for accurate GPS positioning.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorTitle = 'GPS Unavailable';
              errorMessage = 'GPS/WiFi positioning unavailable. Try moving outdoors or near a window.';
              break;
            case error.TIMEOUT:
              errorTitle = 'GPS Timeout';
              errorMessage = 'GPS request timed out. Check your device settings and try again.';
              break;
            default:
              errorMessage = 'GPS positioning failed. Using campus fallback location.';
              break;
          }
          
          console.log(`❌ ${errorTitle}: ${errorMessage}`);
          
          // Show error notification only for manual requests
          if (isManual) {
            showGeolocationError(errorMessage, () => {
              requestLocation(true);
            });
          } else {
            // For automatic requests on page load, silently use fallback
            console.log('🏫 Using Computer Science Department as fallback for auto-request');
          }
          
          // Default to Computer Science Department
          setUserLocation({ lat: 6.125396, lng: 8.142920 });
        },
        { 
          enableHighAccuracy: true,        // Use GPS instead of IP-based location
          timeout: 10000,                  // Reduced to 10 seconds as suggested by ChatGPT
          maximumAge: 0                    // Don't use cached location - get fresh GPS data
        }
      );
    } else {
      console.log('❌ Geolocation not supported');
      showError(
        'Geolocation Not Supported',
        'Your browser does not support GPS location services. Using Computer Science Department as default.',
        { duration: 6000 }
      );
      setUserLocation({ lat: 6.125396, lng: 8.142920 });
    }
  }, [showSuccess, showGeolocationError, showWarning, showError, showInfo, showLocationConfirmation, removeNotification]);

  // Get user's location on component mount (only once)
  useEffect(() => {
    // Prevent multiple location requests during initial load
    if (!initialLoadRef.current && !locationRequestedRef.current) {
      initialLoadRef.current = true;
      console.log('🚀 Initial app load - requesting GPS location...');
      requestLocation(false);
    }
  }, [requestLocation]);

  // Calculate route using Google Maps or fallback
  const calculateRoute = useCallback(async (destination) => {
    if (!userLocation || !destination) return;

    setIsLoading(true);
    try {
      console.log('🗺️ Attempting Google Maps routing...');
      const route = await findOptimalRoute(
        userLocation.lat,
        userLocation.lng,
        destination.lat,
        destination.lng
      );

      setRouteData(route);
      setSelectedDestination(destination);

      // Show success notification
      showSuccess(
        'Route Found!',
        `✨ ${route.distance}m route to ${destination.name} (${route.duration} min walk)`,
        { duration: 4000 }
      );

      // Add to recent searches
      const newSearch = { ...destination, timestamp: Date.now() };
      setRecentSearches(prev => {
        const filtered = prev.filter(item => item.name !== destination.name);
        return [newSearch, ...filtered].slice(0, 5);
      });

    } catch (error) {
      console.error('❌ Google Maps routing failed:', error);
      
      // Show user-friendly error notification
      showRouteError(error.message, () => {
        // Retry the route calculation
        calculateRoute(destination);
      });
      
      // Create fallback route for display purposes
      const fallbackRoute = {
        path: [
          { lat: userLocation.lat, lng: userLocation.lng, name: 'Start Location', type: 'start' },
          { lat: destination.lat, lng: destination.lng, name: destination.name, type: 'destination' }
        ],
        waypoints: 2,
        distance: Math.round(
          Math.sqrt(
            Math.pow((destination.lat - userLocation.lat) * 111320, 2) +
            Math.pow((destination.lng - userLocation.lng) * 111320 * Math.cos(userLocation.lat * Math.PI / 180), 2)
          )
        ),
        duration: Math.round(
          Math.sqrt(
            Math.pow((destination.lat - userLocation.lat) * 111320, 2) +
            Math.pow((destination.lng - userLocation.lng) * 111320 * Math.cos(userLocation.lat * Math.PI / 180), 2)
          ) / 80
        ), // Assuming 80m/min walking speed
        instructions: ['Walk from your location to the destination'],
        isEstimate: true
      };
      
      setRouteData(fallbackRoute);
      setSelectedDestination(destination);
    } finally {
      setIsLoading(false);
    }
  }, [userLocation, setIsLoading, setRouteData, setSelectedDestination, setRecentSearches, showRouteError, showSuccess]);

  // Handle route optimization
  const handleRouteOptimize = useCallback(async (type) => {
    if (!selectedDestination || !userLocation) return;
    
    console.log(`🔄 Optimizing route for: ${type}`);
    setIsLoading(true);
    
    try {
      // Re-calculate route with optimization preference
      await calculateRoute(selectedDestination);
    } catch (error) {
      console.error('❌ Route optimization failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDestination, userLocation, setIsLoading, calculateRoute]);

  // Set up navigation callback for map info windows
  useEffect(() => {
    window.onBuildingNavigate = (building) => {
      console.log(`🧭 Navigating to: ${building.name}`);
      calculateRoute(building);
      setIsSearchOpen(false);
    };
    
    return () => {
      window.onBuildingNavigate = null;
    };
  }, [userLocation, calculateRoute]);

  // Quick actions - Updated with real campus buildings
  const quickDestinations = [
    { name: 'Department of Computer Science/Maths & Statistics', icon: '💻', color: 'bg-blue-500' },
    { name: 'Theater Art Auditorium', icon: '🎭', color: 'bg-green-500' },
    { name: 'AE-FUNAI Female Hostel', icon: '💜', color: 'bg-purple-500' },
    { name: 'ICT Building', icon: '📱', color: 'bg-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Mobile-Optimized Header - Ultra Compact */}
      <div className={`bg-white/10 backdrop-blur-lg border-b border-white/20 transition-all duration-300 ${isMenuOpen ? 'h-auto' : 'h-12 lg:h-16'}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12 lg:h-16">
            {/* Ultra Compact Logo for Mobile */}
            <div className="flex items-center space-x-2 lg:space-x-3">
              <div className="w-7 h-7 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg lg:rounded-xl flex items-center justify-center">
                <FiNavigation className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="text-white">
                <h1 className="text-base lg:text-xl font-bold">AE-FUNAI Navigator</h1>
                <p className="text-xs text-white/70 hidden lg:block">A* Pathfinding System • Real Coordinates</p>
              </div>
            </div>

            {/* Mobile Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Search Button - Compact for Mobile */}
              <button
                onClick={() => {
                  console.log('🔍 Opening search modal...');
                  setIsSearchOpen(true);
                }}
                className="flex items-center space-x-1 lg:space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg lg:rounded-xl px-2 lg:px-4 py-1.5 lg:py-2 text-white transition-all duration-200"
              >
                <FiSearch className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="hidden sm:block text-sm">Search...</span>
              </button>

              {/* Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1.5 lg:p-2 rounded-lg lg:rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all duration-200"
              >
                <FiMenu className="w-4 h-4 lg:w-6 lg:h-6" />
              </button>
            </div>
          </div>
          
          {/* Collapsible Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden pb-3 space-y-2 border-t border-white/20 pt-3 mt-2">
              {/* Current Location - Ultra Compact */}
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                {userLocation ? (
                  <div className="text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">📍</span>
                        <span className="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded-full">GPS Active</span>
                      </div>
                      <button
                        onClick={() => setIsMenuOpen(false)}
                        className="text-white/70 hover:text-white text-lg"
                      >
                        ×
                      </button>
                    </div>
                    <p className="text-xs text-white/70 mt-1">
                      {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                    </p>
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => {
                          locationRequestedRef.current = false;
                          requestLocation(true);
                          setIsMenuOpen(false);
                        }}
                        className="text-xs bg-blue-500/80 hover:bg-blue-600/80 px-2 py-1 rounded transition-colors flex items-center space-x-1"
                      >
                        <span>🔄</span>
                        <span>GPS</span>
                      </button>
                      <button
                        onClick={() => {
                          setUserLocation({ lat: 6.125396, lng: 8.142920 });
                          showSuccess('Campus Location Set', 'Computer Science Department', { duration: 2000 });
                          setIsMenuOpen(false);
                        }}
                        className="text-xs bg-green-500/80 hover:bg-green-600/80 px-2 py-1 rounded transition-colors flex items-center space-x-1"
                      >
                        <span>🏫</span>
                        <span>Campus</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-white/70 text-sm flex items-center">
                    <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-400 border-t-transparent mr-2"></div>
                    Getting location...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile-First Layout - Map Takes 90% on Mobile */}
      <div className="relative h-[calc(100vh-3rem)] lg:h-[calc(100vh-4rem)]">
        {/* Desktop Sidebar - Hidden on Mobile */}
        <div className="hidden lg:block w-80 bg-white/10 backdrop-blur-lg border-r border-white/20 p-6 overflow-y-auto absolute left-0 top-0 bottom-0 z-10">
          {/* Current Location */}
          <div className="mb-6">
            <h2 className="text-white font-semibold mb-3 flex items-center">
              <FiMapPin className="w-5 h-5 mr-2" />
              Current Location
            </h2>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              {userLocation ? (
                <div className="text-white">
                  <p className="text-sm flex items-center">
                    📍 You are here
                    <span className="ml-2 px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                      GPS Active
                    </span>
                  </p>
                  <p className="text-xs text-white/70 mt-1">
                    {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                  </p>
                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={() => {
                        console.log('🔄 Manual GPS refresh requested');
                        locationRequestedRef.current = false;
                        requestLocation(true);
                      }}
                      className="text-xs bg-blue-500/80 hover:bg-blue-600/80 px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1"
                    >
                      <span>🔄</span>
                      <span>Refresh GPS</span>
                    </button>
                    <button
                      onClick={() => {
                        setUserLocation({ lat: 6.125396, lng: 8.142920 });
                        showSuccess(
                          'Campus Location Set',
                          'Using Computer Science Department as starting point',
                          { duration: 3000 }
                        );
                        console.log('🏫 Set to Computer Science Department');
                      }}
                      className="text-xs bg-green-500/80 hover:bg-green-600/80 px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1"
                    >
                      <span>🏫</span>
                      <span>Use Campus</span>
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <p className="text-xs text-white/50">
                      {userLocation.lat === 6.125396 && userLocation.lng === 8.142920 
                        ? '🏫 Computer Science Department (Default)' 
                        : '🛰️ GPS Location (High Accuracy)'}
                    </p>
                    <button
                      onClick={() => setShowLocationHelper(true)}
                      className="text-xs text-blue-300 hover:text-blue-200 underline"
                    >
                      Improve accuracy
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-white/70 text-sm flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent mr-2"></div>
                  🛰️ Getting GPS location...
                </div>
              )}
            </div>
          </div>

          {/* Quick Destinations */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">Quick Access</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickDestinations.map((dest) => {
                const destination = destinations.find(d => d.name === dest.name);
                return (
                  <button
                    key={dest.name}
                    onClick={() => destination && calculateRoute(destination)}
                    disabled={!userLocation || isLoading}
                    className={`${dest.color} hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl p-4 text-white font-medium transition-all duration-200 shadow-lg`}
                  >
                    <div className="text-2xl mb-1">{dest.icon}</div>
                    <div className="text-xs">{dest.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <FiClock className="w-4 h-4 mr-2" />
                Recent
              </h3>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => calculateRoute(search)}
                    disabled={!userLocation || isLoading}
                    className="w-full text-left bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg p-3 text-white transition-all duration-200"
                  >
                    <div className="font-medium text-sm">{search.name}</div>
                    <div className="text-xs text-white/70">
                      {new Date(search.timestamp).toLocaleTimeString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Route Planning Panel */}
          <RoutePlanningPanel
            routeData={routeData}
            selectedDestination={selectedDestination}
            onRouteOptimize={handleRouteOptimize}
          />
        </div>

        {/* Map Area - Full Screen on Mobile, Adjusted for Desktop */}
        <div className="absolute inset-0 lg:left-80">
          <GoogleMapComponent
            userLocation={userLocation}
            routeData={routeData}
          />

          {/* Mobile Floating Quick Actions - Positioned at Top */}
          <div className="lg:hidden absolute top-3 left-3 flex flex-wrap gap-2 max-w-[calc(100vw-6rem)]">
            {quickDestinations.map((dest) => {
              const destination = destinations.find(d => d.name === dest.name);
              return (
                <button
                  key={dest.name}
                  onClick={() => destination && calculateRoute(destination)}
                  disabled={!userLocation || isLoading}
                  className={`${dest.color} disabled:opacity-50 disabled:cursor-not-allowed w-10 h-10 rounded-lg text-white font-medium transition-all duration-200 shadow-lg hover:scale-105 backdrop-blur-sm border border-white/20 flex items-center justify-center`}
                  title={dest.name}
                >
                  <span className="text-sm">{dest.icon}</span>
                </button>
              );
            })}
          </div>

          {/* Search FAB - Positioned Above Bottom Sheet on Mobile */}
          <button
            onClick={() => {
              console.log('🔍 Opening search modal from FAB...');
              setIsSearchOpen(true);
            }}
            className="absolute bottom-24 lg:bottom-6 right-4 lg:right-6 w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full shadow-2xl flex items-center justify-center text-white transition-all duration-200 hover:scale-110 z-20"
          >
            <FiNavigation className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-30">
              <div className="bg-white rounded-xl p-4 lg:p-6 text-center mx-4">
                <div className="w-6 h-6 lg:w-8 lg:h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3 lg:mb-4"></div>
                <p className="text-gray-700 font-medium text-sm lg:text-base">Calculating optimal route...</p>
                <p className="text-gray-500 text-xs lg:text-sm mt-1">Using A* algorithm</p>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Bottom Sheet for Route Info */}
        {routeData && (
          <div className="lg:hidden absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 rounded-t-2xl shadow-2xl z-20 transform transition-transform duration-300">
            <div className="p-4">
              {/* Handle Bar */}
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-3"></div>
              
              {/* Route Summary */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-800 text-base">Route to {selectedDestination?.name}</h3>
                  <button
                    onClick={() => setRouteData(null)}
                    className="text-gray-500 hover:text-gray-700 text-xl leading-none"
                  >
                    ×
                  </button>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <span>📏</span>
                    <span>{routeData.distance}m</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>⏱️</span>
                    <span>{routeData.duration} min walk</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>📍</span>
                    <span>{routeData.waypoints} waypoints</span>
                  </div>
                </div>

                {routeData.isEstimate && (
                  <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
                    ⚠️ Estimated route - Google Maps unavailable
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        destinations={destinations}
        onSelect={(destination) => {
          calculateRoute(destination);
          setIsSearchOpen(false);
        }}
        userLocation={userLocation}
      />

      {/* Notification System */}
      <NotificationSystem
        notifications={notifications}
        onRemove={removeNotification}
      />

      {/* Location Accuracy Helper */}
      <LocationAccuracyHelper
        isOpen={showLocationHelper}
        onClose={() => setShowLocationHelper(false)}
      />
    </div>
  );
};

export default ModernHome;

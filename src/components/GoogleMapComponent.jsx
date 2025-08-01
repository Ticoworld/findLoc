import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FiMaximize2, FiMinimize2, FiLayers } from 'react-icons/fi';
import { Loader } from '@googlemaps/js-api-loader';
import { getAllCampusBuildings } from '../utils/googleMapsService';

const GoogleMapComponent = ({ userLocation, routeData }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const directionsRendererRef = useRef(null);
  const markersRef = useRef([]);

  // Google Maps API Key from environment
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDdkfFy_y0wAyyxC_ixzniD1vOyWTTvctk';

  // Get professional marker icon based on building type
  const getMarkerIcon = (type) => {
    const iconMap = {
      'building': 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" fill="#3B82F6" stroke="#ffffff" stroke-width="3"/>
          <rect x="14" y="12" width="20" height="24" rx="2" fill="white"/>
          <rect x="16" y="14" width="4" height="4" fill="#3B82F6"/>
          <rect x="22" y="14" width="4" height="4" fill="#3B82F6"/>
          <rect x="28" y="14" width="4" height="4" fill="#3B82F6"/>
          <rect x="16" y="20" width="4" height="4" fill="#3B82F6"/>
          <rect x="22" y="20" width="4" height="4" fill="#3B82F6"/>
          <rect x="28" y="20" width="4" height="4" fill="#3B82F6"/>
          <rect x="16" y="26" width="4" height="4" fill="#3B82F6"/>
          <rect x="22" y="26" width="4" height="4" fill="#3B82F6"/>
          <rect x="28" y="26" width="4" height="4" fill="#3B82F6"/>
          <rect x="20" y="30" width="8" height="6" rx="1" fill="#3B82F6"/>
        </svg>
      `),
      'hostel': 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" fill="#BE185D" stroke="#ffffff" stroke-width="3"/>
          <path d="M16 35h16v-8l-8-6-8 6v8z" fill="white"/>
          <path d="M12 27l12-9 12 9h-2v-2l-10-7.5L14 25v2h-2z" fill="white"/>
          <rect x="20" y="29" width="3" height="6" fill="#BE185D"/>
          <rect x="25" y="29" width="3" height="6" fill="#BE185D"/>
          <rect x="18" y="25" width="3" height="3" fill="#BE185D"/>
          <rect x="27" y="25" width="3" height="3" fill="#BE185D"/>
        </svg>
      `),
      'medical': 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" fill="#DC2626" stroke="#ffffff" stroke-width="3"/>
          <rect x="21" y="14" width="6" height="20" rx="1" fill="white"/>
          <rect x="14" y="21" width="20" height="6" rx="1" fill="white"/>
        </svg>
      `),
      'entrance': 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" fill="#059669" stroke="#ffffff" stroke-width="3"/>
          <rect x="14" y="16" width="20" height="20" rx="2" fill="white"/>
          <rect x="18" y="20" width="12" height="12" rx="6" fill="#059669"/>
          <rect x="22" y="24" width="4" height="8" fill="white"/>
        </svg>
      `),
      'transport': 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" fill="#F59E0B" stroke="#ffffff" stroke-width="3"/>
          <rect x="14" y="18" width="20" height="12" rx="2" fill="white"/>
          <rect x="16" y="20" width="16" height="8" rx="1" fill="#F59E0B"/>
          <circle cx="18" cy="32" r="2" fill="white"/>
          <circle cx="30" cy="32" r="2" fill="white"/>
          <rect x="16" y="22" width="4" height="4" fill="white"/>
          <rect x="20" y="22" width="4" height="4" fill="white"/>
          <rect x="24" y="22" width="4" height="4" fill="white"/>
          <rect x="28" y="22" width="4" height="4" fill="white"/>
        </svg>
      `),
      'religious': 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" fill="#7C3AED" stroke="#ffffff" stroke-width="3"/>
          <rect x="22" y="12" width="4" height="8" fill="white"/>
          <rect x="18" y="16" width="12" height="4" fill="white"/>
          <rect x="20" y="20" width="8" height="16" rx="1" fill="white"/>
          <rect x="22" y="22" width="4" height="6" fill="#7C3AED"/>
          <rect x="18" y="30" width="3" height="6" fill="#7C3AED"/>
          <rect x="27" y="30" width="3" height="6" fill="#7C3AED"/>
        </svg>
      `),
      'cultural': 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" fill="#EC4899" stroke="#ffffff" stroke-width="3"/>
          <rect x="14" y="20" width="20" height="16" rx="2" fill="white"/>
          <polygon points="14,20 24,12 34,20" fill="white"/>
          <rect x="20" y="26" width="8" height="10" rx="1" fill="#EC4899"/>
          <rect x="16" y="22" width="3" height="3" fill="#EC4899"/>
          <rect x="29" y="22" width="3" height="3" fill="#EC4899"/>
        </svg>
      `),
      'recreation': 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" fill="#10B981" stroke="#ffffff" stroke-width="3"/>
          <circle cx="24" cy="24" r="10" fill="white"/>
          <polygon points="24,16 28,22 32,20 28,28 20,28 16,20 20,22" fill="#10B981"/>
        </svg>
      `),
      'commercial': 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" fill="#F97316" stroke="#ffffff" stroke-width="3"/>
          <rect x="16" y="18" width="16" height="18" rx="2" fill="white"/>
          <rect x="18" y="20" width="12" height="4" fill="#F97316"/>
          <rect x="20" y="26" width="3" height="3" fill="#F97316"/>
          <rect x="25" y="26" width="3" height="3" fill="#F97316"/>
          <rect x="20" y="30" width="3" height="4" fill="#F97316"/>
          <rect x="25" y="30" width="3" height="4" fill="#F97316"/>
        </svg>
      `),
      'venue': 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" fill="#8B5CF6" stroke="#ffffff" stroke-width="3"/>
          <ellipse cx="24" cy="28" rx="12" ry="8" fill="white"/>
          <rect x="20" y="14" width="8" height="12" rx="4" fill="white"/>
          <rect x="22" y="16" width="4" height="8" fill="#8B5CF6"/>
        </svg>
      `),
      'default': 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" fill="#6B7280" stroke="#ffffff" stroke-width="3"/>
          <circle cx="24" cy="20" r="6" fill="white"/>
          <circle cx="24" cy="20" r="3" fill="#6B7280"/>
          <path d="M24 28c-6 0-10 4-10 8v4h20v-4c0-4-4-8-10-8z" fill="white"/>
        </svg>
      `)
    };
    
    return iconMap[type] || iconMap['default'];
  };

  // Get enhanced type label for display
  const getTypeLabel = (type) => {
    const labels = {
      'building': '🏢 Academic Building',
      'hostel': '🏠 Student Housing',
      'medical': '🏥 Medical Facility',
      'entrance': '🚪 Campus Gate',
      'transport': '🚌 Transportation Hub',
      'religious': '⛪ Religious Center',
      'cultural': '🏛️ Cultural Center',
      'recreation': '⚽ Recreation Center',
      'commercial': '🏪 Commercial Area',
      'venue': '🎪 Event Venue'
    };
    
    return labels[type] || '📍 Campus Location';
  };

  // Add campus building markers
  const addCampusMarkers = useCallback((map) => {
    const buildings = getAllCampusBuildings();
    
    // Make navigation function available globally for info windows
    window.navigateToBuilding = (name, lat, lng) => {
      console.log(`🧭 Navigation requested to: ${name}`);
      // This will trigger the parent component to calculate route
      if (window.onBuildingNavigate) {
        window.onBuildingNavigate({ name, lat, lng });
      }
      // Close all open info windows after navigation
      markersRef.current.forEach(marker => {
        if (marker.infoWindow) {
          marker.infoWindow.close();
        }
      });
    };
    
    buildings.forEach(building => {
      const marker = new google.maps.Marker({
        position: { lat: building.lat, lng: building.lng },
        map: map,
        title: building.name,
        icon: {
          url: getMarkerIcon(building.type),
          scaledSize: new google.maps.Size(40, 40),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(20, 20)
        }
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 16px; min-width: 250px; max-width: 300px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
            <div style="display: flex; align-items: center; margin-bottom: 12px;">
              <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #3B82F6, #1D4ED8); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
                <span style="font-size: 18px;">🏛️</span>
              </div>
              <h3 style="margin: 0; color: #1F2937; font-size: 16px; font-weight: 700; line-height: 1.2;">
                ${building.name}
              </h3>
            </div>
            
            <div style="background: rgba(59, 130, 246, 0.05); border-radius: 8px; padding: 12px; margin-bottom: 12px; border-left: 4px solid #3B82F6;">
              <p style="margin: 0; color: #374151; font-size: 14px; font-weight: 600;">
                ${getTypeLabel(building.type)}
              </p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
              <div style="background: #F3F4F6; border-radius: 6px; padding: 8px; text-align: center;">
                <div style="font-size: 12px; color: #6B7280; margin-bottom: 2px;">Latitude</div>
                <div style="font-size: 11px; color: #374151; font-weight: 600; font-family: monospace;">${building.lat.toFixed(6)}</div>
              </div>
              <div style="background: #F3F4F6; border-radius: 6px; padding: 8px; text-align: center;">
                <div style="font-size: 12px; color: #6B7280; margin-bottom: 2px;">Longitude</div>
                <div style="font-size: 11px; color: #374151; font-weight: 600; font-family: monospace;">${building.lng.toFixed(6)}</div>
              </div>
            </div>
            
            <div style="border-top: 1px solid #E5E7EB; padding-top: 12px;">
              <button onclick="window.navigateToBuilding && window.navigateToBuilding('${building.name}', ${building.lat}, ${building.lng})" 
                      style="width: 100%; background: linear-gradient(135deg, #3B82F6, #1D4ED8); color: white; border: none; border-radius: 8px; padding: 10px 16px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);">
                🧭 Navigate Here
              </button>
            </div>
            
            <div style="margin-top: 8px; text-align: center;">
              <span style="font-size: 10px; color: #9CA3AF; background: #F9FAFB; padding: 4px 8px; border-radius: 4px;">
                🗺️ AE-FUNAI Campus Navigator
              </span>
            </div>
          </div>
        `
      });

      marker.addListener('click', () => {
        // Close all other info windows first
        markersRef.current.forEach(m => {
          if (m.infoWindow) {
            m.infoWindow.close();
          }
        });
        infoWindow.open(map, marker);
      });

      // Store reference to info window for later cleanup
      marker.infoWindow = infoWindow;
      markersRef.current.push(marker);
    });

    console.log(`🏢 Added ${buildings.length} campus building markers`);
  }, []);

  // Initialize Google Maps
  useEffect(() => {
    let isMounted = true;
    let timeoutId;
    
    const initializeMap = async () => {
      console.log('🔄 initializeMap called, mapRef.current:', !!mapRef.current);
      
      // Check if container ref exists
      if (!mapRef.current) {
        console.log('⏳ Waiting for map container... (ref not set)');
        timeoutId = setTimeout(() => {
          if (isMounted) {
            initializeMap();
          }
        }, 100);
        return;
      }

      // Check if container has dimensions (is visible)
      const rect = mapRef.current.getBoundingClientRect();
      console.log('📏 Container dimensions:', { width: rect.width, height: rect.height });
      
      if (rect.width === 0 || rect.height === 0) {
        console.log('📐 Container has no dimensions, forcing size...');
        // Force container to have dimensions
        mapRef.current.style.width = '100%';
        mapRef.current.style.height = '100%';
        mapRef.current.style.minHeight = '400px';
        mapRef.current.style.display = 'block';
        
        timeoutId = setTimeout(() => {
          if (isMounted) {
            initializeMap();
          }
        }, 200);
        return;
      }

      try {
        console.log('🔄 Loading Google Maps API...');
        
        const loader = new Loader({
          apiKey: GOOGLE_MAPS_API_KEY,
          version: 'weekly',
          libraries: ['places', 'geometry']
        });

        await loader.load();
        
        if (!isMounted) return;

        console.log('🗺️ Creating Google Maps instance...');
        
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 6.1378266, lng: 8.1459486 }, // AE-FUNAI Front Gate
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          styles: [
            {
              featureType: 'poi.school',
              elementType: 'all',
              stylers: [{ visibility: 'on' }]
            },
            {
              featureType: 'poi.medical',
              elementType: 'all',
              stylers: [{ visibility: 'on' }]
            }
          ],
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: false
        });

        mapInstanceRef.current = map;

        // Close all info windows when clicking on the map
        map.addListener('click', () => {
          markersRef.current.forEach(marker => {
            if (marker.infoWindow) {
              marker.infoWindow.close();
            }
          });
        });
        
        // Initialize directions renderer
        directionsRendererRef.current = new google.maps.DirectionsRenderer({
          draggable: false,
          suppressMarkers: false,
          polylineOptions: {
            strokeColor: '#3B82F6',
            strokeWeight: 5,
            strokeOpacity: 0.8
          }
        });
        directionsRendererRef.current.setMap(map);

        // Add campus building markers
        addCampusMarkers(map);
        
        setIsLoaded(true);
        console.log('✅ Google Maps initialized successfully');
      } catch (error) {
        console.error('❌ Error loading Google Maps:', error);
        if (isMounted) {
          setLoadError(`Failed to load Google Maps: ${error.message}`);
          setIsLoaded(false);
        }
      }
    };

    // Wait a bit longer and try to observe when the DOM element is ready
    const checkAndStart = () => {
      console.log('🚀 Starting map initialization check...');
      if (mapRef.current) {
        console.log('✅ Map ref is available immediately');
        initializeMap();
      } else {
        console.log('⏳ Map ref not ready, waiting...');
        timeoutId = setTimeout(() => {
          if (isMounted) {
            initializeMap();
          }
        }, 300);
      }
    };

    // Use requestAnimationFrame to ensure DOM is fully rendered
    requestAnimationFrame(() => {
      if (isMounted) {
        checkAndStart();
      }
    });
    
    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [addCampusMarkers, GOOGLE_MAPS_API_KEY]);

  // Update user location marker
  useEffect(() => {
    if (!mapInstanceRef.current || !userLocation || !isLoaded) return;

    // Remove existing user marker
    if (window.userMarker) {
      window.userMarker.setMap(null);
    }

    // Add new user marker with enhanced design
    window.userMarker = new google.maps.Marker({
      position: { lat: userLocation.lat, lng: userLocation.lng },
      map: mapInstanceRef.current,
      title: 'Your Current Location',
      icon: {
        url: 'data:image/svg+xml;base64,' + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" fill="none">
            <circle cx="30" cy="30" r="28" fill="#3B82F6" stroke="#ffffff" stroke-width="4"/>
            <circle cx="30" cy="30" r="20" fill="#ffffff" opacity="0.3"/>
            <circle cx="30" cy="30" r="12" fill="#ffffff"/>
            <circle cx="30" cy="30" r="6" fill="#3B82F6"/>
            <circle cx="30" cy="30" r="2" fill="#ffffff"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(30, 30),
        anchor: new google.maps.Point(15, 15)
      },
      animation: google.maps.Animation.DROP,
      zIndex: 1000
    });

    // Center map on user location
    mapInstanceRef.current.setCenter({ lat: userLocation.lat, lng: userLocation.lng });
  }, [userLocation, isLoaded]);

  // Update route display
  useEffect(() => {
    if (!mapInstanceRef.current || !routeData || !isLoaded || !directionsRendererRef.current) return;

    try {
      // Use Google's original response if available
      if (routeData.googleResponse) {
        directionsRendererRef.current.setDirections({
          routes: [routeData.googleResponse],
          request: {
            origin: { lat: routeData.path[0].lat, lng: routeData.path[0].lng },
            destination: { lat: routeData.path[routeData.path.length - 1].lat, lng: routeData.path[routeData.path.length - 1].lng },
            travelMode: google.maps.TravelMode.WALKING
          }
        });
      } else {
        // Fallback: create route from path points
        const path = routeData.path.map(point => ({
          lat: point.lat,
          lng: point.lng
        }));

        const directionsService = new google.maps.DirectionsService();
        directionsService.route({
          origin: path[0],
          destination: path[path.length - 1],
          travelMode: google.maps.TravelMode.WALKING,
          unitSystem: google.maps.UnitSystem.METRIC
        }, (response, status) => {
          if (status === 'OK') {
            directionsRendererRef.current.setDirections(response);
          }
        });
      }

      console.log(`🗺️ Route displayed: ${routeData.distance}m, ${routeData.duration} min`);
    } catch (error) {
      console.error('❌ Error displaying route:', error);
    }
  }, [routeData, isLoaded]);

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 rounded-xl">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg max-w-md">
          <div className="text-red-500 text-4xl mb-4">❌</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Maps Loading Failed</h3>
          <p className="text-gray-600 text-sm mb-4">{loadError}</p>
          <div className="text-xs text-gray-500 mb-4">
            API Key: {GOOGLE_MAPS_API_KEY.substring(0, 20)}...
          </div>
          <button
            onClick={() => {
              setLoadError(null);
              setIsLoaded(false);
              window.location.reload();
            }}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
          >
            🔄 Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : 'w-full h-full'} bg-gray-100`}>
      {/* Map Container - Always render this */}
      <div
        ref={mapRef}
        className="w-full h-full rounded-none lg:rounded-xl overflow-hidden"
        style={{ 
          minHeight: '400px',
          height: isFullscreen ? '100vh' : '100%',
          width: '100%'
        }}
      />

      {/* Loading Overlay - Show while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl">
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading Google Maps</h3>
            <p className="text-gray-600 text-sm">Initializing professional navigation...</p>
            <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Connecting to Google Maps API</span>
            </div>
          </div>
        </div>
      )}

      {/* Professional Map Controls - Only show when loaded */}
      {isLoaded && (
        <>
          {/* Main Control Panel */}
          <div className="absolute top-4 left-4 flex flex-col space-y-3">
            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="group p-3 bg-white/95 hover:bg-white backdrop-blur-sm rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? (
                <FiMinimize2 className="w-5 h-5 text-gray-700 group-hover:text-blue-600" />
              ) : (
                <FiMaximize2 className="w-5 h-5 text-gray-700 group-hover:text-blue-600" />
              )}
            </button>

            {/* Map Type Selector */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-2">
              <div className="text-xs font-semibold text-gray-600 mb-2 px-2">Map View</div>
              <div className="flex flex-col space-y-1">
                <button
                  onClick={() => mapInstanceRef.current?.setMapTypeId(google.maps.MapTypeId.ROADMAP)}
                  className="px-3 py-2 text-xs rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
                >
                  🗺️ Street View
                </button>
                <button
                  onClick={() => mapInstanceRef.current?.setMapTypeId(google.maps.MapTypeId.SATELLITE)}
                  className="px-3 py-2 text-xs rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
                >
                  🛰️ Satellite
                </button>
                <button
                  onClick={() => mapInstanceRef.current?.setMapTypeId(google.maps.MapTypeId.HYBRID)}
                  className="px-3 py-2 text-xs rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
                >
                  🗺️ Hybrid
                </button>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-2">
              <div className="text-xs font-semibold text-gray-600 mb-2 px-2">Quick Nav</div>
              <div className="flex flex-col space-y-1">
                <button
                  onClick={() => {
                    mapInstanceRef.current?.setCenter({ lat: 6.1378266, lng: 8.1459486 });
                    mapInstanceRef.current?.setZoom(16);
                  }}
                  className="px-3 py-2 text-xs rounded-lg hover:bg-green-50 hover:text-green-600 transition-colors text-left"
                >
                  🏛️ Campus Center
                </button>
                <button
                  onClick={() => {
                    if (userLocation) {
                      mapInstanceRef.current?.setCenter({ lat: userLocation.lat, lng: userLocation.lng });
                      mapInstanceRef.current?.setZoom(18);
                    }
                  }}
                  className="px-3 py-2 text-xs rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-colors text-left"
                >
                  📍 My Location
                </button>
              </div>
            </div>
          </div>

          {/* Legend Panel */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 max-w-xs">
            <div className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
              <FiLayers className="w-4 h-4 mr-2" />
              Campus Legend
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Academic</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                <span>Housing</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Medical</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Entrance</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span>Transport</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span>Religious</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Enhanced Attribution & Stats - Only show when loaded */}
      {isLoaded && (
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 max-w-sm">
          <div className="text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-800">🗺️ AE-FUNAI Navigator</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Live</span>
            </div>
            <div className="text-gray-600">
              📍 {markersRef.current.length} Campus Locations • A* Pathfinding
            </div>
            <div className="text-gray-500 text-xs">
              Powered by Google Maps • Real-time Routing
            </div>
            {routeData && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="font-medium text-blue-600">Current Route:</div>
                <div className="text-xs text-gray-600">
                  📏 {routeData.distance}m • ⏱️ {routeData.duration} min walk
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMapComponent;

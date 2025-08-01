import React, { useEffect, useRef, useState } from 'react';
import { FiMaximize2, FiMinimize2, FiLayers } from 'react-icons/fi';

const ModernMap = ({ userLocation, routeData }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapStyle, setMapStyle] = useState('default');

  // Load Leaflet
  useEffect(() => {
    const loadLeaflet = async () => {
      if (window.L) return window.L;

      // Load CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      // Load JS
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      
      return new Promise((resolve) => {
        script.onload = () => resolve(window.L);
        document.head.appendChild(script);
      });
    };

    const initializeMap = (L) => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // Create map
      const map = L.map(mapRef.current, {
        center: [6.1378266, 8.1459486], // AE-FUNAI campus center
        zoom: 16,
        zoomControl: false, // We'll add custom controls
        attributionControl: false
      });

      // Add custom zoom control
      L.control.zoom({
        position: 'bottomright'
      }).addTo(map);

      // Map tile layers
      const tileLayers = {
        default: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }),
        satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: '© Esri'
        }),
        dark: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '© CartoDB'
        })
      };

      tileLayers[mapStyle].addTo(map);

      mapInstanceRef.current = map;
      
      // Add campus buildings as static markers
      addCampusBuildings(L, map);
    };

    loadLeaflet().then(initializeMap);
  }, [mapStyle]);

  // Add campus buildings using REAL coordinates
  const addCampusBuildings = (L, map) => {
    const campusBuildings = [
      // Real AE-FUNAI coordinates with proper icons
      { name: 'Front Gate', lat: 6.1378266, lng: 8.1459486, icon: '🚪', color: '#3B82F6' },
      { name: 'Security Officer Building', lat: 6.137497, lng: 8.145524, icon: '🏢', color: '#EF4444' },
      { name: 'Department of Computer Science/Maths & Statistics', lat: 6.125396, lng: 8.142920, icon: '�', color: '#10B981' },
      { name: 'Theater Art Auditorium', lat: 6.135108672026378, lng: 8.144373553286792, icon: '🎭', color: '#8B5CF6' },
      { name: 'AE-FUNAI Female Hostel', lat: 6.128525844301733, lng: 8.145583953719655, icon: '🏠', color: '#F59E0B' },
      { name: 'ICT Building', lat: 6.126698976719969, lng: 8.143381733833069, icon: '📱', color: '#06B6D4' },
      { name: 'AE-FUNAI Physics Lab', lat: 6.133818, lng: 8.141920, icon: '🔬', color: '#EC4899' },
      { name: 'AE-FUNAI Chemistry Lab', lat: 6.133896, lng: 8.141865, icon: '⚗️', color: '#F97316' },
      { name: 'Hon. Chike Okafor Medical Centre', lat: 6.128281, lng: 8.149163, icon: '🏥', color: '#84CC16' },
      { name: 'CBT Center', lat: 6.133791, lng: 8.141835, icon: '🖥️', color: '#A855F7' },
      { name: 'Book Shop', lat: 6.133101, lng: 8.142301, icon: '📚', color: '#F43F5E' },
      { name: 'University Auditorium', lat: 6.132478, lng: 8.140801, icon: '🎪', color: '#0EA5E9' },
      { name: 'Football Field', lat: 6.133069, lng: 8.142809, icon: '⚽', color: '#22C55E' },
      { name: 'Holy Family Chaplaincy, AE-FUNAI', lat: 6.137353964150157, lng: 8.144483511178525, icon: '⛪', color: '#FBBF24' },
    ];

    campusBuildings.forEach(building => {
      const icon = L.divIcon({
        html: `
          <div class="building-marker" style="background-color: ${building.color}">
            <span>${building.icon}</span>
          </div>
        `,
        className: 'custom-building-marker',
        iconSize: [35, 35],
        iconAnchor: [17, 17]
      });

      L.marker([building.lat, building.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div class="popup-content">
            <h3>${building.name}</h3>
            <p>Campus building</p>
          </div>
        `);
    });
  };

  // Update map when userLocation changes
  useEffect(() => {
    if (!mapInstanceRef.current || !userLocation) return;

    const L = window.L;
    
    // Remove existing user marker
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer.options && layer.options.isUserMarker) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    // Add user location marker
    const userIcon = L.divIcon({
      html: `
        <div class="user-marker">
          <div class="user-marker-inner">📍</div>
          <div class="user-marker-pulse"></div>
        </div>
      `,
      className: 'custom-user-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    L.marker([userLocation.lat, userLocation.lng], { 
      icon: userIcon,
      isUserMarker: true 
    })
      .addTo(mapInstanceRef.current)
      .bindPopup('📍 You are here');

  }, [userLocation]);

  // Update map when route changes
  useEffect(() => {
    if (!mapInstanceRef.current || !routeData) return;

    const L = window.L;
    
    // Remove existing route
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer.options && layer.options.isRoute) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    // Add route line
    const routeCoordinates = routeData.path.map(point => [point.lat, point.lng]);
    
    const routeLine = L.polyline(routeCoordinates, {
      color: '#3B82F6',
      weight: 4,
      opacity: 0.8,
      isRoute: true
    }).addTo(mapInstanceRef.current);

    // Add waypoint markers
    routeData.path.forEach((point, index) => {
      if (index === 0 || index === routeData.path.length - 1) return; // Skip start and end

      const waypointIcon = L.divIcon({
        html: `<div class="waypoint-marker">${index}</div>`,
        className: 'custom-waypoint-marker',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      L.marker([point.lat, point.lng], { 
        icon: waypointIcon,
        isRoute: true 
      })
        .addTo(mapInstanceRef.current)
        .bindPopup(point.name);
    });

    // Fit map to route
    mapInstanceRef.current.fitBounds(routeLine.getBounds(), { 
      padding: [20, 20] 
    });

  }, [routeData]);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Change map style
  const changeMapStyle = () => {
    const styles = ['default', 'satellite', 'dark'];
    const currentIndex = styles.indexOf(mapStyle);
    const nextStyle = styles[(currentIndex + 1) % styles.length];
    setMapStyle(nextStyle);
    
    if (mapInstanceRef.current) {
      // This would require reinitializing with new tiles
      // For simplicity, we'll just log the change
      console.log(`Map style changed to: ${nextStyle}`);
    }
  };

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : 'w-full h-full'} bg-gray-100`}>
      {/* Map Container */}
      <div
        ref={mapRef}
        className="w-full h-full rounded-none lg:rounded-xl overflow-hidden"
        style={{ minHeight: '400px' }}
      />

      {/* Map Controls */}
      <div className="absolute top-4 left-4 flex flex-col space-y-2">
        <button
          onClick={changeMapStyle}
          className="p-3 bg-white hover:bg-gray-50 rounded-lg shadow-lg transition-all duration-200"
          title="Change map style"
        >
          <FiLayers className="w-5 h-5 text-gray-700" />
        </button>
        
        <button
          onClick={toggleFullscreen}
          className="p-3 bg-white hover:bg-gray-50 rounded-lg shadow-lg transition-all duration-200"
          title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? (
            <FiMinimize2 className="w-5 h-5 text-gray-700" />
          ) : (
            <FiMaximize2 className="w-5 h-5 text-gray-700" />
          )}
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <h4 className="text-xs font-semibold text-gray-700 mb-2">Legend</h4>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Route</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">Buildings</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>📍</span>
            <span className="text-gray-600">Your Location</span>
          </div>
        </div>
      </div>

      {/* Map Attribution */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-500 bg-white/80 backdrop-blur-sm px-2 py-1 rounded">
        🆓 Free Maps • A* Algorithm
      </div>

      <style jsx>{`
        .building-marker {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          color: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border: 3px solid white;
        }

        .user-marker {
          position: relative;
        }

        .user-marker-inner {
          width: 30px;
          height: 30px;
          background: #3B82F6;
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          position: relative;
          z-index: 2;
        }

        .user-marker-pulse {
          position: absolute;
          top: 0;
          left: 0;
          width: 30px;
          height: 30px;
          background: #3B82F6;
          border-radius: 50%;
          animation: pulse 2s infinite;
          opacity: 0.6;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.3;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .waypoint-marker {
          width: 20px;
          height: 20px;
          background: #F59E0B;
          color: white;
          border: 2px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: bold;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .popup-content h3 {
          margin: 0 0 5px 0;
          font-size: 14px;
          font-weight: 600;
        }

        .popup-content p {
          margin: 0;
          font-size: 12px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default ModernMap;

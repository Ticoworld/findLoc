import React, { useEffect, useRef, useState } from 'react';
import { FiMaximize2, FiMinimize2, FiLayers } from 'react-icons/fi';

const ModernMapComplete = ({ userLocation, routeData }) => {
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
      
      // Add ALL campus buildings
      addAllCampusBuildings(L, map);
    };

    loadLeaflet().then(initializeMap);
  }, [mapStyle]);

  // Add ALL 44+ campus buildings with proper icons
  const addAllCampusBuildings = (L, map) => {
    const allCampusBuildings = [
      // Gates & Entry Points
      { name: 'Front Gate', lat: 6.1378266, lng: 8.1459486, icon: '🚪', color: '#3B82F6' },
      { name: 'Back Gate', lat: 6.132435, lng: 8.140433, icon: '🚪', color: '#3B82F6' },
      
      // Administrative Buildings
      { name: 'Security Officer Building', lat: 6.137497, lng: 8.145524, icon: '🛡', color: '#EF4444' },
      { name: 'SUG Office', lat: 6.132918, lng: 8.140519, icon: '🏛', color: '#8B5CF6' },
      { name: 'Works Department', lat: 6.133191, lng: 8.141284, icon: '🔧', color: '#F59E0B' },
      
      // Transportation
      { name: 'Funai Park (Bus)', lat: 6.137149, lng: 8.145532, icon: '🚌', color: '#06B6D4' },
      { name: 'Funai Park (Shuttle)', lat: 6.137131, lng: 8.145387, icon: '🚐', color: '#06B6D4' },
      
      // Religious & Cultural
      { name: 'Holy Family Chaplaincy, AE-FUNAI', lat: 6.136649, lng: 8.144593, icon: '⛪', color: '#FBBF24' },
      { name: 'Olaudah Equiano Igbo Center', lat: 6.134701, lng: 8.143127, icon: '🏛', color: '#84CC16' },
      { name: 'Igbo Center Iruka', lat: 6.134653, lng: 8.14820, icon: '🏛', color: '#84CC16' },
      
      // Academic - Arts & Theater
      { name: 'Theater Arts Auditorium', lat: 6.136750, lng: 8.144650, icon: '🎭', color: '#10B981' },
      { name: 'Fine and Applied Art Studio', lat: 6.133271, lng: 8.140869, icon: '🎨', color: '#EC4899' },
      { name: 'Department of Fine and Applied Arts', lat: 6.133452, lng: 8.143002, icon: '🎨', color: '#EC4899' },
      { name: 'Department of Mass Communication', lat: 6.132973, lng: 8.140923, icon: '📺', color: '#A855F7' },
      { name: 'Music Department', lat: 6.132906, lng: 8.140496, icon: '🎵', color: '#F43F5E' },
      
      // Academic - Science Labs
      { name: 'AE-FUNAI Physics Lab', lat: 6.133818, lng: 8.141920, icon: '🔬', color: '#0EA5E9' },
      { name: 'AE-FUNAI Chemistry Lab', lat: 6.133896, lng: 8.141865, icon: '⚗', color: '#F97316' },
      { name: 'AE-FUNAI Biology Laboratory', lat: 6.134012, lng: 8.141812, icon: '🧬', color: '#22C55E' },
      { name: 'Animal House', lat: 6.134026, lng: 8.141768, icon: '🐭', color: '#64748B' },
      { name: 'Department of Biology', lat: 6.127354, lng: 8.142937, icon: '🧬', color: '#22C55E' },
      { name: 'Department of Computer Science/Maths & Statistics', lat: 6.125396, lng: 8.142920, icon: '💻', color: '#6366F1' },
      { name: 'Physical Science Audit', lat: 6.125558, lng: 8.142620, icon: '🏫', color: '#8B5CF6' },
      
      // Academic - Social Sciences
      { name: 'Department of Psychology', lat: 6.133471, lng: 8.141609, icon: '🧠', color: '#D946EF' },
      { name: 'Department of Criminology & Political Science/Environmental Sciences', lat: 6.133380, lng: 8.141407, icon: '⚖', color: '#7C3AED' },
      { name: 'Department of Economics/Sociology', lat: 6.132963, lng: 8.142048, icon: '📊', color: '#059669' },
      { name: 'Faculty of Management Sciences', lat: 6.132162, lng: 8.140257, icon: '💼', color: '#0F172A' },
      
      // Academic Blocks
      { name: 'A Block', lat: 6.133601, lng: 8.143317, icon: '🏢', color: '#1E293B' },
      { name: 'C Block', lat: 6.133221, lng: 8.142492, icon: '🏢', color: '#1E293B' },
      { name: 'Prof Eni Njoku Block (Parents Forum)', lat: 6.127455, lng: 8.143527, icon: '🏛', color: '#7C2D12' },
      
      // Educational Support & Technology
      { name: 'CBT Center', lat: 6.133791, lng: 8.141835, icon: '🖥', color: '#2563EB' },
      { name: 'SIWES Building', lat: 6.133552, lng: 8.141688, icon: '🏭', color: '#DC2626' },
      { name: 'ICT Building', lat: 6.126698976719969, lng: 8.143381733833069, icon: '📱', color: '#0D9488' },
      { name: 'Book Shop', lat: 6.133101, lng: 8.142301, icon: '📚', color: '#7C2D12' },
      
      // Student Housing
      { name: 'AE-FUNAI Female Hostel', lat: 6.128525844301733, lng: 8.145583953719655, icon: '🏠', color: '#BE185D' },
      { name: 'Hostel C', lat: 6.128943, lng: 8.143880, icon: '🏠', color: '#BE185D' },
      { name: 'Texas Lodge', lat: 6.135483, lng: 8.143822, icon: '🏨', color: '#92400E' },
      
      // Medical Facilities
      { name: 'Hon. Chike Okafor Medical Centre', lat: 6.128281, lng: 8.149163, icon: '🏥', color: '#DC2626' },
      { name: 'X-ray Clinic', lat: 6.128693, lng: 8.148842, icon: '🩻', color: '#DC2626' },
      
      // Sports & Recreation
      { name: 'Football Field', lat: 6.133069, lng: 8.142809, icon: '⚽', color: '#16A34A' },
      { name: 'Volleyball Court', lat: 6.132576, lng: 8.141558, icon: '🏐', color: '#16A34A' },
      { name: 'University Auditorium', lat: 6.132478, lng: 8.140801, icon: '🎪', color: '#7C3AED' },
      
      // Commercial & Services
      { name: 'Nice Cool Garden Beverages and Snacks', lat: 6.133917, lng: 8.142180, icon: '🥤', color: '#059669' },
      { name: 'Funai Outlook Limited', lat: 6.132979, lng: 8.140675, icon: '🏪', color: '#0369A1' },
      { name: 'Tastia Restaurant and Bakery (Vegas)', lat: 6.128612, lng: 8.143088, icon: '🍰', color: '#EA580C' },
      { name: 'Former RC', lat: 6.135006, lng: 8.143516, icon: '🏢', color: '#64748B' },
    ];

    console.log(`🗺️ Adding ${allCampusBuildings.length} campus buildings to map`);

    allCampusBuildings.forEach(building => {
      const icon = L.divIcon({
        html: `
          <div class="building-marker-new" style="background-color: ${building.color}">
            <span>${building.icon}</span>
          </div>
        `,
        className: 'custom-building-marker-new',
        iconSize: [35, 35],
        iconAnchor: [17, 17]
      });

      L.marker([building.lat, building.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div class="popup-content-new">
            <h3>${building.name}</h3>
            <p>📍 ${building.lat.toFixed(6)}, ${building.lng.toFixed(6)}</p>
            <p>Campus Location</p>
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
        <div class="user-marker-new">
          <div class="user-marker-inner-new">📍</div>
          <div class="user-marker-pulse-new"></div>
        </div>
      `,
      className: 'custom-user-marker-new',
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

  // Update map when route changes - IMPROVED PATHFINDING DISPLAY
  useEffect(() => {
    if (!mapInstanceRef.current || !routeData) return;

    const L = window.L;
    
    // Remove existing route
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer.options && layer.options.isRoute) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    // Add route line with multiple segments for better visualization
    const routeCoordinates = routeData.path.map(point => [point.lat, point.lng]);
    
    // Main route line
    const routeLine = L.polyline(routeCoordinates, {
      color: '#3B82F6',
      weight: 5,
      opacity: 0.8,
      isRoute: true
    }).addTo(mapInstanceRef.current);

    // Add walking path effect
    const routeOutline = L.polyline(routeCoordinates, {
      color: '#FFFFFF',
      weight: 7,
      opacity: 0.6,
      isRoute: true
    }).addTo(mapInstanceRef.current);

    // Move outline behind main line
    routeOutline.bringToBack();

    // Add waypoint markers for junctions
    routeData.path.forEach((point, index) => {
      if (index === 0 || index === routeData.path.length - 1) return; // Skip start and end
      
      if (point.name && point.name.includes('Junction')) {
        const waypointIcon = L.divIcon({
          html: `<div class="waypoint-marker-new">${index}</div>`,
          className: 'custom-waypoint-marker-new',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        L.marker([point.lat, point.lng], { 
          icon: waypointIcon,
          isRoute: true 
        })
          .addTo(mapInstanceRef.current)
          .bindPopup(`${point.name} - Waypoint ${index}`);
      }
    });

    // Fit map to route with padding
    mapInstanceRef.current.fitBounds(routeLine.getBounds(), { 
      padding: [30, 30] 
    });

    console.log(`🗺️ Route displayed: ${routeData.path.length} waypoints, ${routeData.distance}m`);

  }, [routeData]);

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
          onClick={() => {
            const styles = ['default', 'satellite', 'dark'];
            const currentIndex = styles.indexOf(mapStyle);
            const nextStyle = styles[(currentIndex + 1) % styles.length];
            setMapStyle(nextStyle);
            console.log(`🗺️ Map style: ${nextStyle}`);
          }}
          className="p-3 bg-white hover:bg-gray-50 rounded-lg shadow-lg transition-all duration-200"
          title="Change map style"
        >
          <FiLayers className="w-5 h-5 text-gray-700" />
        </button>
        
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
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

      {/* Enhanced Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <h4 className="text-xs font-semibold text-gray-700 mb-2">Campus Map Legend</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">A* Route</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">Buildings</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>📍</span>
            <span className="text-gray-600">Your Location</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>🎯</span>
            <span className="text-gray-600">Destination</span>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          {routeData ? `${routeData.distance}m • ${routeData.duration} min walk` : 'Select destination for routing'}
        </div>
      </div>

      {/* Enhanced Attribution */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-500 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow">
        <div>🆓 Free Maps • A* Algorithm</div>
        <div>📍 Real AE-FUNAI Coordinates</div>
      </div>

      <style jsx>{`
        .building-marker-new {
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
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .building-marker-new:hover {
          transform: scale(1.1);
        }

        .user-marker-new {
          position: relative;
        }

        .user-marker-inner-new {
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

        .user-marker-pulse-new {
          position: absolute;
          top: 0;
          left: 0;
          width: 30px;
          height: 30px;
          background: #3B82F6;
          border-radius: 50%;
          animation: pulse-new 2s infinite;
          opacity: 0.6;
        }

        @keyframes pulse-new {
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

        .waypoint-marker-new {
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

        .popup-content-new h3 {
          margin: 0 0 8px 0;
          font-size: 14px;
          font-weight: 600;
          color: #1F2937;
        }

        .popup-content-new p {
          margin: 2px 0;
          font-size: 12px;
          color: #6B7280;
        }
      `}</style>
    </div>
  );
};

export default ModernMapComplete;

/**
 * Google Maps Service for AE-FUNAI Campus Navigation
 * Hybrid approach: Smart campus routing + Google Maps backup
 * 
 * Features:
 * - Smart campus pathfinding using building coordinates as waypoints
 * - Logical path connections between nearby buildings
 * - Google Maps fallback for detailed turn-by-turn directions
 * - Offline-capable with graceful degradation
 */

import { Loader } from '@googlemaps/js-api-loader';

// Your Google Maps API Key
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDdkfFy_y0wAyyxC_ixzniD1vOyWTTvctk';

// AE-FUNAI Campus Buildings - ALL your real coordinates
const CAMPUS_BUILDINGS = [
  // Main Campus Gates and Entry Points
  { name: 'Front Gate', lat: 6.1378266, lng: 8.1459486, type: 'entrance' },
  { name: 'Back Gate', lat: 6.132435, lng: 8.140433, type: 'entrance' },
  
  // Administrative & Service Buildings
  { name: 'Security Officer Building', lat: 6.137497, lng: 8.145524, type: 'building' },
  { name: 'SUG Office', lat: 6.132918, lng: 8.140519, type: 'building' },
  { name: 'Works Department', lat: 6.133191, lng: 8.141284, type: 'building' },
  { name: 'Funai Park (Bus)', lat: 6.137149, lng: 8.145532, type: 'transport' },
  { name: 'Funai Park (Shuttle)', lat: 6.137131, lng: 8.145387, type: 'transport' },
  
  // Religious & Cultural Centers
  { name: 'Holy Family Chaplaincy, AE-FUNAI', lat: 6.137353964150157, lng: 8.144483511178525, type: 'religious' },
  { name: 'Olaudah Equiano Igbo Center', lat: 6.134701, lng: 8.143127, type: 'cultural' },
  { name: 'Igbo Center Iruka', lat: 6.134653, lng: 8.14820, type: 'cultural' },
  
  // Academic Buildings - Arts & Theater
  { name: 'Theater Art Auditorium', lat: 6.135108672026378, lng: 8.144373553286792, type: 'building' },
  { name: 'Fine and Applied Art Studio', lat: 6.133271, lng: 8.140869, type: 'building' },
  { name: 'Department of Fine and Applied Arts', lat: 6.133452, lng: 8.143002, type: 'building' },
  { name: 'Department of Mass Communication', lat: 6.132973, lng: 8.140923, type: 'building' },
  { name: 'Music Department', lat: 6.132906, lng: 8.140496, type: 'building' },
  
  // Academic Buildings - Science
  { name: 'AE-FUNAI Physics Lab', lat: 6.133818, lng: 8.141920, type: 'building' },
  { name: 'AE-FUNAI Chemistry Lab', lat: 6.133896, lng: 8.141865, type: 'building' },
  { name: 'AE-FUNAI Biology Laboratory', lat: 6.134012, lng: 8.141812, type: 'building' },
  { name: 'Animal House', lat: 6.134026, lng: 8.141768, type: 'building' },
  { name: 'Department of Biology', lat: 6.127354, lng: 8.142937, type: 'building' },
  { name: 'Department of Computer Science/Maths & Statistics', lat: 6.125396, lng: 8.142920, type: 'building' },
  { name: 'Physical Science Audit', lat: 6.125558, lng: 8.142620, type: 'building' },
  
  // Academic Buildings - Social Sciences
  { name: 'Department of Psychology', lat: 6.133471, lng: 8.141609, type: 'building' },
  { name: 'Department of Criminology & Political Science/Environmental Sciences', lat: 6.133380, lng: 8.141407, type: 'building' },
  { name: 'Department of Economics/Sociology', lat: 6.132963, lng: 8.142048, type: 'building' },
  { name: 'Faculty of Management Sciences', lat: 6.132162, lng: 8.140257, type: 'building' },
  
  // Academic Blocks
  { name: 'A Block', lat: 6.133601, lng: 8.143317, type: 'building' },
  { name: 'C Block', lat: 6.133221, lng: 8.142492, type: 'building' },
  { name: 'Prof Eni Njoku Block (Parents Forum)', lat: 6.127455, lng: 8.143527, type: 'building' },
  
  // Educational Support & Technology
  { name: 'CBT Center', lat: 6.133791, lng: 8.141835, type: 'building' },
  { name: 'SIWES Building', lat: 6.133552, lng: 8.141688, type: 'building' },
  { name: 'ICT Building', lat: 6.126698976719969, lng: 8.143381733833069, type: 'building' },
  { name: 'Book Shop', lat: 6.133101, lng: 8.142301, type: 'building' },
  { name: 'University Library', lat: 6.125918711271787, lng: 8.14575241240812, type: 'building' },
  { name: 'Convocation Arena', lat: 6.126729446109337, lng: 8.146546346189183, type: 'venue' },
  
  // Student Housing
  { name: 'AE-FUNAI Female Hostel', lat: 6.128525844301733, lng: 8.145583953719655, type: 'hostel' },
  { name: 'Hostel C', lat: 6.128943, lng: 8.143880, type: 'hostel' },
  { name: 'Texas Lodge', lat: 6.135483, lng: 8.143822, type: 'hostel' },
  
  // Medical Facilities
  { name: 'Hon. Chike Okafor Medical Centre', lat: 6.128281, lng: 8.149163, type: 'medical' },
  { name: 'X-ray Clinic', lat: 6.128693, lng: 8.148842, type: 'medical' },
  
  // Recreation & Sports
  { name: 'Football Field', lat: 6.133069, lng: 8.142809, type: 'recreation' },
  { name: 'Volleyball Court', lat: 6.132576, lng: 8.141558, type: 'recreation' },
  { name: 'University Auditorium', lat: 6.132478, lng: 8.140801, type: 'venue' },
  
  // Commercial & Services
  { name: 'Nice Cool Garden Beverages and Snacks', lat: 6.133917, lng: 8.142180, type: 'commercial' },
  { name: 'Funai Outlook Limited', lat: 6.132979, lng: 8.140675, type: 'commercial' },
  { name: 'Tastia Restaurant and Bakery (Vegas)', lat: 6.128612, lng: 8.143088, type: 'commercial' },
  { name: 'Zenith Bank plc', lat: 6.134440338343271, lng: 8.142534048441526, type: 'commercial' },
  { name: 'Former RC', lat: 6.135006, lng: 8.143516, type: 'building' },
];

class GoogleMapsService {
  constructor() {
    this.isLoaded = false;
    this.directionsService = null;
    this.loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places', 'geometry']
    });
  }

  // Initialize Google Maps API
  async initialize() {
    try {
      if (this.isLoaded) return;

      await this.loader.load();
      this.directionsService = new google.maps.DirectionsService();
      this.isLoaded = true;
      
      console.log('🗺️ Google Maps API loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load Google Maps API:', error);
      throw error;
    }
  }

  // Smart Campus Routing - Uses building coordinates as logical waypoints
  findCampusRoute(startLat, startLng, goalLat, goalLng) {
    console.log('🎯 Finding smart campus route using building waypoints...');
    
    // Find nearest campus buildings to start and end points
    const startBuilding = this.findNearestBuilding(startLat, startLng);
    const goalBuilding = this.findNearestBuilding(goalLat, goalLng);
    
    // Create logical route through campus buildings
    const waypoints = this.createSmartWaypoints(startBuilding, goalBuilding);
    
    // Build path with realistic walking route
    const path = this.buildCampusPath(
      { lat: startLat, lng: startLng, name: 'Start Location', type: 'start' },
      waypoints,
      { lat: goalLat, lng: goalLng, name: 'Destination', type: 'destination' }
    );
    
    // Calculate total distance and estimated time
    const distance = this.calculatePathDistance(path);
    const duration = Math.round(distance / 80); // 80m/min average walking speed on campus
    
    const route = {
      path,
      waypoints: path.length,
      distance,
      duration,
      instructions: this.generateCampusInstructions(path),
      isCampusRoute: true,
      method: 'Smart Campus Routing'
    };
    
    console.log(`✅ Campus route found: ${distance}m, ${duration} min via ${waypoints.length} waypoints`);
    return route;
  }

  // Find nearest building to given coordinates
  findNearestBuilding(lat, lng) {
    let nearest = null;
    let minDistance = Infinity;
    
    CAMPUS_BUILDINGS.forEach(building => {
      const distance = this.calculateDistance(lat, lng, building.lat, building.lng);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = building;
      }
    });
    
    return nearest;
  }

  // Create smart waypoints between start and goal buildings
  createSmartWaypoints(startBuilding, goalBuilding) {
    const waypoints = [];
    
    // If start and goal are the same building, direct route
    if (startBuilding.name === goalBuilding.name) {
      return [startBuilding];
    }
    
    // Add major campus waypoints for logical routing
    const majorWaypoints = [
      // Main circulation points
      CAMPUS_BUILDINGS.find(b => b.name === 'Front Gate'),
      CAMPUS_BUILDINGS.find(b => b.name === 'Security Officer Building'),
      CAMPUS_BUILDINGS.find(b => b.name === 'Central Campus Junction') || 
        CAMPUS_BUILDINGS.find(b => b.name === 'A Block'), // Use A Block as central point
      CAMPUS_BUILDINGS.find(b => b.name === 'University Auditorium'),
    ].filter(Boolean);
    
    // Find logical intermediate waypoint
    let intermediatePoint = null;
    let minTotalDistance = Infinity;
    
    majorWaypoints.forEach(waypoint => {
      const totalDistance = 
        this.calculateDistance(startBuilding.lat, startBuilding.lng, waypoint.lat, waypoint.lng) +
        this.calculateDistance(waypoint.lat, waypoint.lng, goalBuilding.lat, goalBuilding.lng);
      
      if (totalDistance < minTotalDistance) {
        minTotalDistance = totalDistance;
        intermediatePoint = waypoint;
      }
    });
    
    // Build waypoint sequence
    waypoints.push(startBuilding);
    
    // Add intermediate waypoint if it makes sense (not too close to start/end)
    if (intermediatePoint && 
        this.calculateDistance(startBuilding.lat, startBuilding.lng, intermediatePoint.lat, intermediatePoint.lng) > 50 &&
        this.calculateDistance(intermediatePoint.lat, intermediatePoint.lng, goalBuilding.lat, goalBuilding.lng) > 50) {
      waypoints.push(intermediatePoint);
    }
    
    waypoints.push(goalBuilding);
    
    return waypoints;
  }

  // Build realistic campus path
  buildCampusPath(start, waypoints, destination) {
    const path = [start];
    
    waypoints.forEach((waypoint, index) => {
      // Add intermediate points for smoother path visualization
      if (index > 0) {
        const prevWaypoint = waypoints[index - 1];
        const intermediatePoints = this.createIntermediatePoints(
          prevWaypoint.lat, prevWaypoint.lng,
          waypoint.lat, waypoint.lng
        );
        path.push(...intermediatePoints);
      }
      
      path.push({
        lat: waypoint.lat,
        lng: waypoint.lng,
        name: waypoint.name,
        type: 'waypoint'
      });
    });
    
    // Add final destination
    if (destination.lat !== waypoints[waypoints.length - 1].lat || 
        destination.lng !== waypoints[waypoints.length - 1].lng) {
      path.push(destination);
    }
    
    return path;
  }

  // Create intermediate points for smoother path visualization
  createIntermediatePoints(lat1, lng1, lat2, lng2) {
    const points = [];
    const steps = 3; // Number of intermediate points
    
    for (let i = 1; i < steps; i++) {
      const ratio = i / steps;
      points.push({
        lat: lat1 + (lat2 - lat1) * ratio,
        lng: lng1 + (lng2 - lng1) * ratio,
        name: 'Path Point',
        type: 'path'
      });
    }
    
    return points;
  }

  // Calculate distance between two points (Haversine formula)
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }

  // Calculate total path distance
  calculatePathDistance(path) {
    let totalDistance = 0;
    
    for (let i = 1; i < path.length; i++) {
      totalDistance += this.calculateDistance(
        path[i - 1].lat, path[i - 1].lng,
        path[i].lat, path[i].lng
      );
    }
    
    return totalDistance;
  }

  // Generate campus-specific instructions
  generateCampusInstructions(path) {
    const instructions = [];
    
    for (let i = 1; i < path.length; i++) {
      const from = path[i - 1];
      const to = path[i];
      
      if (to.type === 'waypoint') {
        const direction = this.getDirection(from.lat, from.lng, to.lat, to.lng);
        instructions.push(`${i}. Head ${direction} towards ${to.name}`);
      } else if (to.type === 'destination') {
        instructions.push(`${i}. Arrive at destination`);
      }
    }
    
    return instructions;
  }

  // Get general direction between two points
  getDirection(lat1, lng1, lat2, lng2) {
    const dLat = lat2 - lat1;
    const dLng = lng2 - lng1;
    
    const angle = Math.atan2(dLng, dLat) * 180 / Math.PI;
    
    if (angle >= -22.5 && angle < 22.5) return 'north';
    if (angle >= 22.5 && angle < 67.5) return 'northeast';
    if (angle >= 67.5 && angle < 112.5) return 'east';
    if (angle >= 112.5 && angle < 157.5) return 'southeast';
    if (angle >= 157.5 || angle < -157.5) return 'south';
    if (angle >= -157.5 && angle < -112.5) return 'southwest';
    if (angle >= -112.5 && angle < -67.5) return 'west';
    if (angle >= -67.5 && angle < -22.5) return 'northwest';
    
    return 'forward';
  }

  // Hybrid routing: Try campus route first, fallback to Google Maps
  async findOptimalRoute(startLat, startLng, goalLat, goalLng) {
    console.log('🚀 Starting hybrid routing...');
    
    try {
      // First: Try smart campus routing (always works, no API needed)
      const campusRoute = this.findCampusRoute(startLat, startLng, goalLat, goalLng);
      
      // If route is short distance, campus routing is probably sufficient
      if (campusRoute.distance < 500) {
        console.log('✅ Using campus route (short distance)');
        return campusRoute;
      }
      
      // For longer routes, try Google Maps for more detailed directions
      try {
        await this.initialize();
        const googleRoute = await this.getGoogleMapsRoute(startLat, startLng, goalLat, goalLng);
        console.log('✅ Using Google Maps route (detailed routing)');
        return googleRoute;
      } catch (error) {
        console.log('⚠️ Google Maps failed, using campus route as fallback:', error.message);
        return campusRoute;
      }
      
    } catch (error) {
      console.error('❌ All routing methods failed:', error);
      throw new Error('Unable to calculate route');
    }
  }

  // Google Maps routing (extracted from original method)
  async getGoogleMapsRoute(startLat, startLng, goalLat, goalLng) {
    return new Promise((resolve, reject) => {
      const request = {
        origin: new google.maps.LatLng(startLat, startLng),
        destination: new google.maps.LatLng(goalLat, goalLng),
        travelMode: google.maps.TravelMode.WALKING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
        provideRouteAlternatives: true
      };

      this.directionsService.route(request, (response, status) => {
        if (status === 'OK') {
          const route = response.routes[0];
          const leg = route.legs[0];
          
          // Convert Google Maps route to our format
          const formattedRoute = this.formatGoogleRoute(route, leg);
          
          console.log(`✅ Google Maps route found: ${formattedRoute.distance}m, ${formattedRoute.duration} minutes`);
          resolve(formattedRoute);
        } else {
          console.error('❌ Google Directions API error:', status);
          
          // Provide specific error messages
          let errorMessage = `Google Directions API error: ${status}`;
          switch(status) {
            case 'REQUEST_DENIED':
              errorMessage += ' - API Key issue: Check billing, API restrictions, or enable Directions API';
              break;
            case 'OVER_QUERY_LIMIT':
              errorMessage += ' - Quota exceeded: Check your Google Cloud billing';
              break;
            case 'ZERO_RESULTS':
              errorMessage += ' - No route found between these locations';
              break;
            case 'INVALID_REQUEST':
              errorMessage += ' - Invalid request parameters';
              break;
          }
          
          reject(new Error(errorMessage));
        }
      });
    });
  }

  // Format Google Maps response to match our application structure
  formatGoogleRoute(route, leg) {
    const path = [];
    
    // Add detailed waypoints from Google's route
    leg.steps.forEach((step, index) => {
      // Add start point of each step
      path.push({
        lat: step.start_location.lat(),
        lng: step.start_location.lng(),
        name: index === 0 ? 'Start Location' : `Step ${index}`,
        type: 'waypoint',
        instruction: step.instructions
      });
      
      // Add intermediate points along the step for smooth curves
      if (step.path && step.path.length > 2) {
        const pathPoints = step.path.slice(1, -1); // Skip first and last
        pathPoints.forEach((point, i) => {
          if (i % 3 === 0) { // Add every 3rd point to avoid too many waypoints
            path.push({
              lat: point.lat(),
              lng: point.lng(),
              name: 'Route Point',
              type: 'path'
            });
          }
        });
      }
    });
    
    // Add final destination
    path.push({
      lat: leg.end_location.lat(),
      lng: leg.end_location.lng(),
      name: 'Destination',
      type: 'destination'
    });

    // Extract turn-by-turn instructions
    const instructions = leg.steps.map((step, index) => {
      const instruction = step.instructions.replace(/<[^>]*>/g, ''); // Remove HTML
      return `${index + 1}. ${instruction}`;
    });

    return {
      path,
      waypoints: path.length,
      distance: leg.distance.value, // meters
      duration: Math.round(leg.duration.value / 60), // minutes
      instructions,
      googleResponse: route // Keep original for advanced features
    };
  }

  // Get all campus destinations - include ALL types for comprehensive search
  getCampusDestinations() {
    return CAMPUS_BUILDINGS
      .map(building => ({
        name: building.name,
        lat: building.lat,
        lng: building.lng,
        type: building.type
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  // Get all buildings for map display
  getAllBuildings() {
    return CAMPUS_BUILDINGS;
  }
}

// Create singleton instance
const googleMapsService = new GoogleMapsService();

// Export functions for use in React components
export const findOptimalRoute = async (startLat, startLng, goalLat, goalLng) => {
  try {
    return await googleMapsService.findOptimalRoute(startLat, startLng, goalLat, goalLng);
  } catch (error) {
    console.error('🚨 Google Maps routing error:', error);
    throw error;
  }
};

export const getCampusDestinations = () => {
  return googleMapsService.getCampusDestinations();
};

export const getAllCampusBuildings = () => {
  return googleMapsService.getAllBuildings();
};

export default googleMapsService;

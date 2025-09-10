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
import { loadCampusGraph, loadCampusBuildings } from './campusGraphService';
import { computeCampusRoute } from './aStarPathfinding';
import { dataStore } from './dataStore';

// Your Google Maps API Key
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDdkfFy_y0wAyyxC_ixzniD1vOyWTTvctk';

// Buildings list is provided by campusGraphService (single source of truth)

class GoogleMapsService {
  constructor() {
    this.isLoaded = false;
    this.directionsService = null;
    this.loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places', 'geometry']
    });
  // Initialize empty; will be filled from API when available
  this._buildingsCache = [];
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
    
  // For nearest, use dynamic buildings list
  // NOTE: This method remains for legacy/visualization; A* will be used first.
  // We'll load buildings for nearest computation.
  // This function is synchronous; we rely on previously loaded buildings if needed.
  // In practice, findOptimalRoute uses A* path.
  this._buildingsCache = this._buildingsCache || [];
  this._buildingsCache.forEach(building => {
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
      this._buildingsCache.find(b => b.name === 'Front Gate'),
      this._buildingsCache.find(b => b.name === 'Security Officer Building'),
      this._buildingsCache.find(b => b.name === 'Central Campus Junction') || 
        this._buildingsCache.find(b => b.name === 'A Block'), // Use A Block as central point
      this._buildingsCache.find(b => b.name === 'University Auditorium'),
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
      // First: Try Campus A* pathfinding using the custom graph
      try {
        const graph = await loadCampusGraph();
        // Load buildings from API for search/legacy helpers
        try {
          this._buildingsCache = (await loadCampusBuildings()).map(b => ({ name: b.name, lat: b.lat, lng: b.lng, type: b.type }));
        } catch (e) {
          console.warn('Buildings load failed; A* may still work if graph loaded:', e.message);
        }

        const aStarRoute = computeCampusRoute({
          start: { lat: startLat, lng: startLng },
          goal: { lat: goalLat, lng: goalLng },
          graph,
          preferences: { speedMetersPerMin: 80 }
        });
  console.log('✅ Using Campus A* route');
  try { dataStore.saveRouteHistory({ destination: 'Custom', routeSummary: { distance: aStarRoute.distance, duration: aStarRoute.duration, method: 'Campus A*' } }); } catch { void 0; }
  return aStarRoute;
      } catch (aStarError) {
        console.log('ℹ️ Campus A* not available or failed, trying Google Maps:', aStarError.message);
      }

      // Then: try Google Maps for detailed directions
      try {
        await this.initialize();
        const googleRoute = await this.getGoogleMapsRoute(startLat, startLng, goalLat, goalLng);
  console.log('✅ Using Google Maps route (detailed routing)');
  try { dataStore.saveRouteHistory({ destination: 'Custom', routeSummary: { distance: googleRoute.distance, duration: googleRoute.duration, method: 'Google Maps' } }); } catch { void 0; }
        return googleRoute;
      } catch (error) {
        console.log('⚠️ Google Maps failed, attempting basic campus fallback:', error.message);
        // Last resort: basic heuristic campus route for visualization
        const campusFallback = this.findCampusRoute(startLat, startLng, goalLat, goalLng);
  try { dataStore.saveRouteHistory({ destination: 'Custom', routeSummary: { distance: campusFallback.distance, duration: campusFallback.duration, method: 'Smart Campus Routing' } }); } catch { void 0; }
        return campusFallback;
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
  const list = this._buildingsCache && this._buildingsCache.length ? this._buildingsCache : [];
  return list
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
  return this._buildingsCache && this._buildingsCache.length ? this._buildingsCache : [];
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

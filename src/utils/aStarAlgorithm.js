/**
 * A* Pathfinding Algorithm Implementation
 * Optimized for AE-FUNAI Campus Navigation
 * 
 * Features:
 * - Heuristic-based shortest path calculation
 * - Campus-specific distance calculations
 * - Walking time estimation
 * - Obstacle avoidance (buildings, restricted areas)
 */

class AStarNode {
  constructor(lat, lng, name = null, type = 'walkable') {
    this.lat = lat;
    this.lng = lng;
    this.name = name;
    this.type = type; // 'walkable', 'building', 'restricted'
    
    // A* specific properties
    this.g = 0; // Cost from start
    this.h = 0; // Heuristic cost to goal
    this.f = 0; // Total cost (g + h)
    this.parent = null;
    this.neighbors = [];
  }

  // Calculate distance to another node (Haversine formula)
  distanceTo(other) {
    const R = 6371000; // Earth's radius in meters
    const dLat = this.toRadians(other.lat - this.lat);
    const dLng = this.toRadians(other.lng - this.lng);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(this.lat)) * Math.cos(this.toRadians(other.lat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Heuristic function (Manhattan distance approximation for campus)
  heuristic(goal) {
    return this.distanceTo(goal);
  }
}

class CampusGraph {
  constructor() {
    this.nodes = new Map();
    this.walkingSpeed = 1.4; // meters per second (average walking speed)
    this.initializeCampusNodes();
  }

  // Initialize AE-FUNAI campus nodes with ALL REAL coordinates from your data
  initializeCampusNodes() {
    const campusLocations = [
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
      { name: 'Holy Family Chaplaincy, AE-FUNAI', lat: 6.136649, lng: 8.144593, type: 'religious' },
      { name: 'Olaudah Equiano Igbo Center', lat: 6.134701, lng: 8.143127, type: 'cultural' },
      { name: 'Igbo Center Iruka', lat: 6.134653, lng: 8.14820, type: 'cultural' },
      
      // Academic Buildings - Arts & Theater
      { name: 'Theater Arts Auditorium', lat: 6.136750, lng: 8.144650, type: 'building' },
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
      { name: 'Former RC', lat: 6.135006, lng: 8.143516, type: 'building' },
      
      // Strategic walkable junctions for realistic routing
      { name: 'Main Road Junction', lat: 6.135000, lng: 8.144000, type: 'walkable' },
      { name: 'Science Complex Junction', lat: 6.133500, lng: 8.141800, type: 'walkable' },
      { name: 'Arts Faculty Junction', lat: 6.133000, lng: 8.141500, type: 'walkable' },
      { name: 'Sports Complex Junction', lat: 6.132800, lng: 8.142000, type: 'walkable' },
      { name: 'Hostel Area Junction', lat: 6.129000, lng: 8.145000, type: 'walkable' },
      { name: 'Medical Center Junction', lat: 6.128500, lng: 8.148000, type: 'walkable' },
      { name: 'Central Campus Junction', lat: 6.133000, lng: 8.142500, type: 'walkable' },
      { name: 'Back Gate Junction', lat: 6.132500, lng: 8.140500, type: 'walkable' },
      
      // ADDITIONAL WALKWAY POINTS for comprehensive coverage
      { name: 'North Campus Walkway', lat: 6.136000, lng: 8.143500, type: 'walkable' },
      { name: 'South Campus Walkway', lat: 6.130000, lng: 8.142500, type: 'walkable' },
      { name: 'East Campus Walkway', lat: 6.133000, lng: 8.147000, type: 'walkable' },
      { name: 'West Campus Walkway', lat: 6.133000, lng: 8.140000, type: 'walkable' },
      { name: 'Theater District Junction', lat: 6.135500, lng: 8.144000, type: 'walkable' },
      { name: 'Academic Block Junction', lat: 6.133400, lng: 8.142800, type: 'walkable' },
      { name: 'Hostel Road Junction', lat: 6.129000, lng: 8.144500, type: 'walkable' },
      { name: 'Campus Center Walkway', lat: 6.132000, lng: 8.141500, type: 'walkable' },
      { name: 'Main Gate Approach', lat: 6.137500, lng: 8.145200, type: 'walkable' },
      { name: 'Laboratory Row Junction', lat: 6.133800, lng: 8.141900, type: 'walkable' },
    ];

    // Create nodes
    campusLocations.forEach(location => {
      const node = new AStarNode(location.lat, location.lng, location.name, location.type);
      this.nodes.set(location.name, node);
    });

    // Define campus connections (edges)
    this.createCampusConnections();
  }

  createCampusConnections() {
    const connections = [
      // MAIN ENTRANCE AREA - Front Gate connections
      ['Front Gate', 'Security Officer Building'],
      ['Front Gate', 'Funai Park (Bus)'],
      ['Front Gate', 'Funai Park (Shuttle)'],
      ['Front Gate', 'Main Road Junction'],
      
      // MAIN ROAD PATHWAY through campus
      ['Main Road Junction', 'Holy Family Chaplaincy, AE-FUNAI'],
      ['Main Road Junction', 'Theater Arts Auditorium'],
      ['Main Road Junction', 'Central Campus Junction'],
      
      // CENTRAL CAMPUS HUB - connects major areas
      ['Central Campus Junction', 'Science Complex Junction'],
      ['Central Campus Junction', 'Arts Faculty Junction'],
      ['Central Campus Junction', 'Sports Complex Junction'],
      ['Central Campus Junction', 'A Block'],
      ['Central Campus Junction', 'C Block'],
      
      // SCIENCE COMPLEX AREA
      ['Science Complex Junction', 'AE-FUNAI Physics Lab'],
      ['Science Complex Junction', 'AE-FUNAI Chemistry Lab'],
      ['Science Complex Junction', 'AE-FUNAI Biology Laboratory'],
      ['Science Complex Junction', 'Animal House'],
      ['Science Complex Junction', 'CBT Center'],
      ['Science Complex Junction', 'SIWES Building'],
      ['Science Complex Junction', 'Book Shop'],
      
      // ARTS & HUMANITIES AREA
      ['Arts Faculty Junction', 'Department of Psychology'],
      ['Arts Faculty Junction', 'Department of Criminology & Political Science/Environmental Sciences'],
      ['Arts Faculty Junction', 'Fine and Applied Art Studio'],
      ['Arts Faculty Junction', 'Department of Fine and Applied Arts'],
      ['Arts Faculty Junction', 'Works Department'],
      
      // BACK GATE AREA
      ['Back Gate Junction', 'Back Gate'],
      ['Back Gate Junction', 'SUG Office'],
      ['Back Gate Junction', 'Music Department'],
      ['Back Gate Junction', 'Department of Mass Communication'],
      ['Back Gate Junction', 'Faculty of Management Sciences'],
      ['Back Gate Junction', 'University Auditorium'],
      ['Back Gate Junction', 'Funai Outlook Limited'],
      
      // SPORTS & RECREATION AREA
      ['Sports Complex Junction', 'Football Field'],
      ['Sports Complex Junction', 'Volleyball Court'],
      ['Sports Complex Junction', 'Department of Economics/Sociology'],
      ['Sports Complex Junction', 'Nice Cool Garden Beverages and Snacks'],
      
      // HOSTEL AREA - separate cluster
      ['Hostel Area Junction', 'AE-FUNAI Female Hostel'],
      ['Hostel Area Junction', 'Hostel C'],
      ['Hostel Area Junction', 'ICT Building'],
      ['Hostel Area Junction', 'Tastia Restaurant and Bakery (Vegas)'],
      ['Hostel Area Junction', 'Prof Eni Njoku Block (Parents Forum)'],
      ['Hostel Area Junction', 'Department of Biology'],
      ['Hostel Area Junction', 'Department of Computer Science/Maths & Statistics'],
      ['Hostel Area Junction', 'Physical Science Audit'],
      
      // MEDICAL AREA
      ['Medical Center Junction', 'Hon. Chike Okafor Medical Centre'],
      ['Medical Center Junction', 'X-ray Clinic'],
      ['Medical Center Junction', 'Igbo Center Iruka'],
      
      // CONNECTING MAJOR JUNCTIONS (main campus pathways)
      ['Main Road Junction', 'Central Campus Junction'],
      ['Central Campus Junction', 'Arts Faculty Junction'],
      ['Central Campus Junction', 'Science Complex Junction'],
      ['Arts Faculty Junction', 'Back Gate Junction'],
      ['Science Complex Junction', 'Sports Complex Junction'],
      ['Central Campus Junction', 'Hostel Area Junction'],
      ['Hostel Area Junction', 'Medical Center Junction'],
      
      // ENHANCED WALKWAY NETWORK - creates realistic campus paths
      ['Main Gate Approach', 'Main Road Junction'],
      ['North Campus Walkway', 'Main Road Junction'],
      ['North Campus Walkway', 'Theater District Junction'],
      ['Theater District Junction', 'Central Campus Junction'],
      ['Academic Block Junction', 'Central Campus Junction'],
      ['Laboratory Row Junction', 'Science Complex Junction'],
      ['Campus Center Walkway', 'Arts Faculty Junction'],
      ['West Campus Walkway', 'Back Gate Junction'],
      ['East Campus Walkway', 'Hostel Area Junction'],
      ['South Campus Walkway', 'Hostel Road Junction'],
      ['Hostel Road Junction', 'Hostel Area Junction'],
      
      // INTER-WALKWAY CONNECTIONS for alternate routes
      ['North Campus Walkway', 'East Campus Walkway'],
      ['South Campus Walkway', 'West Campus Walkway'],
      ['Academic Block Junction', 'Laboratory Row Junction'],
      ['Campus Center Walkway', 'South Campus Walkway'],
      ['Theater District Junction', 'Academic Block Junction'],
      
      // THEATER & CULTURAL AREA
      ['Theater Arts Auditorium', 'Texas Lodge'],
      ['Theater Arts Auditorium', 'Former RC'],
      ['Theater Arts Auditorium', 'Olaudah Equiano Igbo Center'],
      
      // DIRECT CONNECTIONS for close buildings
      ['AE-FUNAI Physics Lab', 'AE-FUNAI Chemistry Lab'],
      ['AE-FUNAI Chemistry Lab', 'AE-FUNAI Biology Laboratory'],
      ['AE-FUNAI Biology Laboratory', 'Animal House'],
      ['CBT Center', 'SIWES Building'],
      ['A Block', 'C Block'],
      ['Department of Fine and Applied Arts', 'Fine and Applied Art Studio'],
      ['Department of Psychology', 'Department of Criminology & Political Science/Environmental Sciences'],
      ['SUG Office', 'Music Department'],
      ['Football Field', 'Volleyball Court'],
      ['Hon. Chike Okafor Medical Centre', 'X-ray Clinic'],
      ['Department of Biology', 'Department of Computer Science/Maths & Statistics'],
      ['Department of Computer Science/Maths & Statistics', 'Physical Science Audit'],
      
      // ALTERNATE ROUTES for flexibility
      ['Security Officer Building', 'Theater Arts Auditorium'],
      ['Holy Family Chaplaincy, AE-FUNAI', 'Central Campus Junction'],
      ['Back Gate Junction', 'Sports Complex Junction'],
      ['Science Complex Junction', 'Arts Faculty Junction'],
      ['AE-FUNAI Female Hostel', 'Medical Center Junction'],
    ];

    // Create bidirectional connections
    connections.forEach(([from, to]) => {
      const fromNode = this.nodes.get(from);
      const toNode = this.nodes.get(to);
      
      if (fromNode && toNode) {
        fromNode.neighbors.push(toNode);
        toNode.neighbors.push(fromNode);
      }
    });
  }

  // Find the closest node to given coordinates
  findClosestNode(lat, lng) {
    let closest = null;
    let minDistance = Infinity;

    for (const node of this.nodes.values()) {
      const tempNode = new AStarNode(lat, lng);
      const distance = tempNode.distanceTo(node);
      
      if (distance < minDistance) {
        minDistance = distance;
        closest = node;
      }
    }

    return closest;
  }

  // A* pathfinding algorithm
  findPath(startLat, startLng, goalLat, goalLng) {
    console.log(`🎯 A* Pathfinding: From (${startLat}, ${startLng}) to (${goalLat}, ${goalLng})`);
    
    const startNode = this.findClosestNode(startLat, startLng);
    const goalNode = this.findClosestNode(goalLat, goalLng);

    if (!startNode || !goalNode) {
      throw new Error('Cannot find valid start or goal nodes');
    }

    console.log(`📍 Route: ${startNode.name} → ${goalNode.name}`);

    // A* algorithm implementation
    const openSet = [startNode];
    const closedSet = new Set();

    // Reset all nodes
    for (const node of this.nodes.values()) {
      node.g = Infinity;
      node.h = 0;
      node.f = Infinity;
      node.parent = null;
    }

    startNode.g = 0;
    startNode.h = startNode.heuristic(goalNode);
    startNode.f = startNode.g + startNode.h;

    while (openSet.length > 0) {
      // Find node with lowest f score
      let current = openSet[0];
      let currentIndex = 0;

      for (let i = 1; i < openSet.length; i++) {
        if (openSet[i].f < current.f) {
          current = openSet[i];
          currentIndex = i;
        }
      }

      // Move current from open to closed
      openSet.splice(currentIndex, 1);
      closedSet.add(current);

      // Goal reached
      if (current === goalNode) {
        return this.reconstructPath(current, startLat, startLng, goalLat, goalLng);
      }

      // Check all neighbors
      for (const neighbor of current.neighbors) {
        if (closedSet.has(neighbor) || neighbor.type === 'restricted') {
          continue;
        }

        const tentativeG = current.g + current.distanceTo(neighbor);

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        } else if (tentativeG >= neighbor.g) {
          continue;
        }

        neighbor.parent = current;
        neighbor.g = tentativeG;
        neighbor.h = neighbor.heuristic(goalNode);
        neighbor.f = neighbor.g + neighbor.h;
      }
    }

    throw new Error('No path found between the specified locations');
  }

  // Helper method for distance calculation
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000; // Earth's radius in meters
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Enhanced method to create realistic walkable paths
  getWalkableConnection(fromLat, fromLng, toPoint) {
    // Find the nearest junction/walkway points to create realistic paths
    const nearbyJunctions = Array.from(this.nodes.values())
      .filter(node => node.type === 'walkable')
      .sort((a, b) => {
        const distA = this.calculateDistance(fromLat, fromLng, a.lat, a.lng);
        const distB = this.calculateDistance(fromLat, fromLng, b.lat, b.lng);
        return distA - distB;
      });

    if (nearbyJunctions.length > 0) {
      const nearestJunction = nearbyJunctions[0];
      const distToJunction = this.calculateDistance(fromLat, fromLng, nearestJunction.lat, nearestJunction.lng);
      
      // If junction is close, route through it
      if (distToJunction < 100) { // Within 100 meters
        return {
          lat: nearestJunction.lat,
          lng: nearestJunction.lng,
          name: 'Campus Walkway via ' + nearestJunction.name,
          type: 'walkway'
        };
      }
    }
    
    // Fallback: Create intermediate point along campus grid
    const deltaLat = toPoint.lat - fromLat;
    const deltaLng = toPoint.lng - fromLng;
    
    // Follow L-shaped path (like walking along roads)
    const useHorizontalFirst = Math.abs(deltaLng) > Math.abs(deltaLat);
    
    if (useHorizontalFirst) {
      // Go horizontal first, then vertical
      return {
        lat: fromLat,
        lng: fromLng + (deltaLng * 0.7), // 70% of horizontal distance
        name: 'Campus Road (Horizontal)',
        type: 'walkway'
      };
    } else {
      // Go vertical first, then horizontal  
      return {
        lat: fromLat + (deltaLat * 0.7), // 70% of vertical distance
        lng: fromLng,
        name: 'Campus Road (Vertical)', 
        type: 'walkway'
      };
    }
  }

  // Reconstruct the path from goal to start - FIXED WALKABLE PATHS
  reconstructPath(goalNode, startLat, startLng, goalLat, goalLng) {
    const path = [];
    let current = goalNode;

    // Build path from goal to start through actual junctions
    while (current) {
      path.unshift({
        lat: current.lat,
        lng: current.lng,
        name: current.name,
        type: current.type
      });
      current = current.parent;
    }

    // FIXED: Only add start/end points, let the junctions handle the routing
    if (path.length > 0) {
      // Add actual start as first point
      path.unshift({
        lat: startLat,
        lng: startLng,
        name: 'Start Location',
        type: 'start'
      });

      // Add actual destination as last point
      path.push({
        lat: goalLat,
        lng: goalLng,
        name: 'Destination',
        type: 'destination'
      });
    }

    // Calculate route statistics
    const routeStats = this.calculateRouteStats(path);

    console.log(`✅ Path found: ${path.length} waypoints, ${routeStats.distance}m, ${routeStats.duration} minutes`);

    return {
      path,
      waypoints: path.length,
      distance: routeStats.distance,
      duration: routeStats.duration,
      instructions: this.generateInstructions(path)
    };
  }

  // Calculate route statistics
  calculateRouteStats(path) {
    let totalDistance = 0;

    for (let i = 0; i < path.length - 1; i++) {
      const current = new AStarNode(path[i].lat, path[i].lng);
      const next = new AStarNode(path[i + 1].lat, path[i + 1].lng);
      totalDistance += current.distanceTo(next);
    }

    const duration = Math.round(totalDistance / this.walkingSpeed / 60); // minutes

    return {
      distance: Math.round(totalDistance),
      duration: Math.max(1, duration) // At least 1 minute
    };
  }

  // Generate turn-by-turn instructions
  generateInstructions(path) {
    const instructions = [];

    for (let i = 0; i < path.length; i++) {
      const current = path[i];
      
      if (i === 0) {
        instructions.push(`🚀 Start at ${current.name}`);
      } else if (i === path.length - 1) {
        instructions.push(`🎯 Arrive at ${current.name}`);
      } else {
        if (current.name.includes('Junction')) {
          instructions.push(`➡️ Continue through ${current.name}`);
        } else {
          instructions.push(`🚶‍♂️ Walk past ${current.name}`);
        }
      }
    }

    return instructions;
  }

  // Get all available destinations
  getDestinations() {
    return Array.from(this.nodes.values())
      .filter(node => node.type === 'building' || node.type === 'hostel')
      .map(node => ({
        name: node.name,
        lat: node.lat,
        lng: node.lng,
        type: node.type
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}

// Export for use in React components
export { CampusGraph, AStarNode };

// Example usage:
export const findOptimalRoute = (startLat, startLng, goalLat, goalLng) => {
  try {
    const graph = new CampusGraph();
    return graph.findPath(startLat, startLng, goalLat, goalLng);
  } catch (error) {
    console.error('A* Pathfinding Error:', error);
    throw error;
  }
};

export const getCampusDestinations = () => {
  const graph = new CampusGraph();
  return graph.getDestinations();
};

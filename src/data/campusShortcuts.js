/**
 * Campus Graph seed data (nodes + edges) and full Buildings list.
 *
 * Notes:
 * - Buildings are exported as-is for UI markers and search.
 * - Graph nodes include buildings and a few example waypoints.
 * - Edges model walkable paths and shortcuts with weights (meters).
 * - Owners can extend nodes/edges over time without code changes.
 */

// Full buildings list (moved from googleMapsService for single source of truth)
export const CAMPUS_BUILDINGS = [
  // Main Campus Gates and Entry Points
  { id: 'front_gate', name: 'Front Gate', lat: 6.1378266, lng: 8.1459486, type: 'entrance' },
  { id: 'back_gate', name: 'Back Gate', lat: 6.132435, lng: 8.140433, type: 'entrance' },

  // Administrative & Service Buildings
  { id: 'security_office', name: 'Security Officer Building', lat: 6.137497, lng: 8.145524, type: 'building' },
  { id: 'sug_office', name: 'SUG Office', lat: 6.132918, lng: 8.140519, type: 'building' },
  { id: 'works_dept', name: 'Works Department', lat: 6.133191, lng: 8.141284, type: 'building' },
  { id: 'funai_park_bus', name: 'Funai Park (Bus)', lat: 6.137149, lng: 8.145532, type: 'transport' },
  { id: 'funai_park_shuttle', name: 'Funai Park (Shuttle)', lat: 6.137131, lng: 8.145387, type: 'transport' },

  // Religious & Cultural Centers
  { id: 'chaplaincy', name: 'Holy Family Chaplaincy, AE-FUNAI', lat: 6.137353964150157, lng: 8.144483511178525, type: 'religious' },
  { id: 'igbo_center', name: 'Olaudah Equiano Igbo Center', lat: 6.134701, lng: 8.143127, type: 'cultural' },
  { id: 'igbo_center_iruka', name: 'Igbo Center Iruka', lat: 6.134653, lng: 8.1482, type: 'cultural' },

  // Academic Buildings - Arts & Theater
  { id: 'theatre_auditorium', name: 'Theater Art Auditorium', lat: 6.135108672026378, lng: 8.144373553286792, type: 'building' },
  { id: 'fine_applied_studio', name: 'Fine and Applied Art Studio', lat: 6.133271, lng: 8.140869, type: 'building' },
  { id: 'dept_fine_applied', name: 'Department of Fine and Applied Arts', lat: 6.133452, lng: 8.143002, type: 'building' },
  { id: 'dept_mass_comm', name: 'Department of Mass Communication', lat: 6.132973, lng: 8.140923, type: 'building' },
  { id: 'music_dept', name: 'Music Department', lat: 6.132906, lng: 8.140496, type: 'building' },

  // Academic Buildings - Science
  { id: 'physics_lab', name: 'AE-FUNAI Physics Lab', lat: 6.133818, lng: 8.14192, type: 'building' },
  { id: 'chemistry_lab', name: 'AE-FUNAI Chemistry Lab', lat: 6.133896, lng: 8.141865, type: 'building' },
  { id: 'biology_lab', name: 'AE-FUNAI Biology Laboratory', lat: 6.134012, lng: 8.141812, type: 'building' },
  { id: 'animal_house', name: 'Animal House', lat: 6.134026, lng: 8.141768, type: 'building' },
  { id: 'dept_biology', name: 'Department of Biology', lat: 6.127354, lng: 8.142937, type: 'building' },
  { id: 'dept_csc_maths_stats', name: 'Department of Computer Science/Maths & Statistics', lat: 6.125396, lng: 8.14292, type: 'building' },
  { id: 'physical_science_audit', name: 'Physical Science Audit', lat: 6.125558, lng: 8.14262, type: 'building' },

  // Academic Buildings - Social Sciences
  { id: 'dept_psych', name: 'Department of Psychology', lat: 6.133471, lng: 8.141609, type: 'building' },
  { id: 'dept_criminology_env', name: 'Department of Criminology & Political Science/Environmental Sciences', lat: 6.13338, lng: 8.141407, type: 'building' },
  { id: 'dept_economics_sociology', name: 'Department of Economics/Sociology', lat: 6.132963, lng: 8.142048, type: 'building' },
  { id: 'faculty_mgmt_sciences', name: 'Faculty of Management Sciences', lat: 6.132162, lng: 8.140257, type: 'building' },

  // Academic Blocks
  { id: 'a_block', name: 'A Block', lat: 6.133601, lng: 8.143317, type: 'building' },
  { id: 'c_block', name: 'C Block', lat: 6.133221, lng: 8.142492, type: 'building' },
  { id: 'eni_njoku_block', name: 'Prof Eni Njoku Block (Parents Forum)', lat: 6.127455, lng: 8.143527, type: 'building' },

  // Educational Support & Technology
  { id: 'cbt_center', name: 'CBT Center', lat: 6.133791, lng: 8.141835, type: 'building' },
  { id: 'siwes_building', name: 'SIWES Building', lat: 6.133552, lng: 8.141688, type: 'building' },
  { id: 'ict_building', name: 'ICT Building', lat: 6.126698976719969, lng: 8.143381733833069, type: 'building' },
  { id: 'book_shop', name: 'Book Shop', lat: 6.133101, lng: 8.142301, type: 'building' },
  { id: 'university_library', name: 'University Library', lat: 6.125918711271787, lng: 8.14575241240812, type: 'building' },
  { id: 'convocation_arena', name: 'Convocation Arena', lat: 6.126729446109337, lng: 8.146546346189183, type: 'venue' },

  // Student Housing
  { id: 'female_hostel', name: 'AE-FUNAI Female Hostel', lat: 6.128525844301733, lng: 8.145583953719655, type: 'hostel' },
  { id: 'hostel_c', name: 'Hostel C', lat: 6.128943, lng: 8.14388, type: 'hostel' },
  { id: 'texas_lodge', name: 'Texas Lodge', lat: 6.135483, lng: 8.143822, type: 'hostel' },

  // Medical Facilities
  { id: 'medical_centre', name: 'Hon. Chike Okafor Medical Centre', lat: 6.128281, lng: 8.149163, type: 'medical' },
  { id: 'xray_clinic', name: 'X-ray Clinic', lat: 6.128693, lng: 8.148842, type: 'medical' },

  // Recreation & Sports
  { id: 'football_field', name: 'Football Field', lat: 6.133069, lng: 8.142809, type: 'recreation' },
  { id: 'volleyball_court', name: 'Volleyball Court', lat: 6.132576, lng: 8.141558, type: 'recreation' },
  { id: 'university_auditorium', name: 'University Auditorium', lat: 6.132478, lng: 8.140801, type: 'venue' },

  // Commercial & Services
  { id: 'nice_cool_garden', name: 'Nice Cool Garden Beverages and Snacks', lat: 6.133917, lng: 8.14218, type: 'commercial' },
  { id: 'funai_outlook', name: 'Funai Outlook Limited', lat: 6.132979, lng: 8.140675, type: 'commercial' },
  { id: 'tastia_restaurant', name: 'Tastia Restaurant and Bakery (Vegas)', lat: 6.128612, lng: 8.143088, type: 'commercial' },
  { id: 'zenith_bank', name: 'Zenith Bank plc', lat: 6.134440338343271, lng: 8.142534048441526, type: 'commercial' },
  { id: 'former_rc', name: 'Former RC', lat: 6.135006, lng: 8.143516, type: 'building' }
];

// Seed graph: nodes (including buildings + a few shared waypoints) and edges.
// Owners can extend these freely; IDs must be unique.
export const CAMPUS_GRAPH = {
  version: '1.0.0',
  // Start with buildings as nodes
  nodes: [
    ...CAMPUS_BUILDINGS.map(b => ({
      id: b.id,
      name: b.name,
      lat: b.lat,
      lng: b.lng,
      type: b.type || 'building'
    })),
    // Example intermediate waypoints/intersections for better routing
    { id: 'main_junction', name: 'Main Junction', lat: 6.1339, lng: 8.1425, type: 'intersection' },
    { id: 'walkway_north', name: 'North Walkway', lat: 6.1346, lng: 8.1436, type: 'waypoint' },
    { id: 'walkway_south', name: 'South Walkway', lat: 6.1262, lng: 8.1436, type: 'waypoint' }
  ],
  edges: [
    // Sample formal paths
    { id: 'e1', from: 'front_gate', to: 'security_office', bidirectional: true },
    { id: 'e2', from: 'security_office', to: 'funai_park_bus', bidirectional: true },
    { id: 'e3', from: 'security_office', to: 'walkway_north', bidirectional: true },
    { id: 'e4', from: 'walkway_north', to: 'a_block', bidirectional: true },
    { id: 'e5', from: 'a_block', to: 'c_block', bidirectional: true },
    { id: 'e6', from: 'c_block', to: 'cbt_center', bidirectional: true },
    { id: 'e7', from: 'cbt_center', to: 'siwes_building', bidirectional: true },
    { id: 'e8', from: 'cbt_center', to: 'physics_lab', bidirectional: true },
    { id: 'e9', from: 'cbt_center', to: 'book_shop', bidirectional: true },
    { id: 'e10', from: 'book_shop', to: 'university_auditorium', bidirectional: true },
    { id: 'e11', from: 'ict_building', to: 'university_library', bidirectional: true },
    { id: 'e12', from: 'ict_building', to: 'walkway_south', bidirectional: true },
    { id: 'e13', from: 'walkway_south', to: 'eni_njoku_block', bidirectional: true },

    // Sample shortcut paths (flagged)
    { id: 's1', from: 'front_gate', to: 'a_block', bidirectional: true, attributes: { shortcut: true, surface: 'dirt' } },
    { id: 's2', from: 'a_block', to: 'cbt_center', bidirectional: true, attributes: { shortcut: true, surface: 'paved' } },
    { id: 's3', from: 'c_block', to: 'female_hostel', bidirectional: true, attributes: { shortcut: true, lit: true } },
    { id: 's4', from: 'book_shop', to: 'zenith_bank', bidirectional: true, attributes: { shortcut: true, covered: false } }
  ]
};

export const getCampusGraph = () => CAMPUS_GRAPH;
export const getCampusBuildings = () => CAMPUS_BUILDINGS;

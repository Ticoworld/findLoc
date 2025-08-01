// Backward compatibility file for search functionality
// This imports from the main locs.js and reformats for existing components

import { campusLocations } from './locs.js';

// Flatten all campus locations into the old format
const getAllLocationsFlat = () => {
  const allLocations = [];
  
  // Iterate through all categories in campusLocations
  Object.values(campusLocations).forEach(category => {
    if (Array.isArray(category)) {
      allLocations.push(...category);
    }
  });
  
  return allLocations;
};

// Export in the old format that search component expects
export const places = {
  lodges: [
    {
      name: 'Texas Lodge',
      lat: 6.135483,
      lng: 8.143822,
      category: 'lodge'
    }
  ],
  
  PermSite: [
    {
      name: 'ICT Building',
      lat: 6.126698976719969,
      lng: 8.143381733833069,
      category: 'permanent'
    },
    {
      name: 'AE-FUNAI Female Hostel',
      lat: 6.128525844301733,
      lng: 8.145583953719655,
      category: 'permanent'
    },
    {
      name: 'Olaudah Equiano Igbo Center',
      lat: 6.134701,
      lng: 8.143127,
      category: 'permanent'
    },
    {
      name: 'Igbo Center Iruka',
      lat: 6.134653,
      lng: 8.14820,
      category: 'permanent'
    }
  ],
  
  TempSite: [
    {
      name: 'Holy Family Chaplaincy, AE-FUNAI',
      lat: 6.137353964150157,
      lng: 8.144483511178525,
      category: 'temporary'
    },
    {
      name: 'Zenith Bank plc',
      lat: 6.134440338343271,
      lng: 8.142534048441526,
      category: 'temporary'
    }
  ],
  
  admin: getAllLocationsFlat()
};

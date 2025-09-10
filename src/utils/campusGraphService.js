/**
 * Campus Graph Service
 * - Provides the campus graph from local seed data for now
 * - Ready to swap to MongoDB/API in the future without changing callers
 */

import { getCampusGraph, getCampusBuildings } from '../data/campusShortcuts';
import { apiGet } from './apiClient';

const HAS_API = !!import.meta.env.VITE_API_BASE_URL;

export async function loadCampusGraph() {
  if (HAS_API) {
    try {
      const data = await apiGet('/graph');
      // Expecting { nodes, edges }
      return { version: 'api', nodes: data.nodes || [], edges: data.edges || [] };
    } catch {
      // fallback to local seed
    }
  }
  return getCampusGraph();
}

export async function loadCampusBuildings() {
  if (HAS_API) {
    try {
      const g = await loadCampusGraph();
      return (g.nodes || []).filter(n => n.type === 'building').map(n => ({ name: n.name, lat: n.lat, lng: n.lng, type: n.type }));
    } catch {
      // ignore
    }
  }
  return getCampusBuildings();
}

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
    } catch (e) {
      // If unauthorized, propagate error for auth guard
      if (/401|403/.test(String(e))) throw e;
      // fallback to local seed when API unreachable
    }
  }
  return getCampusGraph();
}

export async function loadCampusBuildings() {
  if (HAS_API) {
    try {
      const g = await loadCampusGraph();
      const HIDE = new Set(['waypoint', 'intersection', 'path']);
      return (g.nodes || [])
        .filter(n => typeof n.lat === 'number' && typeof n.lng === 'number')
        .filter(n => !HIDE.has((n.type || '').toLowerCase()))
        .map(n => ({ name: n.name, lat: n.lat, lng: n.lng, type: n.type || 'building' }));
    } catch (e) {
      // If unauthorized, rethrow so callers can show login
      if (/401|403/.test(String(e))) throw e;
      // else ignore and fall back to seed
    }
  }
  return getCampusBuildings();
}

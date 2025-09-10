/**
 * Data Store Abstraction
 * - LocalStorage-based stub for now
 * - Ready to swap to MongoDB/API without changing callers
 */

const KEYS = {
  USER: 'findloc.user',
  PREFS: 'findloc.prefs',
  ROUTE_HISTORY: 'findloc.routeHistory',
  GRAPH: 'findloc.graphOverride'
};

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const dataStore = {
  getUser() {
    return loadJSON(KEYS.USER, null);
  },
  saveUser(user) {
    saveJSON(KEYS.USER, user);
  },
  getPreferences() {
    return loadJSON(KEYS.PREFS, { avoidDirt: false, preferLit: false, avoidStairs: false, speedMetersPerMin: 80 });
  },
  savePreferences(prefs) {
    saveJSON(KEYS.PREFS, prefs);
  },
  saveRouteHistory(entry) {
    const list = loadJSON(KEYS.ROUTE_HISTORY, []);
    list.unshift({ ...entry, at: Date.now() });
    saveJSON(KEYS.ROUTE_HISTORY, list.slice(0, 50));
  },
  getRouteHistory() {
    return loadJSON(KEYS.ROUTE_HISTORY, []);
  },
  getGraphOverride() {
    return loadJSON(KEYS.GRAPH, null);
  },
  setGraphOverride(graph) {
    saveJSON(KEYS.GRAPH, graph);
  }
};

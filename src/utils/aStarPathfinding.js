/**
 * A* Pathfinding for Campus Graph
 * - Works with nodes/edges provided by campusGraphService
 * - Supports weighted edges and user preference adjustments
 * - Returns route in app-compatible format
 */

// Haversine distance in meters
function haversine(a, b) {
	const R = 6371000;
	const dLat = (b.lat - a.lat) * Math.PI / 180;
	const dLng = (b.lng - a.lng) * Math.PI / 180;
	const la1 = a.lat * Math.PI / 180;
	const la2 = b.lat * Math.PI / 180;
	const sinDLat = Math.sin(dLat / 2);
	const sinDLng = Math.sin(dLng / 2);
	const c = sinDLat * sinDLat + Math.cos(la1) * Math.cos(la2) * sinDLng * sinDLng;
	const d = 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c));
	return Math.round(R * d);
}

function nearestNodeId(point, nodes) {
	let best = null;
	let min = Infinity;
	for (const n of nodes) {
		const d = haversine(point, n);
		if (d < min) { min = d; best = n.id; }
	}
	return best;
}

function buildAdjacency(nodes, edges, preferences = {}) {
	const idToNode = new Map(nodes.map(n => [n.id, n]));
	const adj = new Map();
	const weightMultiplier = (attr = {}) => {
		let m = 1;
		if (preferences.avoidDirt && attr.surface === 'dirt') m *= 1.3;
		if (preferences.preferLit && attr.lit === true) m *= 0.9;
		if (preferences.avoidStairs && attr.stairs) m *= 2.0;
		if (attr.shortcut) m *= 0.95; // slight preference for shortcuts by default
		return m;
	};

	const cost = (fromId, toId, attr) => {
		const a = idToNode.get(fromId); const b = idToNode.get(toId);
		if (!a || !b) return Infinity;
		return haversine(a, b) * weightMultiplier(attr);
	};

	for (const e of edges) {
		const w = cost(e.from, e.to, e.attributes);
		if (!isFinite(w)) continue;
		if (!adj.has(e.from)) adj.set(e.from, []);
		adj.get(e.from).push({ to: e.to, weight: w, edge: e });
		if (e.bidirectional !== false) {
			const w2 = cost(e.to, e.from, e.attributes);
			if (!adj.has(e.to)) adj.set(e.to, []);
			adj.get(e.to).push({ to: e.from, weight: w2, edge: e });
		}
	}
	return { adj, idToNode };
}

function aStar(startId, goalId, adj, idToNode) {
	const h = (id) => haversine(idToNode.get(id), idToNode.get(goalId));

	const open = new Set([startId]);
	const cameFrom = new Map();
	const gScore = new Map([[startId, 0]]);
	const fScore = new Map([[startId, h(startId)]]);

	const lowestF = () => {
		let best = null; let bestV = Infinity;
		for (const id of open) {
			const v = fScore.get(id) ?? Infinity;
			if (v < bestV) { bestV = v; best = id; }
		}
		return best;
	};

	while (open.size) {
		const current = lowestF();
		if (!current) break;
		if (current === goalId) {
			// reconstruct
			const path = [];
			let cur = goalId;
			while (cur) {
				path.push(cur);
				cur = cameFrom.get(cur);
			}
			path.reverse();
			return path;
		}
		open.delete(current);
		const neighbors = adj.get(current) || [];
		for (const { to, weight } of neighbors) {
			const tentative = (gScore.get(current) ?? Infinity) + weight;
			if (tentative < (gScore.get(to) ?? Infinity)) {
				cameFrom.set(to, current);
				gScore.set(to, tentative);
				fScore.set(to, tentative + h(to));
				open.add(to);
			}
		}
	}
	return null;
}

function toAppRoute(nodePath, idToNode, speedMetersPerMin = 80) {
	const path = [];
	for (let i = 0; i < nodePath.length; i++) {
		const n = idToNode.get(nodePath[i]);
		path.push({ lat: n.lat, lng: n.lng, name: n.name, type: i === 0 ? 'start' : (i === nodePath.length - 1 ? 'destination' : 'waypoint') });
	}
	// compute distance
	let distance = 0;
	for (let i = 1; i < path.length; i++) {
		distance += haversine(path[i - 1], path[i]);
	}
	const duration = Math.max(1, Math.round(distance / speedMetersPerMin));
	const instructions = [];
		for (let i = 1; i < path.length; i++) {
			const to = path[i];
			instructions.push(`${i}. Walk towards ${to.name}`);
		}
	return {
		path,
		waypoints: path.length,
		distance,
		duration,
		instructions,
		isCampusRoute: true,
		method: 'Campus A*'
	};
}

export function computeCampusRoute({ start, goal, graph, preferences }) {
	if (!graph || !graph.nodes || !graph.edges || graph.nodes.length === 0) {
		throw new Error('Campus graph is not available');
	}
	const speed = preferences?.speedMetersPerMin || 80;
	const { adj, idToNode } = buildAdjacency(graph.nodes, graph.edges, preferences);
	const startId = nearestNodeId(start, graph.nodes);
	const goalId = nearestNodeId(goal, graph.nodes);
	// If either snap is too far (> 500m), consider graph not suitable
	const farLimit = 500;
	if (haversine(start, idToNode.get(startId)) > farLimit || haversine(goal, idToNode.get(goalId)) > farLimit) {
		throw new Error('Campus graph not suitable for this route');
	}
	const nodePath = aStar(startId, goalId, adj, idToNode);
	if (!nodePath) throw new Error('No campus path found');
	return toAppRoute(nodePath, idToNode, speed);
}

export const aStarUtils = { haversine, nearestNodeId };


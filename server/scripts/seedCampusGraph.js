/* seedCampusGraph: Parse provided points into nodes and connect logical edges, including shortcuts */
/* global process */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import Node from '../models/Node.js';
import Edge from '../models/Edge.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const points = [
  { name: 'Humanity lecture hall', lat: 6.1337867, lng: 8.1446816, type: 'building' },
  { name: 'Venus cafe', lat: 6.1336043, lng: 8.1445511, type: 'commercial' },
  { name: 'Humanity cafe', lat: 6.1333197, lng: 8.1446504, type: 'commercial' },
  { name: 'Humanity faculty', lat: 6.1334953, lng: 8.1449226, type: 'building' },
  { name: 'Funai poultry', lat: 6.1330793, lng: 8.1446393, type: 'building' },
  { name: 'Lep office', lat: 6.1325116, lng: 8.145212, type: 'building' },
  { name: 'Education faculty', lat: 6.13348, lng: 8.1468381, type: 'building' },
  { name: 'Education lecture hall', lat: 6.1340377, lng: 8.1474697, type: 'building' },
  { name: 'Education lab', lat: 6.1346044, lng: 8.1476923, type: 'building' },
  { name: 'Education cafe', lat: 6.1337403, lng: 8.1470503, type: 'commercial' },
  { name: 'Funai primary school', lat: 6.1353438, lng: 8.1454061, type: 'building' },
  { name: 'New building close to the primary school', lat: 6.1355505, lng: 8.1450628, type: 'building' },
  { name: 'Three junction to perm site front gate and back gate', lat: 6.1344071, lng: 8.1432124, type: 'intersection' },
  { name: 'Temp site - perm site road', lat: 6.133693, lng: 8.1435218, type: 'waypoint' },
  { name: 'Temp site - perm site road', lat: 6.1319886, lng: 8.1436784, type: 'waypoint' },
  { name: 'Temp site - perm site road', lat: 6.128976, lng: 8.1434266, type: 'waypoint' },
  { name: 'Humanities road', lat: 6.1325113, lng: 8.1437958, type: 'waypoint' },
  { name: 'Theater art - humanities road', lat: 6.1344464, lng: 8.144531, type: 'waypoint' },
  { name: 'Road to humanities', lat: 6.1326529, lng: 8.1440519, type: 'waypoint' },
  { name: 'Road to Lep office', lat: 6.1328023, lng: 8.1450038, type: 'waypoint' },
  { name: 'Road to Lep office', lat: 6.1330376, lng: 8.1453779, type: 'waypoint' },
  { name: 'Road to Lep office', lat: 6.1322362, lng: 8.1454487, type: 'waypoint' },
  { name: 'Road to education', lat: 6.1335303, lng: 8.1451868, type: 'waypoint' },
  { name: 'Road to education', lat: 6.1339244, lng: 8.1454329, type: 'waypoint' },
  { name: 'Road to education faculty', lat: 6.133368, lng: 8.1463925, type: 'waypoint' },
  { name: 'Road to education lecture hall', lat: 6.1340684, lng: 8.1470516, type: 'waypoint' },
  { name: 'Road to education lab', lat: 6.1345144, lng: 8.1475515, type: 'waypoint' },
  { name: 'Road to education', lat: 6.1342891, lng: 8.1464703, type: 'waypoint' },
  { name: 'Road to education', lat: 6.1339294, lng: 8.145845, type: 'waypoint' },
  { name: 'Road to education', lat: 6.1349128, lng: 8.145325, type: 'waypoint' },
  { name: 'Road to funai primary school', lat: 6.1353175, lng: 8.1448978, type: 'waypoint' },
  { name: 'Road to theater art', lat: 6.1353275, lng: 8.1444532, type: 'waypoint' },
  { name: 'Road to theater art', lat: 6.1352011, lng: 8.1445843, type: 'waypoint' },
  { name: 'Road to theater art', lat: 6.1352231, lng: 8.144125, type: 'waypoint' },
  { name: 'Road to theater', lat: 6.1350544, lng: 8.1439463, type: 'waypoint' },
  { name: 'Road to boys hostel', lat: 6.1323639, lng: 8.1413613, type: 'waypoint' },
  { name: 'Road to basket ball court', lat: 6.1327729, lng: 8.1416483, type: 'waypoint' },
  { name: 'Back gate road to perm site', lat: 6.1318279, lng: 8.1399669, type: 'waypoint' },
  { name: 'Back gate', lat: 6.1324536, lng: 8.1404259, type: 'entrance' },
  { name: 'Back gate bridge road to perm site', lat: 6.1310795, lng: 8.1401516, type: 'waypoint' },
  { name: 'Road to solar farm', lat: 6.1305738, lng: 8.1401027, type: 'waypoint' },
  { name: 'Road to perm site', lat: 6.1291793, lng: 8.1411585, type: 'waypoint' },
  { name: 'Road to engineering department', lat: 6.1287403, lng: 8.1416332, type: 'waypoint' },
  { name: 'Road to engineering department', lat: 6.1280856, lng: 8.1415759, type: 'waypoint' },
  { name: 'Road to engineering department', lat: 6.1275549, lng: 8.1416004, type: 'waypoint' },
  { name: 'Road from engineering to aar', lat: 6.1275512, lng: 8.1418039, type: 'waypoint' },
  { name: 'Road from engineering to aar', lat: 6.1271935, lng: 8.1417214, type: 'waypoint' },
  { name: 'Road from engineering to aar', lat: 6.1271098, lng: 8.1414797, type: 'waypoint' },
  { name: 'Road to agric', lat: 6.1265595, lng: 8.1412034, type: 'waypoint' },
  { name: 'Road to solar farm', lat: 6.1261281, lng: 8.1407991, type: 'waypoint' },
  { name: 'Road to physical science', lat: 6.1260818, lng: 8.1412135, type: 'waypoint' },
  { name: 'Road to physical science', lat: 6.1258787, lng: 8.1420728, type: 'waypoint' },
  { name: 'Road to physical science', lat: 6.1259094, lng: 8.1423916, type: 'waypoint' },
  { name: 'Road to physical science', lat: 6.1255597, lng: 8.1424597, type: 'waypoint' },
  { name: 'Road to agric faculty', lat: 6.1251063, lng: 8.1422921, type: 'waypoint' },
  { name: 'Road to physical science', lat: 6.1246883, lng: 8.142564, type: 'waypoint' },
  { name: 'Road to agric faculty', lat: 6.1246723, lng: 8.1421874, type: 'waypoint' },
  { name: 'Road to agric faculty', lat: 6.1247026, lng: 8.1420205, type: 'waypoint' },
  { name: 'Road to agric faculty', lat: 6.124851, lng: 8.1418213, type: 'waypoint' },
  { name: 'Road to agric faculty', lat: 6.1249, lng: 8.1416557, type: 'waypoint' },
  { name: 'Road to faculty', lat: 6.1246376, lng: 8.1418099, type: 'waypoint' },
  { name: 'Road to agric faculty', lat: 6.124948, lng: 8.1413959, type: 'waypoint' },
  { name: 'Road to agric faculty', lat: 6.12454, lng: 8.141241, type: 'waypoint' },
  { name: 'Road to agric from back', lat: 6.1244873, lng: 8.1422572, type: 'waypoint' },
  { name: 'Road to medicals', lat: 6.1235502, lng: 8.1418763, type: 'waypoint' },
  { name: 'Road to medicals', lat: 6.1218877, lng: 8.1414398, type: 'waypoint' },
  { name: 'AAR', lat: 6.1268292, lng: 8.1417734, type: 'building' },
  { name: 'engineering lecture hall', lat: 6.12828, lng: 8.141072, type: 'building' },
  { name: 'engineering library', lat: 6.127285, lng: 8.140631, type: 'building' },
  { name: 'mechanical workshop', lat: 6.127424, lng: 8.140149, type: 'building' },
  { name: 'civil workshop', lat: 6.127049, lng: 8.139988, type: 'building' },
  { name: 'electrical workshop', lat: 6.126704, lng: 8.139949, type: 'building' },
  { name: 'agric faculty', lat: 6.124485, lng: 8.141967, type: 'building' },
  { name: 'road to physical science lecture hall, mercury relaxation center, funai library', lat: 6.125689, lng: 8.143075, type: 'waypoint' },
  { name: 'funai new library', lat: 6.124795, lng: 8.14465, type: 'building' },
  { name: 'vc office', lat: 6.125635, lng: 8.145744, type: 'building' },
  { name: 'Road to vc office', lat: 6.126395, lng: 8.144752, type: 'waypoint' },
  { name: 'male medical hostel', lat: 6.129646, lng: 8.144298, type: 'hostel' },
  { name: 'Road to biological science audit', lat: 6.128139, lng: 8.143274, type: 'waypoint' },
  { name: 'Road to agric faculty', lat: 6.1253277, lng: 8.1427034, type: 'waypoint' },
  { name: 'Physical science audit ,physical science lecture hall, mercury relaxation center, funai library', lat: 6.1259551, lng: 8.1424473, type: 'waypoint' },
];

function toId(name, lat, lng) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') + '_' + lat.toFixed(5) + '_' + lng.toFixed(5);
}

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371000; const dLat = (lat2 - lat1) * Math.PI / 180; const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return 2*R*Math.asin(Math.sqrt(a));
}

function connectNearest(points, k=3) {
  const edges = [];
  for (let i=0;i<points.length;i++) {
    const p = points[i];
    const dists = points.map((q, j) => ({ j, d: i===j?Infinity:haversine(p.lat,p.lng,q.lat,q.lng) }));
    dists.sort((a,b)=>a.d-b.d);
    for (let n=1;n<=k;n++) {
      const j = dists[n]?.j; if (j==null) continue;
      const q = points[j];
      const shortcut = p.name.toLowerCase().includes('road') === false && q.name.toLowerCase().includes('road') === false && dists[n].d > 60;
      edges.push({ from: p._id, to: q._id, bidirectional: true, attributes: shortcut ? { shortcut: true } : {} });
    }
  }
  return edges;
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set');
  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB_NAME || undefined });
  console.log('Seeding campus graph...');

  // Create/Upsert nodes
  const nodes = [];
  for (const p of points) {
    const nodeId = toId(p.name, p.lat, p.lng);
  await Node.findOneAndUpdate(
      { nodeId },
      { nodeId, name: p.name, lat: p.lat, lng: p.lng, type: p.type, metadata: {} },
      { upsert: true, new: true }
    );
    nodes.push({ ...p, _id: nodeId });
  }

  // Connect nearest neighbors (basic formal edges); mark long non-road links as shortcuts
  const edgeDefs = connectNearest(nodes, 3);

  // Save edges with deterministic ids
  let idx = 0;
  for (const e of edgeDefs) {
    const edgeId = `auto_${idx++}`;
    const existing = await Edge.findOneAndUpdate(
      { edgeId },
      { edgeId, from: e.from, to: e.to, bidirectional: true, attributes: e.attributes },
      { upsert: true, new: true }
    );
    void existing;
  }

  console.log(`Seeded ${nodes.length} nodes and ${edgeDefs.length} edges.`);
  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });

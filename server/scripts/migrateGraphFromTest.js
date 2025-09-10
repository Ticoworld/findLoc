/* Migrate graph collections (nodes, edges) from source DB (default: 'test') to target DB (MONGODB_DB_NAME). */
/* global process */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function migrate() {
  const uri = process.env.MONGODB_URI;
  const sourceDb = process.env.SOURCE_DB_NAME || 'test';
  const targetDb = process.env.MONGODB_DB_NAME;
  if (!uri) throw new Error('MONGODB_URI not set');
  if (!targetDb) throw new Error('MONGODB_DB_NAME not set');

  console.log(`Connecting to MongoDB...`);
  await mongoose.connect(uri); // connect client once
  const src = mongoose.connection.useDb(sourceDb);
  const tgt = mongoose.connection.useDb(targetDb);
  console.log(`Connected. Migrating from '${sourceDb}' -> '${targetDb}'`);

  const collections = ['nodes', 'edges'];
  for (const coll of collections) {
    const srcColl = src.collection(coll);
    const tgtColl = tgt.collection(coll);
    const docs = await srcColl.find({}).toArray();
    if (!docs.length) {
      console.log(`- ${coll}: no documents to migrate`);
      continue;
    }
    const ops = docs.map((d) => {
      const copy = { ...d };
      delete copy._id; // let target DB allocate a fresh _id
      if (coll === 'nodes') {
        const nodeId = copy.nodeId || copy.id; // prefer nodeId
        return {
          updateOne: {
            filter: { nodeId },
            update: {
              $set: {
                nodeId,
                name: copy.name,
                lat: copy.lat,
                lng: copy.lng,
                type: copy.type,
                metadata: copy.metadata || {}
              }
            },
            upsert: true
          }
        };
      } else {
        const edgeId = copy.edgeId || copy.id;
        return {
          updateOne: {
            filter: { edgeId },
            update: {
              $set: {
                edgeId,
                from: copy.from,
                to: copy.to,
                bidirectional: copy.bidirectional !== false,
                weightMeters: copy.weightMeters,
                attributes: copy.attributes || {}
              }
            },
            upsert: true
          }
        };
      }
    });
    const res = await tgtColl.bulkWrite(ops, { ordered: false });
    console.log(`- ${coll}: migrated ${docs.length} docs (upserts: ${(res.upsertedCount || 0)})`);
  }

  await mongoose.disconnect();
  console.log('Migration complete.');
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});

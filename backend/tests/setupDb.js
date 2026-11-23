// backend/tests/setupDb.js
// Each test file gets its own in-memory MongoDB; collections are wiped between tests.

import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongod;

// Starting mongod can be slow (first-run binary download, antivirus scans on Windows).
const STARTUP_TIMEOUT_MS = 60_000;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create({
    instance: { launchTimeout: STARTUP_TIMEOUT_MS },
  });
  await mongoose.connect(mongod.getUri());
}, STARTUP_TIMEOUT_MS);

afterEach(async () => {
  const collections = await mongoose.connection.db.collections();
  await Promise.all(collections.map((c) => c.deleteMany({})));
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod?.stop();
});

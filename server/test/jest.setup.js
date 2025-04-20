const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Overrides environment variable
  process.env.MONGODB_URL = mongoUri;
  process.env.ENV = "test";

  // Connection to mock server
  const mongoConnection = require("../src/config/mongoDbConnection");
  await mongoConnection();

  console.log("TEST DB URI:", mongoose.connection.models);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

if (process.env.NODE_ENV === "test") {
  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });
}

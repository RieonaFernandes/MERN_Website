const testEnvironment = "node";
const setupFilesAfterEnv = ["./test/jest.setup.js"];
const coveragePathIgnorePatterns = [
  "/node_modules/",
  "/test/",
  "/config/",
  "/middlewares/",
];
const testTimeout = 15000;

module.exports = {
  testEnvironment,
  coveragePathIgnorePatterns,
  setupFilesAfterEnv,
  testTimeout,
};

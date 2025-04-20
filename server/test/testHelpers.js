const request = require("supertest");
const app = require("../src/app");
const Users = require("../src/models/usersSchema");

const testClient = request(app);

// Clean database helper
const clearDatabase = async () => {
  await Users.deleteMany({});
};

const getUser = async (data) => {
  try {
    const res = await Users.findOne(data);
    return res;
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  testClient,
  clearDatabase,
  getUser,
};

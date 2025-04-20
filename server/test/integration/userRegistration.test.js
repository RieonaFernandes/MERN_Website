const { testClient, clearDatabase, getUser } = require("../testHelpers");
const mongoose = require("mongoose");

describe("User Registration Integration Tests", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  // Test request
  const validUser = {
    firstName: "John",
    lastName: "0bbc993a5b4b5bafbfb6c9d90272928d",
    email: "57159f10b411bc7f265e8b5b522e670f",
    password: "d4b73b40778d193d07a8a853eaee9f6d",
    phone: "1234567890",
    countryCode: "+90",
  };

  // Successful Registration
  it("should register a user and return 200 status", async () => {
    const response = await testClient
      .post("/api/v1/user/register")
      .send(validUser);
    // Check response
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      code: 200,
      details: {
        data: {},
        message: "User created successfully.",
      },
      timestamp: response.body.timestamp,
    });

    // Verify if user is in the database
    const dbUser = await getUser({ email: "emaill@yield.uk" });
    expect(dbUser).toBeTruthy();
    expect(dbUser.password).not.toBe(validUser.password); // Ensure password is hashed
  });

  // Existing User Conflict
  it("should return 409 if email is already registered", async () => {
    // Create user first
    await testClient.post("/api/v1/user/register").send(validUser);

    // Try to create the same user again
    const response = await testClient
      .post("/api/v1/user/register")
      .send(validUser);

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      code: 409,
      details: {
        message: "User already exists!",
      },
    });
  });

  // Invalid Email Format
  it("should return 400 for invalid email", async () => {
    const response = await testClient.post("/api/v1/user/register").send({
      ...validUser,
      email: "invalid-email",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code: 400,
      details: {
        message: "Validation error: Invalid or missing email",
      },
    });
  });

  // Weak Password
  it("should return 400 for weak password", async () => {
    const response = await testClient.post("/api/v1/user/register").send({
      ...validUser,
      password: "weak",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code: 400,
      details: {
        message:
          "Validation error: Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character",
      },
    });
  });

  // Missing Required Field
  it("should return 400 if firstName is missing", async () => {
    const { firstName, ...invalidUser } = validUser;
    const response = await testClient
      .post("/api/v1/user/register")
      .send(invalidUser);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      code: 400,
      details: {
        message: "Validation error: Invalid or missing first name",
      },
    });
  });

  // Database Failure (e.g., connection dropped)
  it("should return 500 on database error", async () => {
    // Simulate DB failure by closing the connection
    await mongoose.disconnect();

    const response = await testClient
      .post("/api/v1/user/register")
      .send(validUser);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      code: 500,
      details: {
        message: "User registration failed. Please try again.",
      },
    });

    // Restore connection for subsequent tests
    await mongoose.connect(process.env.MONGODB_URL);
  });
});

const { sanitizeRegInput } = require("../../src/middlewares/sanitizeInput");
const { userRegValidator } = require("../../src/middlewares/validator");
const { registerUser } = require("../../src/controllers/userController");
const {
  BAD_REQUEST,
  CONFLICT,
  SERVER_ERROR,
} = require("../../src/config/errors");

const Users = require("../../src/models/usersSchema");
const { hash } = require("../../src/config/utils");
const { MESSAGE } = require("../../src/config/constants");

// Mock dependencies
jest.mock("../../src/models/usersSchema");
jest.mock("../../src/config/utils", () => ({
  decrypt: jest.fn().mockImplementation((val) => val),
  hash: jest.fn().mockResolvedValue("hashed_password"),
}));

describe("Sanitization Middleware", () => {
  test("should properly sanitize registration input", () => {
    const input = {
      firstName: " <script>John</script> ",
      lastName: "Doe",
      email: "57159f10b411bc7f265e8b5b522e670f",
      password: "d4b73b40778d193d07a8a853eaee9f6d",
      phone: "+1 (555) --' 12'3-4567",
    };

    const result = sanitizeRegInput(input);

    expect(result.firstName).toBe("&lt;script&gt;John&lt;&#x2F;script&gt;");
    expect(result.lastName).toBe("Doe");
    expect(result.email).toMatch(/@/);
    expect(result.phone).toBe("5551234567");
  });
});

describe("Validation Middleware", () => {
  const mockReq = (body) => ({
    body,
    method: "POST",
  });

  const mockRes = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  });

  test("should reject invalid email format", async () => {
    const req = mockReq({
      firstName: "John",
      lastName: "Doe",
      email: "invalid-email",
      password: "Password123!",
    });

    await userRegValidator(req, mockRes(), (err) => {
      expect(err.message).toContain(
        "Validation error: Invalid or missing email"
      );
    });
  });

  test("should reject weak password", async () => {
    const req = mockReq({
      firstName: "John",
      lastName: "Doe",
      email: "valid@example.com",
      password: "weak",
    });

    await userRegValidator(req, mockRes(), (err) => {
      expect(err.message).toContain(
        "Validation error: Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character"
      );
    });
  });
});

describe("registerUser Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockRequest = {
    firstName: "John",
    lastName: "Doe",
    email: "test@example.com",
    password: "ValidPassword123!",
    phone: "1234567890",
  };

  // Successful Registration
  it("should register a user and return success message", async () => {
    Users.find.mockResolvedValue([]);
    hash.mockResolvedValue("hashed_password");
    Users.create.mockResolvedValue({ email: mockRequest.email });

    const result = await new Promise((resolve, reject) => {
      registerUser(mockRequest, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
    expect(result).toEqual({
      message: MESSAGE.USER_CREATED,
      data: {},
    });

    expect(Users.find).toHaveBeenCalledWith({ email: mockRequest.email });
    expect(hash).toHaveBeenCalledWith("ValidPassword123!");

    expect(Users.create).toHaveBeenCalledWith({
      ...mockRequest,
      password: "hashed_password",
    });
  });

  // Existing User Conflict
  it("should return CONFLICT error if user exists", async () => {
    Users.find.mockResolvedValue([mockRequest]);

    await new Promise((resolve) => {
      registerUser(mockRequest, (error, result) => {
        expect(error).toEqual(CONFLICT(MESSAGE.USER_EXISTS));
        expect(result).toBeNull();
        resolve();
      });
    });

    expect(Users.find).toHaveBeenCalledWith({ email: mockRequest.email });
    expect(hash).not.toHaveBeenCalled();
    expect(Users.create).not.toHaveBeenCalled();
  });

  // Hashing Failure
  it("should handle password hashing failure", async () => {
    Users.find.mockResolvedValue([]);
    hash.mockRejectedValue(new Error("Hashing failed"));

    await new Promise((resolve) => {
      registerUser(mockRequest, (error, result) => {
        expect(error).toEqual(
          SERVER_ERROR("User registration failed. Please try again.")
        );
        expect(result).toBeNull();
        resolve();
      });
    });

    expect(hash).toHaveBeenCalledWith(mockRequest.password);
    expect(Users.create).not.toHaveBeenCalled();
  });

  // Database Creation Failure
  it("should handle user creation failure", async () => {
    Users.find.mockResolvedValue([]);
    hash.mockResolvedValue("hashed_password");
    Users.create.mockRejectedValue(new Error("Database error"));

    await new Promise((resolve) => {
      registerUser(mockRequest, (error, result) => {
        expect(error).toEqual(
          SERVER_ERROR("User registration failed. Please try again.")
        );
        expect(result).toBeNull();
        resolve();
      });
    });

    expect(Users.create).toHaveBeenCalled();
  });

  // Email Mismatch After Creation
  it("should return error if created user email mismatch", async () => {
    Users.find.mockResolvedValue([]);
    hash.mockResolvedValue("hashed_password");
    Users.create.mockResolvedValue({ email: "wrong@example.com" });

    await new Promise((resolve) => {
      registerUser(mockRequest, (error, result) => {
        expect(error).toEqual(
          BAD_REQUEST("User registration failed. Please try again.")
        );
        expect(result).toBeNull();
        resolve();
      });
    });

    expect(Users.create).toHaveBeenCalled();
  });

  // Database Find Error
  it("should handle database find error", async () => {
    Users.find.mockRejectedValue(new Error("Database error"));

    await new Promise((resolve) => {
      registerUser(mockRequest, (error, result) => {
        expect(error).toEqual(
          SERVER_ERROR("User registration failed. Please try again.")
        );
        expect(result).toBeNull();
        resolve();
      });
    });

    expect(Users.find).toHaveBeenCalled();
    expect(hash).not.toHaveBeenCalled();
  });
});

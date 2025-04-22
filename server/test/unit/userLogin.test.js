const { userLoginValidator } = require("../../src/middlewares/validator");
const { sanitizeRegInput } = require("../../src/middlewares/sanitizeInput");
const { loginUser } = require("../../src/controllers/userController");
const {
  BAD_REQUEST,
  SERVER_ERROR,
  NOT_AUTHORIZED,
} = require("../../src/config/errors");
const {
  decrypt,
  compareHash,
  generateToken,
  encrypt,
} = require("../../src/config/utils");

const Users = require("../../src/models/usersSchema");
const Tokens = require("../../src/models/userTokens");
const { MESSAGE } = require("../../src/config/constants");
const moment = require("moment");

// Mock dependencies
jest.mock("../../src/models/usersSchema");
jest.mock("../../src/models/userTokens");
jest.mock("../../src/config/utils", () => ({
  decrypt: jest.fn().mockImplementation((val) => val),
  compareHash: jest.fn().mockResolvedValue(true),
  generateToken: jest.fn().mockReturnValue("raw_token"),
  encrypt: jest.fn().mockImplementation((val) => `encrypted_${val}`),
  hash: jest.fn().mockResolvedValue("hashed_password"),
}));

describe("Login Sanitization", () => {
  test("should sanitize login input", () => {
    const input = {
      email: "  TEST@EXAMPLE.COM  ",
      password: "  Password123!  ",
      deviceId: " <script>device123</script> ",
      deviceType: " android ",
    };

    const result = sanitizeRegInput(input);

    expect(decrypt).toHaveBeenCalledWith(input.email);
    expect(decrypt).toHaveBeenCalledWith(input.password);
    expect(result.email).toBe("test@example.com");
    expect(result.password).toBe("Password123!");
    expect(result.deviceId).toBe("&lt;script&gt;device123&lt;&#x2F;script&gt;");
    expect(result.deviceType).toBe("android");
  });

  test("should handle decryption errors", () => {
    decrypt.mockImplementation(() => {
      throw new Error("Decryption failed");
    });

    const mockNext = jest.fn();
    const input = { email: "bad-value" };

    sanitizeRegInput(input, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    expect(mockNext.mock.calls[0][0].message).toMatch(
      /Authentication \/ Submission has failed./
    );
  });
});

describe("Login Validation", () => {
  const mockReq = (body) => ({ body });
  const mockRes = () => ({});
  const mockNext = jest.fn();

  beforeEach(() => {
    mockNext.mockClear();
  });

  test("should reject invalid device ID", () => {
    const req = mockReq({
      deviceId: "invalid$device!",
      deviceType: "ios",
      email: "test@example.com",
      password: "ValidPass123!",
    });

    userLoginValidator(req, mockRes(), mockNext);
    expect(mockNext).toHaveBeenCalledWith(BAD_REQUEST(MESSAGE.LOGIN_FAILED));
  });

  test("should reject invalid email format", () => {
    const req = mockReq({
      deviceId: "validDevice123",
      deviceType: "android",
      email: "invalid-email",
      password: "ValidPass123!",
    });

    userLoginValidator(req, mockRes(), mockNext);
    expect(mockNext).toHaveBeenCalledWith(BAD_REQUEST(MESSAGE.LOGIN_FAILED));
  });

  test("should reject weak password", () => {
    const req = mockReq({
      deviceId: "validDevice123",
      deviceType: "web",
      email: "test@example.com",
      password: "weak",
    });

    userLoginValidator(req, mockRes(), mockNext);
    expect(mockNext).toHaveBeenCalledWith(BAD_REQUEST(MESSAGE.LOGIN_FAILED));
  });

  test("should pass valid input", () => {
    const req = mockReq({
      deviceId: "validDevice123",
      deviceType: "ios",
      email: "test@example.com",
      password: "ValidPass123!",
    });

    userLoginValidator(req, mockRes(), mockNext);
    expect(mockNext).toHaveBeenCalledWith();
  });
});

describe("Login Controller", () => {
  const mockUser = {
    _id: "user123",
    email: "test@example.com",
    password: "hashed_password",
    save: jest.fn(),
  };

  const mockRequest = {
    body: {
      email: "test@example.com",
      password: "ValidPassword123!",
      deviceId: "device123",
      deviceType: "ios",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET_KEY = "secret";
    process.env.JWT_TOKEN_EXPIRY = "1h";
    process.env.REFRESH_TOKEN_EXPIRY = "7d";
  });

  test("should return error for non-existent user", async () => {
    Users.findOne.mockResolvedValue(null);

    await new Promise((resolve) => {
      loginUser(mockRequest, (error, result) => {
        expect(error).toEqual(NOT_AUTHORIZED(MESSAGE.LOGIN_FAILED));
        resolve();
      });
    });
  });

  test("should return error for invalid password", async () => {
    Users.findOne.mockResolvedValue(mockUser);
    compareHash.mockResolvedValue(false);

    await new Promise((resolve) => {
      loginUser(mockRequest, (error, result) => {
        expect(error).toEqual(NOT_AUTHORIZED(MESSAGE.LOGIN_FAILED));
        resolve();
      });
    });
  });

  test("should successfully login valid user", async () => {
    Users.findOne.mockResolvedValue(mockUser);
    compareHash.mockResolvedValue(true);
    Users.findOneAndUpdate.mockResolvedValue({ ...mockUser, isActive: true });
    // Tokens.create.mockResolvedValue(true);
    const mockToken = "raw_token";
    generateToken.mockReturnValue(mockToken);
    encrypt.mockImplementation((val) => `encrypted_${val}`);
    Tokens.create.mockResolvedValue(true);

    const dateNow = new Date();
    let expectedATExpTime = moment(dateNow)
      .add(process.env.JWT_TOKEN_EXPIRY[0], process.env.JWT_TOKEN_EXPIRY[1])
      .toDate();

    let expectedRTokenExpTime = moment(dateNow)
      .add(
        process.env.REFRESH_TOKEN_EXPIRY[0],
        process.env.REFRESH_TOKEN_EXPIRY[1]
      )
      .toDate();

    await new Promise((resolve) => {
      loginUser(mockRequest, (error, result) => {
        expect(error).toBeNull();
        expect(result.data).toMatchObject({
          userId: "encrypted_user123",
          // email: "test@example.com",
          accessToken: "encrypted_raw_token",
          refreshToken: "encrypted_raw_token",
        });
        expect(result.data.accessTokenExpTime).toBeApproximatelyDate(
          expectedATExpTime
        );
        expect(result.data.refreshTokenExpTime).toBeApproximatelyDate(
          expectedRTokenExpTime
        );

        resolve();
      });
    });

    expect(Users.findOneAndUpdate).toHaveBeenCalled();
    expect(Tokens.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user123",
        deviceId: "device123",
        deviceType: "ios",
        accessToken: "encrypted_raw_token",
        refreshToken: "encrypted_raw_token",
      })
    );
  });

  test("should handle database update failure", async () => {
    Users.findOne.mockResolvedValue(mockUser);
    Users.findOneAndUpdate.mockRejectedValue(new Error("DB error"));

    await new Promise((resolve) => {
      loginUser(mockRequest, (error, result) => {
        expect(error).toEqual(SERVER_ERROR(MESSAGE.LOGIN_FAILED));
        resolve();
      });
    });
  });

  test("should handle token creation failure", async () => {
    Users.findOne.mockResolvedValue(mockUser);
    Users.findOneAndUpdate.mockResolvedValue({ ...mockUser, isActive: true });
    Tokens.create.mockRejectedValue(new Error("Token error"));

    await new Promise((resolve) => {
      loginUser(mockRequest, (error, result) => {
        expect(error).toEqual(SERVER_ERROR(MESSAGE.LOGIN_FAILED));
        resolve();
      });
    });
  });
});

expect.extend({
  toBeApproximatelyDate(actualDate, expectedDate, marginInMs = 5000) {
    const actual = new Date(actualDate).getTime();
    const expected = new Date(expectedDate).getTime();

    const pass =
      actual >= expected - marginInMs && actual <= expected + marginInMs;

    return {
      pass,
      message: () =>
        `expected ${new Date(
          actual
        ).toISOString()} to be approximately equal to ${new Date(
          expected
        ).toISOString()} ± ${marginInMs}ms`,
    };
  },
});

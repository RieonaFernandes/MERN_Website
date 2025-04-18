const userController = require("../controllers/userController");
const async = require("async");
const { ERROR_TYPES } = require("../config/constants");

async function registerUser(req, res) {
  userController.registerUser(req.body, (err, data) => {
    if (err) {
      return res.status(err?.code || 500).json(err);
    }
    return res.json({
      code: ERROR_TYPES.SUCCESS,
      details: {
        message: data.message,
        data: data.data,
      },
      timestamp: new Date().toISOString(),
    });
  });
}

module.exports = { registerUser };

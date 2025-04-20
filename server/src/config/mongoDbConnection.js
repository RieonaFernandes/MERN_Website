const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// Connect to MongoDB
async function mongoDbConnection() {
  mongoose
    .connect(`${process.env.MONGODB_URL}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
      console.error("Error connecting to MongoDB", err);
      process.exit(1);
    });
}

module.exports = mongoDbConnection;

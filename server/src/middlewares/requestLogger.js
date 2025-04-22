const fs = require("fs");
const path = require("path");

const logsDir = path.join(__dirname, `../logs`); // Log file path based on the date

// Ensure logs directory exists
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

let currentLogDate = null;

function deleteOldLogs() {
  const retentionDays = 7; // Keep logs for 7 days
  const retentionTime = retentionDays * 24 * 60 * 60 * 1000; // in milliseconds
  const now = Date.now();

  fs.readdir(logsDir, (err, files) => {
    if (err) {
      console.error("Error reading logs directory:", err);
      return;
    }

    files.forEach((file) => {
      const match = file.match(/^(\d{4}-\d{2}-\d{2})-api\.log$/);
      if (!match) return;

      const fileDate = match[1];
      const fileTime = new Date(fileDate).getTime();

      if (now - fileTime > retentionTime) {
        fs.unlink(path.join(logsDir, file), (err) => {
          if (err) {
            console.error("Error deleting old log file:", file, err);
          } else {
            console.log("Deleted old log file:", file);
          }
        });
      }
    });
  });
}

const requestLogger = (req, res, next) => {
  const startTime = process.hrtime(); // Start time

  res.on("finish", () => {
    const [seconds, nanoseconds] = process.hrtime(startTime);
    const executionTime = (seconds * 1000 + nanoseconds / 1e6).toFixed(2); // Convert to milliseconds

    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const logFilePath = path.join(logsDir, `${today}-api.log`);

    const logEntry = `[${now.toISOString()}] ${req.method} ${
      req.originalUrl
    } - ${res.statusCode} - ${executionTime}ms\n`; // example format: [2025-03-14T11:31:06.137Z] GET /api/v1/pokedex - 200 - 28.52ms

    console.log(logEntry.trim()); // Log to console

    // Check if the date has changed and rotate logs if needed
    if (today !== currentLogDate) {
      currentLogDate = today;
      deleteOldLogs();
    }

    // Append log to file
    fs.appendFile(logFilePath, logEntry, (err) => {
      if (err) console.error("Error writing log:", err);
    });
  });

  next();
};

module.exports = requestLogger;

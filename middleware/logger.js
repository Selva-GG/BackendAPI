import fs from "fs";
import path from "path";

export const logEvents = async (message, fileName) => {
  const currentTime = new Date().toLocaleString();
  const logItem = `${currentTime} ${message}\n`;

  try {
    const logsDir = path.join(new URL(import.meta.url).pathname, "..", "logs");
    if (!fs.existsSync(logsDir)) {
      await fs.promises.mkdir(logsDir);
    }
    await fs.promises.appendFile(path.join(logsDir, fileName), logItem);
  } catch (err) {
    console.error("Error writing to log file", err);
  }
};

export const logger = (req, res, next) => {
  logEvents(`${req.method} - ${req.url}`, "logs.txt");
  next();
};

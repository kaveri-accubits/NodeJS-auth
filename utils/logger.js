const winston = require("winston");
const { combine, timestamp, label, printf } = winston.format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${JSON.stringify(message)}`;
});

const logConfiguration = {
  format: combine(label({ label: "🏷" }), timestamp(), myFormat),
  transports: [
    new winston.transports.Console({
      level: "warn",
    }),
    new winston.transports.File({
      level: "error",
      // Create the log directory if it does not exist
      filename: "logs/error.log",
    }),
    new winston.transports.File({
      level: "info",
      filename: "logs/info.log",
    }),
  ],
};

const logger = winston.createLogger(logConfiguration);

logger.info("Logger initialized");

module.exports = logger;

const env = require("../config/env");

// Minimal dependency-free structured logger. Keeps the project's footprint
// small while still giving timestamped, leveled log lines suitable for
// aggregation by Render/hosting platform log collectors.
const levels = ["error", "warn", "info", "debug"];

function log(level, message, meta) {
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    if (level === "error") {
        console.error(line, meta ?? "");
    } else if (level === "warn") {
        console.warn(line, meta ?? "");
    } else if (level === "debug" && env.nodeEnv === "production") {
        // suppress debug noise in production
        return;
    } else {
        console.log(line, meta ?? "");
    }
}

const logger = {};
levels.forEach((level) => {
    logger[level] = (message, meta) => log(level, message, meta);
});

module.exports = logger;

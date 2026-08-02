require("dotenv").config();

// Centralized, validated access to environment variables.
// Fails fast at boot if a required variable is missing instead of
// surfacing confusing errors later at request time.
const required = ["DB_HOST", "DB_USER", "DB_NAME", "JWT_SECRET"];

const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(", ")}`);
    console.error("Copy .env.example to .env and fill in the values.");
    process.exit(1);
}

module.exports = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT) || 5000,

    db: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD || "",
        name: process.env.DB_NAME,
    },

    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    },

    corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",

    upload: {
        maxFileSizeMb: Number(process.env.MAX_UPLOAD_MB) || 5,
    },
};

const app = require("./app");
const db = require("./config/db");
const env = require("./config/env");
const logger = require("./utils/logger");

async function startServer() {
    try {
        await db.query("SELECT 1");
        logger.info("Database connected successfully");

        const server = app.listen(env.port, () => {
            logger.info(`Server running on port ${env.port} [${env.nodeEnv}]`);
        });

        const shutdown = (signal) => {
            logger.info(`${signal} received, shutting down gracefully`);
            server.close(() => {
                db.end().finally(() => process.exit(0));
            });
        };

        process.on("SIGTERM", () => shutdown("SIGTERM"));
        process.on("SIGINT", () => shutdown("SIGINT"));
    } catch (error) {
        logger.error("Database connection failed", { message: error.message });
        process.exit(1);
    }
}

startServer();

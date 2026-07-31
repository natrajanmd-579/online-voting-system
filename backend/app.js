const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const electionRoutes = require("./routes/electionRoutes");
const candidateRoutes = require("./routes/candidateRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/elections", electionRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const db = require("./config/db");

(async () => {
    try {
        const connection = await db.getConnection();
        console.log("✅ Connected to MySQL Database");
        connection.release();
    } catch (error) {
        console.error("❌ Database Connection Failed:", error.message);
    }
})();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
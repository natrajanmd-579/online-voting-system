const db = require("../config/db");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// @desc Overall stats for dashboard cards
const getDashboardSummary = asyncHandler(async (req, res) => {
    const [[stats]] = await db.query(`
        SELECT
            (SELECT COUNT(*) FROM users) AS totalUsers,
            (SELECT COUNT(*) FROM candidates) AS totalCandidates,
            (SELECT COUNT(*) FROM elections) AS totalElections,
            (SELECT COUNT(*) FROM votes) AS totalVotes,
            (SELECT COUNT(*) FROM elections WHERE status = 'active') AS activeElections,
            (SELECT COUNT(*) FROM elections WHERE status = 'completed') AS completedElections,
            (SELECT COUNT(*) FROM elections
                WHERE status = 'upcoming' OR NOW() < start_date) AS upcomingElections
    `);

    ApiResponse.send(res, { message: "Dashboard summary retrieved successfully", data: stats });
});

// @desc Lightweight election list for dropdowns
const getElectionsList = asyncHandler(async (req, res) => {
    const [elections] = await db.query(
        "SELECT id, title, status FROM elections ORDER BY created_at DESC"
    );
    ApiResponse.send(res, { message: "Elections list retrieved successfully", data: elections });
});

// @desc Votes-per-day for the last 14 days, used for the dashboard trend chart
const getVoteTrends = asyncHandler(async (req, res) => {
    const [rows] = await db.query(`
        SELECT DATE(voted_at) AS date, COUNT(*) AS votes
        FROM votes
        WHERE voted_at >= (NOW() - INTERVAL 14 DAY)
        GROUP BY DATE(voted_at)
        ORDER BY date ASC
    `);
    ApiResponse.send(res, { message: "Vote trends retrieved successfully", data: rows });
});

// @desc Most recent votes/elections/candidates for a "recent activity" feed
const getRecentActivity = asyncHandler(async (req, res) => {
    const [rows] = await db.query(`
        (SELECT 'vote' AS type, v.voted_at AS occurred_at,
                CONCAT(u.full_name, ' voted in ', e.title) AS description
         FROM votes v
         JOIN users u ON u.id = v.user_id
         JOIN elections e ON e.id = v.election_id
         ORDER BY v.voted_at DESC LIMIT 10)
        UNION ALL
        (SELECT 'election' AS type, e.created_at AS occurred_at,
                CONCAT('Election created: ', e.title) AS description
         FROM elections e
         ORDER BY e.created_at DESC LIMIT 10)
        ORDER BY occurred_at DESC
        LIMIT 10
    `);
    ApiResponse.send(res, { message: "Recent activity retrieved successfully", data: rows });
});

// @desc Election results, vote breakdown, and winner detection
const getElectionResults = asyncHandler(async (req, res) => {
    const { electionId } = req.params;

    const [elections] = await db.query("SELECT * FROM elections WHERE id = ?", [electionId]);
    if (elections.length === 0) {
        throw ApiError.notFound("Election not found");
    }

    const [[{ totalVotesCast }]] = await db.query(
        "SELECT COUNT(*) AS totalVotesCast FROM votes WHERE election_id = ?",
        [electionId]
    );

    const [candidates] = await db.query(
        `SELECT c.id, c.name, c.party, c.symbol, c.photo,
                COUNT(v.id) AS votesCount,
                IFNULL(ROUND((COUNT(v.id) * 100.0 / NULLIF(?, 0)), 2), 0) AS percentage
         FROM candidates c
         LEFT JOIN votes v ON c.id = v.candidate_id
         WHERE c.election_id = ?
         GROUP BY c.id, c.name, c.party, c.symbol, c.photo
         ORDER BY votesCount DESC`,
        [totalVotesCast, electionId]
    );

    const winner = candidates.length > 0 && candidates[0].votesCount > 0 ? candidates[0] : null;

    ApiResponse.send(res, {
        message: "Election results retrieved successfully",
        data: { election: elections[0], totalVotesCast, winner, candidates },
    });
});

module.exports = {
    getDashboardSummary,
    getElectionsList,
    getVoteTrends,
    getRecentActivity,
    getElectionResults,
};

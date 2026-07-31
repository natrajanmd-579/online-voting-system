const db = require('../config/db'); // MySQL connection pool

/**
 * @desc Get overall system statistics for dashboard cards
 * @route GET /api/dashboard/summary
 */
exports.getDashboardSummary = async (req, res) => {
    try {
        const query = `
            SELECT 
                (SELECT COUNT(*) FROM users) AS totalUsers,
                (SELECT COUNT(*) FROM candidates) AS totalCandidates,
                (SELECT COUNT(*) FROM elections) AS totalElections,
                (SELECT COUNT(*) FROM votes) AS totalVotes,
                (SELECT COUNT(*) FROM elections WHERE status = 'active') AS activeElections,
                (SELECT COUNT(*) FROM elections WHERE status = 'completed') AS completedElections
        `;

        const [rows] = await db.query(query);

        return res.status(200).json({
            success: true,
            message: "Dashboard summary retrieved successfully",
            data: rows[0]
        });
    } catch (error) {
        console.error("Error fetching dashboard summary:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching dashboard summary",
            data: null
        });
    }
};

/**
 * @desc Get election results, vote breakdown, and winner detection
 * @route GET /api/dashboard/results/:electionId
 */
exports.getElectionResults = async (req, res) => {
    const { electionId } = req.params;

    try {
        // Fetch election info
        const [elections] = await db.query("SELECT * FROM elections WHERE id = ?", [electionId]);
        if (elections.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Election not found",
                data: null
            });
        }

        // Fetch total votes cast in this election
        const [[{ totalVotesCast }]] = await db.query(
            "SELECT COUNT(*) AS totalVotesCast FROM votes WHERE election_id = ?", 
            [electionId]
        );

        // Fetch candidate details with votes count & percentage
        const candidateQuery = `
            SELECT 
                c.id, 
                c.name, 
                c.party, 
                c.symbol, 
                COUNT(v.id) AS votesCount,
                IFNULL(ROUND((COUNT(v.id) * 100.0 / NULLIF(?, 0)), 2), 0) AS percentage
            FROM candidates c
            LEFT JOIN votes v ON c.id = v.candidate_id
            WHERE c.election_id = ?
            GROUP BY c.id, c.name, c.party, c.symbol
            ORDER BY votesCount DESC
        `;
        const [candidates] = await db.query(candidateQuery, [totalVotesCast, electionId]);

        // Winner or Current Leader
        const winner = candidates.length > 0 && candidates[0].votesCount > 0 ? candidates[0] : null;

        return res.status(200).json({
            success: true,
            message: "Election results retrieved successfully",
            data: {
                election: elections[0],
                totalVotesCast,
                winner,
                candidates
            }
        });
    } catch (error) {
        console.error("Error fetching election results:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching election results",
            data: null
        });
    }
};
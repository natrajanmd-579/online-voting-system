const db = require("../config/db");

const VoteModel = {

    // Check if the user has already voted in a specific election
    async hasUserVoted(userId, electionId) {

        const [rows] = await db.query(
            `SELECT id
             FROM votes
             WHERE user_id = ?
             AND election_id = ?`,
            [userId, electionId]
        );

        return rows.length > 0;
    },

    // Store a new vote
    async castVote(userId, electionId, candidateId) {

        const [result] = await db.query(
            `INSERT INTO votes
            (user_id, election_id, candidate_id)
            VALUES (?, ?, ?)`,
            [userId, electionId, candidateId]
        );

        return result;
    },

    // Fetch voting history for a user
    async getVoteHistory(userId) {

        const [rows] = await db.query(
            `SELECT
                v.id,
                e.title AS election_title,
                c.name AS candidate_name,
                c.party AS party_name,
                v.voted_at
            FROM votes v
            INNER JOIN elections e
                ON v.election_id = e.id
            INNER JOIN candidates c
                ON v.candidate_id = c.id
            WHERE v.user_id = ?
            ORDER BY v.voted_at DESC`,
            [userId]
        );

        return rows;
    },

    // Check vote status for a specific election
    async getVoteStatus(userId, electionId) {

        const [rows] = await db.query(
            `SELECT
                id,
                candidate_id,
                voted_at
            FROM votes
            WHERE user_id = ?
            AND election_id = ?`,
            [userId, electionId]
        );

        return rows[0] || null;
    }

};

module.exports = VoteModel;
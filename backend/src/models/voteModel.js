const db = require("../config/db");

const VoteModel = {
    async hasUserVoted(userId, electionId) {
        const [rows] = await db.query(
            "SELECT id FROM votes WHERE user_id = ? AND election_id = ? LIMIT 1",
            [userId, electionId]
        );
        return rows.length > 0;
    },

    // Casts a vote inside a transaction with a row lock on the election so
    // two concurrent requests from the same user cannot both pass the
    // "already voted" check before either insert completes (a real risk
    // under load with the previous check-then-insert code). The database's
    // UNIQUE(user_id, election_id) constraint is the final safety net.
    async castVote(userId, electionId, candidateId) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            await connection.query(
                "SELECT id FROM elections WHERE id = ? FOR UPDATE",
                [electionId]
            );

            const [existing] = await connection.query(
                "SELECT id FROM votes WHERE user_id = ? AND election_id = ? LIMIT 1",
                [userId, electionId]
            );

            if (existing.length > 0) {
                await connection.rollback();
                const err = new Error("You have already voted in this election");
                err.statusCode = 409;
                throw err;
            }

            const [result] = await connection.query(
                "INSERT INTO votes (user_id, election_id, candidate_id) VALUES (?, ?, ?)",
                [userId, electionId, candidateId]
            );

            await connection.commit();
            return result;
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    },

    async getVoteHistory(userId) {
        const [rows] = await db.query(
            `SELECT v.id, e.id AS election_id, e.title AS election_title,
                    c.name AS candidate_name, c.party AS party_name, v.voted_at
             FROM votes v
             INNER JOIN elections e ON v.election_id = e.id
             INNER JOIN candidates c ON v.candidate_id = c.id
             WHERE v.user_id = ?
             ORDER BY v.voted_at DESC`,
            [userId]
        );
        return rows;
    },

    async getVoteStatus(userId, electionId) {
        const [rows] = await db.query(
            "SELECT id, candidate_id, voted_at FROM votes WHERE user_id = ? AND election_id = ?",
            [userId, electionId]
        );
        return rows[0] || null;
    },
};

module.exports = VoteModel;

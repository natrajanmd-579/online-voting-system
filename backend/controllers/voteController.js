const VoteModel = require("../models/voteModel");
const db = require("../config/db");

const VoteController = {

    // ===============================
    // Cast Vote
    // ===============================

    async castVote(req, res) {

        try {

            const userId = req.user.id;

            const {
                election_id,
                candidate_id
            } = req.body;

            // -----------------------
            // Validation
            // -----------------------

            if (!election_id || !candidate_id) {

                return res.status(400).json({
                    success: false,
                    message: "Election ID and Candidate ID are required"
                });

            }

            // -----------------------
            // Check Election Exists
            // -----------------------

            const [election] = await db.query(

                `SELECT *
                 FROM elections
                 WHERE id = ?
                 AND status = 'active'`,

                [election_id]

            );

            if (election.length === 0) {

                return res.status(400).json({
                    success: false,
                    message: "Election is not active or does not exist"
                });

            }

            // -----------------------
            // Check Candidate Exists
            // -----------------------

            const [candidate] = await db.query(

                `SELECT *
                 FROM candidates
                 WHERE id = ?
                 AND election_id = ?`,

                [candidate_id, election_id]

            );

            if (candidate.length === 0) {

                return res.status(400).json({
                    success: false,
                    message: "Candidate does not belong to this election"
                });

            }

            // -----------------------
            // Duplicate Vote Check
            // -----------------------

            const alreadyVoted = await VoteModel.hasUserVoted(
                userId,
                election_id
            );

            if (alreadyVoted) {

                return res.status(400).json({
                    success: false,
                    message: "You have already voted in this election"
                });

            }

            // -----------------------
            // Save Vote
            // -----------------------

            await VoteModel.castVote(
                userId,
                election_id,
                candidate_id
            );

            return res.status(201).json({

                success: true,

                message: "Vote cast successfully"

            });

        }

        catch (error) {

            console.error(error);

            return res.status(500).json({

                success: false,

                message: "Failed to cast vote"

            });

        }

    },

    // ===============================
    // Vote History
    // ===============================

    async getVoteHistory(req, res) {

        try {

            const userId = req.user.id;

            const history = await VoteModel.getVoteHistory(userId);

            return res.status(200).json({

                success: true,

                message: "Vote history fetched successfully",

                data: history

            });

        }

        catch (error) {

            console.error(error);

            return res.status(500).json({

                success: false,

                message: "Failed to fetch vote history"

            });

        }

    },

    // ===============================
    // Vote Status
    // ===============================

    async getVoteStatus(req, res) {

        try {

            const userId = req.user.id;

            const { electionId } = req.params;

            const vote = await VoteModel.getVoteStatus(

                userId,

                electionId

            );

            return res.status(200).json({

                success: true,

                message: "Vote status fetched successfully",

                data: vote

            });

        }

        catch (error) {

            console.error(error);

            return res.status(500).json({

                success: false,

                message: "Failed to fetch vote status"

            });

        }

    }

};

module.exports = VoteController;
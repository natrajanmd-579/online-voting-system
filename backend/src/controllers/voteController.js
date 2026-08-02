const VoteModel = require("../models/voteModel");
const db = require("../config/db");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const castVote = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { election_id, candidate_id } = req.body;

    const [election] = await db.query(
        "SELECT id FROM elections WHERE id = ? AND status = 'active' AND NOW() BETWEEN start_date AND end_date",
        [election_id]
    );
    if (election.length === 0) {
        throw ApiError.badRequest("Election is not active or does not exist");
    }

    const [candidate] = await db.query(
        "SELECT id FROM candidates WHERE id = ? AND election_id = ?",
        [candidate_id, election_id]
    );
    if (candidate.length === 0) {
        throw ApiError.badRequest("Candidate does not belong to this election");
    }

    await VoteModel.castVote(userId, election_id, candidate_id);

    ApiResponse.send(res, { statusCode: 201, message: "Vote cast successfully" });
});

const getVoteHistory = asyncHandler(async (req, res) => {
    const history = await VoteModel.getVoteHistory(req.user.id);
    ApiResponse.send(res, { message: "Vote history fetched successfully", data: history });
});

const getVoteStatus = asyncHandler(async (req, res) => {
    const vote = await VoteModel.getVoteStatus(req.user.id, req.params.electionId);
    ApiResponse.send(res, { message: "Vote status fetched successfully", data: vote });
});

module.exports = { castVote, getVoteHistory, getVoteStatus };

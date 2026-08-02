const electionModel = require("../models/electionModel");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { getPagination, buildMeta } = require("../utils/pagination");

const getAllElections = asyncHandler(async (req, res) => {
    const { search, status } = req.query;
    const { page, limit, offset } = getPagination(req.query);

    const { rows, total } = await electionModel.getAllElections({ search, status, limit, offset });

    ApiResponse.send(res, {
        message: "Elections fetched successfully",
        data: rows,
        meta: buildMeta({ page, limit, total }),
    });
});

const getElectionById = asyncHandler(async (req, res) => {
    const election = await electionModel.getElectionById(req.params.id);

    if (!election) {
        throw ApiError.notFound("Election not found");
    }

    ApiResponse.send(res, { message: "Election fetched successfully", data: election });
});

const createElection = asyncHandler(async (req, res) => {
    const { title, description, start_date, end_date, status } = req.body;

    const result = await electionModel.createElection({ title, description, start_date, end_date, status });

    ApiResponse.send(res, {
        statusCode: 201,
        message: "Election created successfully",
        data: { id: result.insertId },
    });
});

const updateElection = asyncHandler(async (req, res) => {
    const { title, description, start_date, end_date, status } = req.body;

    const result = await electionModel.updateElection(req.params.id, {
        title, description, start_date, end_date, status,
    });

    if (result.affectedRows === 0) {
        throw ApiError.notFound("Election not found");
    }

    ApiResponse.send(res, { message: "Election updated successfully" });
});

const deleteElection = asyncHandler(async (req, res) => {
    const result = await electionModel.deleteElection(req.params.id);

    if (result.affectedRows === 0) {
        throw ApiError.notFound("Election not found");
    }

    ApiResponse.send(res, { message: "Election deleted successfully" });
});

const activateElection = asyncHandler(async (req, res) => {
    const result = await electionModel.activateElection(req.params.id);

    if (result.affectedRows === 0) {
        throw ApiError.notFound("Election not found");
    }

    ApiResponse.send(res, { message: "Election activated successfully" });
});

const endElection = asyncHandler(async (req, res) => {
    const result = await electionModel.endElection(req.params.id);

    if (result.affectedRows === 0) {
        throw ApiError.notFound("Election not found");
    }

    ApiResponse.send(res, { message: "Election ended successfully" });
});

module.exports = {
    getAllElections,
    getElectionById,
    createElection,
    updateElection,
    deleteElection,
    activateElection,
    endElection,
};

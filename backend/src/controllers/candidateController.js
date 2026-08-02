const fs = require("fs");
const path = require("path");
const candidateModel = require("../models/candidateModel");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { getPagination, buildMeta } = require("../utils/pagination");

const UPLOAD_DIR = path.join(__dirname, "..", "uploads", "candidates");

const removeFileIfExists = (filename) => {
    if (!filename) return;
    const filePath = path.join(UPLOAD_DIR, filename);
    fs.unlink(filePath, () => {}); // best-effort cleanup, ignore errors
};

const getAllCandidates = asyncHandler(async (req, res) => {
    const { search, electionId } = req.query;
    const { page, limit, offset } = getPagination(req.query);

    const { rows, total } = await candidateModel.getAllCandidates({ search, electionId, limit, offset });

    ApiResponse.send(res, {
        message: "Candidates fetched successfully",
        data: rows,
        meta: buildMeta({ page, limit, total }),
    });
});

const getCandidateById = asyncHandler(async (req, res) => {
    const candidate = await candidateModel.getCandidateById(req.params.id);

    if (!candidate) {
        throw ApiError.notFound("Candidate not found");
    }

    ApiResponse.send(res, { message: "Candidate fetched successfully", data: candidate });
});

const createCandidate = asyncHandler(async (req, res) => {
    const { election_id, name, party, symbol, manifesto } = req.body;
    const photo = req.file ? req.file.filename : null;

    try {
        const result = await candidateModel.createCandidate({ election_id, name, party, symbol, photo, manifesto });

        ApiResponse.send(res, {
            statusCode: 201,
            message: "Candidate created successfully",
            data: { id: result.insertId },
        });
    } catch (err) {
        removeFileIfExists(photo); // don't orphan an uploaded file if the insert fails
        throw err;
    }
});

const updateCandidate = asyncHandler(async (req, res) => {
    const { election_id, name, party, symbol, manifesto } = req.body;
    const photo = req.file ? req.file.filename : undefined;

    const existing = await candidateModel.getCandidateById(req.params.id);
    if (!existing) {
        removeFileIfExists(photo);
        throw ApiError.notFound("Candidate not found");
    }

    const result = await candidateModel.updateCandidate(req.params.id, {
        election_id, name, party, symbol, photo, manifesto,
    });

    if (result.affectedRows === 0) {
        throw ApiError.notFound("Candidate not found");
    }

    // Replaced the photo: remove the old file now that the new one is saved.
    if (photo && existing.photo) {
        removeFileIfExists(existing.photo);
    }

    ApiResponse.send(res, { message: "Candidate updated successfully" });
});

const deleteCandidate = asyncHandler(async (req, res) => {
    const existing = await candidateModel.getCandidateById(req.params.id);
    if (!existing) {
        throw ApiError.notFound("Candidate not found");
    }

    await candidateModel.deleteCandidate(req.params.id);
    removeFileIfExists(existing.photo);

    ApiResponse.send(res, { message: "Candidate deleted successfully" });
});

module.exports = {
    getAllCandidates,
    getCandidateById,
    createCandidate,
    updateCandidate,
    deleteCandidate,
};

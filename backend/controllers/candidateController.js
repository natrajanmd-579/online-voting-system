const candidateModel = require("../models/candidateModel");

// Get all candidates
exports.getAllCandidates = async (req, res) => {
    try {
        const candidates = await candidateModel.getAllCandidates();

        res.status(200).json({
            success: true,
            message: "Candidates fetched successfully",
            data: candidates
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get candidate by ID
exports.getCandidateById = async (req, res) => {
    try {
        const candidate = await candidateModel.getCandidateById(req.params.id);

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Candidate fetched successfully",
            data: candidate
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Create candidate
exports.createCandidate = async (req, res) => {
    try {
        const {
            election_id,
            name,
            party,
            symbol,
            manifesto
        } = req.body;

        if (!election_id || !name || !party || !symbol) {
            return res.status(400).json({
                success: false,
                message: "Election ID, Name, Party and Symbol are required"
            });
        }

        const photo = req.file ? req.file.filename : null;

        const result = await candidateModel.createCandidate({
            election_id,
            name,
            party,
            symbol,
            photo,
            manifesto
        });

        res.status(201).json({
            success: true,
            message: "Candidate created successfully",
            data: {
                id: result.insertId
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update candidate
exports.updateCandidate = async (req, res) => {
    try {
        const {
            election_id,
            name,
            party,
            symbol,
            manifesto
        } = req.body;

        const photo = req.file ? req.file.filename : null;

        const result = await candidateModel.updateCandidate(req.params.id, {
            election_id,
            name,
            party,
            symbol,
            photo,
            manifesto
        });

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Candidate not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Candidate updated successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete candidate
exports.deleteCandidate = async (req, res) => {
    try {
        const result = await candidateModel.deleteCandidate(req.params.id);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Candidate not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Candidate deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const db = require("../config/db");

// Get all candidates
const getAllCandidates = async () => {
    const [rows] = await db.query(`
        SELECT c.*, e.title AS election_title
        FROM candidates c
        JOIN elections e ON c.election_id = e.id
        ORDER BY c.id DESC
    `);

    return rows;
};

// Get candidate by ID
const getCandidateById = async (id) => {
    const [rows] = await db.query(
        `SELECT * FROM candidates WHERE id = ?`,
        [id]
    );

    return rows[0];
};

// Create candidate
const createCandidate = async (candidateData) => {
    const {
        election_id,
        name,
        party,
        symbol,
        photo,
        manifesto
    } = candidateData;

    const [result] = await db.query(
        `INSERT INTO candidates
        (election_id, name, party, symbol, photo, manifesto)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            election_id,
            name,
            party,
            symbol,
            photo,
            manifesto
        ]
    );

    return result;
};

// Update candidate
const updateCandidate = async (id, candidateData) => {
    const {
        election_id,
        name,
        party,
        symbol,
        photo,
        manifesto
    } = candidateData;

    const [result] = await db.query(
        `UPDATE candidates
         SET election_id = ?,
             name = ?,
             party = ?,
             symbol = ?,
             photo = ?,
             manifesto = ?
         WHERE id = ?`,
        [
            election_id,
            name,
            party,
            symbol,
            photo,
            manifesto,
            id
        ]
    );

    return result;
};

// Delete candidate
const deleteCandidate = async (id) => {
    const [result] = await db.query(
        "DELETE FROM candidates WHERE id = ?",
        [id]
    );

    return result;
};

module.exports = {
    getAllCandidates,
    getCandidateById,
    createCandidate,
    updateCandidate,
    deleteCandidate
};
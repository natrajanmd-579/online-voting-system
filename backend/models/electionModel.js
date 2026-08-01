const db = require("../config/db");

// Get all elections
const getAllElections = async () => {
    const [rows] = await db.query(
        "SELECT * FROM elections ORDER BY id DESC"
    );
    return rows;
};

// Get election by ID
const getElectionById = async (id) => {
    const [rows] = await db.query(
        "SELECT * FROM elections WHERE id = ?",
        [id]
    );

    return rows[0];
};

// Create election
const createElection = async (electionData) => {
    const { title, description, start_date, end_date, status } = electionData;

    const [result] = await db.query(
        `INSERT INTO elections
        (title, description, start_date, end_date, status)
        VALUES (?, ?, ?, ?, ?)`,
        [title, description, start_date, end_date, status]
    );

    return result;
};

// Update election
const updateElection = async (id, electionData) => {
    const { title, description, start_date, end_date, status } = electionData;

    const [result] = await db.query(
        `UPDATE elections
         SET title = ?,
             description = ?,
             start_date = ?,
             end_date = ?,
             status = ?
         WHERE id = ?`,
        [title, description, start_date, end_date, status, id]
    );

    return result;
};

// Delete election
const deleteElection = async (id) => {
    const [result] = await db.query(
        "DELETE FROM elections WHERE id = ?",
        [id]
    );

    return result;
};

// Activate election
const activateElection = async (id) => {
    const [result] = await db.query(
        "UPDATE elections SET status = 'active' WHERE id = ?",
        [id]
    );

    return result;
};

// End election
const endElection = async (id) => {
    const [result] = await db.query(
        "UPDATE elections SET status = 'completed' WHERE id = ?",
        [id]
    );

    return result;
};

module.exports = {
    getAllElections,
    getElectionById,
    createElection,
    updateElection,
    deleteElection,
    activateElection,
    endElection,
};
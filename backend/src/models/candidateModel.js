const db = require("../config/db");

const getAllCandidates = async ({ search, electionId, limit, offset } = {}) => {
    const conditions = [];
    const params = [];

    if (search) {
        conditions.push("(c.name LIKE ? OR c.party LIKE ?)");
        params.push(`%${search}%`, `%${search}%`);
    }

    if (electionId) {
        conditions.push("c.election_id = ?");
        params.push(electionId);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const [rows] = await db.query(
        `SELECT c.*, e.title AS election_title,
                (SELECT COUNT(*) FROM votes v WHERE v.candidate_id = c.id) AS vote_count
         FROM candidates c
         JOIN elections e ON c.election_id = e.id
         ${whereClause}
         ORDER BY c.id DESC
         LIMIT ? OFFSET ?`,
        [...params, limit, offset]
    );

    const [[{ total }]] = await db.query(
        `SELECT COUNT(*) AS total FROM candidates c ${whereClause}`,
        params
    );

    return { rows, total };
};

const getCandidateById = async (id) => {
    const [rows] = await db.query(
        `SELECT c.*, e.title AS election_title
         FROM candidates c JOIN elections e ON c.election_id = e.id
         WHERE c.id = ?`,
        [id]
    );
    return rows[0];
};

const createCandidate = async ({ election_id, name, party, symbol, photo, manifesto }) => {
    const [result] = await db.query(
        `INSERT INTO candidates (election_id, name, party, symbol, photo, manifesto)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [election_id, name, party, symbol, photo, manifesto || null]
    );
    return result;
};

const updateCandidate = async (id, fields) => {
    const allowed = ["election_id", "name", "party", "symbol", "photo", "manifesto"];
    const updates = [];
    const params = [];

    for (const key of allowed) {
        if (fields[key] !== undefined && fields[key] !== null) {
            updates.push(`${key} = ?`);
            params.push(fields[key]);
        }
    }

    if (updates.length === 0) return { affectedRows: 0 };

    params.push(id);

    const [result] = await db.query(
        `UPDATE candidates SET ${updates.join(", ")} WHERE id = ?`,
        params
    );
    return result;
};

const deleteCandidate = async (id) => {
    const [result] = await db.query("DELETE FROM candidates WHERE id = ?", [id]);
    return result;
};

module.exports = {
    getAllCandidates,
    getCandidateById,
    createCandidate,
    updateCandidate,
    deleteCandidate,
};

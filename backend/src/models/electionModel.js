const db = require("../config/db");

// Elections are stored with an explicit status column (set by admins via
// activate/end actions), but list/detail responses also expose a
// `computed_status` derived from start/end dates so the UI can show an
// accurate Upcoming/Active/Completed badge and countdown even if an admin
// forgets to flip the stored status manually.
const STATUS_CASE = `
    CASE
        WHEN status = 'completed' THEN 'completed'
        WHEN NOW() < start_date THEN 'upcoming'
        WHEN NOW() BETWEEN start_date AND end_date THEN 'active'
        ELSE 'completed'
    END AS computed_status
`;

const getAllElections = async ({ search, status, limit, offset } = {}) => {
    const conditions = [];
    const params = [];

    if (search) {
        conditions.push("(title LIKE ? OR description LIKE ?)");
        params.push(`%${search}%`, `%${search}%`);
    }

    if (status) {
        conditions.push("status = ?");
        params.push(status);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const [rows] = await db.query(
        `SELECT e.*, ${STATUS_CASE},
                (SELECT COUNT(*) FROM candidates c WHERE c.election_id = e.id) AS candidate_count,
                (SELECT COUNT(*) FROM votes v WHERE v.election_id = e.id) AS vote_count
         FROM elections e
         ${whereClause}
         ORDER BY e.created_at DESC
         LIMIT ? OFFSET ?`,
        [...params, limit, offset]
    );

    const [[{ total }]] = await db.query(
        `SELECT COUNT(*) AS total FROM elections e ${whereClause}`,
        params
    );

    return { rows, total };
};

const getElectionById = async (id) => {
    const [rows] = await db.query(
        `SELECT e.*, ${STATUS_CASE},
                (SELECT COUNT(*) FROM candidates c WHERE c.election_id = e.id) AS candidate_count,
                (SELECT COUNT(*) FROM votes v WHERE v.election_id = e.id) AS vote_count
         FROM elections e WHERE e.id = ?`,
        [id]
    );
    return rows[0];
};

const createElection = async ({ title, description, start_date, end_date, status }) => {
    const [result] = await db.query(
        `INSERT INTO elections (title, description, start_date, end_date, status)
         VALUES (?, ?, ?, ?, ?)`,
        [title, description, start_date, end_date, status || "upcoming"]
    );
    return result;
};

const updateElection = async (id, fields) => {
    const allowed = ["title", "description", "start_date", "end_date", "status"];
    const updates = [];
    const params = [];

    for (const key of allowed) {
        if (fields[key] !== undefined) {
            updates.push(`${key} = ?`);
            params.push(fields[key]);
        }
    }

    if (updates.length === 0) return { affectedRows: 0 };

    params.push(id);

    const [result] = await db.query(
        `UPDATE elections SET ${updates.join(", ")}, updated_at = NOW() WHERE id = ?`,
        params
    );
    return result;
};

const deleteElection = async (id) => {
    const [result] = await db.query("DELETE FROM elections WHERE id = ?", [id]);
    return result;
};

const activateElection = async (id) => {
    const [result] = await db.query("UPDATE elections SET status = 'active' WHERE id = ?", [id]);
    return result;
};

const endElection = async (id) => {
    const [result] = await db.query("UPDATE elections SET status = 'completed' WHERE id = ?", [id]);
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

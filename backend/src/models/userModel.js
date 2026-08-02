const db = require("../config/db");

const PUBLIC_FIELDS = "id, full_name, email, phone, role, status, created_at";

const findUserByEmail = async (email) => {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
    return rows[0];
};

const findUserById = async (id) => {
    const [rows] = await db.query(`SELECT ${PUBLIC_FIELDS} FROM users WHERE id = ? LIMIT 1`, [id]);
    return rows[0];
};

const createUser = async ({ full_name, email, phone, password }) => {
    const [result] = await db.query(
        `INSERT INTO users (full_name, email, phone, password) VALUES (?, ?, ?, ?)`,
        [full_name, email, phone || null, password]
    );
    return result.insertId;
};

const updateUser = async (id, full_name, phone) => {
    const [result] = await db.query(
        `UPDATE users SET full_name = ?, phone = ? WHERE id = ?`,
        [full_name, phone || null, id]
    );
    return result;
};

const updatePassword = async (id, password) => {
    const [result] = await db.query("UPDATE users SET password = ? WHERE id = ?", [password, id]);
    return result;
};

module.exports = {
    findUserByEmail,
    findUserById,
    createUser,
    updateUser,
    updatePassword,
};

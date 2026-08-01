const db = require("../config/db");

const findUserByEmail = async (email) => {

    const [rows] = await db.query(
        "SELECT * FROM users WHERE email=?",
        [email]
    );

    return rows[0];
};
const loginUser = async (email) => {

    const [rows] = await db.query(

        "SELECT * FROM users WHERE email=?",

        [email]

    );

    return rows[0];

};
const createUser = async(user)=>{

    const {full_name,email,phone,password}=user;

    const [result]=await db.query(

        `INSERT INTO users
        (full_name,email,phone,password)
        VALUES(?,?,?,?)`,

        [full_name,email,phone,password]

    );

    return result.insertId;

};
const findUserById = async (id) => {

    const [rows] = await db.query(
        "SELECT id, full_name, email, phone, role, status, created_at FROM users WHERE id = ?",
        [id]
    );

    return rows[0];
};
const updateUser = async (id, full_name, phone) => {

    const [result] = await db.query(

        `UPDATE users
         SET full_name = ?, phone = ?
         WHERE id = ?`,

        [full_name, phone, id]

    );

    return result;
};
const updatePassword = async (id, password) => {

    const [result] = await db.query(
        "UPDATE users SET password=? WHERE id=?",
        [password, id]
    );

    return result;
};
module.exports = {

    findUserByEmail,
    createUser,
    loginUser,
    findUserById,
    updateUser,
    updatePassword
};

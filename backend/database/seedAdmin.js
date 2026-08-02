/**
 * One-off CLI script to create (or promote) an admin account.
 * Usage: npm run seed:admin -- "Full Name" email@example.com password123
 */
require("dotenv").config();
const bcrypt = require("bcrypt");
const db = require("../src/config/db");

async function main() {
    const [full_name, email, password] = process.argv.slice(2);

    if (!full_name || !email || !password) {
        console.error('Usage: npm run seed:admin -- "Full Name" email@example.com password123');
        process.exit(1);
    }

    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    const hashed = await bcrypt.hash(password, 10);

    if (existing.length > 0) {
        await db.query("UPDATE users SET password = ?, role = 'admin' WHERE id = ?", [hashed, existing[0].id]);
        console.log(`Existing user ${email} promoted to admin and password updated.`);
    } else {
        await db.query(
            "INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, 'admin')",
            [full_name, email, hashed]
        );
        console.log(`Admin account created for ${email}.`);
    }

    process.exit(0);
}

main().catch((err) => {
    console.error("Failed to seed admin:", err.message);
    process.exit(1);
});

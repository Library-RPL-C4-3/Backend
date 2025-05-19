const db = require("../config/db");
const jwt = require("jsonwebtoken");
const ApiError = require("../errors/apiError");

async function login(username, password) {
  const [rows] = await db.query("SELECT * FROM admins WHERE username = ?", [username]);

  if (rows.length === 0) {
    throw ApiError.unauthorized("Username tidak ditemukan");
  }

  const admin = rows[0];

  if (admin.password !== password) {
    throw ApiError.unauthorized("Password salah");
  }

  // JWT
  const token = jwt.sign(
    { id: admin.id, username: admin.username, name: admin.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return {
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      username: admin.username
    }
  };
}

module.exports = {
  login
};

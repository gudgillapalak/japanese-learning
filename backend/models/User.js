import pool from "../config/db.js";

/* =========================
   FIND USER BY EMAIL
========================= */
export const findUserByEmail = async (email) => {
  const result = await pool.query(
    `SELECT id, username, email, password
     FROM users
     WHERE email = $1`,
    [email]
  );

  return result.rows[0];
};

/* =========================
   CREATE USER
========================= */
export const createUser = async (username, email, hashedPassword) => {
  const result = await pool.query(
    `INSERT INTO users (username, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, username, email`,
    [username, email, hashedPassword]
  );

  const user = result.rows[0];

  // auto-create stats row
  await pool.query(
    `INSERT INTO user_stats (user_id) VALUES ($1)`,
    [user.id]
  );

  return user;
};

/* =========================
   DASHBOARD DATA
========================= */
export const getUserDashboardData = async (userId) => {
  const result = await pool.query(
    `SELECT 
        u.id,
        u.username,
        s.study_time_minutes,
        s.accuracy,
        s.streak,
        s.rank
     FROM users u
     LEFT JOIN user_stats s ON s.user_id = u.id
     WHERE u.id = $1`,
    [userId]
  );

  return result.rows[0];
};

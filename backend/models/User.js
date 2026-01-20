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
export const createUser = async ({ username, email, password }) => {
  const result = await pool.query(
    `INSERT INTO users (username, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, username, email`,
    [username, email, password]
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

/* =========================
   UPDATE STUDY TIME
========================= */
export const addStudyTime = async (userId, minutes) => {
  await pool.query(
    `UPDATE user_stats
     SET study_time_minutes = study_time_minutes + $1
     WHERE user_id = $2`,
    [minutes, userId]
  );
};

/* =========================
   UPDATE STREAK
========================= */
export const updateStreak = async (userId) => {
  await pool.query(
    `UPDATE user_stats
     SET streak = streak + 1
     WHERE user_id = $1`,
    [userId]
  );
};

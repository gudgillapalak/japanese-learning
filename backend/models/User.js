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

  await pool.query(
    `INSERT INTO user_stats (user_id, last_active_date)
     VALUES ($1, CURRENT_DATE)`,
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
   ADD STUDY TIME
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
   REAL DAILY STREAK LOGIC ✅
========================= */
export const updateDailyStreak = async (userId) => {
  const result = await pool.query(
    `SELECT streak, last_active_date
     FROM user_stats
     WHERE user_id = $1`,
    [userId]
  );

  const stats = result.rows[0];
  const today = new Date();
  const todayDate = today.toISOString().split("T")[0];

  if (!stats.last_active_date) {
    await pool.query(
      `UPDATE user_stats
       SET streak = 1,
           last_active_date = CURRENT_DATE
       WHERE user_id = $1`,
      [userId]
    );
    return;
  }

  const lastDate = stats.last_active_date.toISOString().split("T")[0];

  const diffDays =
    (new Date(todayDate) - new Date(lastDate)) / (1000 * 60 * 60 * 24);

  if (diffDays === 1) {
    // ✅ consecutive day
    await pool.query(
      `UPDATE user_stats
       SET streak = streak + 1,
           last_active_date = CURRENT_DATE
       WHERE user_id = $1`,
      [userId]
    );
  } else if (diffDays > 1) {
    // ❌ missed day → reset
    await pool.query(
      `UPDATE user_stats
       SET streak = 1,
           last_active_date = CURRENT_DATE
       WHERE user_id = $1`,
      [userId]
    );
  }
};

/* =========================
   SAVE QUIZ ACCURACY
========================= */
export const saveQuizAccuracy = async (userId, accuracy) => {
  await pool.query(
    `UPDATE user_stats
     SET accuracy = $1
     WHERE user_id = $2`,
    [accuracy, userId]
  );
};

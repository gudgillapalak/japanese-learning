import {
  getUserDashboardData,
  addStudyTime,
  updateStreak,
} from "../models/User.js";

/* =========================
   GET DASHBOARD
========================= */
export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const data = await getUserDashboardData(userId);

    res.json({
      message: "Dashboard data fetched",
      data,
    });
  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   ADD STUDY TIME
========================= */
export const addStudyTimeController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { minutes } = req.body;

    if (!minutes || minutes <= 0) {
      return res.status(400).json({ message: "Invalid minutes" });
    }

    await addStudyTime(userId, minutes);

    res.json({ message: "Study time updated" });
  } catch (err) {
    console.error("STUDY TIME ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   UPDATE STREAK
========================= */
export const updateStreakController = async (req, res) => {
  try {
    const userId = req.user.id;

    await updateStreak(userId);

    res.json({ message: "Streak updated" });
  } catch (err) {
    console.error("STREAK ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

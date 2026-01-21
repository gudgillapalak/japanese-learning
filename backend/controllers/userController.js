import {
  getUserDashboardData,
  addStudyTime,
  updateDailyStreak,
  saveQuizAccuracy,
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
    await updateDailyStreak(userId); // 🔥 streak update here

    res.json({ message: "Study time updated & streak checked" });
  } catch (err) {
    console.error("STUDY TIME ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   SAVE QUIZ RESULT
========================= */
export const saveQuizAccuracyController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { accuracy } = req.body;

    if (accuracy === undefined) {
      return res.status(400).json({ message: "Accuracy required" });
    }

    await saveQuizAccuracy(userId, accuracy);
    await updateDailyStreak(userId); // 🔥 streak update here

    res.json({ message: "Quiz saved & streak checked" });
  } catch (err) {
    console.error("QUIZ ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

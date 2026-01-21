import express from "express";
import {
  getDashboard,
  addStudyTimeController,
  saveQuizAccuracyController,
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================
   DASHBOARD
========================= */
router.get("/dashboard", protect, getDashboard);

/* =========================
   STUDY TIME
========================= */
router.post("/stats/study-time", protect, addStudyTimeController);

/* =========================
   QUIZ RESULT
========================= */
router.post("/stats/quiz", protect, saveQuizAccuracyController);

export default router;

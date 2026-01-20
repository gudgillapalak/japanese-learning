import express from "express";
import {
  getDashboard,
  addStudyTimeController,
  updateStreakController,
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, getDashboard);
router.post("/stats/study-time", protect, addStudyTimeController);
router.post("/stats/streak", protect, updateStreakController);

export default router;

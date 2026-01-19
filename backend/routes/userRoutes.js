import express from "express";
import { getUserDashboard } from "../controllers/userController.js";

const router = express.Router();

router.get("/:id/dashboard", getUserDashboard);

export default router;

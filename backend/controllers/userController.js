import { getUserDashboardData } from "../models/User.js";

export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.params.id;

    const data = await getUserDashboardData(userId);

    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

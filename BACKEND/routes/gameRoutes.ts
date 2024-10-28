import { requireAuth } from "../middleware/authMiddleware";
const { Router } = require("express");
const {
	getHome,
	getUserStats,
	getPlayerStats,
	getUserDualPlayerStats,
} = require("../controllers/gameController");
const router = Router();

router.get("/stats/:username", getUserStats);
router.get("/stats/dual-player/:username", getUserDualPlayerStats);
router.post("/stats", getPlayerStats);

router.get("*", requireAuth, getHome);

module.exports = router;

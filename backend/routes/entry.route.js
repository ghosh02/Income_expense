const express = require("express");
const router = express.Router();
const entryController = require("../controllers/entry.controller");
const { protectRoute } = require("../middlewares/auth.middleware");

router.post("/create", protectRoute, entryController.createEntry);
router.get("/allEntry", protectRoute, entryController.getAllEntries);
router.get("/income", protectRoute, entryController.getMonthlyIncome);
router.get("/expense", protectRoute, entryController.getMonthlyExpense);
router.get("/summary", protectRoute, entryController.getLastThreeMonthsSummary);
router.delete("/delete/:id", protectRoute, entryController.deleteEntry);

module.exports = router;

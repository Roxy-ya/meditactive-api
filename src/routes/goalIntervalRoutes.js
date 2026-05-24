const express = require("express");

const goalIntervalController = require("../controllers/goalIntervalController");
const asyncHandler = require("../middlewares/asyncHandler");

const router = express.Router();

/* Rotte per la gestione degli intervalli di obiettivi */
router.get("/", asyncHandler(goalIntervalController.getGoalIntervals));
router.get("/:id", asyncHandler(goalIntervalController.getGoalIntervalById));
router.post("/", asyncHandler(goalIntervalController.createGoalInterval));
router.put("/:id", asyncHandler(goalIntervalController.updateGoalInterval));
router.delete("/:id", asyncHandler(goalIntervalController.deleteGoalInterval));
router.post("/:id/goals", asyncHandler(goalIntervalController.addGoalToInterval));
router.delete("/:intervalId/goals/:goalId", asyncHandler(goalIntervalController.removeGoalFromInterval));

module.exports = router;
const express = require("express");

const goalController = require("../controllers/goalController");
const asyncHandler = require("../middlewares/asyncHandler");

const router = express.Router();

/* Rotte per la gestione degli obiettivi */
router.get("/", asyncHandler(goalController.getGoals));
router.get("/:id", asyncHandler(goalController.getGoalById));
router.post("/", asyncHandler(goalController.createGoal));
router.put("/:id", asyncHandler(goalController.updateGoal));
router.delete("/:id", asyncHandler(goalController.deleteGoal));

module.exports = router;
const express = require("express");

const userController = require("../controllers/userController");
const asyncHandler = require("../middlewares/asyncHandler");

const router = express.Router();

/* Rotte per la gestione degli utenti */
router.get("/", asyncHandler(userController.getUsers));
router.get("/:id", asyncHandler(userController.getUserById));
router.post("/", asyncHandler(userController.createUser));
router.put("/:id", asyncHandler(userController.updateUser));
router.delete("/:id", asyncHandler(userController.deleteUser));

module.exports = router;
const goalRepository = require("../repositories/goalRepository");
const { validateGoalPayload } = require("../validators/goalValidator");
const ApiError = require("../utils/ApiError");

const getGoals = async (req, res) => {
  const goals = await goalRepository.findAll();

  res.status(200).json(goals);
};

/* Funzione per ottenere un obiettivo per ID */
const getGoalById = async (req, res) => {
  const { id } = req.params;

  const goal = await goalRepository.findById(id);

  if (!goal) {
    throw new ApiError(404, "Goal not found");
  }

  res.status(200).json(goal);
};

/* Funzione per creare un nuovo obiettivo */
const createGoal = async (req, res) => {
  const errors = validateGoalPayload(req.body);

  if (errors.length > 0) {
    throw new ApiError(400, "Validation failed", errors);
  }

  const { title, description, category } = req.body;

  const createdGoal = await goalRepository.create({
    title,
    description,
    category,
  });

  res.status(201).json(createdGoal);
};

/* Funzione per aggiornare un obiettivo */
const updateGoal = async (req, res) => {
  const { id } = req.params;

  const goal = await goalRepository.findById(id);

  if (!goal) {
    throw new ApiError(404, "Goal not found");
  }

  const errors = validateGoalPayload(req.body);

  if (errors.length > 0) {
    throw new ApiError(400, "Validation failed", errors);
  }

  const { title, description, category } = req.body;

  const updatedGoal = await goalRepository.update(id, {
    title,
    description,
    category,
  });

  res.status(200).json(updatedGoal);
};

/* Funzione per eliminare un obiettivo */
const deleteGoal = async (req, res) => {
  const { id } = req.params;

  const deleted = await goalRepository.remove(id);

  if (!deleted) {
    throw new ApiError(404, "Goal not found");
  }

  res.status(204).send();
};

module.exports = {
  getGoals,
  getGoalById,
  createGoal,
  updateGoal,
  deleteGoal,
};
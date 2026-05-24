const goalIntervalRepository = require("../repositories/goalIntervalRepository");
const userRepository = require("../repositories/userRepository");
const goalRepository = require("../repositories/goalRepository");
const {
  validateGoalIntervalPayload,
  validateGoalIntervalFilters,
} = require("../validators/goalIntervalValidator");
const ApiError = require("../utils/ApiError");

/* Funzione per ottenere tutti gli intervalli di obiettivi */
const getGoalIntervals = async (req, res) => {
  const errors = validateGoalIntervalFilters(req.query);

  if (errors.length > 0) {
    throw new ApiError(400, "Validation failed", errors);
  }

  const { goalId, startDate, endDate } = req.query;

  const intervals = await goalIntervalRepository.findAll({
    goalId,
    startDate,
    endDate,
  });

  res.status(200).json(intervals);
};
/* Funzione per ottenere un intervallo di obiettivi per ID */
const getGoalIntervalById = async (req, res) => {
  const { id } = req.params;

  const interval = await goalIntervalRepository.findById(id);

  if (!interval) {
    throw new ApiError(404, "Goal interval not found");
  }

  res.status(200).json(interval);
};

/* Funzione per creare un nuovo intervallo di obiettivi */
const createGoalInterval = async (req, res) => {
  const errors = validateGoalIntervalPayload(req.body);

  if (errors.length > 0) {
    throw new ApiError(400, "Validation failed", errors);
  }

  const { userId, startDate, endDate } = req.body;

  const user = await userRepository.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const createdInterval = await goalIntervalRepository.create({
    userId,
    startDate,
    endDate,
  });

  res.status(201).json(createdInterval);
};

/* Funzione per aggiornare un intervallo di obiettivi */
const updateGoalInterval = async (req, res) => {
  const { id } = req.params;

  const interval = await goalIntervalRepository.findById(id);

  if (!interval) {
    throw new ApiError(404, "Goal interval not found");
  }

  const errors = validateGoalIntervalPayload(req.body);

  if (errors.length > 0) {
    throw new ApiError(400, "Validation failed", errors);
  }

  const { userId, startDate, endDate } = req.body;

  const user = await userRepository.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const updatedInterval = await goalIntervalRepository.update(id, {
    userId,
    startDate,
    endDate,
  });

  res.status(200).json(updatedInterval);
};

/* Funzione per eliminare un intervallo di obiettivi */
const deleteGoalInterval = async (req, res) => {
  const { id } = req.params;

  const deleted = await goalIntervalRepository.remove(id);

  if (!deleted) {
    throw new ApiError(404, "Goal interval not found");
  }

  res.status(204).send();
};

/* Funzione per aggiungere un obiettivo a un intervallo */
const addGoalToInterval = async (req, res) => {
  const { id } = req.params;
  const { goalId } = req.body;

  if (!goalId) {
    throw new ApiError(400, "Validation failed", ["Goal id is required"]);
  }

  const interval = await goalIntervalRepository.findById(id);

  if (!interval) {
    throw new ApiError(404, "Goal interval not found");
  }

  const goal = await goalRepository.findById(goalId);

  if (!goal) {
    throw new ApiError(404, "Goal not found");
  }

  const existingAssociation = await goalIntervalRepository.findGoalAssociation(
    id,
    goalId
  );

  if (existingAssociation) {
    throw new ApiError(409, "Goal is already associated to this interval");
  }

  const association = await goalIntervalRepository.addGoalToInterval(id, goalId);

  res.status(201).json({
    message: "Goal associated successfully",
    association,
  });
};

/* Funzione per rimuovere un obiettivo da un intervallo */
const removeGoalFromInterval = async (req, res) => {
  const { intervalId, goalId } = req.params;

  const interval = await goalIntervalRepository.findById(intervalId);

  if (!interval) {
    throw new ApiError(404, "Goal interval not found");
  }

  const goal = await goalRepository.findById(goalId);

  if (!goal) {
    throw new ApiError(404, "Goal not found");
  }

  const deleted = await goalIntervalRepository.removeGoalFromInterval(
    intervalId,
    goalId
  );

  if (!deleted) {
    throw new ApiError(404, "Goal association not found");
  }

  res.status(204).send();
};

module.exports = {
  getGoalIntervals,
  getGoalIntervalById,
  createGoalInterval,
  updateGoalInterval,
  deleteGoalInterval,
  addGoalToInterval,
  removeGoalFromInterval,
};
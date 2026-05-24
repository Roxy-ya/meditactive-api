const userRepository = require("../repositories/userRepository");
const { validateUserPayload } = require("../validators/userValidator");
const ApiError = require("../utils/ApiError");

/* Funzione per ottenere tutti gli utenti */
const getUsers = async (req, res) => {
  const users = await userRepository.findAll();

  res.status(200).json(users);
};

/* Funzione per ottenere un utente per ID */
const getUserById = async (req, res) => {
  const { id } = req.params;

  const user = await userRepository.findById(id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(user);
};

/* Funzione per creare un nuovo utente */
const createUser = async (req, res) => {
  const errors = validateUserPayload(req.body);

  if (errors.length > 0) {
    throw new ApiError(400, "Validation failed", errors);
  }

  const { email, firstName, lastName } = req.body;

  const existingUser = await userRepository.findByEmail(email);

  if (existingUser) {
    throw new ApiError(409, "Email already exists");
  }

  const createdUser = await userRepository.create({
    email,
    firstName,
    lastName,
  });

  res.status(201).json(createdUser);
};

/* Funzione per aggiornare un utente */
const updateUser = async (req, res) => {
  const { id } = req.params;

  const user = await userRepository.findById(id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const errors = validateUserPayload(req.body);

  if (errors.length > 0) {
    throw new ApiError(400, "Validation failed", errors);
  }

  const { email, firstName, lastName } = req.body;

  const existingUser = await userRepository.findByEmail(email);

  if (existingUser && Number(existingUser.id) !== Number(id)) {
    throw new ApiError(409, "Email already exists");
  }

  const updatedUser = await userRepository.update(id, {
    email,
    firstName,
    lastName,
  });

  res.status(200).json(updatedUser);
};

/* Funzione per eliminare un utente */
const deleteUser = async (req, res) => {
  const { id } = req.params;

  const deleted = await userRepository.remove(id);

  if (!deleted) {
    throw new ApiError(404, "User not found");
  }

  res.status(204).send();
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
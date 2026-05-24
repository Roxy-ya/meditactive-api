const ApiError = require("../utils/ApiError");

/* Middleware per gestire le route non trovate */
const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
};

module.exports = notFoundHandler;
/* Classe per gestire gli errori API */
class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);

    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/* Esportazione della classe ApiError */
module.exports = ApiError;
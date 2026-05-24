/* Middleware per gestire gli errori */
const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  /* La risposta dell'errore */
  const response = {
    message: error.message || "Internal server error",
  };

  /* Eventuali errori di validazione */
  if (error.errors && error.errors.length > 0) {
    response.errors = error.errors;
  }

  /* Risposta dell'errore */
  res.status(statusCode).json(response);
};

module.exports = errorHandler;
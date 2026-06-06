/* Middleware per gestire gli errori */
const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal server error";
  let errors = error.errors || [];

  /* Gestione degli errori di chiave duplicata MySQL.*/
  if (error.code === "ER_DUP_ENTRY") {
    statusCode = 409;
    message = "Risorsa già esistente";
    errors = [];
  }

  const response = {
    message,
  };

  if (errors.length > 0) {
    response.errors = errors;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
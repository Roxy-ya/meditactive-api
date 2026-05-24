/* Validazione del payload per gli utenti */
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/* Validazione del payload per gli utenti */
const validateUserPayload = (body) => {
  const errors = [];

  if (!body.email || body.email.trim() === "") {
    errors.push("Email è obbligatoria");
  } else if (!isValidEmail(body.email)) {
    errors.push("Email non è valida");
  }

  if (!body.firstName || body.firstName.trim() === "") {
    errors.push("Nome è obbligatorio");
  }

  if (!body.lastName || body.lastName.trim() === "") {
    errors.push("Cognome è obbligatorio");
  }

  return errors;
};

/* Validazione del payload per gli utenti */
module.exports = {
  validateUserPayload,
};
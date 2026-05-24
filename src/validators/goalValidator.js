/* Validazione del payload per gli obiettivi */
const validateGoalPayload = (body) => {
  const errors = [];

  if (!body.title || body.title.trim() === "") {
    errors.push("Titolo è obbligatorio");
  }

  if (body.title && body.title.length > 255) {
    errors.push("Il titolo deve essere inferiore a 255 caratteri");
  }

  if (body.category && body.category.length > 100) {
    errors.push("La categoria deve essere inferiore a 100 caratteri");
  }

  return errors;
};

/* Validazione del payload per gli obiettivi */
module.exports = {
  validateGoalPayload,
};
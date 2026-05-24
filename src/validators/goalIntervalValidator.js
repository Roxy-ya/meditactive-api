/* Funzione per verificare se una data è valida */
const isValidDate = (value) => {
  if (!value) {
    return false;
  }

  const date = new Date(value);

  return !Number.isNaN(date.getTime());
};

/* Validazione del payload per gli intervalli degli obiettivi */
const validateGoalIntervalPayload = (body) => {
  const errors = [];

  if (!body.userId) {
    errors.push("Id utente è obbligatorio");
  }

  if (!body.startDate) {
    errors.push("Data di inizio è obbligatoria");
  } else if (!isValidDate(body.startDate)) {
    errors.push("Data di inizio non è valida");
  }

  if (!body.endDate) {
    errors.push("Data di fine è obbligatoria");
  } else if (!isValidDate(body.endDate)) {
    errors.push("Data di fine non è valida");
  }

  if (
    isValidDate(body.startDate) &&
    isValidDate(body.endDate) &&
    new Date(body.endDate) < new Date(body.startDate)
  ) {
    errors.push("La data di fine deve essere maggiore o uguale alla data di inizio");
  }

  return errors;
};

/* Validazione dei filtri per gli intervalli degli obiettivi */
const validateGoalIntervalFilters = (query) => {
  const errors = [];

  if (query.goalId && Number.isNaN(Number(query.goalId))) {
    errors.push("Id obiettivo filter deve essere un numero");
  }

  if (query.startDate && !isValidDate(query.startDate)) {
    errors.push("Filtro data di inizio non è valido");
  }

  if (query.endDate && !isValidDate(query.endDate)) {
    errors.push("Filtro data di fine non è valido");
  }

  if (
    query.startDate &&
    query.endDate &&
    isValidDate(query.startDate) &&
    isValidDate(query.endDate) &&
    new Date(query.endDate) < new Date(query.startDate)
  ) {
    errors.push("Il filtro data di fine deve essere maggiore o uguale al filtro data di inizio");
  }

  return errors;
};

/* Esportazione delle funzioni di validazione */
module.exports = {
  validateGoalIntervalPayload,
  validateGoalIntervalFilters,
};
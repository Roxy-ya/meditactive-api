/* Validazione del payload per associare un obiettivo a un intervallo */
const validateGoalAssociationPayload = (body) => {
  const errors = [];

  if (!body.goalId) {
    errors.push("Id obiettivo è obbligatorio");
  } else if (
    Number.isNaN(Number(body.goalId)) ||
    !Number.isInteger(Number(body.goalId)) ||
    Number(body.goalId) <= 0
  ) {
    errors.push("Id obiettivo deve essere un numero intero");
  }

  return errors;
};

module.exports = {validateGoalAssociationPayload};
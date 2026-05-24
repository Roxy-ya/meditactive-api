const db = require("../config/db");

/* Funzione per mappare gli intervalli con i relativi obiettivi */
const mapIntervalsWithGoals = (rows) => {
  const intervalsMap = new Map();

  rows.forEach((row) => {
    if (!intervalsMap.has(row.id)) {
      intervalsMap.set(row.id, {
        id: row.id,
        userId: row.userId,
        startDate: row.startDate,
        endDate: row.endDate,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        user: {
          id: row.userId,
          email: row.userEmail,
          firstName: row.userFirstName,
          lastName: row.userLastName,
        },
        goals: [],
      });
    }

    if (row.goalId) {
      intervalsMap.get(row.id).goals.push({
        id: row.goalId,
        title: row.goalTitle,
        description: row.goalDescription,
        category: row.goalCategory,
      });
    }
  });

  return Array.from(intervalsMap.values());
};

/* Funzione per trovare tutti gli intervalli di obiettivi */
const findAll = async ({ goalId, startDate, endDate } = {}) => {
  const conditions = [];
  const params = [];

  if (goalId) {
    conditions.push(
      `EXISTS (
        SELECT 1
        FROM goal_interval_goals gig_filter
        WHERE gig_filter.interval_id = gi.id
        AND gig_filter.goal_id = ?
      )`
    );
    params.push(goalId);
  }

  if (startDate) {
    conditions.push("gi.start_date >= ?");
    params.push(startDate);
  }

  if (endDate) {
    conditions.push("gi.end_date <= ?");
    params.push(endDate);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  /* Esecuzione della query per ottenere gli intervalli di obiettivi */
  const [rows] = await db.execute(
    `SELECT
      gi.id,
      gi.user_id AS userId,
      gi.start_date AS startDate,
      gi.end_date AS endDate,
      gi.created_at AS createdAt,
      gi.updated_at AS updatedAt,

      u.email AS userEmail,
      u.first_name AS userFirstName,
      u.last_name AS userLastName,

      g.id AS goalId,
      g.title AS goalTitle,
      g.description AS goalDescription,
      g.category AS goalCategory
    FROM goal_intervals gi
    JOIN users u ON u.id = gi.user_id
    LEFT JOIN goal_interval_goals gig ON gig.interval_id = gi.id
    LEFT JOIN goals g ON g.id = gig.goal_id
    ${whereClause}
    ORDER BY gi.id ASC, g.id ASC`,
    params
  );

  return mapIntervalsWithGoals(rows);
};

/* Funzione per trovare un intervallo di obiettivi per ID */
const findById = async (id) => {
  const [rows] = await db.execute(
    `SELECT
      gi.id,
      gi.user_id AS userId,
      gi.start_date AS startDate,
      gi.end_date AS endDate,
      gi.created_at AS createdAt,
      gi.updated_at AS updatedAt,

      u.email AS userEmail,
      u.first_name AS userFirstName,
      u.last_name AS userLastName,

      g.id AS goalId,
      g.title AS goalTitle,
      g.description AS goalDescription,
      g.category AS goalCategory
    FROM goal_intervals gi
    JOIN users u ON u.id = gi.user_id
    LEFT JOIN goal_interval_goals gig ON gig.interval_id = gi.id
    LEFT JOIN goals g ON g.id = gig.goal_id
    WHERE gi.id = ?
    ORDER BY g.id ASC`,
    [id]
  );

  const intervals = mapIntervalsWithGoals(rows);

  return intervals[0] || null;
};

/* Funzione per creare un nuovo intervallo di obiettivi */
const create = async ({ userId, startDate, endDate }) => {
  const [result] = await db.execute(
    `INSERT INTO goal_intervals (user_id, start_date, end_date)
     VALUES (?, ?, ?)`,
    [userId, startDate, endDate]
  );

  return findById(result.insertId);
};

/* Funzione per aggiornare un intervallo di obiettivi */
const update = async (id, { userId, startDate, endDate }) => {
  await db.execute(
    `UPDATE goal_intervals
     SET user_id = ?, start_date = ?, end_date = ?
     WHERE id = ?`,
    [userId, startDate, endDate, id]
  );

  return findById(id);
};

/* Funzione per rimuovere un intervallo di obiettivi */
const remove = async (id) => {
  const [result] = await db.execute(
    `DELETE FROM goal_intervals
     WHERE id = ?`,
    [id]
  );

  return result.affectedRows > 0;
};

/* Funzione per aggiungere un obiettivo a un intervallo */
const addGoalToInterval = async (intervalId, goalId) => {
  const [result] = await db.execute(
    `INSERT INTO goal_interval_goals (interval_id, goal_id)
     VALUES (?, ?)`,
    [intervalId, goalId]
  );

  return {
    id: result.insertId,
    intervalId: Number(intervalId),
    goalId: Number(goalId),
  };
};

/* Funzione per rimuovere un obiettivo da un intervallo */
const removeGoalFromInterval = async (intervalId, goalId) => {
  const [result] = await db.execute(
    `DELETE FROM goal_interval_goals
     WHERE interval_id = ?
     AND goal_id = ?`,
    [intervalId, goalId]
  );

  return result.affectedRows > 0;
};

/* Funzione per trovare l'associazione tra un intervallo e un obiettivo */
const findGoalAssociation = async (intervalId, goalId) => {
  const [rows] = await db.execute(
    `SELECT
      id,
      interval_id AS intervalId,
      goal_id AS goalId,
      created_at AS createdAt
    FROM goal_interval_goals
    WHERE interval_id = ?
    AND goal_id = ?`,
    [intervalId, goalId]
  );

  return rows[0] || null;
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
  addGoalToInterval,
  removeGoalFromInterval,
  findGoalAssociation,
};
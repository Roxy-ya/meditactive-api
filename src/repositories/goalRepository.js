const db = require("../config/db");

/* Funzione per trovare tutti gli obiettivi */
const findAll = async () => {
  const [rows] = await db.execute(
    `SELECT 
      id,
      title,
      description,
      category,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM goals
    ORDER BY id ASC`
  );

  return rows;
};

/* Funzione per trovare un obiettivo per ID */
const findById = async (id) => {
  const [rows] = await db.execute(
    `SELECT 
      id,
      title,
      description,
      category,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM goals
    WHERE id = ?`,
    [id]
  );

  return rows[0] || null;
};

/* Funzione per creare un nuovo obiettivo */
const create = async ({ title, description, category }) => {
  const [result] = await db.execute(
    `INSERT INTO goals (title, description, category)
     VALUES (?, ?, ?)`,
    [title, description || null, category || null]
  );

  return findById(result.insertId);
};

/* Funzione per aggiornare un obiettivo */
const update = async (id, { title, description, category }) => {
  await db.execute(
    `UPDATE goals
     SET title = ?, description = ?, category = ?
     WHERE id = ?`,
    [title, description || null, category || null, id]
  );

  return findById(id);
};

/* Funzione per rimuovere un obiettivo */
const remove = async (id) => {
  const [result] = await db.execute(
    `DELETE FROM goals
     WHERE id = ?`,
    [id]
  );

  return result.affectedRows > 0;
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
const db = require("../config/db");

/* Funzione per trovare tutti gli utenti */
const findAll = async () => {
  const [rows] = await db.execute(
    `SELECT 
      id,
      email,
      first_name AS firstName,
      last_name AS lastName,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM users
    ORDER BY id ASC`
  );

  return rows;
};

/* Funzione per trovare un utente per ID */
const findById = async (id) => {
  const [rows] = await db.execute(
    `SELECT 
      id,
      email,
      first_name AS firstName,
      last_name AS lastName,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM users
    WHERE id = ?`,
    [id]
  );

  return rows[0] || null;
};

/* Funzione per trovare un utente per email */
const findByEmail = async (email) => {
  const [rows] = await db.execute(
    `SELECT 
      id,
      email,
      first_name AS firstName,
      last_name AS lastName,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM users
    WHERE email = ?`,
    [email]
  );

  return rows[0] || null;
};

/* Funzione per creare un nuovo utente */
const create = async ({ email, firstName, lastName }) => {
  const [result] = await db.execute(
    `INSERT INTO users (email, first_name, last_name)
     VALUES (?, ?, ?)`,
    [email, firstName, lastName]
  );

  return findById(result.insertId);
};

/* Funzione per aggiornare un utente */
const update = async (id, { email, firstName, lastName }) => {
  await db.execute(
    `UPDATE users
     SET email = ?, first_name = ?, last_name = ?
     WHERE id = ?`,
    [email, firstName, lastName, id]
  );

  return findById(id);
};

/* Funzione per rimuovere un utente */
const remove = async (id) => {
  const [result] = await db.execute(
    `DELETE FROM users
     WHERE id = ?`,
    [id]
  );

  return result.affectedRows > 0;
};

module.exports = {
  findAll,
  findById,
  findByEmail,
  create,
  update,
  remove,
};
const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const goalRoutes = require("./routes/goalRoutes");
const goalIntervalRoutes = require("./routes/goalIntervalRoutes");
const notFoundHandler = require("./middlewares/notFoundHandler");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

/* Controllo dello stato dell'API */
app.get("/", (req, res) => {
  res.status(200).json({
    message: "MeditActive API is running",
  });
});

/* Controllo dello stato del database */
app.get("/api/health/db", async (req, res, next) => {
  try {
    const [rows] = await db.query("SELECT 1 AS result");

    res.status(200).json({
      message: "Database connection is working",
      result: rows[0].result,
    });
  } catch (error) {
    next(error);
  }
});

/* Rotte per le risorse dell'API */
app.use("/api/users", userRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/goal-intervals", goalIntervalRoutes);

/* Gestione degli errori e delle rotte non trovate */
app.use(notFoundHandler);
app.use(errorHandler);

/* Esportazione dell'applicazione */
module.exports = app;
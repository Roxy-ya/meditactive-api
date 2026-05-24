require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`MeditActive API server is running on port ${PORT}`);
});

/* Gestione delle promise non gestite */
process.on("unhandledRejection", (error) => {
  console.error("Unhandled rejection:", error.message);
  server.close(() => {
    process.exit(1);
  });
});

/* Gestione delle eccezioni */
process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error.message);
  process.exit(1);
});
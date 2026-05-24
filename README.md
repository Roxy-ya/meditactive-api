# MeditActive API

MeditActive API è un progetto backend sviluppato con Node.js, Express.js e MySQL.

Il progetto espone API JSON RESTful per gestire utenti, obiettivi di meditazione e intervalli temporali associati agli obiettivi.  
L'applicazione è pensata per una piattaforma di meditazione che aiuta gli utenti a seguire obiettivi quotidiani, mensili o annuali legati al benessere personale.

---

## Tecnologie utilizzate

- Node.js
- Express.js
- MySQL
- mysql2
- dotenv
- cors
- nodemon

---

## Funzionalità principali

L'API permette di:

- creare, leggere, modificare ed eliminare utenti;
- creare, leggere, modificare ed eliminare obiettivi;
- creare, leggere, modificare ed eliminare intervalli di obiettivi;
- associare uno o più obiettivi a un intervallo;
- rimuovere un obiettivo da un intervallo;
- visualizzare tutti gli intervalli con utente e obiettivi associati;
- filtrare gli intervalli per obiettivo incluso;
- filtrare gli intervalli per data di inizio e data di fine.

---

## Struttura del progetto

```txt
meditactive-api/
│
├── database/
│   └── migrations.sql
│
├── src/
│   ├── app.js
│   ├── server.js
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── goalController.js
│   │   └── goalIntervalController.js
│   │
│   ├── middlewares/
│   │   ├── asyncHandler.js
│   │   ├── errorHandler.js
│   │   └── notFoundHandler.js
│   │
│   ├── repositories/
│   │   ├── userRepository.js
│   │   ├── goalRepository.js
│   │   └── goalIntervalRepository.js
│   │
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── goalRoutes.js
│   │   └── goalIntervalRoutes.js
│   │
│   ├── utils/
│   │   └── ApiError.js
│   │
│   └── validators/
│       ├── userValidator.js
│       ├── goalValidator.js
│       └── goalIntervalValidator.js
│
├── .env.example
├── .gitignore
├── package.json
└── README.md

---

## Tecst automatici


Il progetto include test automatici realizzati con:

- Jest
- Supertest
- Sinon
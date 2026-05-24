DROP TABLE IF EXISTS goal_interval_goals;
DROP TABLE IF EXISTS goal_intervals;
DROP TABLE IF EXISTS goals;
DROP TABLE IF EXISTS users;

-- Tabella degli utenti
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--- Tabella degli obiettivi
CREATE TABLE goals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabella degli intervalli di tempo per gli obiettivi
CREATE TABLE goal_intervals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

-- Vincoli di integrità referenziale e di validazione
  CONSTRAINT fk_goal_intervals_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

-- Vincolo per assicurare che la data di fine sia successiva o uguale alla data di inizio
  CONSTRAINT chk_goal_interval_dates
    CHECK (end_date >= start_date)
);

-- Tabella delle associazioni tra intervalli e obiettivi
CREATE TABLE goal_interval_goals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  interval_id INT NOT NULL,
  goal_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

-- Vincoli di integrità referenziale
  CONSTRAINT fk_goal_interval_goals_interval
    FOREIGN KEY (interval_id)
    REFERENCES goal_intervals(id)
    ON DELETE CASCADE,

-- Vincolo per assicurare che un obiettivo possa essere associato a più intervalli, ma non duplicati per lo stesso intervallo
  CONSTRAINT fk_goal_interval_goals_goal
    FOREIGN KEY (goal_id)
    REFERENCES goals(id)
    ON DELETE CASCADE,

-- Vincolo di unicità per evitare duplicati di associazioni tra lo stesso intervallo e lo stesso obiettivo
  CONSTRAINT uq_interval_goal UNIQUE (interval_id, goal_id)
);
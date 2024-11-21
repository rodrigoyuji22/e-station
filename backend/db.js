const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("Erro ao abrir o banco de dados:", err.message);
  } else {
    console.log("Conectado ao banco de dados SQLite.");
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
      )`);

    db.run(`
        CREATE TABLE IF NOT EXISTS stations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          source TEXT,
          recycle INTEGER DEFAULT 0,
          available INTEGER
        )`);

    db.run(`
      CREATE TABLE IF NOT EXISTS charging_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        station_id INTEGER,
        status TEXT,
        preferences TEXT,
        FOREIGN KEY (user_id) REFERENCES users (id)
        FOREIGN KEY (station_id) REFERENCES stations (id)
      )`);
  }
});

module.exports = db;

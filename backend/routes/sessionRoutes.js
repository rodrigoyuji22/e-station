const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

// Middleware de autenticação
const authenticate = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "Token não fornecido" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Falha na autenticação" });
    req.userId = decoded.id;
    next();
  });
};

// Endpoint para obter status de recarga
router.get("/", authenticate, (req, res) => {
  db.all(
    `SELECT 
      cs.id, 
      cs.status, 
      cs.preferences, 
      s.source AS station
    FROM 
      charging_sessions cs
      join stations s on cs.station_id = s.id
    WHERE cs.user_id = ?`,
    [req.userId],
    (err, rows) => {
      if (err)
        return res.status(500).json({ message: "Erro ao buscar sessões" });
      res.json(rows);
    }
  );
});

// Endpoint para atualizar preferências de recarga
router.put("/:id", authenticate, (req, res) => {
  const { id } = req.params;
  const { status, station_id, preferences } = req.body;

  db.run(
    `UPDATE charging_sessions SET status = ?, preferences = ? WHERE id = ? AND user_id = ?`,
    [status, preferences, id, req.userId],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Erro ao atualizar sessão" });
      }
      if (
        status.trim().toLowerCase() == "completed" ||
        status.trim().toLowerCase() == "canceled"
      ) {
        db.run(
          "UPDATE stations SET available = 1 WHERE id = ?",
          [station_id],
          (err) => {
            if (err) {
              return res
                .status(500)
                .json({ message: "Erro ao atualizar estação" });
            }
          }
        );
      }
      res.json({ message: "Sessão atualizada com sucesso!" });
    }
  );
});

router.post("/", authenticate, (req, res) => {
  const { station_id, preferences } = req.body;
  db.run(
    'INSERT INTO charging_sessions (user_id, station_id, status, preferences) VALUES (?, ?, "pending", ?)',
    [req.userId, station_id, preferences],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Erro ao registrar sessão" });
      } else {
        db.run(
          "UPDATE stations SET available = 0 WHERE id = ?",
          [station_id],
          (err) => {
            if (err)
              return res
                .status(500)
                .json({ message: "Erro ao atualizar estação" });
          }
        );
      }
      res.json({ message: "Sessão registrada com sucesso!" });
    }
  );
});

module.exports = router;

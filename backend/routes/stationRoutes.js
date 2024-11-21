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

router.get("/", authenticate, (req, res) => {
  db.all(
    "SELECT * FROM stations ORDER BY recycle DESC, id DESC",
    [],
    (err, rows) => {
      if (err)
        return res.status(500).json({ message: "Erro ao buscar sessões" });
      res.json(rows);
    }
  );
});

router.post("/", authenticate, (req, res) => {
  const { source, is_reciclable } = req.body;
  db.run(
    "INSERT INTO stations (source,recycle, available) VALUES (?,?, 1)",
    [source, is_reciclable],
    (err) => {
      if (err)
        return res.status(500).json({ message: "Erro ao registrar estação" });
      res.json({ message: "Estação registrada com sucesso!" });
    }
  );
});

module.exports = router;

const jwt = require("jsonwebtoken");
const turnModel = require("../models/turnModel");

const createTurn = (req, res) => {
  const newTurn = {
    status: "IN_PROGRESS",
  };

  turnModel.insertTurn(newTurn, (err, result) => {
    if (err) {
      console.error("Erro ao inserir turno:", err);
      return res.status(500).json({ error: "Erro ao criar turno" });
    }

    jwt.sign({ turn: newTurn }, "secretKey", (err, token) => {
      if (err) return res.sendStatus(500);
      res.json({ token, turn: newTurn });
    });
  });
};

module.exports = {
  createTurn,
};

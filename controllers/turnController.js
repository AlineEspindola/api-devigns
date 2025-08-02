const jwt = require("jsonwebtoken");
const turnModel = require("../models/turnModel");

const getTurn = (req, res) => {
  const { turnID } = req.params;

  turnModel.getTurnById(turnID, (err, result) => {
    if (err) {
      console.error("Erro ao pegar ao pegar o turno: ", err);
      return res.status(500).json({
        error: "Erro interno ao buscar o turno",
      });
    }

    if (!result || result.length === 0) {
      return res.status(404).json({ error: "Turno não encontrado" });
    }

    return res.status(200).json(result);
  });
};

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

const finishTurn = (req, res) => {
  const token = req.token;
  const { turn_ID } = req.body;

  if (!turn_ID) {
    return res.status(400).json({ error: "turn_ID é obrigatório" });
  }

  jwt.verify(token, "secretKey", (err, authData) => {
    if (err) {
      return res.sendStatus(403);
    }

    turnModel.getTurnById(turn_ID, (err, turn) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao buscar turno" });
      }

      if (!turn) {
        return res.status(404).json({ error: "Turno não encontrado" });
      }

      if (turn.status === "DONE") {
        return res.status(400).json({ message: "Turno já está finalizado" });
      }

      turnModel.finishTurn(turn_ID, "DONE", (err, result) => {
        if (err) {
          return res.status(500).json({ error: "Erro ao finalizar turno" });
        }

        res.json({ message: "Turno finalizado com sucesso" });
      });
    });
  });
};

module.exports = {
  getTurn,
  createTurn,
  finishTurn,
};

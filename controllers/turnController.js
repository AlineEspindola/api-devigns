const jwt = require("jsonwebtoken");
const turnModel = require("../models/turnModel");
const chapterModel = require("../models/chapterModel");
const optionsModel = require("../models/optionsModel");

const getTurn = (req, res) => {
  const { turnID } = req.params;

  turnModel.getTurnById(turnID, (err, result) => {
    if (err) {
      console.error("Erro ao pegar o turno: ", err);
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

const chooseOption = (req, res) => {
  const { turnID, choice } = req.params;

  if (!choice) {
    console.error("Não foi informado o parâmetro 'choice'");
    return res.status(400).json({ error: "Parâmetro 'choice' é obrigatório" });
  }

  turnModel.getTurnById(turnID, (err, turnResult) => {
    if (err)
      return res.status(500).json({ error: "Erro interno ao buscar o turno" });
    if (!turnResult || turnResult.length === 0)
      return res.status(404).json({ error: "Turno não encontrado" });
    if (turnResult.status === "DONE")
      return res.status(400).json({ error: "O turno já foi finalizado" });

    chapterModel.getChapterByTurnID(turnID, (err, chapterResult) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Erro interno ao buscar capítulo" });
      if (!chapterResult || chapterResult.length === 0)
        return res.status(404).json({ error: "Capítulo não encontrado" });

      const chapterID = chapterResult[0].chapter_ID;

      optionsModel.getOptionsByChapterID(chapterID, (err, optionsResult) => {
        if (err)
          return res
            .status(500)
            .json({ error: "Erro interno ao buscar opções" });
        if (!optionsResult || optionsResult.length === 0)
          return res.status(404).json({ error: "Opções não encontradas" });

        const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
        const newScores = {
          sanity: clamp(
            turnResult.sanity + optionsResult[0][`${choice}_sanity`],
            0,
            100
          ),
          knowledge: clamp(
            turnResult.knowledge + optionsResult[0][`${choice}_knowledge`],
            0,
            100
          ),
          money: clamp(
            turnResult.money + optionsResult[0][`${choice}_money`],
            0,
            100
          ),
        };

        turnModel.updateTurn(turnID, newScores, (err, updateTurnResult) => {
          if (err) {
            return res.status(500).json({ error: "Erro ao atualizar turno" });
          }

          if (updateTurnResult.affectedRows === 0) {
            return res
              .status(404)
              .json({ error: "Turno não encontrado para atualizar" });
          }

          chapterModel.updateChapter(
            chapterID,
            { turn_ID: null },
            (err, updateChapterResultOld) => {
              if (err) {
                return res
                  .status(500)
                  .json({ error: "Erro ao atualizar capítulo" });
              }

              if (updateChapterResultOld.affectedRows === 0) {
                return res
                  .status(404)
                  .json({ error: "Capítulo não encontrado" });
              }

              return res.status(200).json({
                message: `Você escolheu a opção '${choice}' com sucesso.`,
                updatedScores: newScores,
              });
            }
          );
        });
      });
    });
  });
};

module.exports = {
  getTurn,
  createTurn,
  finishTurn,
  chooseOption,
};

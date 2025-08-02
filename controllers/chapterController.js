const chapterModel = require("../models/chapterModel");

const addTurnToChapter = (req, res) => {
  const { chapterID } = req.params;
  const { turnID } = req.body;

  chapterModel.insertTurnToChapter(chapterID, turnID, (err, result) => {
    if (err) {
      console.error("Erro ao inserir turno no capítulo: ", err);
      return res
        .status(500)
        .json({ error: "Erro ao colocar turno no capítulo" });
    }

    res.json({ message: "Turno adicionado ao capítulo com sucesso" });
  });
};

const getChapterByTurnID = (req, res) => {
  const { turnID } = req.params;

  chapterModel.getChapterByTurnID(turnID, (err, result) => {
    if (err) {
      console.error("Erro ao pegar o capítulo por meio do ID do turno: ", err);
      return res
        .status(500)
        .json({ error: "Erro interno ao buscar capítulo pelo ID do turno" });
    }

    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ error: "Capítulo não encontrado para este turno" });
    }

    return res.status(200).json(result);
  });
};

module.exports = {
  addTurnToChapter,
  getChapterByTurnID,
};

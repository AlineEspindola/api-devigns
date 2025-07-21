const chapterModel = require("../models/chapterModel");

const addTurnToChapter = (req, res) => {
  const { chapterID } = req.params;
  const { turnID } = req.body;

  chapterModel.insertTurnToChapter(chapterID, turnID, (err, result) => {
    if (err) {
      console.error("Erro ao inserir turno no capítulo:", err);
      return res.status(500).json({ error: "Erro ao colocar turno no capítulo" });
    }

    res.json({ message: "Turno adicionado ao capítulo com sucesso" });
  });
}

module.exports = {
  addTurnToChapter,
};
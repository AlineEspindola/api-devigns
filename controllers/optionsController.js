const optionsModel = require("../models/optionsModel");

const getOptionsByChapterID = (req, res) => {
  const { chapterID } = req.params;

  optionsModel.getOptionsByChapterID(chapterID, (err, result) => {
    if (err) {
      console.error(
        "Erro ao pegar as opções por meio do ID do capítulo: ",
        err
      );
      return res.status(500).json({
        error: "Erro interno ao buscar as opções pelo ID do capítulo",
      });
    }

    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ error: "Opções não encontradas para este capítulo" });
    }

    return res.status(200).json(result);
  });
};

module.exports = {
  getOptionsByChapterID,
};

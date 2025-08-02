const db = require("../config/db");

const OptionsModel = {
  getOptionsByChapterID: (chapter_ID, callback) => {
    const sql = "SELECT * FROM options WHERE chapter_ID = ?"
    db.query(sql, [chapter_ID], callback)
  },
};

module.exports = OptionsModel;


const db = require('../config/db');

const ChapterModel = {
  insertTurnToChapter: (chapter_ID, turn_ID, callback) => {
    const sql = "UPDATE chapter SET turn_ID = ? WHERE chapter_ID = ?";
    db.query(sql, [turn_ID, chapter_ID], callback);
  },

  getChapterByTurnID: (turn_ID, callback) => {
    const sql = "SELECT * FROM chapter WHERE turn_ID = ? "
    db.query(sql, [turn_ID], callback)
  }
}

module.exports = ChapterModel;

const db = require('../config/db');

const TurnModel = {
  insertTurn: (turnData, callback) => {
    const sql = "INSERT INTO turn SET ?";
    db.query(sql, turnData, callback);
  },

  finishTurn: (turn_ID, status, callback) => {
    const sql = "UPDATE turn SET status = ? WHERE turn_ID = ?";
    db.query(sql, [status, turn_ID], callback);
  }
}

module.exports = TurnModel;

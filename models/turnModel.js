const db = require('../config/db');

const TurnModel = {
  insertTurn: (turnData, callback) => {
    const sql = "INSERT INTO turn SET ?";
    db.query(sql, turnData, callback);
  },

  getTurnById: (turn_ID, callback) => {
    const sql = "SELECT * FROM turn WHERE turn_ID = ?";
    db.query(sql, [turn_ID], (err, results) => {
      if (err) return callback(err);
      if (results.length === 0) return callback(null, null);
      callback(null, results[0]);
    });
  },

  finishTurn: (turn_ID, status, callback) => {
    const sql = "UPDATE turn SET status = ? WHERE turn_ID = ?";
    db.query(sql, [status, turn_ID], callback);
  }
}

module.exports = TurnModel;

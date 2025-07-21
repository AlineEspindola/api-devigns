const express = require("express");
const router = express.Router();
const turnController = require("../../controllers/turnController")

router.post("/init_turn", turnController.createTurn);
router.post("/finish_turn", verifyToken, turnController.finishTurn);

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

module.exports = router;

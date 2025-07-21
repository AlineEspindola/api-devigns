const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const turnController = require("../../controllers/turnController")

router.post("/init_turn", turnController.createTurn);
router.post("/finish_turn", verifyToken, turnController.finishTurn);

// router.post("/start_turn", verifyToken, (req, res) => {
//   jwt.verify(req.token, "secretKey", (err, authData) => {
//     if (err) {
//       res.sendStatus(403);
//     } else {
//       res.json({
//         message: "Turn created...",
//         authData
//       });
//     }
//   });
// });

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

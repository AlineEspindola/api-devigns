const express = require("express");
const router = express.Router();
const chapterController = require("../../controllers/chapterController")

router.put("/:chapterID/:turnID/turn", verifyToken, chapterController.addTurnToChapter);
router.get("/:turnID", chapterController.getChapterByTurnID)

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

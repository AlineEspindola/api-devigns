const express = require("express");
const router = express.Router();
const chapterController = require("../../controllers/chapterController")

router.put("/:chapterID/:turnID/turn", chapterController.addTurnToChapter);
router.get("/:turnID", chapterController.getChapterByTurnID)

module.exports = router;

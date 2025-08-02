const express = require("express");
const router = express.Router();
const optionsController = require("../../controllers/optionsController")

router.get("/:chapterID", optionsController.getOptionsByChapterID)

module.exports = router;
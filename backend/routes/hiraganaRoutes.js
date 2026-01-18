const express = require("express");
const { getHiragana } = require("../controllers/hiraganaController");

const router = express.Router();
router.get("/", getHiragana);

module.exports = router;

const hiragana = require("../data/hiragana.json");

exports.getHiragana = (req, res) => {
  res.json(hiragana);
};

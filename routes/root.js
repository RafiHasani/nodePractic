const express = require("express");
const router = express.Router();
const path = require("path");

router.get("ˆ/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

module.exports = router;

const express = require("express");
const router = express.Router();
const path = require("path");

const refreshToken = require("../../controllers/refreshController");

router.get("/", refreshToken.handleRefreshToken);

module.exports = router;

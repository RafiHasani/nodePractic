const express = require("express");

const router = express.Router();

const path = require("path");

const authUser = require("../../controllers/authController");

router.post("/", authUser.handlUserAuth);

module.exports = router;

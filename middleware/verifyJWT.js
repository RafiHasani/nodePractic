require("dotenv").config();
const jwt = require("jsonwebtoken");

const env = require("process").env;

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);
  console.log(authHeader);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, `${env.ACCESS_TOKEN_SECRET}`, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded.username;
    next();
  });
};

module.exports = verifyJWT;

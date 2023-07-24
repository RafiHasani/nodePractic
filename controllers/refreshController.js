const usersDb = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const env = require("process").env;

const jwt = require("jsonwebtoken");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const handleRefreshToken = (req, res) => {
  console.log("refresh api called");

  console.log(req.cookies.jwt);
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    res.status(401).json({ cookie: "cookies not found" });
    return;
  }

  console.log(cookies);
  const refreshToken = cookies.jwt;

  const foundUser = usersDb.users.find(
    (user) => user.refreshToken === refreshToken
  );

  if (!foundUser) return res.sendStatus(403);

  jwt.verify(refreshToken, `${env.REFRESH_TOKEN_SECRET}`, (err, decoded) => {
    if (err || foundUser.username !== decoded.username)
      return res.sendStatus(403);
    const accessToken = jwt.sign(
      { username: decoded.username },
      `${env.ACCESS_TOKEN_SECRET}`,
      { expiresIn: "30s" }
    );
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };

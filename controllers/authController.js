require("dotenv").config();

const usersDb = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fsPromises = require("fs").promises;
const path = require("path");

const handlUserAuth = async (req, res) => {
  const { username, pass } = req.body;

  console.log(`${username} ${pass}`);

  if (!username || !pass) {
    res.status(401).json({
      message: "Invalid username or password",
    });
    return;
  }

  const foundUser = usersDb.users.find((user) => user.username == username);

  console.log(foundUser);

  if (foundUser) {
    const isPasswordMatch = await bcrypt.compare(pass, foundUser.password);
    if (isPasswordMatch) {
      const accessToken = jwt.sign(
        { username: foundUser.username },
        `${process.env.ACCESS_TOKEN_SECRET}`,
        {
          expiresIn: "30s",
        }
      );
      const refreshToken = jwt.sign(
        { username: foundUser.username },
        `${process.env.REFRESH_TOKEN_SECRET}`,
        {
          expiresIn: "1d",
        }
      );

      const otherUsers = usersDb.users.filter(
        (person) => person.username !== foundUser.username
      );

      const currentUser = { ...foundUser, refreshToken };
      usersDb.setUsers([...otherUsers, currentUser]);

      await fsPromises.writeFile(
        path.join(__dirname, "../model/users.json"),
        JSON.stringify(usersDb.users)
      );

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        SameSite: "None",
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json(accessToken);
      return;
    } else {
      res.status(401).json({
        message: "Invalid username or password",
      });
      return;
    }
  } else {
    return res.status(400).json({
      message: "User not found",
    });
  }
};

module.exports = { handlUserAuth };

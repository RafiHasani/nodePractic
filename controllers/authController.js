const usersDb = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const bcrypt = require("bcrypt");
const User = require("../model/userModel");

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
      res.status(200).json({
        message: "successfully authenticated",
      });
      return;
    } else {
      res.status(401).json({
        message: "Invalid username or password",
      });
      return;
    }
  } else {
    res.status(400).json({
      message: "User not found",
    });
    return;
  }
};

module.exports = { handlUserAuth };

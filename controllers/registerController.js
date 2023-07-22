const usersDb = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const User = require("../model/userModel");

const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, pass } = req.body;

  console.log(`api called with user ${user} and pass ${pass}`);
  if (!user || !pass)
    return res.status(400).json({
      message: "Username or password are required",
    });

  const duplicate = usersDb.users.find((person) => {
    person.username === user;
  });
  if (duplicate) return res.sendStatus(409);

  try {
    const hashpass = await bcrypt.hash(pass, 10);
    //store the new user name and password

    const newUser = new User(user, hashpass);
    usersDb.setUsers([...usersDb.users, newUser]);

    await fsPromises.writeFile(
      path.join(__dirname, "../", "/model/users.json"),
      JSON.stringify(usersDb.users)
    );
    console.log(usersDb.users);
    res.status(201).json({
      success: `New user with name: ${newUser.username} and password: ${newUser.password} created`,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = { handleNewUser };

const UserDb = {
  users: require("../model/users.json"),
  setUsers: function (users) {
    this.users = users;
  },
};

const fsPromises = require("fs").promises;
const path = require("path");

const handleLogoutUser = async (req, res) => {
  // on client user delete access or logout

  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204); // no content found

  const refreshToken = cookies.jwt;

  const foundedUser = UserDb.users.find((person) => {
    person.refreshToken = refreshToken;
  });

  if (!foundedUser) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(204);
  }
  const otherUsers = UserDb.users.filter(
    (user) => user.refreshToken !== foundedUser.refreshToken
  );

  const currentUser = { ...foundedUser, refreshToken: "" };
  UserDb.setUsers([...otherUsers, currentUser]);

  await fsPromises.writeFile(
    path.join(__dirname, "..", "/model/users.json"),
    JSON.stringify(UserDb.users)
  );

  res.clearCookie("jwt", { httpOnly: true });

  res.sendStatus(204);
};

module.exports = { handleLogoutUser };

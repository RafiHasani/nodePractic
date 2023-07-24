const {logEvents} = require("./logevents");
const errorHandler = function (err, req, res, next) {

  logEvents(`${err.name} ${err.message}`, "errLog.txt");
  console.log(err);
  res.status(500).send(err.message);
};

module.exports = errorHandler;

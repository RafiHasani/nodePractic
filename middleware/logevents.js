const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
console.log(format(new Date(), "yyyy-MMM-dd hh:mm a"));

const fs = require("fs");

const fsPromises = require("fs").promises;
const path = require("path");

const logEvents = async (message, filename) => {
  const dateTime = `${format(new Date(), "yyyy-MM-dd\t HH:mm")}`;
  const logitem = `${dateTime}\t ${uuid()}\t ${message}\n`;

  console.log(logitem);
  //logfile

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", filename),
      logitem
    );
  } catch (err) {
    console.error(err);
  }
};

const logger = (req, res, next) => {
  logEvents(`${req.url}\t${req.headers.origin}\t${req.path}`, "reqLogs.txt");
  next();
};

module.exports = { logger, logEvents };

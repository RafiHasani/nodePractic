const whitelist = ["http://localhost:3500/"];

const corsOption = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed domain"));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOption;

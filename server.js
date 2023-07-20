const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const { logger } = require("./middleware/logevents");
const errorHandler = require("./middleware/errorHandler");

const corsOptions = require("./config/corsOption");

const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger);

app.use(cors(corsOptions));
app.use(express.json());

app.use("/", express.static(path.join(__dirname, "/public")));
app.use("/", require("./routes/root"));
app.use("/employees", require("./routes/api/employees"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({
      error: "404 Not Found",
    });
  } else {
    res.type("txt").send("404 Not Found");
  }
});
app.use(errorHandler);
app.listen(PORT, () => console.log("Server listening on " + PORT));

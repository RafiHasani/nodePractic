const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { logger } = require("./middleware/logevents");
const errorHandler = require("./middleware/errorHandler");

const corsOptions = require("./config/corsOption");
const verifyJWT = require("./middleware/verifyJWT");

const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger);

app.use(cors(corsOptions));
app.use(express.json());

// middleware for cookies

app.use("/", express.static(path.join(__dirname, "/public")));
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/api/register"));
app.use(cookieParser());
app.use("/login", require("./routes/api/auth"));

app.use("/logout", require("./routes/api/logout"));

app.use("/refresh", require("./routes/api/refreshToken"));

app.use(verifyJWT);
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

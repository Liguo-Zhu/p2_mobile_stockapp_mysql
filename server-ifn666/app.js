var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

//post
//localhost:3000/users/register
//json file
// {
// 	"email": "f@f.com",
// 	"password": "123456"
// }

//import cors
const cors = require("cors");

// step 1: import the files and config
const options = require("./knexfile");
const knex = require("knex")(options);

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

//// step 4: import api routes from api.js to this file.
const apiRouter = require("./routes/api");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// aad cores
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// step 2: create a middleware to use db for step 1.
app.use((req, res, next) => {
  req.db = knex;
  next();
});

app.use("/", indexRouter);
app.use("/users", usersRouter);

// step 4: use api routes from api.js
app.use("/api", apiRouter);

// step 3: test part for testing the database.
// test the database whether it is ok or not.
app.get("/knex", function (req, res, next) {
  req.db
    .raw("SELECT VERSION()")
    .then((version) => console.log(version[0][0]))
    .catch((err) => {
      throw err;
    });

  res.send("Version logged successfully");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

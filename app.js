/*jslint node: true, nomen: true*/
"use strict";

var express = require("express");
var path = require("path");

var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var fs = require("fs");
var routes = require("./routes/index");
var app = express();
// view engine setup (not included)

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());

// get config

// pretend to return favicon
app.get("/favicon.ico", function (req, res) {
  res.sendStatus(200);
});

// Set the ENV variable to point to the right environment

switch (process.env.NODE_ENV) {
  case "development":
    app.set("env", "development");
    break;
  case "production":
    app.set("env", "production");
    break;
  case "test":
    app.set("env", "test");
    break;
  default:
    console.error(
      "NODE_ENV environment variable should have value 'development', 'test', or 'production' \nExiting"
    );
    process.exit();
}

//load the config variables depending on the environment

var config_file_name = app.get("env") + "_config.json";
var data = fs.readFileSync(path.join(__dirname, "config", config_file_name));

var configObject, property;
try {
  configObject = JSON.parse(data);
} catch (err) {
  console.log("There has been an error parsing the config file JSON.");
  console.log(err);
  process.exit();
}
app.config = {};
for (property in configObject) {
  if (configObject.hasOwnProperty(property)) {
    app.config[property] = configObject[property];
  }
}

var logLevel = process.env.LOGGING_LEVEL;
if (
  !(
    logLevel === "info" ||
    logLevel === "warn" ||
    logLevel === "error" ||
    logLevel === "debug"
  )
) {
  console.warn(
    "LOGGING_LEVEL environment variable not set to a valid logging level. Using default level info"
  );
  logLevel = "info";
}

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );

  //intercepts OPTIONS method
  if ("OPTIONS" === req.method) {
    //respond with 200
    res.sendStatus(200);
  } else {
    //move on
    next();
  }
});

app.use("/", routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stack traces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {},
  });
});

module.exports = app;

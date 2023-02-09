"use strict";

/*
 * nodejs-express-mongoose-movie-online
 * MIT Licensed
 */

/**
 * Module dependencies
 */

require("dotenv").config();

const fs = require("fs");
const join = require("path").join;
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const config = require("./src/config");
const helpers = require("./src/app/helpers");

const models = join(__dirname, "src/app/models");
const port = process.env.PORT || 3000;
const app = express();
global.__basedir = __dirname;
global.helpers = helpers;

/**
 * Expose
 */

module.exports = app;

// Bootstrap models
fs.readdirSync(models)
  .filter((file) => ~file.search(/^[^.].*\.js$/))
  .forEach((file) => require(join(models, file)));

// Bootstrap routes
require("./src/config/passport")(passport);
require("./src/config/express")(app, passport);
require("./src/config/routes")(app, passport);

connect();

function listen() {
  if (app.get("env") === "test") return;
  app.listen(port);
  console.log("Express app started on port " + port);
  console.log("App url: http://127.0.0.1:" + port);
}

function connect() {
  mongoose.connection
    .on("error", console.log)
    .on("disconnected", connect)
    .once("open", listen);
  mongoose.set("strictQuery", false);
  return mongoose.connect(config.db, {
    keepAlive: true,
    useNewUrlParser: true,
  });
}

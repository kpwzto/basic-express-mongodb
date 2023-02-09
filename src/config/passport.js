"use strict";

/*!
 * Module dependencies.
 */

const google = require("./passport/google");
const jwt = require("./passport/jwt");

/**
 * Expose
 */

module.exports = function (passport) {
  passport.use(jwt);
  passport.use(google);
};

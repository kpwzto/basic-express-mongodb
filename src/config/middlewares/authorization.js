"use strict";

/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {
  if (req.isAuthenticated()) return next();
  return res
    .status(200)
    .json({ status: false, message: "You need login to access server!" });
};

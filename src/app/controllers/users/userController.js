"use strict";

/**
 * Module dependencies.
 */

const mongoose = require("mongoose");
const { wrap: async } = require("co");
const only = require("only");
const User = mongoose.model("User");

const { sign } = require("../../../config/middlewares/jwt");

/**
 * Load
 */

exports.load = async(function* (req, res, next, _id) {
  const criteria = { _id };
  try {
    req.profile = yield User.load({ criteria });
    if (!req.profile) return next(new Error("User not found"));
  } catch (err) {
    return next(err);
  }
  next();
});

/**
 * Create user
 */

exports.create = async(function* (req, res) {
  const user = new User(only(req.body, "name email password password_confirm"));
  user.provider = "local";
  try {
    yield user.save();
    req.logIn(user, (err) => {
      if (err) {
        res.status(403).json({
          status: false,
          message: "Sorry! We are not able to log you in!",
        });
      } else {
        res.status(200).json({ status: true });
      }
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err._message });
  }
});

exports.login = async(function* (req, res) {
  const params = only(req.body, "email password");
  try {
    const user = yield User.findOne({ email: params.email });

    if (user && user.email) {
      const isAuthenticated = user.authenticate(params.password);
      if (!isAuthenticated || user.status !== 1) {
        return res.status(403).json({ status: false });
      }
      const token = sign(user._id);
      return res.status(200).json({ status: true, token: token });
    }
    res.status(403).json({ status: false });
  } catch (err) {
    console.log(err);
    res.status(400).json({ status: false, message: err._message });
  }
});

/**
 *  Show profile
 */

exports.profile = async(function* (req, res, next) {
  const criteria = req.user._id;
  try {
    let profile = yield User.findById(criteria, "name email");
    return res.status(200).json({ status: true, profile: profile });
  } catch (err) {
    return res.status(404).json({ status: false });
  }
});

/**
 * Logout
 */
exports.logout = function (req, res) {
  return res.status(200).json({ status: true });
};

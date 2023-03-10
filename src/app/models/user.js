"use strict";

/**
 * Module dependencies.
 */

const mongoose = require("mongoose");
const crypto = require("crypto");

const Schema = mongoose.Schema;
const oAuthTypes = ["google"];

/**
 * User Schema
 */

const UserSchema = new Schema({
  name: { type: String, default: "" },
  email: { type: String, default: "" },
  provider: { type: String, default: "" },
  hashed_password: { type: String, default: "" },
  salt: { type: String, default: "" },
  type: { type: Number, default: 0 },
  status: { type: Number, default: 1 },
  authToken: { type: String, default: "" },
  facebook: {},
  twitter: {},
  google: {},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const validatePresenceOf = (value) => value && value.length;

/**
 * Virtuals
 */

UserSchema.virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

UserSchema.virtual("password_confirm")
  .set(function (password) {
    this._password_confirm = password;
  })
  .get(function () {
    return this._password_confirm;
  });

/**
 * Validations
 */

// the below 5 validations only apply if you are signing up traditionally

UserSchema.path("name").validate(function (name) {
  if (this.skipValidation()) return true;
  return name.length;
}, "user.name.required");

UserSchema.path("email").validate(function (email) {
  if (this.skipValidation()) return true;
  return email.length;
}, "user.email.required");

UserSchema.path("email").validate(function (email) {
  const regex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return email.length && regex.test(email);
}, "user.email.invalid");

UserSchema.path("email").validate(function (email) {
  return new Promise((resolve) => {
    const User = mongoose.model("User");
    if (this.skipValidation()) return resolve(true);

    // Check only when it is a new user or when email field is modified
    if (this.isNew || this.isModified("email")) {
      User.find({ email }).exec((err, users) => resolve(!err && !users.length));
    } else resolve(true);
  });
}, "user.email.exist");

UserSchema.path("hashed_password").validate(function (hashed_password) {
  if (this.skipValidation()) return true;
  if (this._password !== this._password_confirm) {
    this.invalidate("password_confirm", "user.password_confirm.not_match");
  }
  return hashed_password.length && this._password.length;
}, "user.password.required");

/**
 * Pre-save hook
 */

UserSchema.pre("save", function (next) {
  if (!this.isNew) return next();

  if (!validatePresenceOf(this.password) && !this.skipValidation()) {
    next(new Error("user.password.invalid"));
  } else {
    next();
  }
});

/**
 * Methods
 */

UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */

  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */

  makeSalt: function () {
    return (
      process.env.APP_KEY +
      "-" +
      Math.round(new Date().valueOf() * Math.random())
    );
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */

  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },

  /**
   * Validation is not required if using OAuth
   */

  skipValidation: function () {
    return ~oAuthTypes.indexOf(this.provider);
  },
};

/**
 * Statics
 */

UserSchema.statics = {
  /**
   * Load
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  load: function (options, cb) {
    options.select = options.select || "name";
    return this.findOne(options.criteria).select(options.select).exec(cb);
  },
};

mongoose.model("User", UserSchema);

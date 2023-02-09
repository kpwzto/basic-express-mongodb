"use strict";

/*
 * Module dependencies.
 */
const users = require("../../app/controllers/users/userController");

/**
 * Expose routes
 */

module.exports = function (app, pauth) {
  const userAuth = pauth("jwt", { session: false });

  // User route
  app.post("/api/user/signup", users.create);
  app.post("/api/user/login", users.login);
  app.get("/api/user/profile", userAuth, users.profile);
  app.get("/api/user/logout", users.logout);
};

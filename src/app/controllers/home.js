'use strict';

/**
 * Module dependencies.
 */
const { wrap: async } = require('co');

/**
 * Home page
 */

exports.index = async(function*(req, res) {
  res.status(200).json({ status: true, message: "Welcome to api resources!" });
});


'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const User = mongoose.model('User');
const co = require('co');

/**
 * Clear database
 *
 * @param {Object} t<Ava>
 * @api public
 */

exports.cleanup = function(t) {
  co(function*() {
    yield User.deleteMany();
    t.end();
  });
};

const jwt = require("jsonwebtoken");
const config = require("../index");

exports.sign = function (id) {
  const token = jwt.sign({ _id: id }, config.jwt.secret_key, {
    expiresIn: config.jwt.expires_in,
  });
  return token;
};

"use strict";

/**
 * Expose
 */

module.exports = {
  db: process.env.MONGODB_URL,
  google: {
    clientID: process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL:
      "https://nodejs-express-demo.herokuapp.com/auth/google/callback",
  },
  jwt: {
    secret_key: process.env.JWT_SECRET_KEY,
    expires_in: process.env.JWT_TTL || 3600,
  },
};

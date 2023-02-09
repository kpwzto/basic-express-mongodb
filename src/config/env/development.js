"use strict";

/**
 * Expose
 */

const port = process.env.PORT || 3000;

module.exports = {
  db: process.env.MONGODB_URL || "mongodb://localhost/test",
  google: {
    clientID: process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: `http://localhost:${port}/auth/google/callback`,
  },
  jwt: {
    secret_key: process.env.JWT_SECRET_KEY,
    expires_in: process.env.JWT_TTL || 3600,
  },
};

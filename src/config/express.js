'use strict';

/**
 * Module dependencies.
 */

const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const upload = require('multer')();

const winston = require('winston');
const helpers = require('view-helpers');
const requireHttps = require('./middlewares/require-https');
const pkg = require('../../package.json');

const env = process.env.APP_ENV || 'development';

/**
 * Expose
 */

module.exports = function(app, passport) {

  app.use(helmet());
  // Run multiple port ( other 443 ) can not require https
  app.use(requireHttps);

  // Compression middleware (should be placed before express.static)
  app.use(
    compression({
      threshold: 512
    })
  );

  app.use(
    cors({
      origin: "*",
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
      credentials: true
    })
  );

  // Use winston on production
  let log = 'dev';
  if (env !== 'development') {
    log = {
      stream: {
        write: message => winston.info(message)
      }
    };
  }

  // Don't log during tests
  // Logging middleware
  if (env !== 'test') app.use(morgan(log));

  // bodyParser should be above methodOverride
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(upload.single('image'));

  app.use(
    methodOverride(function(req) {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method;
        delete req.body._method;
        return method;
      }
    })
  );

  // use passport session
  app.use(passport.initialize());

  app.use(helpers(pkg.name));

  if (env === 'development') {
    app.locals.pretty = true;
  }
};

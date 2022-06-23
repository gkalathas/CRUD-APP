const express = require('express');
const glob = require('glob');
const db = require('../app/models');
const session = require('express-session');
const favicon = require('serve-favicon');
const fileUpload = require('express-fileupload');
const pino = require('pino-http')({
  serializers: {
    req(request) {
      return {
        method: request.method,
        url: request.url,
        path: request.routerPath,
        parameters: request.params,
      };
    },
    res(reply) {
      return {
        statusCode: reply.statusCode,
      };
    },
  },
});

// Store needed for express-session. it should be initialised once!
const SequelizeStore = require('connect-session-sequelize')(session.Store);

module.exports = (app, config) => {
  // Request and response logging middleware
  app.use(pino);

  // Set express to render with .pug files and point to the views directory
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'pug');

  // Serve favicon middleware
  app.use(favicon(config.root + '/public/img/favicon.ico'));

  // Serve static files middleware
  app.use(express.static(config.root + '/public'));

  // Client session middleware
  app.use(
    session({
      secret: process.env.SECRET_KEY,
      store: new SequelizeStore({
        db: db.sequelize,
      }),
      resave: false,
      saveUninitialized: true,
    })
  );

  // File upload middleware
  app.use(fileUpload());

  // Interpret JSON of req.body middleware
  app.use(express.json());

  // Interpret forms' data of req.body middleware
  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  // Scans the /app/controllers directory and adds a router at each route
  const controllers = glob.sync(config.root + '/app/controllers/*.js');
  controllers.forEach((controller) => {
    require(controller)(app);
  });

  // Custom 404 middleware
  // If no route was selected from the controllers,
  // then we don't serve that // route and return a 404 error
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // Custom error handler for all express errors
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      title: 'error',
    });
  });

  return app;
};

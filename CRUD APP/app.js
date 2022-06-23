require('dotenv').config();
const logger = require('pino')();
const express = require('express');

const config = require('./config/config');
const db = require('./app/models');

const app = express();

module.exports = require('./config/express')(app, config);

db.sequelize
  .sync()
  .then(() => {
    if (!module.parent) {
      app.listen(config.port, () => {
        logger.info('Express server listening on port ' + config.port);
      });
    }
  })
  .catch((e) => {
    throw new Error(e);
  });

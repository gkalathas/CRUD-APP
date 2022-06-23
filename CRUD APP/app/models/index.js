const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../../config/config');
const db = {};
const logger = require('pino')();

// Connecting to a database
// Passing parameters separately
const sequelize = new Sequelize(
  config.db,
  config.dbUsername,
  config.dbPassword,
  {
    logging: (msg) => logger.info(msg),
    dialect: config.dbDialect,
    logQueryParameters: true,
  }
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Scans the /app/models directory and defines a
// models for every file. E.g. todo.js -> Todos table
fs.readdirSync(__dirname)
  .filter((file) => file.indexOf('.') !== 0 && file !== 'index.js')
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize);
    db[model.name] = model;
  });

module.exports = db;

const path = require("path");

const rootPath = path.normalize(path.join(__dirname, "/..")).replace(/\\/g, '/');

const config = {
  root: rootPath,
  port: process.env.PORT || 3000,
  db: process.env.DEV_DB,
  dbUsername: process.env.DEV_DB_USERNAME,
  dbPassword: process.env.DEV_DB_PASSWORD,
  dbDialect: process.env.DEV_DB_DIALECT,
};

module.exports = config;

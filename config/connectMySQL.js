const mysql = require("mysql");
const fs = require("fs");
var config = require("./config.json").development;

module.exports = {
  con: mysql.createConnection({
    host: config.host,
    user: config.username,
    password: config.password,
    database: config.database,
  }),
};

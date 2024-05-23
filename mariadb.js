// Get the client
const mysql = require("mysql2");
const config = require("./config/config");

// Create the connection to database
const connection = mysql.createConnection({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  dateStrings: config.db.dateStrings,
});

module.exports = connection;

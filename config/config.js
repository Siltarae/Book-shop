const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  port: process.env.PORT,
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    dateStrings: true,
  },
  jwt: {
    privateKey: process.env.PRIVATE_KEY, //jwt secret key
  },
};

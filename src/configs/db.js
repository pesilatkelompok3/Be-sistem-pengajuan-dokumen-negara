const Sequelize = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;
const HOST = process.env.DB_HOST;
const DIALECT = process.env.DB_DIALECT;

const db = new Sequelize("laundry_db", USERNAME, PASSWORD, {
  host: HOST,
  dialect: DIALECT,
});

module.exports = db;

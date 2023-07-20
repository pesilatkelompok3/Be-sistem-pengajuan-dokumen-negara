const { verifyToken } = require("../helpers/jwt.js");
const { Account } = require("../models");

module.exports = {
  verifyToken(req, res, next) {
    const  access_token  = req.headers['x-access-token'];

    if (!access_token) {
      return res.status(403).send({
        auth: false,
        message: "Error",
        errors: "No token provided",
      });
    }
    const payload = verifyToken(access_token);
    console.log(payload);
    req.userId = payload.id;
      next();
  },

  isAdmin(req, res, next) {
    Account.findByPk(req.userId)
      .then((user) => {
        if (!user) {
          return res.status(403).send({
            status: "fail",
            message: "Id Not Found",
          });
        }

        if (user.role !== "admin" && user.role !== "superAdmin") {
          return res.status(403).send({
            status: "fail",
            message: "Require Admin Role",
          });
        }

        next();
      })
      .catch((error) => {
        res.status(500).send({
          status: "error",
          message: "Internal Server Error",
          error: error.message,
        });
      });
  },

  isSuperAdmin(req, res, next) {
    Account.findByPk(req.userId)
      .then((user) => {
        if (!user) {
          return res.status(403).send({
            status: "fail",
            message: "Id Not Found",
          });
        }

        if (user.role !== "superAdmin") {
          return res.status(403).send({
            status: "fail",
            message: "Require Admin Role",
          });
        }

        next();
      })
      .catch((error) => {
        res.status(500).send({
          status: "error",
          message: "Internal Server Error",
          error: error.message,
        });
      });
  },
};

const jwt = require("jsonwebtoken");
const { Account } = require("../models");

module.exports = {
  verifyToken(req, res, next) {
    let tokenHeader = req.headers["x-access-token"];

    let token = tokenHeader.split(" ")[0];

    if (!token) {
      return res.status(403).send({
        auth: false,
        message: "Error",
        errors: "No token provided",
      });
    }

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res.status(500).send({
          auth: false,
          message: "Error",
          errors: err,
        });
      }
      req.userId = decoded.id;
      next();
    });
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

        if (user.role !== "admin") {
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

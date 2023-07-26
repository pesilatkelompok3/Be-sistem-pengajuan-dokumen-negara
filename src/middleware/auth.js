const { Account } = require("../models/index.js");
const { verifyAccessToken } = require("../helpers/jwt.js");

const authentication = async (req, res, next) => {
  const access_token = req.headers["authorization"];
  const token = access_token && access_token.split(" ")[1];0
  if (!token) {
    return res.status(401).json({ msg: "Mohon Untuk Login Terlebih Dahulu!!" });
  }
  try {
    const payload = await verifyAccessToken(token);
    const result = await Account.findOne({
      where: {
        id: payload.id,
      },
    });
    if (!result) return res.status(404).json({ msg: "User Tidak Di Temukan .." });
    req.accountId = result.id;
    req.name = result.name;
    req.role = result.role;
    next();
  } catch (error) {
    return res.status(401).json({ message: error.message || "Invalid token" });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await Account.findByPk(req.accountId);

    if (!user) {
      return res.status(403).send({
        status: "fail",
        message: "Id Not Found",
      });
    }

    if (user.role !== "admin" && user.role !== "SuperAdmin") {
      return res.status(403).send({
        status: "fail",
        message: "Require Admin Role",
      });
    }

    next();
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const isSuperAdmin = async (req, res, next) => {
  try {
    const user = await Account.findByPk(req.accountId);

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
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


module.exports = {
  authentication,
  isAdmin,
  isSuperAdmin,
};

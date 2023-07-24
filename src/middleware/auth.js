const { Account } = require("../models/index.js");
const { verifyAccessToken } = require("../helpers/jwt.js");

const authentication = async (req, res, next) => {
  const access_token = req.headers["authorization"];
  const token = access_token && access_token.split(" ")[1];
  console.log("test",token);

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

const authorization = async (req, res, next) => {
  const { access_token } = req.headers;
  if (!access_token) {
    return res.status(401).json({ msg: "Mohon Untuk Login Terlebih Dahulu!!" });
  }
  const payload = verifyAccessToken(access_token);
  const result = await Account.findOne({
    where: {
      id: payload.id,
    },
  });
  if (!result) return res.status(404).json({ msg: "User Tidak Di Temukan ..." });
  if (result.id == payload.id) {
    next();
  } else {
    return res.status(401).json({ msg: "Unauthorized" });
  }
};

module.exports = {
  authentication,
  authorization,
};

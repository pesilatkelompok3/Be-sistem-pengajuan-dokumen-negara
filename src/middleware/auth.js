const { Account } = require("../models/index.js");
const { verifyAccessToken } = require("../helpers/jwt.js");

const authentication = async (req, res, next) => {
  const access_token = req.headers["authorization"];
  console.log(access_token);
  const token = access_token && access_token.split(" ")[1];

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

module.exports = {
  authentication,
};

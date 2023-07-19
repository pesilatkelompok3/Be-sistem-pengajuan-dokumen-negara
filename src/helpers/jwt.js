const jwt = require("jsonwebtoken");

const createToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET);
};

module.exports = {
  createToken,
};

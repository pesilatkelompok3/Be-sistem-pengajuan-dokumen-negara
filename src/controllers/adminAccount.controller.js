const argon2 = require("argon2");
const { createToken } = require("../helpers/jwt.js");
const { nanoid } = require("nanoid");
const { Account } = require("../models/index.js");

module.exports = {
  signup: async (req, res) => {
    let user = {};
    if (req.body.email) {
      user = await Account.findOne({
        where: {
          email: req.body.email,
        },
      });
    } else if (req.body.username) {
      user = await Account.findOne({
        where: {
          username: req.body.username,
        },
      });
    }
    try {
      const adminId = `admin-${nanoid(12)}`;
      const hashedPassword = await argon2.hash(req.body.password);

      const user = await Account.create({
        id: adminId,
        username: req.body.username,
        password: hashedPassword,
        role: req.body.role,
      });

      res.status(201).send({
        status: "success",
        id: user.id,
        message: "Account admin registered successfully!",
      });
    } catch (error) {
      res.status(500).send({
        auth: false,
        message: "Error",
        errors: error,
      });
    }
  },

  signin: async (req, res) => {
    try {
      const user = await Account.findOne({
        where: {
          username: req.body.username,
        },
      });

      if (!user) {
        return res.status(404).send({
          auth: false,
          username: req.body.username,
          accessToken: null,
          message: "Error",
          errors: "User Not Found.",
        });
      }

      const passwordIsValid = await argon2.verify(user.password, req.body.password);
      if (!passwordIsValid) {
        return res.status(401).send({
          auth: false,
          username: req.body.username,
          accessToken: null,
          message: "Error",
          errors: "Invalid Password!",
        });
      }

      const payload = {
        id: user.id,
      };
      res.status(200).json({
        access_token: createToken(payload),
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        username: req.body.username,
        accessToken: null,
        message: "Error",
        errors: error,
      });
    }
  },
};

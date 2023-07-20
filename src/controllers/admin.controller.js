const argon2 = require("argon2");
const { createToken } = require("../helpers/jwt.js");
const { nanoid } = require("nanoid");
const { Account } = require("../models/index.js");

module.exports = {
  registerAdmin: async (req, res) => {
    try {
      const adminId = `admin-${nanoid(12)}`;
      const hashedPassword = await argon2.hash(req.body.password);

      const user = await Account.create({
        id: userId,
        username: req.body.username,
        password: hashedPassword,
        role: req.body.role,
      });

      res.status(201).send({
        status: "success",
        id: user.id,
        message: "User as admin registered successfully!",
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

      const passwordIsValid = await argon2.verify(
        user.password,
        req.body.password
      );
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
        status: "success",
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

  update: async (req, res) => {
    try {
      const user = await Account.findByPk(req.params.id);
      if (!user) {
        return res.status(404).send({
          status_response: "Bad Request",
          errors: "User Not Found",
        });
      }
      const hashedPassword = await argon2.hash(req.body.password);
      await user.update({
        username: req.body.username,
        password: hashedPassword,
      });

      const status = {
        status: "success",
        message: "Data has been updated",
      };
      return res.status(200).send(status);
    } catch (error) {
      res.status(400).send({
        status_response: "Bad Request",
        errors: error,
      });
    }
  },

  delete: async (req, res) => {
    try {
      const user = await Account.findByPk(req.params.id);
      if (!user) {
        return res.status(404).send({
          status_response: "Bad Request",
          errors: "User Not Found",
        });
      }
      await user.destroy();
      const status = {
        status: "success",
        message: "User account has been deleted",
      };
      return res.status(200).send(status);
    } catch (error) {
      res.status(400).send({
        status_response: "Bad Request",
        errors: error,
      });
    }
  },
};

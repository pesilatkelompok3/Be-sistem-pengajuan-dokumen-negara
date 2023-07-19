require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const { Account } = require("../models");
const config = require("../config/configRoles");

module.exports = {
  signup: async (req, res) => {
    try {
      const userId = `user-${nanoid(12)}`;
      const hashedPassword = await argon2.hash(req.body.password);

      const user = await Account.create({
        id: userId,
        user: req.body.username,
        password: hashedPassword,
      });

      res.status(201).send({
        status: "success",
        id: user.id,
        message: "User registered successfully!",
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
      const user = await User.findOne({
        where: {
          user: req.body.username,
        },
      });

      if (!user) {
        return res.status(404).send({
          auth: false,
          user: req.body.username,
          accessToken: null,
          message: "Error",
          errors: "User Not Found.",
        });
      }

      const passwordIsValid = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          auth: false,
          user: req.body.username,
          accessToken: null,
          message: "Error",
          errors: "Invalid Password!",
        });
      }

      const token = `Bearer ${jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24h expired
      })}`;

      res.status(201).send({
        status: "success",
        id: user.id,
        username: req.body.username,
        accessToken: token,
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        user_name: req.body.user_name,
        accessToken: null,
        message: "Error",
        errors: error,
      });
    }
  },

  update: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).send({
          status_response: "Bad Request",
          errors: "User Not Found",
        });
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 8);
      await user.update({
        user: req.body.username,
        password: hashedPassword,
      });

      const status = {
        status: "success",
        message: "The user data has been updated",
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
      const user = await User.findByPk(req.params.id);
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

const { nanoid } = require("nanoid");
const argon2 = require("argon2");
const { Account } = require("../models");
const { Op } = require("sequelize");
const { createToken } = require("../helpers/jwt.js");

module.exports = {
  signin: async (req, res) => {
    const user = await Account.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user) return res.status(404).json({ msg: "User Tidak Di Temukan" });
    const match = await argon2.verify(user.password, req.body.password);
    if (!match) return res.status(400).json({ msg: "Password Yang Anda Masukan Salah" });
    const payload = {
      id: user.id,
    };
    res.status(200).json({
      access_token: createToken(payload),
    });
  },

  signup: async (req, res) => {
    const { name, phone_number, email, password, confPassword } = req.body;
    const id = `user-${nanoid(12)}`;
    const role = "user";
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) return res.status(400).json({ msg: "Email Tidak Sesuai" });

    const isEmailTaken = await Account.findOne({
      attributes: ["email"],
      where: {
        email: email,
      },
    });
    if (isEmailTaken) return res.status(400).json({ msg: "Email Ini Sudah Terdaftar" });

    if (password !== confPassword) return res.status(400).json({ msg: "Password Dan Confirm Password Tidak Sesuai" });
    const hashPassword = await argon2.hash(password);

    try {
      await Account.create({
        id: id,
        name: name,
        phone_number: phone_number,
        email: email,
        password: hashPassword,
        role: role,
      });
      res.status(201).json({ msg: "Account Created" });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },

  update: async (req, res) => {
    const user = await Account.findOne({
      where: {
        id: req.userId,
      },
    });
    const { name, phone_number, address, password, confPassword } = req.body;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    let email = req.body.email;
    if (!emailRegex.test(email)) return res.status(400).json({ msg: "Email Tidak Sesuai" });

    const isEmailTaken = await Account.findOne({
      where: {
        email: email,
      },
    });
    if (user.email !== email) {
      if (isEmailTaken) return res.status(400).json({ msg: "Email Ini Sudah Terdaftar" });
    }

    let hashPassword;
    if (password !== confPassword) return res.status(400).json({ msg: "Password Dan Confirm Password Tidak Sesuai" });
    if (password === "" || password === null) {
      hashPassword = user.password;
    } else {
      hashPassword = await argon2.hash(password);
    }

    try {
      await Account.update(
        {
          username: username,
          name: name,
          phone_number: phone_number,
          email: email,
          password: hashPassword,
          address: address,
        },
        {
          where: {
            id: user.id,
          },
        }
      );
      res.status(200).json({ msg: "User Berhasil Di Perbarui" });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },

  delete: async (req, res) => {
    const user = await Account.findOne({
      where: {
        id: req.userId,
      },
    });
    if (!user) return res.status(404).json({ msg: "User Tidak Di Temukan" });
    try {
      await Account.destroy({
        where: {
          id: user.id,
        },
      });
      res.status(200).json({ msg: "User Berhasil Di hapus" });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },
};

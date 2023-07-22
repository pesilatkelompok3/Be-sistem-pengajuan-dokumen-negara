const argon2 = require("argon2");
// const { createAccessToken } = require("../helpers/jwt.js");
// const { nanoid } = require("nanoid");
const { Op } = require("sequelize");
const { Account } = require("../models/index.js");

module.exports = {
  getAllAccount: async (req, res) => {
    if (req.role === "SuperAdmin") {
      try {
        const response = await Account.findAll({
          attributes: ["id", "name", "phone_number", "email", "birth_date", "gender", "address"],
          where: {
            [Op.or]: [{ role: "user" }, { role: "admin" }],
          },
        });
        res.status(200).json(response);
      } catch (error) {
        res.status(500).json({ msg: error.message });
      }
    } else if (req.role === "admin") {
      try {
        const response = await Account.findAll({
          attributes: ["id", "name", "phone_number", "email", "birth_date", "gender", "address"],
          where: {
            role: "user",
          },
        });
        res.status(200).json(response);
      } catch (error) {
        res.status(500).json({ msg: error.message });
      }
    }
  },

  getAccountById: async (req, res) => {
    if (req.role === "SuperAdmin" || req.role === "admin") {
      try {
        const response = await Account.findOne({
          attributes: ["id", "name", "phone_number", "email", "birth_date", "gender", "address"],
          where: {
            id: req.params.id,
          },
        });
        res.status(200).json(response);
      } catch (error) {
        res.status(500).json({ msg: error.message });
      }
    } else if (req.role === "user") {
      try {
        const response = await Account.findOne({
          attributes: ["id", "name", "phone_number", "email", "birth_date", "gender", "address"],
          where: {
            id: req.accountId,
          },
        });
        res.status(200).json(response);
      } catch (error) {
        res.status(500).json({ msg: error.message });
      }
    }
  },

  updateAccount: async (req, res) => {
    let account;
    if (req.role === "SuperAdmin" || req.role === "admin") {
      account = await Account.findOne({
        where: {
          id: req.body.id,
        },
      });
    } else if (req.role === "user") {
      account = await Account.findOne({
        where: {
          id: req.accountId,
        },
      });
    }

    if (account.role === "SuperAdmin") {
      if (req.role === "admin" || req.role === "user") {
        res.status(403).json({ msg: "Akses Ditolak" });
      }
    }

    const { name, phone_number, birth_date, gender, address, password, confPassword } = req.body;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    let email = req.body.email;
    if (password === "" || password === null) {
      email = account.email;
    } else {
      if (!emailRegex.test(email)) return res.status(400).json({ msg: "Email Tidak Sesuai" });
    }

    const isEmailTaken = await Account.findOne({
      where: {
        email: email,
      },
    });
    if (account.email !== email) {
      if (isEmailTaken) return res.status(400).json({ msg: "Email Ini Sudah Terdaftar" });
    }

    let hashPassword;
    if (password !== confPassword) return res.status(400).json({ msg: "Password Dan Confirm Password Tidak Sesuai" });
    if (password === "" || password === null) {
      hashPassword = account.password;
    } else {
      hashPassword = await argon2.hash(password);
    }

    try {
      await Account.update(
        {
          name: name,
          phone_number: phone_number,
          email: email,
          birth_date: birth_date,
          gender: gender,
          password: hashPassword,
          address: address,
        },
        {
          where: {
            id: account.id,
          },
        }
      );
      res.status(200).json({ msg: "account Berhasil Di Perbarui" });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },

  deleteAccount: async (req, res) => {
    if (req.role === "admin" || req.role === "SuperAdmin") {
      const account = await Account.findOne({
        where: {
          id: req.body.id,
        },
      });
      if (!account) return res.status(404).json({ msg: "account Tidak Di Temukan" });
      try {
        await Account.destroy({
          where: {
            id: account.id,
          },
        });
        res.status(200).json({ msg: "account Berhasil Di hapus" });
      } catch (error) {
        res.status(400).json({ msg: error.message });
      }
    } else if (req.role === "user") {
      const account = await Account.findOne({
        where: {
          id: req.accountId,
        },
      });
      if (!account) return res.status(404).json({ msg: "account Tidak Di Temukan" });
      try {
        await Account.destroy({
          where: {
            id: account.id,
          },
        });
        res.status(200).json({ msg: "account Berhasil Di hapus" });
      } catch (error) {
        res.status(400).json({ msg: error.message });
      }
    }
  },
};

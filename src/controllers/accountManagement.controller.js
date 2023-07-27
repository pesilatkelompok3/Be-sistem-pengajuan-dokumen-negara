const argon2 = require("argon2");
const { Op } = require("sequelize");
const { Account } = require("../models/index.js");
const { updateAccount } = require("../helpers/UpdateAccount.js");

module.exports = {
  getAllAccount: async (req, res) => {
    if (req.role === "SuperAdmin") {
      try {
        const response = await Account.findAll({
          attributes: ["id", "name", "phone_number", "email", "birth_date", "gender", "role", "address"],
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
          attributes: ["id", "nip", "name", "phone_number", "email", "birth_date", "gender", "address"],
          where: {
            role: "user",
          },
        });
        res.status(200).json(response);
      } catch (error) {
        res.status(500).json({ msg: error.message });
      }
    } else if (req.role === "user") {
      res.status(403).json({ msg: "Akses Ditolak" });
    }
  },

  getAccountById: async (req, res) => {
    if (req.role === "SuperAdmin" || req.role === "admin") {
      try {
        const response = await Account.findOne({
          attributes: ["id", "nip", "name", "phone_number", "email", "birth_date", "gender", "role", "address"],
          where: {
            id: req.params.id,
          },
        });
        if (req.role === "admin") {
          if (response.role === "SuperAdmin" || response.role === "admin") {
            res.status(403).json({ msg: "Akses Ditolak" });
          } else {
            res.status(200).json(response);
          }
        } else {
          res.status(200).json(response);
        }
      } catch (error) {
        res.status(500).json({ msg: error.message });
      }
    } else {
      res.status(403).json({ msg: "Akses Ditolak" });
    }
  },

  getAccountByRole: async (req, res) => {
    if (req.role === "SuperAdmin") {
      try {
        const response = await Account.findAll({
          attributes: ["id", "nip", "name", "phone_number", "email", "birth_date", "gender", "role", "address"],
          where: {
            role: req.body.role,
          },
        });
        res.status(200).json(response);
      } catch (error) {
        res.status(500).json({ msg: error.message });
      }
    } else if (req.role === "admin") {
      try {
        const response = await Account.findAll({
          attributes: ["id", "name", "phone_number", "email", "birth_date", "gender", "role", "address"],
          where: {
            role: "user",
          },
        });
        res.status(200).json(response);
      } catch (error) {
        res.status(500).json({ msg: error.message });
      }
    } else {
      res.status(403).json({ msg: "Akses Ditolak" });
    }
  },

  getDetailAccount: async (req, res) => {
    try {
      const response = await Account.findOne({
        attributes: ["id", "nip", "name", "phone_number", "email", "birth_date", "role", "gender", "address"],
        where: {
          id: req.accountId,
        },
      });
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ msg: error.message });
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

    const { name, phone_number, birth_date, gender, address, password, confPassword } = req.body;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Z!@#$%^&*].{7,}$/;

    let email = req.body.email;
    if (email === "" || email === null) {
      email = account.email;
    } else {
      if (!emailRegex.test(email))
        return res.status(400).send({
          statusMessage: "Bad Request",
          type: "Not Email",
          errorMessage: "Email Tidak Sesuai",
        });
    }

    const isEmailTaken = await Account.findOne({
      where: {
        email: email,
      },
    });
    if (account.email !== email) {
      if (isEmailTaken)
        return res.status(400).send({
          statusMessage: "Bad Request",
          type: "Email Taken",
          errorMessage: "Email Ini Sudah Terdaftar",
        });
    }

    let hashPassword;
    if (password !== confPassword)
      return res.status(400).send({
        statusMessage: "Bad Request",
        type: "Password Not Match",
        errorMessage: "Password Dan Confirm Password Tidak Sesuai",
      });
    if (password === "" || password === null) {
      hashPassword = account.password;
    } else {
      if (!passwordPattern.test(password))
        return res.status(400).send({
          statusMessage: "Bad Request",
          type: "Password Pattern",
          errorMessage:
            "Panjang password minimal 8 karakter, yang berisikan huruf awal kapital, dan minimal harus memiliki satu simbol",
        });
      hashPassword = await argon2.hash(password);
    }

    if (account.role === "SuperAdmin") {
      if (req.role === "admin" || req.role === "user") {
        res.status(403).json({ msg: "Akses Ditolak" });
      } else {
        updateAccount(name, email, phone_number, birth_date, gender, address, hashPassword, res, account);
      }
    } else if (account.role === "admin") {
      if (req.role === "admin" || req.role === "user") {
        res.status(403).json({ msg: "Akses Ditolak" });
      } else {
        updateAccount(name, email, phone_number, birth_date, gender, address, hashPassword, res, account);
      }
    } else {
      updateAccount(name, email, phone_number, birth_date, gender, address, hashPassword, res, account);
    }
  },

  deleteAccountParams: async (req, res) => {
    if (req.role === "admin" || req.role === "SuperAdmin") {
      const account = await Account.findOne({
        where: {
          id: req.params.id,
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

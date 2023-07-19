const { nanoid } = require("nanoid");
const { Account } = require("../models");
const { Op } = require("sequelize");

module.exports = {
  getUser: async (req, res) => {
    if (req.role === "admin" || req.role === "SuperAdmin") {
      try {
        const response = await Account.findAll({
          attributes: ["id", "username", "name", "phone_number", "email", "address", "kota"],
        });
        res.status(200).json(response);
      } catch (error) {
        res.status(500).json({ msg: error.message });
      }
    }
  },

  signup: async (req, res) => {
    const { username, name, phone_number, email, address, password, confPassword, kota } = req.body;
    const id = `user-${nanoid(12)}`;
    const role = 1;

    const isUsernameTaken = await Account.findOne({
      where: {
        username: username,
      },
    });
    if (isUsernameTaken) return res.status(400).json({ msg: "Username Ini Sudah Terdaftar" });
    const isEmailTaken = await Account.findOne({
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
        username: username,
        name: name,
        phone_number: phone_number,
        email: email,
        password: hashPassword,
        address: address,
        kota: kota,
        role: role,
      });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },

  signin: async (req, res) => {
    const user = await Account.findOne({
      where: {
        [Op.or]: [{ email: req.body.email }, { username: req.body.username }],
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

  update: async (req, res) => {
    const user = await Account.findOne({
      where: {
        id: req.userId,
      },
    });
    const { name, phone_number, address, password, confPassword, kota } = req.body;

    let username = req.body.username;
    const isUsernameTaken = await Account.findOne({
      where: {
        username: username,
      },
    });
    if (user.username !== username) {
      if (isUsernameTaken) return res.status(400).json({ msg: "Username Ini Sudah Terdaftar" });
    }

    let email = req.body.email;
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
          kota: kota,
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
    if (req.role === "admin" || req.role === "SuperAdmin") {
      const user = await Account.findOne({
        where: {
          id: req.body.id,
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
    } else if (req.role === "user") {
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
    }
  },
};

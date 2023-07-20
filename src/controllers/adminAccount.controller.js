const argon2 = require("argon2");
const { createToken } = require("../helpers/jwt.js");
const { nanoid } = require("nanoid");
const { Account } = require("../models/index.js");

module.exports = {
  signup: async (req, res) => {
    const user = await Account.findOne({
      where: {
        id: req.accountId,
      },
    });
    if (req.accountId === "superAdmin1") {
      try {
        const adminId = `admin-${nanoid(12)}`;
        const { nip, name, email, password, confPassword, role } = req.body;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        const isNipTaken = await Account.findOne({
          attributes: ["nip"],
          where: {
            nip: nip,
          },
        });
        if (isNipTaken) return res.status(400).json({ msg: "Nip Ini Sudah Terdaftar" });

        if (!emailRegex.test(email)) return res.status(400).json({ msg: "Email Tidak Sesuai" });
        if (password !== confPassword)
          return res.status(400).json({ msg: "Password Dan Confirm Password Tidak Sesuai" });
        const hashedPassword = await argon2.hash(password);

        await Account.create({
          id: adminId,
          nip: nip,
          name: name,
          email: email,
          password: hashedPassword,
          role: role,
        });

        res.status(201).json({ msg: "Akun Berhasil Dibuat" });
      } catch (error) {
        res.status(500).send({
          auth: false,
          message: "Error",
          errors: error.message,
        });
      }
    } else {
      res.status(403).json({ msg: "Akses Ditolak" });
    }
  },

  signin: async (req, res) => {
    try {
      const { nip, password } = req.body;
      const user = await Account.findOne({
        where: {
          nip: nip,
        },
      });
      if (!user) return res.status(404).json({ msg: "User Tidak Di Temukan" });

      const passwordIsValid = await argon2.verify(user.password, password);
      if (!passwordIsValid) return res.status(400).json({ msg: "Password Yang Anda Masukan Salah" });

      const payload = {
        id: user.id,
      };
      res.status(200).json({
        access_token: createToken(payload),
      });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },
};

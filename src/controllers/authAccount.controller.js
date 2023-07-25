const { Account } = require("../models");
const argon2 = require("argon2");
const { nanoid } = require("nanoid");
const { verifyRefreshToken, createRefreshToken, createAccessToken } = require("../helpers/jwt.js");

module.exports = {
  refreshToken: async (req, res) => {
    try {
      const refreshToken = req.cookies.refresh_token;
      if (!refreshToken) return res.sendStatus(401);
      const account = await Account.findOne({
        where: {
          refresh_token: refreshToken,
        },
      });
      if (!account) return res.sendStatus(403);
      verifyRefreshToken(refreshToken, account, res);
    } catch (err) {
      console.log(err);
    }
  },

  login: async (req, res) => {
    try {
      const { email, nip, password } = req.body;
      let account;
      if (email) {
        account = await Account.findOne({
          where: {
            email: email,
          },
        });
      } else if (nip) {
        account = await Account.findOne({
          where: {
            nip: nip,
          },
        });
      }

      if (!account) return res.status(404).json({ msg: "Account Tidak Di Temukan" });
      const match = await argon2.verify(account.password, password);
      if (!match) return res.status(400).json({ msg: "Password Yang Anda Masukan Salah" });
      const payload = {
        id: account.id,
      };
      const accessToken = createAccessToken(payload);
      const refreshToken = createRefreshToken(payload);
      await Account.update({ refresh_token: refreshToken }, { where: { id: account.id } });

      res.cookie("refresh_token", refreshToken, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.status(200).json({ msg: accessToken, refresh_token: refreshToken });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },

  userRegister: async (req, res) => {
    const { name, phone_number, email, password, confPassword } = req.body;
    const id = `user-${nanoid(12)}`;
    const role = "user";
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email))
      return res.status(400).send({ statusMessage: "Bad Request", errorMessage: "Email Tidak Sesuai" });
    const isEmailTaken = await Account.findOne({
      attributes: ["email"],
      where: {
        email: email,
      },
    });
    if (isEmailTaken)
      return res.status(400).send({ statusMessage: "Bad Request", errorMessage: "Email Ini Sudah Terdaftar" });
    if (password !== confPassword)
      return res
        .status(400)
        .send({ statusMessage: "Bad Request", errorMessage: "Password Dan Confirm Password Tidak Sesuai" });
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
      res.status(201).send({ msg: "User Account Created" });
    } catch (error) {
      res.status(400).send({ msg: error.message });
    }
  },

  adminRegister: async (req, res) => {
    const account = await Account.findOne({
      where: {
        id: req.accountId,
      },
    });
    if (account.role === "SuperAdmin") {
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

        res.status(201).json({ msg: "Admin Account Created" });
      } catch (error) {
        res.status(400).json({ msg: error.message });
      }
    } else {
      res.status(403).json({ msg: "Akses Ditolak" });
    }
  },

  logout: async (req, res) => {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) return res.sendStatus(204);
    const account = await Account.findOne({
      where: {
        id: req.accountId,
      },
    });
    if (account.refresh_token !== refreshToken) return res.sendStatus(204);
    await Account.update(
      { refresh_token: null },
      {
        where: {
          id: account.id,
        },
      }
    );
    res.clearCookie("refreshToken");
    return res.sendStatus(200);
  },
};

const { Account } = require("../models/index.js");

const updateAccount = async (
  name,
  email,
  phone_number,
  birth_date,
  gender,
  address,
  hashPassword,
  res,
  account,
  Url
) => {
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
        profile_image: Url,
      },
      {
        where: {
          id: account.id,
        },
      }
    );
    return res.status(200).json({ msg: "account Berhasil Di Perbarui" });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};
module.exports = {
  updateAccount,
};

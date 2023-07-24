const express = require("express");
const { authentication } = require("../middleware/auth.js");
const authAccount = require("../controllers/authAccount.controller.js");
const accountManagement = require("../controllers/accountManagement.controller.js");
const accountRouter = express.Router();

accountRouter.get("/token", authAccount.refreshToken);
accountRouter.post("/login", authAccount.login);
accountRouter.post("/user/registration", authAccount.userRegister);
accountRouter.post("/admin/registration", authentication, authAccount.adminRegister);
accountRouter.delete("/logout", authentication, authAccount.logout);

accountRouter.get("/account", authentication, accountManagement.getAllAccount);
accountRouter.get("/account/:id", authentication, accountManagement.getAccountById);
accountRouter.get("/me", authentication, accountManagement.getDetailAccount);
accountRouter.patch("/account", authentication, accountManagement.updateAccount);
accountRouter.delete("/account", authentication, accountManagement.deleteAccount);

module.exports = accountRouter;

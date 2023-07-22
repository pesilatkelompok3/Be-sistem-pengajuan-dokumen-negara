const express = require("express");
const verifyUser = require("../middleware/verifyUser.js");
const form = require("../controllers/formAndQuestion.controller.js");
const { authentication, authorization } = require("../middleware/auth.js");
const authAccount = require("../controllers/authAccount.controller.js");
const accountManagement = require("../controllers/accountManagement.controller.js");
const accountRouter = express.Router();

accountRouter.get("/token", authAccount.refreshToken);
accountRouter.get("/login", authAccount.login);
accountRouter.post("/user/registration", authAccount.userRegister);
accountRouter.post("/admin/registration", authentication, authAccount.adminRegister);

accountRouter.get("/account", authentication, accountManagement.getAllAccount);
accountRouter.get("/account/:id", authentication, accountManagement.getAccountById);
accountRouter.patch("/account", authentication, accountManagement.updateAccount);
accountRouter.delete("/account", authentication, accountManagement.deleteAccount);
// accountRouter.get("/account/role", userAccount.filterByRole)

module.exports = accountRouter;

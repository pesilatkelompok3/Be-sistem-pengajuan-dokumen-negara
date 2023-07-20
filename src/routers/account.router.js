const express = require("express");
const verifyUser = require("../middleware/verifyUser.js");
const { authentication, authorization } = require("../middleware/auth.js");
const adminAccount = require("../controllers/adminAccount.controller.js");
const userAccount = require("../controllers/userAccount.controller.js");
const accountRouter = express.Router();

accountRouter.post("/admin/registration", authentication, adminAccount.signup);
accountRouter.post("/admin/login", adminAccount.signin);

accountRouter.post("/users/registration", userAccount.signup);
accountRouter.post("/user/login", userAccount.signin);

accountRouter.patch("/users", userAccount.update);
accountRouter.delete("/users", userAccount.delete);

// accountRouter.get("/account", userAccount.getUser);
// accountRouter.get("/account/role", userAccount.filterByRole)

module.exports = accountRouter;

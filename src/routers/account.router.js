const express = require("express");
const verifyUser = require("../middleware/verifyUser.js");
const userAccount = require("../controllers/userAccount.controller.js");
const admin = require("../controllers/admin.controller.js");
const userRouter = express.Router();

userRouter.post("/admin/registration", verifyUser.isSuperAdmin, admin.registerAdmin);
userRouter.post("/admin/login", admin.signin);

userRouter.post("/users", userAccount.signup);
userRouter.patch("/users", userAccount.update);
userRouter.delete("/users", userAccount.delete);

userRouter.post("/user/login", userAccount.signin);

userRouter.get("/account", userAccount.getUser);
userRouter.get("/account/role", userAccount.filterByRole)

module.exports = userRouter;

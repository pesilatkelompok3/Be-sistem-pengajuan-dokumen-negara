const express = require("express");
const userAccount = require("../controllers/userAccount.controller.js");
const userRouter = express.Router();


userRouter.post("/users", userAccount.signup);
userRouter.patch("/users", userAccount.update);
userRouter.delete("/users", userAccount.delete);

userRouter.post("/user/login", userAccount.signin);

userRouter.get("/account", userAccount.getUser);
userRouter.get("account/role", userAccount.filterByRole)

module.exports = userRouter;

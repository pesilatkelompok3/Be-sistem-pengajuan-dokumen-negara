const express = require("express");
const userAccount = require("../controllers/userAccount.controller.js");
const userRouter = express.Router();

userRouter.get("/users", userAccount.getUser);
userRouter.post("/users", userAccount.signup);
userRouter.patch("/users", userAccount.update);
userRouter.delete("/users", userAccount.delete);

userRouter.post("/user/login", userAccount.signin);

module.exports = userRouter;

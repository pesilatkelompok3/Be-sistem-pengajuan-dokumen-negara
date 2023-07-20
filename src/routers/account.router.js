const express = require("express");
const verifyUser = require("../middleware/verifyUser.js");
const form = require("../controllers/form.controller.js");
const userAccount = require("../controllers/userAccount.controller.js");
const admin = require("../controllers/admin.controller.js");
const userRouter = express.Router();

userRouter.post("/admin/registration", verifyUser.verifyToken, verifyUser.isSuperAdmin, admin.registerAdmin);
userRouter.post("/admin/login", admin.signin);

userRouter.get("/admin/form", verifyUser.verifyToken, verifyUser.isAdmin, form.getForms);
userRouter.get("/admin/form/:id", verifyUser.verifyToken, verifyUser.isAdmin, form.getFormById);
userRouter.post("/admin/form/create", verifyUser.verifyToken, verifyUser.isAdmin, form.createForm);
userRouter.post("/admin/form/create/:id", verifyUser.verifyToken, verifyUser.isAdmin, form.createQuestion);
userRouter.patch("/admin/form/:id", verifyUser.verifyToken, verifyUser.isAdmin, form.updateForm);
userRouter.patch("/admin/form/question/:id", verifyUser.verifyToken, verifyUser.isAdmin, form.updateQuestion);
userRouter.delete("/admin/form/:id", verifyUser.verifyToken, verifyUser.isAdmin, form.deleteForm);
userRouter.delete("/admin/form/question/:id", verifyUser.verifyToken, verifyUser.isAdmin, form.deleteQuestion);

userRouter.get("/users", userAccount.getUser);
userRouter.post("/users", userAccount.signup);
userRouter.patch("/users", userAccount.update);
userRouter.delete("/users", userAccount.delete);

userRouter.post("/user/login", userAccount.signin);

module.exports = userRouter;

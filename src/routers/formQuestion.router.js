const express = require("express");
const verifyUser = require("../middleware/verifyUser.js");
const form = require("../controllers/formQuestion.controller.js");

const formRouter = express.Router();

formRouter.get("/admin/form", verifyUser.verifyToken, verifyUser.isAdmin, form.getForms);
formRouter.get("/admin/form/:id", verifyUser.verifyToken, verifyUser.isAdmin, form.getFormQuestionById);
formRouter.post("/admin/form/create", verifyUser.verifyToken, verifyUser.isAdmin, form.createForm);
formRouter.post("/admin/form/create/:id", verifyUser.verifyToken, verifyUser.isAdmin, form.createQuestion);
formRouter.patch("/admin/form/:id", verifyUser.verifyToken, verifyUser.isAdmin, form.updateForm);
formRouter.patch("/admin/form/question/:id", verifyUser.verifyToken, verifyUser.isAdmin, form.updateQuestion);
formRouter.delete("/admin/form/:id", verifyUser.verifyToken, verifyUser.isAdmin, form.deleteForm);
formRouter.delete("/admin/form/question/:id", verifyUser.verifyToken, verifyUser.isAdmin, form.deleteQuestion);

module.exports = formRouter;
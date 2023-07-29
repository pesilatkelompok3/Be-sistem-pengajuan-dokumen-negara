const express = require("express");
const { authentication, isAdmin } = require("../middleware/auth.js");
const form = require("../controllers/formQuestion.controller.js");

const formRouter = express.Router();

formRouter.get("/admin/form", authentication, isAdmin, form.getForms);
formRouter.get("/admin/form/:id", authentication, isAdmin, form.getFormQuestionById);
formRouter.post("/admin/form/create", authentication, isAdmin, form.createForm);
formRouter.post("/admin/question/:id", authentication, isAdmin, form.createQuestion);
formRouter.patch("/admin/form/:id", authentication, isAdmin, form.updateForm);
formRouter.patch("/admin/question/:id", authentication, isAdmin, form.updateQuestion);
formRouter.delete("/admin/form/:id", authentication, isAdmin, form.deleteForm);
formRouter.delete("/admin/question/:id", authentication, isAdmin, form.deleteQuestion);

formRouter.get("/forms", authentication, form.getForms);
formRouter.get("/home", form.getForms);
formRouter.get("/form/:id", authentication, form.getFormQuestionById);

module.exports = formRouter;

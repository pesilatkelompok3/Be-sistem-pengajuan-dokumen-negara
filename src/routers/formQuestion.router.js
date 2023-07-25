const express = require("express");
const { authentication, authorization, isAdmin } = require("../middleware/auth.js");
const form = require("../controllers/formQuestion.controller.js");

const formRouter = express.Router();

formRouter.get("/admin/form", authentication, authorization, isAdmin, form.getForms);
formRouter.get("/admin/form/:id", authentication, authorization, isAdmin, form.getFormQuestionById);
formRouter.post("/admin/form/create", authentication, authorization, isAdmin, form.createForm);
formRouter.post("/admin/form/create/:id", authentication, authorization, isAdmin, form.createQuestion);
formRouter.patch("/admin/form/:id", authentication, authorization, isAdmin, form.updateForm);
formRouter.patch("/admin/form/question/:id", authentication, authorization, isAdmin, form.updateQuestion);
formRouter.delete("/admin/form/:id", authentication, authorization, isAdmin, form.deleteForm);
formRouter.delete("/admin/form/question/:id", authentication, authorization, isAdmin, form.deleteQuestion);

module.exports = formRouter;
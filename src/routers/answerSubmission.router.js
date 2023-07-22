const express = require("express");
const verifyUser = require("../middleware/verifyUser.js");
const { authentication, authorization } = require("../middleware/auth.js");
const submission = require("../controllers/answerSubmission.controller.js");

const formRouter = express.Router();

formRouter.get("/admin/submission", verifyUser.verifyToken, verifyUser.isAdmin, submission.getAllSubmission);
formRouter.get("/admin/submission/:id", verifyUser.verifyToken, verifyUser.isAdmin, submission.getSubmissionWithAnswerById);
formRouter.patch("/admin/submission/:id", verifyUser.verifyToken, verifyUser.isAdmin, submission.upadateAnswerFromSumbmissionById);
formRouter.get("/submission/:id", authentication, authorization, submission.getSubmissionWithAnswerById);
formRouter.post("/submission", authentication, authorization, submission.creatAnswerFromSumbmission);
formRouter.patch("/submission/:id", authentication, authorization, submission.upadateAnswerFromSumbmissionById);
formRouter.delete("/submission/:id", authentication, authorization, submission.deleteSubmission);

module.exports = formRouter;
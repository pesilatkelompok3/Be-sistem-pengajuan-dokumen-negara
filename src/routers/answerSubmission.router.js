const express = require("express");
const verifyUser = require("../middleware/verifyUser.js");
const { authentication, authorization } = require("../middleware/auth.js");
const submission = require("../controllers/answerSubmission.controller.js");

const submissionRouter = express.Router();

submissionRouter.get("/admin/submission", verifyUser.verifyToken, verifyUser.isAdmin, submission.getAllSubmission);
submissionRouter.get("/admin/submission/:id", verifyUser.verifyToken, verifyUser.isAdmin, submission.getSubmissionWithAnswerById);
submissionRouter.patch("/admin/submission/:id", verifyUser.verifyToken, verifyUser.isAdmin, submission.upadateAnswerFromSumbmissionById);
submissionRouter.get("/submission/:id", authentication, authorization, submission.getSubmissionWithAnswerById);
submissionRouter.post("/submission", authentication, authorization, submission.creatAnswerFromSumbmission);
submissionRouter.patch("/submission/:id", authentication, authorization, submission.upadateAnswerFromSumbmissionById);
submissionRouter.delete("/submission/:id", authentication, authorization, submission.deleteSubmission);

module.exports = submissionRouter;
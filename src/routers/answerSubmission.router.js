const express = require("express");
const { authentication, authorization, isAdmin } = require("../middleware/auth.js");
const submission = require("../controllers/answerSubmission.controller.js");

const submissionRouter = express.Router();

submissionRouter.get("/admin/submission", authentication, authorization, isAdmin, submission.getAllSubmission);
submissionRouter.get("/admin/submission/:id", authentication, authorization, isAdmin, submission.getSubmissionWithAnswerById);
submissionRouter.patch("/admin/submission/:id", authentication, authorization, isAdmin, submission.processedSubmissionById);
submissionRouter.patch("/admin/submission/:id", authentication, authorization, isAdmin, submission.finisedSubmissionById);
submissionRouter.patch("/admin/submission/:id", authentication, authorization, isAdmin, submission.rejectedSumbmissionById);
submissionRouter.patch("/admin/submission/:id", authentication, authorization, isAdmin, submission.upadateAnswerFromSumbmissionById);
submissionRouter.get("/submission/:id", authentication, authorization, submission.getSubmissionWithAnswerById);
submissionRouter.post("/submission/:id", authentication, authorization, submission.creatAnswerFromSumbmission);
submissionRouter.patch("/submission/:id", authentication, authorization, submission.upadateAnswerFromSumbmissionById);
submissionRouter.delete("/submission/:id", authentication, authorization, submission.deleteSubmission);

module.exports = submissionRouter;
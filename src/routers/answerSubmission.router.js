const express = require("express");
const { authentication, isAdmin } = require("../middleware/auth.js");
const submission = require("../controllers/answerSubmission.controller.js");

const submissionRouter = express.Router();

submissionRouter.get(
  "/admin/submission",
  authentication,
  isAdmin,
  submission.getAllSubmission
);
submissionRouter.get(
  "/admin/submission/:id",
  authentication,
  isAdmin,
  submission.getSubmissionWithAnswerById
);
submissionRouter.patch(
  "/admin/submission/processes/:id",
  authentication,
  isAdmin,
  submission.processedSubmissionById
);
submissionRouter.patch(
  "/admin/submission/finish/:id",
  authentication,
  isAdmin,
  submission.finisedSubmissionById
);
submissionRouter.patch(
  "/admin/submission/reject/:id",
  authentication,
  isAdmin,
  submission.rejectedSumbmissionById
);
submissionRouter.patch(
  "/admin/submission/:id",
  authentication,
  isAdmin,
  submission.upadateAnswerFromSumbmissionById
);
submissionRouter.get(
  "/submission/:id",
  authentication,
  submission.getSubmissionWithAnswerById
);
submissionRouter.post(
  "/submission/:id",
  authentication,
  submission.creatAnswerFromSumbmission
);
submissionRouter.patch(
  "/submission/:id",
  authentication,
  submission.upadateAnswerFromSumbmissionById
);
submissionRouter.delete(
  "/submission/:id",
  authentication,
  submission.deleteSubmission
);

module.exports = submissionRouter;

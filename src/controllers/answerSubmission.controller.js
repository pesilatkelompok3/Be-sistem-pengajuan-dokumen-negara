const { Form } = require("../models");
const { Question } = require("../models");
const { Answer } = require("../models");
const { Submission } = require("../models");
const { Comment } = require("../models");
const { nanoid } = require("nanoid");
const path = require("path");
const fs = require("fs");

module.exports = {
  getAllSubmission: async (req, res) => {
    try {
      const allSubmission = await Submission.findAll();
      res.status(201).send({
        status: "success",
        data: {
          allSubmission,
        },
      });
    } catch (error) {
      res.status(500).send({
        auth: false,
        message: "Error",
        errors: error,
      });
    }
  },

  getSubmissionWithAnswerById: async (req, res) => {
    try {
      if (req.role !== "SuperAdmin" && req.role !== "admin") {
        const userId = req.userId;
        const submissionOwner = await Submission.findOne({
          where: {
            id: req.params.id,
            user_id: userId,
          },
        });
        if (!submissionOwner) {
          return res.status(403).send({
            auth: false,
            message: "Forbidden",
          });
        }
      }

      const submission = await Submission.findOne({
        where: {
          id: req.params.id,
        },
      });

      const answer = await Answer.findAll({
        where: {
          submission_id: req.params.id,
        },
      });

      res.status(201).send({
        status: "success",
        submission,
        answer,
      });
    } catch (error) {
      res.status(500).send({
        auth: false,
        message: "Error",
        errors: error,
      });
    }
  },

  creatAnswerFromSumbmission: async (req, res) => {
    try {
      const submissionId = `answer-${nanoid(12)}`;
      const statusInput = "Submitted";
      const submission = await Submission.create({
        id: submissionId,
        user_id: req.userId,
        form_id: req.params.formId,
        status: statusInput,
      });

      const form = await Form.findOne({
        where: {
          id: req.params.formId,
        },
      });

      const questions = await Question.findAll({
        where: {
          form_id: form.id,
        },
      });

      const answers = [];

      for (const question of questions) {
        let answerInput = req.body[question.id];
        if (question.type === "file upload" && req.files) {
          const file = req.files[question.id];
          const fileSize = file.data.length;
          const ext = path.extname(file.name);
          const fileName = `${nanoid(12)}${ext}`;
          const url = `${req.protocol}://${req.get("host")}/file/${fileName}`;
          const uploadPath = `./src/public/file/${fileName}`;

          if (fileSize > 3000000)
            return res
              .status(422)
              .json({ msg: "Image must be less than 3 MB" });

          file.mv(uploadPath, (err) => {
            if (err) {
              console.error("Error uploading file:", err);
            }
          });

          answerInput = url;
        }

        const answer = await Answer.create({
          id: `answer-${nanoid(12)}`,
          submission_id: submissionId,
          question_id: question.id,
          input: answerInput,
        });

        answers.push(answer);
      }

      res.status(200).send({
        auth: true,
        message: "Answers saved successfully",
        submission,
      });
    } catch (error) {
      res.status(500).send({
        auth: false,
        message: "Error",
        errors: error,
      });
    }
  },

  processedSubmissionById: async (req, res) => {
    try {
      const submission = await Submission.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (!submission) {
        return res.status(404).send({
          message: "No Data Found",
        });
      }

      const input = "Processed";
      const [updatedRowsCount, updatedSubmission] = await Submission.update(
        {
          status: input,
        },
        {
          where: {
            id: req.params.id,
          },
          returning: true,
        }
      );
      

      if (updatedRowsCount === 0) {
        return res.status(500).send({
          auth: false,
          message: "Error updating submission status",
        });
      }

      const statusUpdate = updatedSubmission.status;

      res.status(200).send({
        auth: true,
        message: "Submission status updated",
        statusUpdate,
      });
    } catch (error) {
      res.status(500).send({
        auth: false,
        message: "Error",
        errors: error,
      });
    }
  },

  finisedSubmissionById: async (req, res) => {
    try {
      const submission = await Submission.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (!submission) {
        return res.status(404).send({
          message: "No Data Found",
        });
      }

      const input = "Done";
      const [updatedRowsCount, updatedSubmission] = await Submission.update(
        {
          status: input,
        },
        {
          where: {
            id: req.params.id,
          },
          returning: true,
        }
      );
      

      if (updatedRowsCount === 0) {
        return res.status(500).send({
          auth: false,
          message: "Error updating submission status",
        });
      }

      const statusUpdate = updatedSubmission.status;

      res.status(200).send({
        auth: true,
        message: "Submission status updated",
        statusUpdate,
      });
    } catch (error) {
      res.status(500).send({
        auth: false,
        message: "Error",
        errors: error,
      });
    }
  },

  rejectedSumbmissionById: async (req, res) => {
    try {
      const submission = await Submission.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (!submission) {
        return res.status(404).send({
          message: "No Data Found",
        });
      }

      const input = "Reject";
      const [updatedRowsCount, updatedSubmission] = await Submission.update(
        {
          status: input,
        },
        {
          where: {
            id: req.params.id,
          },
          returning: true,
        }
      );
      if (updatedRowsCount === 0) {
        return res.status(500).send({
          auth: false,
          message: "Error updating submission status",
        });
      }

      const commentId = `comment-${nanoid(12)}`;
      const commentInput = req.body.input;
      const comment = await Comment.create({
        id: commentId,
        submission_id: req.params.id,
        comment_input: commentInput,
      });
  
      const statusUpdate = updatedSubmission.status;
      const adminComment = comment.comment_input;
      res.status(200).send({
        auth: true,
        message: "Submission status updated",
        statusUpdate,
        adminComment,
      });
    } catch (error) {
      res.status(500).send({
        auth: false,
        message: "Error",
        errors: error,
      });
    }
  },

  upadateAnswerFromSumbmissionById: async (req, res) => {
    const existingAnswer = await Answer.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!existingAnswer) {
      return res.status(404).send({
        message: "No Data Found",
      });
    }
    try {
      let answerInput = req.body.input;

      if (req.files) {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        const fileName = `${nanoid(12)}${ext}`;
        const url = `${req.protocol}://${req.get("host")}/file/${fileName}`;
        const uploadPath = `./src/public/file/${fileName}`;

        if (fileSize > 3000000) {
          return res
            .status(422)
            .json({ message: "File must be less than 3 MB" });
        }
        const oldFileName = existingAnswer.input.split("/").pop();
        const oldfile = `./src/public/file/${oldFileName}`;
        fs.unlinkSync(oldfile);

        file.mv(uploadPath, (err) => {
          if (err) {
            console.error("Error uploading file:", err);
            return res.status(500).json({ message: "Failed to upload file" });
          }
        });

        answerInput = url;
      }
      const updatedAnswer = await Answer.update(
        {
          input: answerInput,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      res.status(200).send({
        auth: true,
        message: "Answer updated successfully",
        data: updatedAnswer,
      });
    } catch (error) {
      res.status(500).send({
        auth: false,
        message: "Error",
        errors: error,
      });
    }
  },

  deleteSubmission: async (req, res) => {
    const submission = await Submission.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!submission) return res.status(404).json({ msg: "No Data Found" });

    const answers = await Answer.findAll({
      where: {
        form_id: submission.id,
      },
    });
    if (!answers) return res.status(404).json({ msg: "No Data Found" });

    try {
      for (const answer of answers) {
        if (
          answer.input &&
          (answer.input.startsWith("http://") ||
            answer.input.startsWith("https://"))
        ) {
          const fileName = answer.input.split("/").pop();
          const oldfile = `./src/public/file/${fileName}`;

          fs.unlinkSync(oldfile);
        }
      }

      await submission.destroy();
      const status = {
        status: "success",
        message: "Submission has been deleted",
      };
      res.status(200).json(status);
    } catch (error) {
      res.status(500).send({
        auth: false,
        message: "Error",
        errors: error,
      });
    }
  },
};

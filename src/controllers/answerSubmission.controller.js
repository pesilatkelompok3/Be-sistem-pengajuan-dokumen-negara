const { Form } = require("../models");
const { Account } = require("../models");
const { Question } = require("../models");
const { Answer } = require("../models");
const { Submission } = require("../models");
const { Comment } = require("../models");
const { nanoid } = require("nanoid");
const { customAlphabet } = require("nanoid");
const path = require("path");
const fs = require("fs");

module.exports = {
  getAllSubmission: async (req, res) => {
    try {
      const submissions = await Submission.findAll();

      const forms = await Form.findAll();

      let dataSubmission = submissions.map((submission) => ({
        id: submission.id,
        user_id: submission.user_id,
        user_name: submission.user_name,
        form_id: submission.form_id,
        status: submission.status,
        form_title:
          forms.find((form) => form.id === submission.form_id)?.title || null,
        createdAt: submission.createdAt,
      }));

      return res.status(200).send({
        status: "success",
        submissionOwner: dataSubmission,
      });
    } catch (error) {
      res.status(500).send({
        auth: false,
        message: "Error",
        errors: error,
      });
    }
  },

  getSubmissionUser: async (req, res) => {
    try {
      const submissions = await Submission.findAll({
        where: {
          user_id: req.accountId,
        },
      });

      const forms = await Form.findAll();

      let dataSubmission = submissions.map((submission) => ({
        id: submission.id,
        user_id: submission.user_id,
        user_name: submission.user_name,
        form_id: submission.form_id,
        status: submission.status,
        form_title:
          forms.find((form) => form.id === submission.form_id)?.title || null,
        createdAt: submission.createdAt,
      }));

      return res.status(200).send({
        status: "success",
        submissionOwner: dataSubmission,
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
        const submissionOwner = await Submission.findOne({
          where: {
            id: req.params.id,
            user_id: req.accountId,
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

      const formId = submission.form_id;

      const form = await Form.findOne({
        where: {
          id: formId,
        },
      });

      const questions = await Question.findAll({
        where: {
          form_id: formId,
        },
      });

      const answer = await Answer.findAll({
        where: {
          submission_id: req.params.id,
        },
      });

      if (submission.status === "Ditolak" || submission.status === "Selesai") {
        const comment = await Comment.findOne({
          where: {
            submission_id: req.params.id,
          },
        });
        const corection = comment.comment_input;
        return res.status(200).send({
          status: "success",
          form,
          questions,
          submission,
          answer,
          corection,
        });
      }

      res.status(200).send({
        status: "success",
        form,
        questions,
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
      const account = await Account.findOne({
        where: {
          id: req.accountId,
        },
      });

      const form = await Form.findOne({
        where: {
          id: req.params.id,
        },
      });
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const idLength = 6;

      const generateCustomID = customAlphabet(alphabet, idLength);

      const currentDate =
        new Date().toISOString().slice(2, 4) +
        new Date().toISOString().slice(5, 7) +
        new Date().toISOString().slice(8, 10);

      const customID = currentDate +"-" + generateCustomID();
      const submissionId = `NP-${customID}`;
      const name = account.name;
      const formTitle = form.title;
      const statusInput = "Diajukan";
      const submission = await Submission.create({
        id: submissionId,
        user_id: req.accountId,
        user_name: name,
        form_id: req.params.id,
        form_title: formTitle,
        status: statusInput,
      });

      const questions = await Question.findAll({
        where: {
          form_id: form.id,
        },
      });

      const answers = [];

      for (const question of questions) {
        let answerInput = req.body[question.id];
        if (question.type === "image-upload" && req.files) {
          const file = req.files[question.id];
          const fileSize = file.data.length;
          const ext = path.extname(file.name);
          const fileName = `${nanoid(12)}${ext}`;
          const url = `${req.protocol}://${req.get("host")}/file/${fileName}`;
          const uploadPath = `./src/public/file/${fileName}`;

          if (fileSize > 3000000)
            return res
              .status(422)
              .json({ msg: "Ukuran file tidak boleh lebih dari 3 MB" });

          file.mv(uploadPath, (err) => {
            if (err) {
              console.error("Error uploading file:", err);
            }
          });

          answerInput = url;
        }

        if (question.required === "1" && !answerInput) {
          return res.status(422).json({ msg: "Mohon isi data dengan lengkap" });
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
        message: "Submission has created",
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

      const input = "Diproses";
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

      const input = "Selesai";
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
      const commentInput = req.body.c_input;
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

      const input = "Ditolak";
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
      const comment = await Comment.create({
        id: commentId,
        submission_id: req.params.id,
        comment_input: req.body.c_input,
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
    try {
      if (req.role !== "SuperAdmin" && req.role !== "admin") {
        const submissionOwner = await Submission.findOne({
          where: {
            id: req.params.id,
            user_id: req.accountId,
          },
        });
        if (!submissionOwner) {
          return res.status(403).send({
            auth: false,
            message: "Forbidden",
          });
        }
      }

      const oldAnswers = await Answer.findAll({
        where: {
          submission_id: req.params.id,
        },
      });

      if (!oldAnswers) {
        return res.status(404).send({
          message: "Submission not found",
        });
      }

      const answers = [];

      for (const oldAnswer of oldAnswers) {
        let answerInput = req.body[oldAnswer.question_id];
        if (req.files) {
          const file = req.files[oldAnswer.question_id];
          if (file) {
            const fileSize = file.data.length;
            const ext = path.extname(file.name);
            const fileName = `${nanoid(12)}${ext}`;
            const url = `${req.protocol}://${req.get("host")}/file/${fileName}`;
            const uploadPath = `./src/public/file/${fileName}`;

            if (fileSize > 3000000)
              return res
                .status(422)
                .json({ msg: "Ukuran file tidak boleh lebih dari 3 MB" });

            const oldFileName = oldAnswer.input.split("/").pop();
            const oldfile = `./src/public/file/${oldFileName}`;
            fs.unlinkSync(oldfile);

            file.mv(uploadPath, (err) => {
              if (err) {
                console.error("Error uploading file:", err);
              }
            });

            answerInput = url;
          }
        }

        const answer = await Answer.update(
          {
            input: answerInput,
          },
          {
            where: {
              question_id: oldAnswer.question_id,
              submission_id: req.params.id,
            },
          }
        );

        answers.push(answer);
      }

      res.status(200).send({
        auth: true,
        message: "Submission updated successfully",
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
    if (req.role !== "SuperAdmin" && req.role !== "admin") {
      const userId = req.userId;
      const submissionOwner = await Submission.findOne({
        where: {
          id: req.params.id,
          user_id: req.accountId,
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
    if (!submission) return res.status(404).json({ msg: "No Data Found" });

    const answers = await Answer.findAll({
      where: {
        submission_id: submission.id,
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

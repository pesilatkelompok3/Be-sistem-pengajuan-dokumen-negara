const { Form } = require("../models");
const { Question } = require("../models");
const { Answer } = require("../models");
const { Submission } = require("../models");
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
      const submission = await Submission.findOne({
        where: {
          id: req.params.id,
        },
      });

      const answer = await Answer.findAll({
        where: {
          id: req.params.id,
        },
      });

      res.status(201).send({
        status: "success",
        data: {
          submission,
          answer,
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
  creatAnswerFromSumbmission: async (req, res) => {
    try {
      const submissionId = `answer-${nanoid(12)}`;

      const submission = await Submission.create({
        id: submissionId,
        user_id: req.params.userId,
        form_id: req.params.formId,
        status: req.body.status,
      });

      const form = await Form.findOne({
        where: {
          id: req.params.id,
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
        data: answers,
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
    if (!existingAnswer) return res.status(404).json({ msg: "No Data Found" });
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

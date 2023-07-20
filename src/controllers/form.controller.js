const { Form } = require("../models");
const { Question } = require("../models");
const { nanoid } = require("nanoid");

module.exports = {
  getForms: async (req, res) => {
    try {
      const response = await Form.findAll();
      res.json(response);
    } catch (error) {
      res.status(500).send({
        auth: false,
        message: "Error",
        errors: error,
      });
    }
  },
  getFormById: async (req, res) => {
    try {
      const response = await Form.findOne({
        where: {
          id: req.params.id,
        },
      });
      res.json(response);
    } catch (error) {
      res.status(500).send({
        auth: false,
        message: "Error",
        errors: error,
      });
    }
  },

  createForm: async (req, res) => {
    try {
      const formId = `form-${nanoid(12)}`;

      const form = await Form.create({
        id: formId,
        title: req.body.title,
        description: req.body.description,
      });

      res.status(201).send({
        status: "success",
        id: formId,
        message: "Form has been created",
      });
    } catch (error) {
      res.status(500).send({
        auth: false,
        message: "Error",
        errors: error,
      });
    }
  },

  createQuestion: async (req, res) => {
    try {
      const questionId = `question-${nanoid(12)}`;
      const formId = req.params.id;
      const question = await Question.create({
        id: questionId,
        form_id: formId,
        title_field: req.body.title_field,
        type: req.body.type,
        required: req.body.required,
      });
      res.status(201).send({
        status: "success",
        id: questionId,
        message: "Question has been created",
      });
    } catch (error) {
      res.status(500).send({
        auth: false,
        message: "Error",
        errors: error,
      });
    }
  },

  updateForm: async (req, res) => {
    const form = await Form.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!form) return res.status(404).json({ msg: "No Data Found" });

    try {
      await Form.update(
        {
          title: req.body.title,
          type: req.body.type,
          required: req.body.required,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      res.status(200).json({ msg: "Form Updated Successfuly" });
    } catch (error) {
      res.status(500).send({
        auth: false,
        message: "Error",
        errors: error,
      });
    }
  },

  updateQuestion: async (req, res) => {
    const question = await Question.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!question) return res.status(404).json({ msg: "No Data Found" });
    try {
      await Question.update(
        {
          title_field: req.body.title_field,
          description: req.body.description,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      res.status(200).json({ msg: "Question Updated Successfuly" });
    } catch (error) {
      res.status(500).send({
        auth: false,
        message: "Error",
        errors: error,
      });
    }
  },

  deleteForm: async (req, res) => {
    try {
      const form = await Form.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (!form) return res.status(404).json({ msg: "No Data Found" });
      await form.destroy();
      const status = {
        status: "success",
        message: "Form has been deleted",
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

  deleteQuestion: async (req, res) => {
    try {
      const question = await Question.findOne({
        where: {
          id: req.params.id,
        },
      });

      if (!question) return res.status(404).json({ msg: "No Data Found" });
      await question.destroy();
      const status = {
        status: "success",
        message: "Question has been deleted",
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

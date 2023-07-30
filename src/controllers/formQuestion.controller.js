const { Form } = require("../models");
const { Question } = require("../models");
const { nanoid } = require("nanoid");

module.exports = {
  getForms: async (req, res) => {
    try {
      const allForm = await Form.findAll();
      res.status(201).send({
        status: "success",
        allForm,
      });
    } catch (error) {
      res.status(500).send({
        auth: false,
        message: "Error",
        errors: error,
      });
    }
  },
  getFormQuestionById: async (req, res) => {
    try {
      const form = await Form.findOne({
        where: {
          id: req.params.id,
        },
      });
      const question = await Question.findAll({
        where: {
          form_id: req.params.id,
        },
      });
      res.status(201).send({
        status: "success",
        form,
        question,
      });
    } catch (error) {
      res.status(500).send({
        auth: false,
        message: "Error",
        errors: error,
      });
    }
  },
getCompleteness: async (req, res) => {
try {
  const completeness = await Form.findOne({
    where: {
      id: req.params.id,
    },
  });
  const data = completeness.completeness;

  res.status(201).send({
    status: "success",
    data,
  });

} catch (error) {
  
}
},
  createForm: async (req, res) => {
    try {
      const formId = `form-${nanoid(12)}`;
      const title = req.body.form.title;
      const description = req.body.form.description;
      const rule = req.body.form.rule;
      const form = await Form.create({
        id: formId,
        title: title,
        description: description,
        completeness: rule,
      });

      const questions = req.body.form.question;
      const inputs = [];
      for (const question of questions) {
        const titleField = question.title_field;
        const type = question.type;
        const required = question.required;

        const input = await Question.create({
          id: `question-${nanoid(12)}`,
          form_id: formId,
          title_field: titleField,
          type: type,
          required: required,
        });

        inputs.push(input);
      }
      const questionData = await Question.findAll({
        where: {
          form_id: formId,
        },
      });
      res.status(200).send({
        auth: true,
        message: "Form has created",
        form,
        questionData,
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
        questionId,
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
      const rule = req.body.form.rule;
      await Form.update(
        {
          title: req.body.title,
          description: req.body.description,
          completeness: rule,
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
          type: req.body.type,
          required: req.body.required,
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

      res.status(200).json({ message: "Question has been deleted" });
    } catch (error) {
      res.status(500).send({
        auth: false,
        message: "Error",
        errors: error,
      });
    }
  },
};

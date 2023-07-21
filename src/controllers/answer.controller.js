const { Form } = require("../models");
const { Question } = require("../models");
const { Answer } = require("../models");
const { Submission } = require("../models");
const { nanoid } = require("nanoid");

module.exports = {
  getAllAnswer: async (req, res) => {
    try {
      const response = await Answer.findAll();
      res.json(response);
    } catch (error) {
      res.status(500).send({
        auth: false,
        message: "Error",
        errors: error,
      });
    }
  },
  getAllAnswer: async (req, res) => {
    try {
      const response = await Answer.findAll();
      res.json(response);
    } catch (error) {
      res.status(500).send({
        auth: false,
        message: "Error",
        errors: error,
      });
    }
  },
  creatAnswer: async (req, res) => {
    try {
      const answerId = `answer-${nanoid(12)}`;
    } catch (error) {
      res.status(500).send({
        auth: false,
        message: "Error",
        errors: error,
      });
    }
  },
};

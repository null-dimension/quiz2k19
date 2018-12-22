const errors = require("restify-errors");

const Question = require("../models/Question");
const config = require("../config");

module.exports = server => {
  // Admin home page
  server.get("/admin", async (req, res, next) => {
    try {
      const questions = await Question.find({});
      res.send(questions);
      next();
    } catch (err) {
      return next(new errors.InvalidContentError(err));
    }
  });

  // Add quewstions
  server.post("/admin/add-question", async (req, res, next) => {
    if (!req.is("application/json")) {
      return next(new errors.InvalidContentError("Expects 'application/json"));
    }

    const { title, options, answer } = req.body;

    let question = new Question({
      title,
      options,
      answer
    });

    let validationErrors = { errors: [] };

    try {
      validationErrors.errors = validate(question);
      if (validationErrors.errors.length > 0) {
        res.send(validationErrors);
        next();
      } else {
        question = convertToLowerCase(question);
        const newQuestion = await question.save();
        res.send(201);
        next();
      }
    } catch (err) {
      return next(new errors.InternalError(err.message));
    }
  });

  server.put('/admin/edit-question/:id', async (req, res, next) => {
    if (!req.is("application/json")) {
      return next(new errors.InvalidContentError("Expects 'application/json'"));
    }

    try {
      let validationErrors = { errors: [] };
      validationErrors.errors = validate(req.body);

      if (validationErrors.errors.length > 0) {
        res.send(validationErrors);
        next();
      } else {
        const question = await Question.findOneAndUpdate({_id: req.params.id}, req.body);
        res.send(200);
        next();
      }
    } catch(err) {
      return next(new errors.InternalError(err.message));
    }
  });

  server.del('/admin/delete-question/:id', async (req, res, next) => {
    try {
      const question = await Question.findOneAndRemove({_id: req.params.id});
      res.send(204);
      next();
    } catch(err) {
      return next(new errors.ResourceNotFoundError("Customer not found"));
    }
  });
};

function convertToLowerCase(question) {
  // Convert everything to lowercase
  question.title = question.title.toLowerCase().trim();
  for (let i = 0; i < question.options.length; i++) {
    question.options[i] = question.options[i].toLowerCase().trim();
  }
  question.answer = question.answer.toLowerCase().trim();

  return question;
}

function validate(question) {
  let errors = [];
  if(!question.title || !question.options || !question.answer) {
    console.log(question);  
    return ["One or more properties are not defined"];
  }
  if (question.title.trim().length === 0) {
    errors.push("Title is required");
  }
  if (question.answer.trim().length === 0) {
    errors.push("Answer is required");
  }
  if (question.options.length <= 1) {
    errors.push("At least two options are required");
  }
  for (let i = 0; i < question.options.length; i++) {
    if (question.options[i].trim().length === 0) {
      errors.push("Option cannot be empty");
    }
  }

  return errors;
}

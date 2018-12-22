const errors = require("restify-errors");
const Question = require("../models/Question");
const Team = require("../models/Team");
const config = require("../config");

module.exports = server => {
  server.get("/", async (req, res, next) => {
    try {
      res.send({ message: "Welcome!" });
      next();
    } catch (err) {
      return next(new errors.InvalidContentError(err));
    }
  });

  server.post("/quiz", async (req, res, next) => {
    if (!req.is("application/json")) {
      return next(new errors.InvalidContentError("Expects 'application/json"));
    }
    let validationErrors = { errors: [] };
    try {
      const teamName = req.body.teamName.toLowerCase().trim();

      // Team name empty
      if (teamName.length === 0) {
        validationErrors.errors.push("Team Name cannot be empty");
      }

      // Team name exists
      const teamExists = await Team.findOne({ name: teamName });

      if (teamExists) {
        validationErrors.errors.push("Team already exists!");
      }
      // No errors
      if (validationErrors.errors.length === 0) {
        let team = new Team({
          name: teamName
        });
        const newTeam = await team.save();

        let questions = await Question.find({});

        // Randomly sort the questions
        questions.sort(()=>0.5 - Math.random());
        
        questions.unshift({"teamName": teamName});
        res.send(questions);
        next();
      } else {
        res.send(validationErrors);
        next();
      }
    } catch (err) {
      return next(new errors.InvalidContentError(err));
    }
  });

  server.get("/quiz", async (req, res, next) => {
    try {
      //const questions = await Question.find({});
      //res.send(questions);
      res.send({"error": "Invalid Request"});
      next();
    } catch (err) {
      return next(new errors.InvalidContentError(err));
    }
  });
};

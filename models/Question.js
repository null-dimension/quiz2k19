const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const QuestionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    options:{
        type: [String],
        required: true,
        trim: true,
        lowercase: true
    },
    answer: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    }

});

QuestionSchema.plugin(timestamp);

const Question = mongoose.model('Question', QuestionSchema);
module.exports = Question;
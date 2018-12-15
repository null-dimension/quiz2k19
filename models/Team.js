const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const Team = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    points: {
        type: Number,
        default: 0
    }
});

TeamSchema.plugin(timestamp);

const Team = mongoose.model('Question', TeamSchema);
module.exports = Team;
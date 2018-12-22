const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const TeamSchema = new mongoose.Schema({
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

const Team = mongoose.model('Team', TeamSchema);
module.exports = Team;
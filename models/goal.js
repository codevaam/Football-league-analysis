const mongoose = require('mongoose');

var goal = new mongoose.Schema({
    fixtureID: {type: Number},
    time: {type: Number},
    goalType: {type: String},
    playerID: {type: Number},
    assistID: {type: Number}
});

const Goal =  mongoose.model("Goal", goal);
exports.Goal = Goal;

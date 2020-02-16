const mongoose = require('mongoose');

var fixture = new mongoose.Schema({
    fixtureID: {type: Number, required: true, unique: true, index: true},
    seasonID: {type: Number},
    date: {type: String, required: true},
    team1: {type: Number, required: true},
    team2:  {type: Number, required: true},
    team1Score: {type: Number, required: true},
    team2Score: {type: Number}
});

const Fixture =  mongoose.model("Fixture", fixture);
exports.Fixture = Fixture;

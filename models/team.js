const mongoose = require('mongoose')

var team = new mongoose.Schema({
    teamID: {type: Number, required: true, index: true},
    year: {type: String},
    name: {type: String, required: true},
    shortName: String,
    abbr: String,
    teamType: String,
    seasonID: [{type: String}],
    // groundID: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Ground'
    // }]
})

const Team = mongoose.model("Team", team);

exports.Team = Team;
exports.insertTeam = async function(teamID, name, shortName, abbr, teamType, groundIDs) {
    const newTeam = new Team({
        teamID: teamID,
        name: name,
        shortName: shortName,
        abbr: abbr,
        teamType: teamType,
        groundID: groundIDs
    });
    await newTeam.save();
}

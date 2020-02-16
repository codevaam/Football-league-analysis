const mongoose = require('mongoose');

var seasonPlayer = new mongoose.Schema({
    seasonID: {type: Number},
    playerID: {type: Number},
    teamID: { type: Number }
});

const SeasonPlayer = mongoose.model("SeasonPlayer", seasonPlayer);
exports.SeasonPlayer = SeasonPlayer;
exports.insertSeasonPlayer = async function(seasonID, teamID, playerID) {
    const newPlayer = new SeasonPlayer({
        SeasonID: seasonID,
        TeamID: teamID,
        PlayerID: playerID
    });
    await newPlayer.save();
}

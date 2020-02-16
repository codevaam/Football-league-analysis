const mongoose = require('mongoose');

const season = new mongoose.Schema({
    seasonID: {type: Number, required: true, index: true, unique: true},
    name: {type: String, required: true},
    year: {type: String},
    leagueID : {type: Number}
});

const Season = mongoose.model("Season", season);

exports.Season = Season;

exports.getSeasonById = async function(id) {
    return await Season.findOne({seasonID: id}).exec();
}

exports.insertAndUpdateSeason = async function(seasonID, name, teamIDs) {
    const newSeason = {
        seasonID: seasonID,
        name: name,
        teams: teamIDs
    };

    return await Season.findOneAndUpdate({seasonID: seasonID}, newSeason, {
        upsert: true,
        new: true
      }); 
}

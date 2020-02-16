const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Season = require("../models/season").Season;
const League = require("../models/league").League;
const Team = require("../models/team").Team;
const Fixture = require("../models/fixture").Fixture;

router.get("/", async function (req, res) {
    const seasons = await Season.aggregate([
        {
            $lookup:
            {
                from: 'leagues',
                localField: 'leagueID',
                foreignField: 'leagueID',
                as: 'leagueDetails'
            },
        },{
            $project:
            {
                "leagueID": 1,
                "seasonID": 1,
                "name" : 1,
                "leagueDetails": {"$arrayElemAt":["$leagueDetails", 0]},
            },
        },{
            $project:
            {
                "leagueID": 1,
                "seasonID": 1,
                "name" : 1,
                "leagueName": "$leagueDetails.name"
            }
        }
    ]).exec();
    const templateVals = {
        model: "seasons",
        fields: [
        { name: 'seasonID', type: 'ID', model: 'seasons' },
        { name: 'leagueID', type: 'ID', model: 'leagues' },
        { name: 'leagueName', type: 'prop', model: ''},
        { name: 'name', type: 'prop', model: '' }],
        data: seasons
    };
    res.render('listModel', templateVals);
});

router.get("/:id", async (req, res) => {
    const season = await Season.findOne({seasonID: req.params.id}).exec();
    const league = await League.findOne({leagueID: season.leagueID}).exec();
    const teams = await Team.find({seasonID: season.seasonID}).exec();
    const fixtures = await Fixture.aggregate([
        {
            $match: {
                seasonID: season.seasonID
            }
        },
        {
            $lookup:
            {
                from: 'teams',
                localField: 'team1',
                foreignField: 'teamID',
                as: 'team1Details'
            },
        },{
            $lookup:
            {
                from: 'teams',
                localField: 'team2',
                foreignField: 'teamID',
                as: 'team2Details'
            },
        },{
            $project:
            {
                "fixtureID": 1,
                "seasonID": 1,
                "date":1,
                "team1": 1,
                "team2": 1,
                "team1Score": 1,
                "team2Score": 1,
                "team1Details": {"$arrayElemAt":["$team1Details", 0]},
                "team2Details": {"$arrayElemAt":["$team2Details", 0]}
            },
        },{
            $project:
            {
                "seasonID": 1,
                "fixtureID": 1,
                "date":1,
                "team1": 1,
                "team2": 1,
                "team1Score": 1,
                "team2Score": 1,
                "team1Name": "$team1Details.name",
                "team2Name": "$team2Details.name"
            }
        }
    ]).exec();
    res.render('seasons', {season, league, teams, fixtures});
});

exports.router = router;

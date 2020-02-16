const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Fixture = require("../models/fixture").Fixture;
const Team = require("../models/team").Team;
const Goal = require("../models/goal").Goal;

router.get("/", async function (req, res) {
    const fixtures = await Fixture.aggregate([
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
                "team1Name": "$team1Details.name",
                "team2Name": "$team2Details.name"
            }
        }
    ]).exec();
    const templateVals = {
        model: "fixtures",
        fields: [{ name: 'fixtureID', type: 'ID', model: 'fixtures' },
        {name: 'seasonID', type: 'ID', 'model': 'seasons'},
        { name: 'date', type: 'prop', model: '' },
        { name: 'team1', type: 'ID', model: 'teams' },
        { name: 'team1Name', type: 'prop', model: 'teams' },
        { name: 'team2', type: 'ID', model: 'teams' },
        { name: 'team2Name', type: 'prop', model: 'teams' },
    ],
        data: fixtures
    };
    res.render('listModel', templateVals);
});


router.get("/:id", async (req, res) => {
    console.log(req.params.id);
    const fixture = await Fixture.findOne({fixtureID: req.params.id}).exec();
    const team1 = await Team.findOne({teamID: fixture.team1});
    const team2 = await Team.findOne({teamID: fixture.team2});

    const goals = await Goal.aggregate([
        {
            $match: {
                fixtureID: fixture.fixtureID
            }
        },
        {
            $lookup:
            {
                from: 'players',
                localField: 'playerID',
                foreignField: 'playerID',
                as: 'playerDetails'
            },
        },{
            $lookup:
            {
                from: 'players',
                localField: 'assistID',
                foreignField: 'playerID',
                as: 'assistDetails'
            },
        },{
            $project:
            {
                "time": 1,
                "playerID": 1,
                "assistID":1,
                "goalType": 1,
                "playerDetails": {"$arrayElemAt":["$playerDetails", 0]},
                "assistDetails": {"$arrayElemAt":["$assistDetails", 0]}
            },
        },{
            $project:
            {
                "time": 1,
                "playerID": 1,
                "assistID":1,
                "goalType": 1,
                "playerName": "$playerDetails.name",
                "assistName": "$assistDetails.name"
            }
        }
    ]).exec();
    res.render('fixture', {fixture, team1, team2, goals});
});

exports.router = router;

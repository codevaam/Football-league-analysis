const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Goal = require("../models/goal").Goal;

router.get("/", async function (req, res) {
    const goals = await Goal.aggregate([
        {
            $lookup:
            {
                from: 'players',
                localField: 'playerID',
                foreignField: 'playerID',
                as: 'playerDetails'
            },
        },{
            $project:
            {
                "playerID": 1,
                "time" : 1,
                "fixtureID": 1,
                "goalType" : 1,
                "assistID": 1,
                "playerDetails": {"$arrayElemAt":["$playerDetails", 0]},
            },
        },{
            $project:
            {
                "playerID": 1,
                "time" : 1,
                "fixtureID": 1,
                "goalType" : 1,
                "assistID": 1,
                "playerName": "$playerDetails.name"
            }
        }
    ]).exec();
    const templateVals = {
        model: "goals",
        fields: [{ name: 'fixtureID', type: 'ID', model: 'fixtures' },
        { name: 'time', type: 'prop', model: '' },
        { name: 'goalType', type: 'prop', model: '' },
        { name: 'playerID', type: 'ID', model: 'players' },
        { name: 'playerName', type: 'prop', model: ''},
        { name: 'assistID', type: 'ID', model: 'players' }]
        ,
        data: goals
    };
    res.render('listModel', templateVals);
});

exports.router = router;

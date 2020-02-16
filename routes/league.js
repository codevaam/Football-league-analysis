const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const League = require("../models/league").League;
const Season = require("../models/season").Season;

router.get("/", async function (req, res) {
    const leagues = await League.find({});
    const templateVals = {
        model: "leagues",
        fields: [{
            name: 'leagueID',
            type: 'ID', model: 'leagues'
        }, {
            name: 'name',
            type: 'prop', model: ''
        }, {
            name: 'abbr',
            type: 'prop', model: ''
        }, {
            name: 'level',
            type: 'prop', model: ''
        }],
        data: leagues
    };
    res.render('listModel', templateVals);
});

router.get("/:id", async (req, res) => {
    const league = await League.findOne({leagueID: req.params.id}).exec();
    const seasons = await Season.find({leagueID: req.params.id}).exec();
    res.render('league', {league, seasons});
});

exports.router = router;
